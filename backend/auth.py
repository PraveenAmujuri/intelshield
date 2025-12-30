from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from database import user_collection, pwd_context

router = APIRouter(prefix="/auth", tags=["Auth"])

# ------------------ CONSTANTS ------------------
BCRYPT_MAX_BYTES = 72

# ------------------ HELPERS ------------------
def validate_bcrypt_password(password: str):
    """
    bcrypt accepts max 72 BYTES, not characters.
    This prevents unicode / invisible char attacks.
    """
    if len(password.encode("utf-8")) > BCRYPT_MAX_BYTES:
        raise HTTPException(
            status_code=400,
            detail="Password too long (max 72 bytes after encoding)"
        )

# ------------------ SCHEMA ------------------
class UserIn(BaseModel):
    username: str = Field(..., min_length=3, max_length=32)
    password: str = Field(..., min_length=8, max_length=64)

# ------------------ REGISTER ------------------
@router.post("/register")
async def register(user: UserIn):
    validate_bcrypt_password(user.password)

    existing = await user_collection.find_one({"username": user.username})
    if existing:
        raise HTTPException(status_code=400, detail="User already exists")

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
    validate_bcrypt_password(user.password)

    db_user = await user_collection.find_one({"username": user.username})
    if not db_user or not pwd_context.verify(user.password, db_user["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    if db_user.get("is_blocked"):
        raise HTTPException(status_code=403, detail="Account blocked")

    return {"message": "Login successful"}
