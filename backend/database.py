import os
import motor.motor_asyncio
import certifi
from dotenv import load_dotenv
from passlib.context import CryptContext

# Load environment variables
load_dotenv()

# Secure MongoDB URI
MONGO_URI = os.getenv("MONGO_URI")

if not MONGO_URI:
    raise RuntimeError("❌ MONGO_URI is not set in environment variables")

client = motor.motor_asyncio.AsyncIOMotorClient(
    MONGO_URI,
    tlsCAFile=certifi.where()
)

database = client["intelshield"]
user_collection = database["users_collection"]

# Password hashing
pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto",
    truncate_error=False
)

def user_helper(user) -> dict:
    return {
        "id": str(user["_id"]),
        "username": user["username"],
        "is_blocked": user.get("is_blocked", False),
    }
