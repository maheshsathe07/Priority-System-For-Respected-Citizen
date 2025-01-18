from src.config.config import get_collection_3

def verify_service_id(service_id):
    """Check if the provided service_id exists in the database."""
    try:
        collection = get_collection_3()

        # Query the collection for the given service_id
        query = {"service_id": service_id}
        result = collection.find_one(query)

        # Return True if found, otherwise False
        return result is not None
    except Exception as e:
        raise Exception(f"Error verifying service ID: {e}")
