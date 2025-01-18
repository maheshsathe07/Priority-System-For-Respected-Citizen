from flask import Blueprint, jsonify, request
from flasgger.utils import swag_from
from distutils.util import strtobool
from src.manager.get_appointment_data import fetch_data_by_filters

GET_APPOINTMENT_DATA = Blueprint("get_appointment_data", __name__)

@GET_APPOINTMENT_DATA.route("/get-appointment-data", methods=["GET"])
@swag_from("swag/get_appointment_data.yaml")  # Connect Swagger YAML
def get_data():
    """
    API endpoint to fetch data based on filters.
    """
    try:
        isRespectedCitizen = request.args.get("isRespectedCitizen")
        date = request.args.get("date")
        page = int(request.args.get("page", 1))
        limit = int(request.args.get("limit", 10))

        # Convert isRespectedCitizen to boolean if provided
        isRespectedCitizen = bool(strtobool(isRespectedCitizen)) if isRespectedCitizen else None

        # Fetch data using the functionality
        data = fetch_data_by_filters(isRespectedCitizen, date, page, limit)
        return jsonify({"data": data, "page": page, "limit": limit}), 200
    except ValueError as ve:
        return jsonify({"error": str(ve)}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500
