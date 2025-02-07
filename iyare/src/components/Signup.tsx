import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    nextOfKinName: "",
    nextOfKinPhoneNumber: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Signup Data:", formData);

    const url = "http://localhost:5000/api/signup";
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
      const data = await response.json();
      if (response.ok) {
        // Save token to localStorage
        localStorage.setItem("access_token", data.access_token);
        console.log("Signup successful! Token saved.");
        navigate("/home");
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6">
      <h1 className="text-3xl font-bold text-red-600 mb-6 text-center">
        Sign Up
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

        <button
          type="submit"
          className="w-full bg-red-600 text-white py-2 rounded-md font-semibold hover:bg-red-700 transition"
        >
          Sign Up
        </button>
      </form>

      <p className="mt-4 text-center">
        Already have an account?{" "}
        <Link
          to="/login"
          className="text-red-600 font-semibold hover:underline"
        >
          Login
        </Link>
      </p>
    </div>
  );
}
