"""
Database connection and configuration for OceanEye MongoDB integration.
"""
import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# MongoDB connection details
MONGO_DETAILS = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
DATABASE_NAME = os.getenv("DATABASE_NAME", "oceaneye_db")

# Global variables for database connection
client: AsyncIOMotorClient = None
database = None

# Collections
user_reports_collection = None
social_posts_collection = None
trending_hashtags_collection = None
users_collection = None


async def connect_to_mongo():
    """Create database connection on startup."""
    global client, database, user_reports_collection, social_posts_collection, trending_hashtags_collection, users_collection

    try:
        # Add timeout to avoid hanging
        client = AsyncIOMotorClient(
            MONGO_DETAILS,
            serverSelectionTimeoutMS=5000,  # 5 second timeout
            connectTimeoutMS=5000,
            socketTimeoutMS=5000
        )
        database = client[DATABASE_NAME]

        # Initialize collections for coastal monitoring
        user_reports_collection = database.get_collection("user_reports")
        social_posts_collection = database.get_collection("social_posts")
        trending_hashtags_collection = database.get_collection("trending_hashtags")
        users_collection = database.get_collection("users")

        # Test the connection with timeout
        await client.admin.command('ping')
        print(f"✅ Connected to MongoDB: {DATABASE_NAME}")

    except Exception as e:
        print(f"⚠️  Failed to connect to MongoDB: {e}")
        print("⚠️  API will run in limited mode without database functionality")
        # Set global variables to None to indicate no connection
        client = None
        database = None
        user_reports_collection = None
        social_posts_collection = None
        trending_hashtags_collection = None
        users_collection = None


async def close_mongo_connection():
    """Close database connection on shutdown."""
    global client
    if client:
        client.close()
        print("🔌 Disconnected from MongoDB")


def get_database():
    """Get the database instance."""
    return database


def get_user_reports_collection():
    """Get the user reports collection."""
    return user_reports_collection


def get_social_posts_collection():
    """Get the social posts collection."""
    return social_posts_collection


def get_trending_hashtags_collection():
    """Get the trending hashtags collection."""
    return trending_hashtags_collection


def get_users_collection():
    """Get the users collection."""
    return users_collection