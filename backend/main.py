from flask import Flask, request, jsonify
from flask_jwt_extended import create_access_token, JWTManager, jwt_required, get_jwt_identity
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from datetime import timedelta
from datetime import datetime

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


class Route(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    departure_city = db.Column(db.String(100), nullable=False)
    destination_city = db.Column(db.String(100), nullable=False)
    price = db.Column(db.Float, nullable=False)
    estimated_time = db.Column(db.String(50), nullable=True)

    def to_dict(self):
        return {
            "id": self.id,
            "departure_city": self.departure_city,
            "destination_city": self.destination_city,
            "price": self.price,
            "estimated_time": self.estimated_time
        }


class Bus(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    route_id = db.Column(db.Integer, db.ForeignKey("route.id"), nullable=False)
    bus_name = db.Column(db.String(100), nullable=False)
    total_seats = db.Column(db.Integer, nullable=False)
    available_seats = db.Column(db.Integer, nullable=False)
    departure_time = db.Column(db.String(50), nullable=False)

    route = db.relationship("Route", backref=db.backref("buses", lazy=True))

    def to_dict(self):
        return {
            "id": self.id,
            "bus_name": self.bus_name,
            "total_seats": self.total_seats,
            "available_seats": self.available_seats,
            "departure_time": self.departure_time,
            "route_id": self.route_id
        }


class Seat(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    bus_id = db.Column(db.Integer, db.ForeignKey("bus.id"), nullable=False)
    seat_number = db.Column(db.String(10), nullable=False)
    status = db.Column(db.String(20), default="available")  # "available" or "booked"
    user_id = db.Column(db.Integer, nullable=True)  # Nullable for guest booking


class Booking(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_name = db.Column(db.String(100), nullable=False)
    phone_number = db.Column(db.String(20), nullable=False)
    next_of_kin_name = db.Column(db.String(100), nullable=False)
    next_of_kin_phone = db.Column(db.String(20), nullable=False)
    bus_id = db.Column(db.Integer, db.ForeignKey('bus.id'), nullable=False)
    seat_numbers = db.Column(db.String(255), nullable=False)  # Example: "1,2,3"
    departure_date = db.Column(db.Date, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "user_name": self.user_name,
            "phone_number": self.phone_number,
            "next_of_kin_name": self.next_of_kin_name,
            "next_of_kin_phone": self.next_of_kin_phone,
            "bus_id": self.bus_id,
            "seat_numbers": self.seat_numbers,
            "departure_date": str(self.departure_date),
        }


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

    return jsonify({"message": "User created successfully"}), 201


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


@app.route("/api/routes", methods=["GET"])
def get_routes():
    routes = Route.query.all()
    
    if not routes:
        return jsonify({"message": "No routes available"}), 404
    
    return jsonify([route.to_dict() for route in routes]), 200


# Insert predefined routes if not in database
def seed_routes():
    default_routes = [
        {"departure_city": "Lagos", "destination_city": "Abuja", "price": 15000, "estimated_time": "10 hours"},
        {"departure_city": "Abuja", "destination_city": "Port Harcourt", "price": 12000, "estimated_time": "8 hours"},
        {"departure_city": "Kano", "destination_city": "Lagos", "price": 18000, "estimated_time": "12 hours"}
    ]

    for route in default_routes:
        existing_route = Route.query.filter_by(
            departure_city=route["departure_city"],
            destination_city=route["destination_city"]
        ).first()

        if not existing_route:
            new_route = Route(**route)
            db.session.add(new_route)
    print("New routes added successfully")
    db.session.commit()


@app.route("/api/buses/<int:route_id>", methods=["GET"])
def get_buses(route_id):
    buses = Bus.query.filter_by(route_id=route_id).all()
    
    if not buses:
        return jsonify({"message": "No buses available for this route"}), 404
    
    return jsonify([bus.to_dict() for bus in buses]), 200

def seed_buses():
    if not Bus.query.first():  # Avoid duplicate data
        buses = [
            {"route_id": 1, "bus_name": "ABC Travels", "total_seats": 20, "available_seats": 20, "departure_time": "Morning"},
            {"route_id": 1, "bus_name": "XYZ Express", "total_seats": 15, "available_seats": 15, "departure_time": "Afternoon"},
            {"route_id": 2, "bus_name": "LMN Transport", "total_seats": 18, "available_seats": 18, "departure_time": "Morning"},
            {"route_id": 2, "bus_name": "DEF Movers", "total_seats": 25, "available_seats": 25, "departure_time": "Afternoon"},
        ]
        for bus in buses:
            new_bus = Bus(**bus)
            db.session.add(new_bus)
        db.session.commit()
        print("Buses seeded successfully!")


@app.route("/api/buses/<int:bus_id>/seats", methods=["GET"])
def get_seats(bus_id):
    seats = Seat.query.filter_by(bus_id=bus_id).all()
    return jsonify([
        {"id": seat.id, "seat_number": seat.seat_number, "status": seat.status}
        for seat in seats
    ])

@app.route("/api/book-seat", methods=["POST"])
@jwt_required()
def book_seat():
    data = request.json
    print("Received booking request:", data)  

    seat_numbers = data.get("seats", [])  
    bus_id = data.get("busId")

    print(f"bus_id: {bus_id} (type: {type(bus_id)})")  # Debugging step
    print(f"seat_numbers: {seat_numbers} (type: {type(seat_numbers)})")  # Debugging step

    if not bus_id or not seat_numbers:
        return jsonify({"message": "Missing bus ID or seats"}), 400

    # Convert bus_id to integer if it's a string
    if isinstance(bus_id, str) and bus_id.isdigit():
        bus_id = int(bus_id)

    seats = Seat.query.filter(Seat.bus_id == bus_id, Seat.seat_number.in_(seat_numbers)).all()

    print("Matching seats in DB:", seats)  # Debugging step

    if len(seats) != len(seat_numbers):
        return jsonify({"message": "Some seats are already booked or do not exist"}), 400

    # ✅ If seats exist, update their status to 'booked'
    for seat in seats:
        seat.status = "booked"

    db.session.commit()

    return jsonify({"message": "Seats booked successfully!"}), 200  # ✅ Always return a response


def seed_seats():
    if not Seat.query.first():  # Avoid duplicate data
        buses = Bus.query.all()  # Get all buses
        seats = []

        for bus in buses:
            for seat_number in range(1, bus.total_seats + 1):  # Create seats from 1 to total_seats
                seats.append(Seat(bus_id=bus.id, seat_number=seat_number, status="available"))

        db.session.bulk_save_objects(seats)  # Bulk insert for efficiency
        db.session.commit()
        print("Seats seeded successfully!")

@app.route("/api/debug-seats", methods=["GET"])
def debug_seats():
    bus_id = 1  # Adjust if needed
    seats = Seat.query.filter(Seat.bus_id == bus_id).all()
    
    return jsonify({"seats": [seat.seat_number for seat in seats]})


@app.route("/api/confirm-booking", methods=["POST"])
def confirm_booking():
    data = request.json
    bus_id = data.get("busId")
    seat_numbers = data.get("seats")  # Expecting a string: "1,2"
    departure_date = data.get("departureDate")

    # Convert departure_date from string to date object
    try:
        departure_date = datetime.strptime(departure_date, "%Y-%m-%d").date()
    except ValueError:
        return jsonify({"error": "Invalid date format"}), 400

    # Check seat availability
    seat_list = seat_numbers.split(",") if seat_numbers else []
    seats = Seat.query.filter(Seat.bus_id == bus_id, Seat.seat_number.in_(seat_list)).all()

    if len(seats) != len(seat_list):
        return jsonify({"error": "Some seats are already booked or do not exist"}), 400

    # Create a new booking record
    booking = Booking(
        user_name=data.get("name"),
        phone_number=data.get("phoneNumber"),
        next_of_kin_name=data.get("nextOfKinName"),
        next_of_kin_phone=data.get("nextOfKinPhoneNumber"),
        bus_id=bus_id,
        seat_numbers=seat_numbers,
        departure_date=departure_date,
    )

    # Mark seats as booked
    for seat in seats:
        seat.status = "booked"

    db.session.add(booking)
    db.session.commit()

    return jsonify({"message": "Booking successful!", "booking": booking.to_dict()}), 201

if __name__ == "__main__":
    with app.app_context():
        db.create_all()
        seed_routes()
        seed_buses()
        seed_seats()

    app.run(debug=True)
