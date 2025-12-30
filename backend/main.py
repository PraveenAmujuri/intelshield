import numpy as np
import joblib
import socketio
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from phishing_engine import calculate_phishing_risk
from auth import router, sessions

# ------------------ CONFIG ------------------
CALIBRATION_POINTS = 60
WINDOW = 30
BOT_RISK_TRIGGER = 3
TOTAL_RISK_BLOCK = 7

# ------------------ INIT ------------------
sio = socketio.AsyncServer(async_mode="asgi", cors_allowed_origins="*")
app = FastAPI()
app.include_router(router)
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

intelshield_models = joblib.load(MODEL_PATH)
print(f"🧠 IntelShield loaded {len(intelshield_models)} models: {list(intelshield_models.keys())}")
print("🚀 Multi-threat detection ACTIVE!")

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
        "amount": 0,
        "device_info": "",
    }
    print(f"✅ Connected: {sid}")

@sio.event
async def disconnect(sid):
    sessions.pop(sid, None)
    print(f"❌ Disconnected: {sid}")

# ------------------ PHISHING SIGNAL ------------------
@sio.event
async def phishing_signal(sid, data):
    session = sessions.get(sid)
    if not session: 
        return
    
    risk = calculate_phishing_risk(data)
    session["phishing_risk"] += risk
    if risk > 0:
        print(f"🦠 PHISHING ATTACK DETECTED | Risk={risk} | URL={data.get('url', 'unknown')}")

# ------------------ BEHAVIOR PACKET ------------------
@sio.event
async def behavior_packet(sid, data):
    session = sessions.get(sid)
    if not session:
        print(f"🚨 NO SESSION for behavior_packet: {data}")
        return
    
    action = data.get("action")
    print(f"🧪 BEHAVIOR PACKET: {action} | Amount=₹{data.get('amount', 0)} | Items={data.get('items', 0)}")
    
    if action == "FINAL_CHECKOUT_ATTEMPT":
        session["amount"] = data.get("amount", 1200)
        print(f"💳 HIGH-RISK CHECKOUT: ₹{session['amount']}")
        
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

    elif action == "ADD_TO_CART":
        print(f"🛒 Cart add: {data.get('item_name')}")

    elif action == "TEST_FRAUD":
        print(f"🧪 MANUAL FRAUD TEST TRIGGERED!")

# ------------------ MOUSE BEHAVIOR (Bot Detection) ------------------
@sio.event
async def mouse_move(sid, data):
    session = sessions.get(sid)
    if not session: 
        return

    session["coords"].append([data["x"], data["y"]])
    if len(session["coords"]) < WINDOW: 
        return

    coords = np.array(session["coords"][-WINDOW:])
    dist = np.sqrt(np.sum(np.diff(coords, axis=0) ** 2, axis=1))
    total_dist = np.sum(dist)
    displacement = np.linalg.norm(coords[-1] - coords[0])
    psi = displacement / total_dist if total_dist > 0 else 1.0
    jitter = np.std(dist)

    if not session["calibrated"]:
        session["baseline"].append([psi, jitter])
        if len(session["baseline"]) >= CALIBRATION_POINTS:
            baseline = np.array(session["baseline"])
            session["psi_mean"] = np.mean(baseline[:, 0])
            session["jitter_mean"] = np.mean(baseline[:, 1])
            session["calibrated"] = True
            print(f"✅ {sid} calibrated!")
        return

    try:
        feature_vector = intelshield_models['behavioral_scaler'].transform([[psi, jitter]])
        raw_score = intelshield_models['behavioral'].decision_function(feature_vector)[0]
    except Exception as e:
        print(f"Behavioral model error: {e}")
        return

    if raw_score < -0.15:
        session["risk"] += 1
        print(f"🤖 BOT DETECTED {sid}: Score={raw_score:.4f} | Risk={session['risk']}")
    else:
        session["risk"] = max(session["risk"] - 1, 0)

    total_risk = session["risk"] + session["phishing_risk"]
    if total_risk >= TOTAL_RISK_BLOCK:
        print(f"🚨 BLOCK {sid}: TOTAL_RISK={total_risk} | Mouse={session['risk']} | Phishing={session['phishing_risk']}")
        await sio.emit("security_lock", {
            "reason": "High confidence malicious activity",
            "mouse_risk": session["risk"],
            "phishing_risk": session["phishing_risk"],
            "score": round(raw_score, 4),
        }, room=sid)

# ------------------ TEST ENDPOINTS ------------------
@app.get("/api/test/phishing")
async def test_phishing():
    return {"message": "🦠 Phishing test triggered - check socket logs", "risk": 5}

@app.get("/api/test/fraud")
async def test_fraud():
    return {"message": "💳 Fraud test triggered - high-risk transaction", "score": -0.5}

@app.get("/api/threat-status")
async def threat_status(request: Request):
    sid = request.headers.get("x-socket-id", "unknown")
    session = sessions.get(sid, {})
    return {
        "mouse_risk": session.get("risk", 0),
        "phishing_risk": session.get("phishing_risk", 0),
        "total_risk": session.get("risk", 0) + session.get("phishing_risk", 0),
        "blocked": session.get("risk", 0) + session.get("phishing_risk", 0) > 7
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:sio_app", host="0.0.0.0", port=8000, reload=True)
