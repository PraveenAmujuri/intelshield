from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from database import user_collection, pwd_context

router = APIRouter(prefix="/auth", tags=["Auth"])

# ------------------ SCHEMA ------------------
class UserIn(BaseModel):
    username: str = Field(..., min_length=3, max_length=32)
    password: str = Field(..., min_length=8, max_length=64)  # 👈 FIX

# ------------------ REGISTER ------------------
@router.post("/register")
async def register(user: UserIn):
    existing = await user_collection.find_one({"username": user.username})
    if existing:
        raise HTTPException(status_code=400, detail="User already exists")

    # Safe: password length guaranteed <= 64
    hashed_password = pwd_context.hash(user.password)

    await user_collection.insert_one({
        "username": user.username,
        "password": hashed_password,
        "is_blocked": False
    })

    return {"message": "User registered successfully"}

# ------------------ LOGIN ------------------
@router.post("/login")
async def login(user: UserIn):
    db_user = await user_collection.find_one({"username": user.username})

    if not db_user or not pwd_context.verify(user.password, db_user["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    if db_user.get("is_blocked"):
        raise HTTPException(status_code=403, detail="Account blocked")

    return {"message": "Login successful"}
