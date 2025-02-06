from flask import Flask, request, jsonify, render_template
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required, JWTManager
from flask_sqlalchemy import SQLAlchemy
from flask_mail import Message, Mail
from flask_cors import CORS
#from dotenv import load_dotenv
from datetime import timedelta, datetime, timezone
import random
import string
import bcrypt
import os
import secrets


#load_dotenv()
app = Flask(__name__)
#app.config["JWT_SECRET_KEY"] = os.environ.get("JWT_SECRET_KEY")
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
    phoneNumber = db.Column(db.Integer, nullable=False, unique=True)
    nextOfKinName = db.Column(db.String(20))
    nextOfKinPhoneNumber = db.Column(db.String(100), nullable=False)


@app.route("/")
def home():
    return "Holla"

@app.route("/api/signup", methods=["POST"])
def signup():
    name = request.json.get("name")
    email = request.json.get("email")
    phoneNumber = request.json.get("phoneNumber")
    nextOfKinName = request.json.get("nextOfKinName")
    nextOfKinPhoneNumber = request.json.get("nextOfKinPhoneNumber")
    
    if not name or not email or not phoneNumber or not nextOfKinName or not nextOfKinPhoneNumber:
        return jsonify({"message":"Fill all fields"}), 400
    
    if Users.query.filter_by(email=email).first():
        return jsonify({"message": "Email is already in use"}), 400
    
    if Users.query.filter_by(phoneNumber=phoneNumber).first():
        return jsonify({"message": "Phone number is already in use"}), 400
    
    new_user = Users(name=name, email=email, phoneNumber=phoneNumber, nextOfKinName=nextOfKinName, nextOfKinPhoneNumber=nextOfKinPhoneNumber)
    db.session.add(new_user)
    db.session.commit()
    print("User created")
    return jsonify({"message": "User created successfully"}), 201


@app.route("/api/login", methods=["POST", "GET"])
def login():
    data = request.get_json()

    if not data:
        return jsonify({'error': 'Fill all fields'}), 400 

    email = data.get('email')
    phoneNumber = data.get('phoneNumber')

    user = Users.query.filter_by(email=email).first()
    if not user:
        return jsonify({"message": "Account does not exist"}), 404
    
    if user.email != email or not user.phoneNumber != phoneNumber:
        return jsonify({"message": "Invalid credentials"}), 401

    access_token = create_access_token(identity=user.id)
    print("Login successful")
    return jsonify(access_token=access_token), 200


if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    app.run(debug=True)
