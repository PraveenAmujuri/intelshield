from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from database import user_collection, pwd_context
import unicodedata

router = APIRouter(prefix="/auth", tags=["Auth"])

BCRYPT_MAX_BYTES = 72

def normalize_password(password: str) -> str:
    return unicodedata.normalize("NFKC", password)

def validate_bcrypt_password(password: str):
    if len(password.encode("utf-8")) > BCRYPT_MAX_BYTES:
        raise HTTPException(status_code=400, detail="Password too long")
    if len(password) < 8:
        raise HTTPException(status_code=400, detail="Password too short")

class UserIn(BaseModel):
    username: str = Field(..., min_length=3, max_length=32)
    password: str

@router.post("/register")
async def register(user: UserIn):
    password = normalize_password(user.password)
    validate_bcrypt_password(password)

    if await user_collection.find_one({"username": user.username}):
        raise HTTPException(status_code=400, detail="User already exists")

    hashed = pwd_context.hash(password)
    await user_collection.insert_one({
        "username": user.username,
        "password": hashed,
        "is_blocked": False
    })
    return {"message": "User registered"}

@router.post("/login")
async def login(user: UserIn):
    password = normalize_password(user.password)
    validate_bcrypt_password(password)

    db_user = await user_collection.find_one({"username": user.username})
    if not db_user or not pwd_context.verify(password, db_user["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    if db_user.get("is_blocked"):
        raise HTTPException(status_code=403, detail="Account blocked")

    return {"message": "Login successful"}
