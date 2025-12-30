import os
import motor.motor_asyncio
import certifi
from dotenv import load_dotenv
import bcrypt  # 🔐 Direct bcrypt - no more passlib issues


load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")
if not MONGO_URI:
    raise RuntimeError("❌ MONGO_URI is not set in environment variables")

client = motor.motor_asyncio.AsyncIOMotorClient(
    MONGO_URI,
    tlsCAFile=certifi.where()
)

database = client["intelshield"]
user_collection = database["users_collection"]


# -------- Password hashing helpers (bcrypt direct) --------
def get_password_hash(password: str) -> str:
    """Hash a plaintext password with bcrypt and return UTF-8 string."""
    # ✅ Keep your 71-byte truncation for bcrypt safety
    safe_password = password.encode('utf-8')[:71]
    hashed = bcrypt.hashpw(safe_password, bcrypt.gensalt())
    return hashed.decode("utf-8")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify plaintext against stored bcrypt hash."""
    # ✅ Same truncation for consistency
    safe_password = plain_password.encode('utf-8')[:71]
    return bcrypt.checkpw(safe_password, hashed_password.encode("utf-8"))


def user_helper(user) -> dict:
    return {
        "id": str(user["_id"]),
        "username": user["username"],
        "is_blocked": user.get("is_blocked", False),
    }
