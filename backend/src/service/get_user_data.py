from flask import Blueprint, jsonify, request
from flasgger.utils import swag_from
from src.manager.get_user_data import fetch_data_by_filters

# Create Blueprint for the API
GET_USER_DATA = Blueprint("get_user_data", __name__)

@GET_USER_DATA.route("/get-user-data", methods=["GET"])
@swag_from("swag/get_user_data.yaml")  # Connect Swagger YAML
def get_data():
    """
    API endpoint to fetch data based on filters.
    """
    try:
        # Get category and date from query parameters
        category = request.args.get("category")
        date = request.args.get("date")

        # Fetch data using the functionality
        data = fetch_data_by_filters(category, date)
        return jsonify({"data": data}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500