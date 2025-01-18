from bson import ObjectId
from datetime import datetime
from src.config.config import get_collection_2

def fetch_data_by_filters(isRespectedCitizen, date, page=1, limit=10):
    """Fetch data from MongoDB based on the provided filters."""
    try:
        collection = get_collection_2()

        # Build the query dynamically based on filters
        query = {}
        if isRespectedCitizen is not None:
            query["respected_citizen"] = bool(isRespectedCitizen)
        if date:
            try:
                datetime.strptime(date, "%Y-%m-%d")
                query["preferred_date"] = date
            except ValueError:
                raise ValueError("Invalid date format. Expected YYYY-MM-DD.")

        # Debug print
        print(f"Query: {query}")

        # Fetch data with all fields
        data = collection.find(
            query,
            {
                "name": 1,
                "category": 1,
                "preferred_date": 1,
                "preferred_time": 1,
                "respected_citizen": 1,
                "service_id": 1,
                "make_announcement": 1,
                "announcement_message": 1,
                "vehicle_number": 1,
                "service_type": 1,
                "service_title": 1,
                "_id": 1
            }
        ).skip((page - 1) * limit).limit(limit)

        data_list = []
        for item in data:
            # Debug print
            print(f"Found item: {item}")
            item["_id"] = str(item["_id"])
            data_list.append(item)

        return data_list
    except Exception as e:
        print(f"Error in fetch_data_by_filters: {e}")
        raise Exception(f"Error fetching data: {e}")
