#!/usr/bin/env python3
"""
Test MongoDB Atlas connection directly
"""
import os
from motor.motor_asyncio import AsyncIOMotorClient
import asyncio
from dotenv import load_dotenv

async def test_connection():
    # Load environment variables
    load_dotenv()

    # Get connection string
    MONGO_URL = os.getenv("MONGODB_URL")
    print(f"🔗 Testing connection to: {MONGO_URL[:50]}...")

    try:
        # Create client
        client = AsyncIOMotorClient(MONGO_URL)

        # Test connection
        await client.admin.command('ismaster')
        print("✅ SUCCESS: Connected to MongoDB Atlas!")

        # Test database operations
        db = client.oceaneye_db
        collection = db.test_collection

        # Insert a test document
        result = await collection.insert_one({"test": "Hello Atlas!", "timestamp": "2025-09-23"})
        print(f"✅ SUCCESS: Inserted test document with ID: {result.inserted_id}")

        # Read the document back
        doc = await collection.find_one({"_id": result.inserted_id})
        print(f"✅ SUCCESS: Retrieved document: {doc}")

        # Clean up - delete the test document
        await collection.delete_one({"_id": result.inserted_id})
        print("✅ SUCCESS: Cleaned up test document")

        # Close connection
        client.close()
        print("✅ SUCCESS: All tests passed! MongoDB Atlas is working perfectly!")

    except Exception as e:
        print(f"❌ ERROR: {e}")
        print("\n🔍 Troubleshooting tips:")
        print("1. Check your username and password in Atlas Database Access")
        print("2. Ensure your IP address is whitelisted in Atlas Network Access")
        print("3. Verify the connection string format")
        print("4. Make sure special characters in password are URL-encoded")

if __name__ == "__main__":
    asyncio.run(test_connection())