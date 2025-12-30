from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from database import user_collection, pwd_context

router = APIRouter(prefix="/auth", tags=["Auth"])

class UserIn(BaseModel):
    username: str
    password: str

@router.post("/register")
async def register(user: UserIn):
    # ✅ FIX: Pre-truncate to 71 bytes to satisfy Bcrypt and prevent library crashes
    safe_password = user.password.encode('utf-8')[:71].decode('utf-8', 'ignore')

    existing = await user_collection.find_one({"username": user.username})
    if existing:
        raise HTTPException(status_code=400, detail="User already exists")

    hashed = pwd_context.hash(safe_password)
    await user_collection.insert_one({
        "username": user.username,
        "password": hashed,
        "is_blocked": False
    })

    return {"message": "User registered successfully"}

@router.post("/login")
async def login(user: UserIn):
    # ✅ FIX: Use the same truncation for verification
    safe_password = user.password.encode('utf-8')[:71].decode('utf-8', 'ignore')

    db_user = await user_collection.find_one({"username": user.username})
    if not db_user or not pwd_context.verify(safe_password, db_user["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    if db_user.get("is_blocked"):
        raise HTTPException(status_code=403, detail="Account blocked")

    return {"message": "Login successful"}