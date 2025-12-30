import os
import motor.motor_asyncio
import certifi
from dotenv import load_dotenv
from passlib.context import CryptContext

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

# ✅ THE FIXED RENDER CONFIGURATION:
# 1. Initialize with a clean context to avoid the 'backend' KeyError
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# 2. Use .update() to force the 'builtin' backend.
# This bypasses the broken system 'bcrypt' library and silences version warnings.
pwd_context.update(bcrypt__backend="builtin") 

def user_helper(user) -> dict:
    return {
        "id": str(user["_id"]),
        "username": user["username"],
        "is_blocked": user.get("is_blocked", False),
    }