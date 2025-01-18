import datetime
from src.config.config import get_collection_4

def get_capacity_settings(date):
    """
    Get capacity settings for a specific date.
    """
    try:
        settings_collection = get_collection_4()
        settings = settings_collection.find_one({"date": date})
        
        if not settings:
            # Return default settings if none exist
            return {
                "date": date,
                "morning_capacity": {
                    "total": 20,
                    "respectedCitizen": 15,
                    "capacity": 5  # This is the civilian capacity
                },
                "afternoon_capacity": {
                    "total": 20,
                    "respectedCitizen": 15,
                    "capacity": 5  # This is the civilian capacity
                }
            }
        
        return settings

    except Exception as e:
        raise Exception(f"Error fetching capacity settings: {str(e)}")