import datetime
from src.config.config import get_collection_2

def add_respected_citizen(name, category, preferred_date, preferred_time, service_id=None, make_announcement=False, announcement_message=None, vehicle_number=None, service_type=None, service_title=None):
    """
    Add a person with their category and mark as respected citizen if service_id is provided.
    Prevents booking multiple appointments on the same date regardless of category.
    Also prevents booking appointments on Sundays.
    """
    try:
        collection = get_collection_2()  # Get the MongoDB collection

        # Debug print
        print(f"Adding appointment with service info: {service_type}, {service_title}")

        # Convert preferred_date string to datetime object for day validation
        date_obj = datetime.datetime.strptime(preferred_date, "%Y-%m-%d")
        
        # Check if the date is a Sunday (weekday() returns 6 for Sunday)
        if date_obj.weekday() == 6:
            raise Exception("Appointments cannot be booked on Sundays")

        # Check if the person has ANY appointment on the same date, regardless of category
        existing_appointment = collection.find_one({
            "name": name,  # Same person
            "preferred_date": str(preferred_date)  # Same date, regardless of category
        })
        
        if existing_appointment:
            existing_category = existing_appointment.get('category', 'unknown')
            raise Exception(f"You already have an appointment on {preferred_date} for category: {existing_category}")

        # Prepare the data
        person_data = {
            "name": name,
            "category": category,
            "preferred_date": str(preferred_date),  # Store date as string consistently
            "preferred_time": preferred_time,
            "respected_citizen": bool(service_id),
            "service_id": service_id,
            "make_announcement": make_announcement,
            "announcement_message": announcement_message if make_announcement else None,
            "vehicle_number": vehicle_number,
            "service_type": service_type,
            "service_title": service_title,
            "created_at": datetime.datetime.utcnow()  # Add timestamp for tracking
        }

        # Debug print
        print(f"Saving data: {person_data}")

        # Insert the person into the collection
        result = collection.insert_one(person_data)
        
        return result.inserted_id

    except Exception as e:
        print(f"Error in add_respected_citizen: {e}")
        raise Exception(f"Error adding appointment: {str(e)}")