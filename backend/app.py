from flask import Flask
from flasgger import Swagger
from flask_cors import CORS
from src.service.get_user_data import GET_USER_DATA
from src.service.add_user_data import ADD_USER_DATA
from src.service.authenticate_user import AUTHENTICATE_USER
from src.service.appointment_data import ADD_RESPECTED_CITIZEN
from src.service.verify_serviceid import VERIFY_SERVICE_ID
from src.service.get_appointment_data import GET_APPOINTMENT_DATA
from src.service.get_appointment_settings import APPOINTMENT_SETTINGS


app = Flask(__name__)
Swagger(app)  # Initialize Swagger

# Enable CORS
CORS(app, resources={r"/*": {"origins": "*"}})  # Allow requests from all origins

# Register Blueprint
app.register_blueprint(GET_USER_DATA)
app.register_blueprint(ADD_USER_DATA)
app.register_blueprint(AUTHENTICATE_USER)
app.register_blueprint(ADD_RESPECTED_CITIZEN)
app.register_blueprint(VERIFY_SERVICE_ID)
app.register_blueprint(GET_APPOINTMENT_DATA)
app.register_blueprint(APPOINTMENT_SETTINGS)

if __name__ == "__main__":
    app.run(debug=True, port=5000)