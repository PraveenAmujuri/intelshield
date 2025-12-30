import os
import motor.motor_asyncio
import certifi
from dotenv import load_dotenv
from passlib.context import CryptContext

load_dotenv()

# 1. MongoDB Connection
MONGO_URI = os.getenv("MONGO_URI")
client = motor.motor_asyncio.AsyncIOMotorClient(
    MONGO_URI,
    tlsCAFile=certifi.where()
)
database = client["intelshield"]
user_collection = database["users_collection"]

# 2. ✅ FINAL RENDER FIX: Two-step initialization to bypass library bugs
# This stops the KeyError: "keyword not supported by bcrypt handler: 'backend'"
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
pwd_context.update(bcrypt__backend="builtin", bcrypt__truncate_error=False)