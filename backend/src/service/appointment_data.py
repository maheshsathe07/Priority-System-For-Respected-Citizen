from flask import Blueprint, jsonify, request
from flasgger.utils import swag_from
from src.manager.appointment_data import add_respected_citizen

# Create Blueprint for the API
ADD_RESPECTED_CITIZEN = Blueprint("add_respected_citizen", __name__)

@ADD_RESPECTED_CITIZEN.route("/add-respected-citizen", methods=["POST"])
@swag_from("swag/appointment_data.yaml")
def add_person():
    """
    API endpoint to add a new respected citizen.
    """
    try:
        # Extract parameters
        name = request.args.get("name")
        category = request.args.get("category")
        preferred_date = request.args.get("preferred_date")
        preferred_time = request.args.get("preferred_time")
        service_id = request.args.get("service_id")
        make_announcement = request.args.get("make_announcement", "false").lower() == "true"
        announcement_message = request.args.get("announcement_message")
        vehicle_number = request.args.get("vehicle_number")
        service_type = request.args.get("service_type")
        service_title = request.args.get("service_title")

        # Debug print
        print("Received service info:", {
            "service_type": service_type,
            "service_title": service_title
        })

        # Add the person with all details
        person_id = add_respected_citizen(
            name=name,
            category=category,
            preferred_date=preferred_date,
            preferred_time=preferred_time,
            service_id=service_id,
            make_announcement=make_announcement,
            announcement_message=announcement_message,
            vehicle_number=vehicle_number,
            service_type=service_type,
            service_title=service_title
        )

        return jsonify({
            "message": "Person added successfully",
            "person_id": str(person_id),
            "announcement": make_announcement,
            "announcement_message": announcement_message if make_announcement else None,
            "service_type": service_type,
            "service_title": service_title
        }), 201

    except Exception as e:
        print("Error:", str(e))  # Debug print
        return jsonify({"error": str(e)}), 500