from flask import Blueprint, jsonify, request
from flasgger.utils import swag_from
from src.manager.get_appointment_settings import get_capacity_settings
from bson import json_util
import json

# Create Blueprint for the API
APPOINTMENT_SETTINGS = Blueprint("appointment_settings", __name__)

@APPOINTMENT_SETTINGS.route("/get-capacity-settings", methods=["GET"])
@swag_from("swag/get_capacity_settings.yaml")
def get_settings():
    """
    API endpoint to get appointment capacity settings.
    """
    try:
        date = request.args.get("date")
        if not date:
            return jsonify({"error": "Date parameter is required"}), 400

        settings = get_capacity_settings(date)
        
        # Convert MongoDB document to JSON-serializable format
        settings_json = json.loads(json_util.dumps(settings))
        
        return jsonify(settings_json), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500