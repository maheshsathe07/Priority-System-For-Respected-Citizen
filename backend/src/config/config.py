import os
from pymongo import MongoClient
import certifi
import sys
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

def get_mongodb_client():
    # Get MongoDB credentials from environment variables
    username = os.getenv("MONGODB_USERNAME")
    password = os.getenv("MONGODB_PASSWORD")
    cluster = os.getenv("MONGODB_CLUSTER")

    try:
        client = MongoClient(
            f"mongodb+srv://{username}:{password}@{cluster}/?retryWrites=true&w=majority",
            tlsCAFile=certifi.where(),
            serverSelectionTimeoutMS=5000
        )
        # Test the connection
        client.admin.command('ping')
        return client
    except Exception as e:
        print(f"Error connecting to MongoDB: {e}")
        sys.exit(1)

def get_db():
    """Return the MongoDB database object."""
    client = get_mongodb_client()
    db_name = os.getenv("MONGODB_DB_NAME")
    return client[db_name]

def get_collection_1():
    """Return the MongoDB collection object."""
    db = get_db()
    collection_name = os.getenv("MONGODB_COLLECTION_NAME_1")
    return db[collection_name]

def get_collection_2():
    """Return the MongoDB collection object."""
    db = get_db()
    collection_name = os.getenv("MONGODB_COLLECTION_NAME_2")
    return db[collection_name]


def get_collection_3():
    """Return the MongoDB collection object."""
    db = get_db()
    collection_name = os.getenv("MONGODB_COLLECTION_NAME_3")
    return db[collection_name]

def get_collection_4():
    """Return the MongoDB collection object."""
    db = get_db()
    collection_name = os.getenv("MONGODB_COLLECTION_NAME_4")
    return db[collection_name]