"use client";

import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";

interface User {
  name: string;
  phoneNumber: string;
  nextOfKinName: string;
  nextOfKinPhoneNumber: string;
}

export default function BookingConfirmation() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const busId = searchParams.get("busId");
  const seats = searchParams.get("seats");
  const departureDate = searchParams.get("departureDate");

  const [formData, setFormData] = useState<User>({
    name: "",
    phoneNumber: "",
    nextOfKinName: "",
    nextOfKinPhoneNumber: "",
  });

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setFormData({
          name: user.name || "",
          phoneNumber: user.phoneNumber || "",
          nextOfKinName: user.nextOfKinName || "",
          nextOfKinPhoneNumber: user.nextOfKinPhoneNumber || "",
        });
      } catch (error) {
        console.error("Error parsing stored user data:", error);
      }
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = "http://localhost:5000/api/confirm-booking";

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          busId,
          seats,
          departureDate,
        }),
      });

      if (response.ok) {
        navigate("/payment");
      } else {
        console.error("Booking failed:", await response.json());
      }
    } catch (error) {
      console.error("Error processing booking:", error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
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
