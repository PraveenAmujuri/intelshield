from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from database import user_collection, get_password_hash, verify_password
import jwt  # For admin token
import time

router = APIRouter(prefix="/auth", tags=["Auth"])

class UserIn(BaseModel):
    username: str
    password: str

class BlockUser(BaseModel):
    username: str
    reason: str

# ------------------ USER AUTH ------------------
@router.post("/register")
async def register(user: UserIn):
    existing = await user_collection.find_one({"username": user.username})
    if existing:
        raise HTTPException(status_code=400, detail="User already exists")

    hashed = get_password_hash(user.password)
    
    await user_collection.insert_one({
        "username": user.username,
        "password": hashed,
        "is_blocked": False,
        "created_at": time.time()
    })

    return {"message": "User registered successfully"}

@router.post("/login")
async def login(user: UserIn):
    db_user = await user_collection.find_one({"username": user.username})
    if not db_user or not verify_password(user.password, db_user["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    if db_user.get("is_blocked"):
        raise HTTPException(status_code=403, detail="Account blocked by IntelShield")

    return {
        "message": "Login successful",
        "access_token": "user_jwt_" + str(time.time()),  # Simple token
        "username": user.username
    }

# ------------------ ADMIN AUTH ------------------
ADMIN_CREDENTIALS = {
    "admin": "intelshield2025"  # Change this in production!
}

@router.post("/admin-login")
async def admin_login(user: UserIn):
    if user.username not in ADMIN_CREDENTIALS or user.password != ADMIN_CREDENTIALS[user.username]:
        raise HTTPException(status_code=401, detail="Invalid admin credentials")
    
    token = jwt.encode({
        "username": user.username,
        "role": "admin",
        "exp": time.time() + 3600  # 1 hour
    }, "intelshield_secret", algorithm="HS256")
    
    return {
        "access_token": token,
        "message": "Admin access granted"
    }

# ------------------ ADMIN ACTIONS ------------------
@router.post("/admin/block-user")
async def block_user(block_data: BlockUser):
    # Admin auth check (in production, verify JWT)
    if not block_data.reason:
        raise HTTPException(status_code=400, detail="Reason required")
    
    result = await user_collection.update_one(
        {"username": block_data.username},
        {"$set": {
            "is_blocked": True,
            "blocked_reason": block_data.reason,
            "blocked_at": time.time()
        }}
    )
    
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="User not found")
    
    return {"message": f"User {block_data.username} blocked: {block_data.reason}"}

@router.post("/admin/whitelist-user")
async def whitelist_user(user: UserIn):
    result = await user_collection.update_one(
        {"username": user.username},
        {"$set": {
            "is_blocked": False,
            "blocked_reason": None,
            "whitelisted_at": time.time()
        }}
    )
    
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="User not found")
    
    return {"message": f"User {user.username} whitelisted"}

@router.get("/admin/alerts")
async def get_admin_alerts():
    # Return recent high-risk alerts (integrate with your sessions/alerts)
    return {
        "alerts": [],
        "active_sessions": len(sessions),
        "blocked_users": await user_collection.count_documents({"is_blocked": True})
    }

# ------------------ USER STATUS ------------------
@router.get("/user/status/{username}")
async def user_status(username: str):
    user = await user_collection.find_one({"username": username})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return {
        "username": user["username"],
        "is_blocked": user.get("is_blocked", False),
        "blocked_reason": user.get("blocked_reason", None),
        "status": "BLOCKED" if user.get("is_blocked") else "ACTIVE"
    }
