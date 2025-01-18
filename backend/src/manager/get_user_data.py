from bson import ObjectId
from src.config.config import get_collection_1
import bcrypt

def fetch_data_by_filters(category=None, date=None):
    """Fetch data from MongoDB based on the provided filters."""
    try:
        collection = get_collection_1()

        # Build the query dynamically based on filters
        query = {}
        if category:
            query["service_category"] = category
        if date:
            query["appointment_date"] = date

        # Query to fetch data
        data = collection.find(query)

        # Convert ObjectId to string
        data_list = []
        for item in data:
            item["_id"] = str(item["_id"])  # Convert ObjectId to string
            # Remove password from the response
            if "password" in item:
                del item["password"]
            data_list.append(item)

        return data_list
    except Exception as e:
        raise Exception(f"Error fetching data: {e}")

def verify_user_password(email, password):
    """
    Verify user's password against stored hash.
    Returns the user data if verification succeeds, None otherwise.
    """
    try:
        collection = get_collection_1()
        user = collection.find_one({"email": email})
        
        if not user:
            return None
            
        # Verify the password
        if bcrypt.checkpw(password.encode('utf-8'), user['password']):
            # Convert ObjectId to string and remove password before returning
            user['_id'] = str(user['_id'])
            del user['password']
            return user
            
        return None
    except Exception as e:
        raise Exception(f"Error verifying password: {e}")