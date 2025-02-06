"use client";

import { useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";

export default function BookingConfirmation() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const busId = searchParams.get("busId");
  const seats = searchParams.get("seats");
  const departureDate = searchParams.get("departureDate");

  const [formData, setFormData] = useState({
    name: "",
    phoneNumber: "",
    nextOfKinName: "",
    nextOfKinPhoneNumber: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Booking submitted:", {
      ...formData,
      busId,
      seats,
      departureDate,
    });
    navigate("/payment");
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      {/* Navbar with Back Button */}
      <nav className="mb-6">
        <Link
          to="/seat-selection"
          className="text-red-600 font-semibold hover:underline"
        >
          ← Back to Seat Selection
        </Link>
      </nav>

      <h1 className="text-3xl font-bold text-red-600 mb-6 text-center">
        Confirm Your Booking
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block font-medium">
            Full Name
          </label>
          <input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder="Enter your full name"
          />
        </div>

        <div>
          <label htmlFor="phoneNumber" className="block font-medium">
            Phone Number
          </label>
          <input
            id="phoneNumber"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleInputChange}
            required
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder="Enter your phone number"
          />
        </div>

        <div>
          <label htmlFor="nextOfKinName" className="block font-medium">
            Next of Kin Name
          </label>
          <input
            id="nextOfKinName"
            name="nextOfKinName"
            value={formData.nextOfKinName}
            onChange={handleInputChange}
            required
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder="Enter next of kin's name"
          />
        </div>

        <div>
          <label htmlFor="nextOfKinPhoneNumber" className="block font-medium">
            Next of Kin Phone Number
          </label>
          <input
            id="nextOfKinPhoneNumber"
            name="nextOfKinPhoneNumber"
            value={formData.nextOfKinPhoneNumber}
            onChange={handleInputChange}
            required
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder="Enter next of kin's phone number"
          />
        </div>

        <div>
          <label className="block font-medium">Departure Date</label>
          <input
            value={departureDate || "Not Available"}
            readOnly
            disabled
            className="w-full p-2 border border-gray-300 rounded-md bg-gray-200 text-gray-500"
          />
        </div>

        <div>
          <label className="block font-medium">Selected Seat(s)</label>
          <input
            value={seats || "None Selected"}
            readOnly
            disabled
            className="w-full p-2 border border-gray-300 rounded-md bg-gray-200 text-gray-500"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-red-600 text-white py-2 rounded-md font-semibold hover:bg-red-700 transition"
        >
          Proceed to Payment
        </button>
      </form>
    </div>
  );
}
