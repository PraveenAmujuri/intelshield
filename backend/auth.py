from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from database import user_collection, pwd_context
import unicodedata

router = APIRouter(prefix="/auth", tags=["Auth"])

class UserIn(BaseModel):
    username: str = Field(..., min_length=3, max_length=32)
    password: str

@router.post("/register")
async def register(user: UserIn):
    # Normalize and truncate to 71 bytes for Bcrypt safety
    password = unicodedata.normalize("NFKC", user.password).encode("utf-8")[:71].decode("utf-8", "ignore")

    if await user_collection.find_one({"username": user.username}):
        raise HTTPException(status_code=400, detail="User already exists")

    hashed = pwd_context.hash(password)
    await user_collection.insert_one({
        "username": user.username,
        "password": hashed,
        "is_blocked": False
    })
    return {"message": "User registered successfully"}

@router.post("/login")
async def login(user: UserIn):
    password = unicodedata.normalize("NFKC", user.password).encode("utf-8")[:71].decode("utf-8", "ignore")
    
    db_user = await user_collection.find_one({"username": user.username})
    if not db_user or not pwd_context.verify(password, db_user["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    if db_user.get("is_blocked"):
        raise HTTPException(status_code=403, detail="Account restricted by AI Sentinel.")

    return {"access_token": db_user["username"], "token_type": "bearer"}