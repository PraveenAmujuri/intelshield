import numpy as np
import joblib
import socketio
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from phishing_engine import calculate_phishing_risk
from auth import router as auth_router



# ------------------ CONFIG ------------------
CALIBRATION_POINTS = 60      # warm-up (~3 sec)
WINDOW = 30                 # sliding window
MODEL_PATH = "intelshield_behavior_model.joblib"

# Risk fusion thresholds
BOT_RISK_TRIGGER = 3
TOTAL_RISK_BLOCK = 7

# ------------------ INIT ------------------
sio = socketio.AsyncServer(async_mode="asgi", cors_allowed_origins="*")
app = FastAPI()
app.include_router(auth_router)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

sio_app = socketio.ASGIApp(sio, app)

# ------------------ LOAD MODEL + SCALER ------------------
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "intelshield_behavior_model.joblib")

global ml_model
global scaler

ml_model, scaler = joblib.load(MODEL_PATH)

print("🧠 ML Brain successfully loaded with scaler.")

# ------------------ SESSION STATE ------------------
sessions = {}

# ------------------ SOCKET EVENTS ------------------
@sio.event
async def connect(sid, environ):
    sessions[sid] = {
        "coords": [],
        "baseline": [],
        "psi_mean": None,
        "jitter_mean": None,
        "risk": 0,
        "phishing_risk": 0,
        "calibrated": False,
    }
    print(f"Connected: {sid}")

@sio.event
async def disconnect(sid):
    sessions.pop(sid, None)
    print(f"Disconnected: {sid}")

# ------------------ PHISHING SIGNAL ------------------
@sio.event
async def phishing_signal(sid, data):
    session = sessions.get(sid)
    if not session:
        return

    risk = calculate_phishing_risk(data)
    session["phishing_risk"] += risk

    if risk > 0:
        print(f"⚠️ Phishing signal detected | Risk={risk}")

# ------------------ MOUSE BEHAVIOR ------------------
@sio.event
async def mouse_move(sid, data):
    session = sessions.get(sid)
    if not session:
        return

    # Store normalized mouse coordinates
    session["coords"].append([data["x"], data["y"]])

    # Safety window
    if len(session["coords"]) < WINDOW:
        return

    # ------------------ FEATURE EXTRACTION ------------------
    coords = np.array(session["coords"][-WINDOW:])
    dist = np.sqrt(np.sum(np.diff(coords, axis=0) ** 2, axis=1))
    total_dist = np.sum(dist)
    displacement = np.linalg.norm(coords[-1] - coords[0])

    psi = displacement / total_dist if total_dist > 0 else 1.0
    jitter = np.std(dist)

    # ------------------ CALIBRATION ------------------
    if not session["calibrated"]:
        session["baseline"].append([psi, jitter])

        if len(session["baseline"]) >= CALIBRATION_POINTS:
            baseline = np.array(session["baseline"])
            session["psi_mean"] = np.mean(baseline[:, 0])
            session["jitter_mean"] = np.mean(baseline[:, 1])
            session["calibrated"] = True
            print("✅ Session calibrated (baseline learned)")
        return

    # ------------------ NORMALIZATION ------------------
    psi_norm = psi / session["psi_mean"]
    jitter_norm = jitter / session["jitter_mean"]

    feature_vector = scaler.transform([[psi_norm, jitter_norm]])

    # ------------------ MODEL SCORE ------------------
    raw_score = ml_model.decision_function(feature_vector)[0]

    # ------------------ BOT RISK ACCUMULATION ------------------
    if raw_score < -0.15:
        session["risk"] += 1
    else:
        session["risk"] = max(session["risk"] - 1, 0)

    # ------------------ RISK FUSION ------------------
    total_risk = session["risk"] + session["phishing_risk"]

    # ------------------ DECISION ------------------
    if total_risk >= TOTAL_RISK_BLOCK:
        print(
            f"🚨 HIGH CONFIDENCE ATTACK | "
            f"MouseRisk={session['risk']} | "
            f"PhishingRisk={session['phishing_risk']} | "
            f"Score={raw_score:.4f}"
        )

        await sio.emit(
            "security_lock",
            {
                "reason": "High confidence malicious activity",
                "mouse_risk": session["risk"],
                "phishing_risk": session["phishing_risk"],
                "score": round(raw_score, 4),
            },
            room=sid,
        )

    elif session["risk"] >= BOT_RISK_TRIGGER:
        print(
            f"⚠️ Suspicious automation | "
            f"MouseRisk={session['risk']} | "
            f"PhishingRisk={session['phishing_risk']} | "
            f"Score={raw_score:.4f}"
        )