from src.config.config import get_collection_1

def verify_user(email, password):
    """
    Authenticate user by verifying the mobile number and password in MongoDB.
    """
    try:
        collection = get_collection_1()

        # Find the user by mobile number
        user = collection.find_one({"email": email})

        if not user:
            return {"error": "User not found"}, 404

        # Check if the password matches
        if user.get("password") == password:
            # Remove sensitive data like password
            user.pop("password", None)
            user["_id"] = str(user["_id"])  # Convert ObjectId to string
            return user
        else:
            return {"error": "Invalid password"}, 401
    except Exception as e:
        raise Exception(f"Error authenticating user: {e}")