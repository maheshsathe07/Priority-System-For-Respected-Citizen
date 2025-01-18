from flask import Blueprint, request, jsonify
from src.manager.get_user_data import verify_user_password

AUTHENTICATE_USER = Blueprint("authenticate_user", __name__)

@AUTHENTICATE_USER.route("/authenticate-user", methods=["POST"])
def authenticate_user():
    try:
        data = request.get_json()
        email = data.get("email")
        password = data.get("password")
        
        if not email or not password:
            return jsonify({"error": "Email and password are required"}), 400
            
        user = verify_user_password(email, password)
        
        if user:
            return jsonify({
                "message": "Login successful",
                "user": user
            }), 200
        else:
            return jsonify({"error": "Invalid email or password"}), 401
            
    except Exception as e:
        return jsonify({"error": str(e)}), 500