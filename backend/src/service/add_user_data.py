from flask import Blueprint, jsonify, request
from flasgger.utils import swag_from
from src.manager.add_user_data import add_new_user

# Create Blueprint for the API
ADD_USER_DATA = Blueprint("add_user_data", __name__)

@ADD_USER_DATA.route("/add-user-data", methods=["POST"])
@swag_from("swag/add_user_data.yaml")
def add_user():
    """
    API endpoint to add a new user.
    """
    try:
        # Check Content-Type header
        if request.content_type != 'application/json':
            return jsonify({
                "error": "Content-Type must be application/json"
            }), 415

        # Get JSON data from request body
        data = request.get_json(silent=True)
        
        if not data:
            return jsonify({"error": "No JSON data provided"}), 400

        # Extract parameters from JSON body
        name = data.get("name")
        email = data.get("email")
        password = data.get("password")
        city = data.get("city", "Unknown")  # Default city if not provided

        # Debug logging
        print(f"Received data: {data}")

        # Validate required parameters
        if not all([name, email, password]):
            missing = [param for param in ["name", "email", "password"] 
                      if not data.get(param)]
            return jsonify({
                "error": f"Missing required fields: {', '.join(missing)}"
            }), 400

        # Basic email validation
        if '@' not in email:
            return jsonify({"error": "Invalid email format"}), 400

        # Add the new user
        user_id = add_new_user(name, email, city, password)

        # Return success response
        return jsonify({
            "message": "User added successfully",
            "user_id": str(user_id)
        }), 201

    except Exception as e:
        print(f"Error in add_user: {str(e)}")
        return jsonify({"error": str(e)}), 500