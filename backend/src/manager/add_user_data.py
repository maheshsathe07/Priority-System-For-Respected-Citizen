from src.config.config import get_collection_1
from bson import ObjectId
import bcrypt

def add_new_user(name, email, city, password):
    """
    Add a new user to the MongoDB collection with hashed password.
    """
    try:
        collection = get_collection_1()  # Get the MongoDB collection
        
        # Check if the mobile number already exists
        existing_user = collection.find_one({"email": email})
        if existing_user:
            raise Exception("Email Already Exists!")
        
        # Hash the password
        salt = bcrypt.gensalt()
        hashed_password = bcrypt.hashpw(password.encode('utf-8'), salt)
        
        # Prepare the user data
        user_data = {
            "name": name,
            "email": email,
            "city": city,
            "password": hashed_password  # Store the hashed password
        }
        
        # Insert the new user into the collection
        result = collection.insert_one(user_data)

        return result.inserted_id
    
    except Exception as e:
        raise Exception(f"Error adding user: {str(e)}")