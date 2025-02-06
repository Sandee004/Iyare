"use client";

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    phoneNumber: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Login Data:", formData);

    const url = "http://localhost:5000/api/login";
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    };

    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        const error = await response.json();
        const errorMessage = error.message || "Signup failed";
        alert(errorMessage);
        return;
      }
      console.log("Login successful");
      navigate("/home");
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6">
      <h1 className="text-3xl font-bold text-red-600 mb-6 text-center">
        Login
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block font-medium">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            required
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder="Enter your email"
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

        <button
          type="submit"
          className="w-full bg-red-600 text-white py-2 rounded-md font-semibold hover:bg-red-700 transition"
        >
          Login
        </button>
      </form>

      <p className="mt-4 text-center">
        Don’t have an account?{" "}
        <Link
          to="/signup"
          className="text-red-600 font-semibold hover:underline"
        >
          Create one
        </Link>
      </p>
    </div>
  );
}
