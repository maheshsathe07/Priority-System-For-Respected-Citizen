from flask import Blueprint, jsonify, request
from flasgger.utils import swag_from
from src.manager.verify_serviceid import verify_service_id

# Create Blueprint for the API
VERIFY_SERVICE_ID = Blueprint("verify_service_id", __name__)

@VERIFY_SERVICE_ID.route("/verify-service-id", methods=["GET"])
@swag_from("swag/verify_serviceid.yaml")  # Connect Swagger YAML
def verify_id():
    """
    API endpoint to verify if the inputted service_id exists.
    """
    try:
        # Get service_id from query parameters
        service_id = request.args.get("service_id")

        # Validate input
        if not service_id:
            return jsonify({"error": "service_id is required"}), 400

        # Verify service_id
        is_valid = verify_service_id(service_id)
        return jsonify({"is_valid": is_valid}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
