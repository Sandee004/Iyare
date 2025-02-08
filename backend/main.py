from flask import Flask, request, jsonify
from flask_jwt_extended import create_access_token, JWTManager, jwt_required, get_jwt_identity
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from datetime import timedelta, datetime

app = Flask(__name__)
app.config["JWT_SECRET_KEY"] = "fish"
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///mydatabase.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=24)

db = SQLAlchemy(app)
jwt = JWTManager(app)
CORS(app)


class Users(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    email = db.Column(db.String(100), nullable=False, unique=True)
    phoneNumber = db.Column(db.String(20), nullable=False, unique=True)
    nextOfKinName = db.Column(db.String(50), nullable=False)
    nextOfKinPhoneNumber = db.Column(db.String(20), nullable=False)

    travels = db.relationship("TravelDetails", backref="traveler", lazy=True)


class Buses(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    busNumber = db.Column(db.String(20), nullable=False, unique=True)
    busCapacity = db.Column(db.Integer, default=14)
    busRoute = db.Column(db.String(50), nullable=False)

    seats = db.relationship("Seats", backref="bus", lazy=True)


class Seats(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    seatNumber = db.Column(db.String(10), nullable=False)
    is_booked = db.Column(db.Boolean, default=False)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=True)
    bus_id = db.Column(db.Integer, db.ForeignKey("buses.id"), nullable=False)


class TravelDetails(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    travellingFrom = db.Column(db.String(50), nullable=False)
    travellingTo = db.Column(db.String(50), nullable=False)
    departureDate = db.Column(db.DateTime, nullable=False)
    route = db.Column(db.String(50), nullable=False)
    
    bus_id = db.Column(db.Integer, db.ForeignKey("buses.id"), nullable=True)
    seat_id = db.Column(db.Integer, db.ForeignKey("seats.id"), nullable=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)


@app.route("/api/signup", methods=["POST"])
def signup():
    data = request.json
    required_fields = ["name", "email", "phoneNumber", "nextOfKinName", "nextOfKinPhoneNumber"]
    
    if not all(data.get(field) for field in required_fields):
        return jsonify({"message": "Fill all fields"}), 400
    
    if Users.query.filter_by(email=data["email"]).first():
        return jsonify({"message": "Email is already in use"}), 400
    
    if Users.query.filter_by(phoneNumber=data["phoneNumber"]).first():
        return jsonify({"message": "Phone number is already in use"}), 400
    
    new_user = Users(**data)
    db.session.add(new_user)
    db.session.commit()
    print("Signup data gotten and stored")    

    return jsonify({
        "message": "User created successfully",
    }), 201


@app.route("/api/login", methods=["POST"])
def login():
    data = request.json
    email = data.get("email")
    phoneNumber = data.get("phoneNumber")

    user = Users.query.filter_by(email=email).first()
    if not user:
        return jsonify({"message": "Account does not exist"}), 404
    
    if user.phoneNumber != phoneNumber:
        return jsonify({"message": "Invalid credentials"}), 401

    print("Login data gotten. Logging the user in")

    access_token = create_access_token(identity=user.id)
    return jsonify(access_token=access_token), 200


@app.route("/api/travel", methods=["POST"])
@jwt_required()
def travelDetails():
    user_id = get_jwt_identity()
    data = request.json
    required_fields = ["travellingFrom", "travellingTo", "departureDate"]
    route = f"{data['travellingFrom']} - {data['travellingTo']}"
    print(route)
    
    if not all(data.get(field) for field in required_fields):
        return jsonify({"message": "Fill all fields"}), 400

    new_travel = TravelDetails(
        travellingFrom=data["travellingFrom"],
        travellingTo=data["travellingTo"],
        departureDate=datetime.strptime(data["departureDate"], "%Y-%m-%d"),  # Ensure correct date format
        route=route,
        user_id=user_id,
    )
    db.session.add(new_travel)
    db.session.commit()
    print("Travel details stored")    

    return jsonify({
        "message": "User created successfully",
    }), 201


@app.route("/buses/<int:bus_id>/seats", methods=["GET"])
def get_seats(bus_id):
    seats = Seats.query.filter_by(bus_id=bus_id).all()
    seat_data = [
        {"id": seat.id, "seatNumber": seat.seatNumber, "is_booked": seat.is_booked}
        for seat in seats
    ]
    return jsonify(seat_data), 200


@app.route('/book-seats', methods=['POST'])
@jwt_required()
def book_seats():
    data = request.json
    bus_id = data['busId']
    selected_seats = data['seats']
    user_id = get_jwt_identity()

    for seat_num in selected_seats:
        seat = Seats.query.filter_by(bus_id=bus_id, seatNumber=seat_num).first()
        if seat and not seat.is_booked:
            seat.is_booked = True
            seat.user_id = user_id
    
    db.session.commit()
    return jsonify({"message": "Seats booked successfully!"}), 200

if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    app.run(debug=True)
