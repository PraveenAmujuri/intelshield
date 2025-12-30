import os
import motor.motor_asyncio
import certifi
from dotenv import load_dotenv
from passlib.context import CryptContext

load_dotenv()

# Database Connection
MONGO_URI = os.getenv("MONGO_URI")
client = motor.motor_asyncio.AsyncIOMotorClient(
    MONGO_URI,
    tlsCAFile=certifi.where()
)
database = client["intelshield"]
user_collection = database["users_collection"]

# ✅ THE FIX: Explicitly handle the bcrypt backend to stop the internal library crash
pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto",
    bcrypt__backend="builtin",      # Forces the stable internal handler
    bcrypt__truncate_error=False    # Prevents crash on passwords > 72 bytes
)