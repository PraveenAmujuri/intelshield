import numpy as np
import joblib
import socketio
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from phishing_engine import calculate_phishing_risk
from auth import router as auth_router

# ------------------ CONFIG ------------------
CALIBRATION_POINTS = 60  # warm-up (~3 sec)
WINDOW = 30  # sliding window
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

# ------------------ LOAD INTELSHIELD 6 MODELS ------------------
import os
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "intelshield_complete_models.joblib")

# 🔥 NEW: Load ALL 6 models
intelshield_models = joblib.load(MODEL_PATH)
print(f"🧠 IntelShield loaded {len(intelshield_models)} models: {list(intelshield_models.keys())}")
print("🚀 Multi-threat detection ACTIVE!")

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
        "amount": 0,  # For fraud detection
        "device_info": "",  # For identity detection
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
    if not session: return
    
    risk = calculate_phishing_risk(data)
    session["phishing_risk"] += risk
    if risk > 0:
        print(f"⚠️ Phishing signal detected | Risk={risk}")

# ------------------ BEHAVIOR PACKET (Checkout/Fraud) ------------------
@sio.event
async def behavior_packet(sid, data):
    session = sessions.get(sid)
    if not session: return
    
    if data.get("action") == "FINAL_CHECKOUT_ATTEMPT":
        session["amount"] = data.get("metadata", {}).get("amount", 1200)
        print(f"💳 Checkout attempt: ${session['amount']}")
        
        # 🔥 FRAUD TRANSACTION CHECK
        try:
            fraud_features = intelshield_models['fraud_transaction_scaler'].transform([[session["amount"], data.get("timestamp", 0)]])
            fraud_score = intelshield_models['fraud_transaction'].decision_function(fraud_features)[0]
            if fraud_score < -0.1:
                session["risk"] += 3
                print(f"🚨 FRAUD TRANSACTION DETECTED: Score={fraud_score:.3f}")
                await sio.emit("security_lock", {
                    "reason": "Suspicious transaction amount/pattern",
                    "fraud_score": round(fraud_score, 4)
                }, room=sid)
        except Exception as e:
            print(f"Fraud check error: {e}")

# ------------------ MOUSE BEHAVIOR ------------------
@sio.event
async def mouse_move(sid, data):
    session = sessions.get(sid)
    if not session: return

    # Store normalized mouse coordinates
    session["coords"].append([data["x"], data["y"]])

    # Safety window
    if len(session["coords"]) < WINDOW: return

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

    # ------------------ INTELSHIELD BEHAVIORAL MODEL ------------------
    try:
        # 🔥 NEW: Use your trained behavioral model!
        feature_vector = intelshield_models['behavioral_scaler'].transform([[psi, jitter]])
        raw_score = intelshield_models['behavioral'].decision_function(feature_vector)[0]
    except Exception as e:
        print(f"Behavioral model error: {e}")
        return

    # ------------------ BOT RISK ACCUMULATION ------------------
    if raw_score < -0.15:
        session["risk"] += 1
    else:
        session["risk"] = max(session["risk"] - 1, 0)

    # 🔥 FRAUD IDENTITY CHECK (device patterns)
    try:
        if "device_info" in session and session["device_info"]:
            id_features = intelshield_models['fraud_identity_scaler'].transform([[0, 0, 0]])  # Simplified
            id_score = intelshield_models['fraud_identity'].decision_function(id_features)[0]
            if id_score < -0.1:
                session["risk"] += 1
                print(f"🆔 Suspicious device pattern: {id_score:.3f}")
    except:
        pass

    # ------------------ RISK FUSION ------------------
    total_risk = session["risk"] + session["phishing_risk"]

    # ------------------ DECISION ------------------
    if total_risk >= TOTAL_RISK_BLOCK:
        print(f"🚨 HIGH CONFIDENCE ATTACK | MouseRisk={session['risk']} | PhishingRisk={session['phishing_risk']} | Score={raw_score:.4f}")
        await sio.emit("security_lock", {
            "reason": "High confidence malicious activity",
            "mouse_risk": session["risk"],
            "phishing_risk": session["phishing_risk"],
            "score": round(raw_score, 4),
        }, room=sid)
    elif session["risk"] >= BOT_RISK_TRIGGER:
        print(f"⚠️ Suspicious automation | MouseRisk={session['risk']} | PhishingRisk={session['phishing_risk']} | Score={raw_score:.4f}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:sio_app", host="0.0.0.0", port=8000, reload=True)
