import os
import motor.motor_asyncio
import certifi
from dotenv import load_dotenv
from passlib.context import CryptContext

# ------------------ ENV ------------------
load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")
if not MONGO_URI:
    raise RuntimeError("❌ MONGO_URI not set")

# ------------------ DB ------------------
client = motor.motor_asyncio.AsyncIOMotorClient(
    MONGO_URI,
    tlsCAFile=certifi.where()
)

database = client["intelshield"]
user_collection = database["users_collection"]

# ------------------ PASSWORD HASHING ------------------
pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto",
    truncate_error=False  # 🔒 strict mode ON
)
