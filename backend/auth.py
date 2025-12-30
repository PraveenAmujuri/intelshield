from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from database import user_collection, get_password_hash, verify_password  # ✅ Updated imports


router = APIRouter(prefix="/auth", tags=["Auth"])


class UserIn(BaseModel):
    username: str
    password: str


@router.post("/register")
async def register(user: UserIn):
    existing = await user_collection.find_one({"username": user.username})
    if existing:
        raise HTTPException(status_code=400, detail="User already exists")

    # ✅ Uses the fixed get_password_hash() from database.py
    hashed = get_password_hash(user.password)
    
    await user_collection.insert_one({
        "username": user.username,
        "password": hashed,  # ✅ Now stores bcrypt hash
        "is_blocked": False
    })

    return {"message": "User registered successfully"}


@router.post("/login")
async def login(user: UserIn):
    db_user = await user_collection.find_one({"username": user.username})
    if not db_user or not verify_password(user.password, db_user["password"]):  # ✅ Fixed verify
        raise HTTPException(status_code=401, detail="Invalid credentials")

    if db_user.get("is_blocked"):
        raise HTTPException(status_code=403, detail="Account blocked")

    return {"message": "Login successful"}
