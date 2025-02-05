import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const BookingDetails = () => {
  const navigate = useNavigate();
  const [searchData, setSearchData] = useState({
    from: "",
    to: "",
    date: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setSearchData({ ...searchData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Search submitted:", searchData);
    navigate("/bus-selection");
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      {/* Navbar with Back Button */}
      <nav className="flex items-center mb-6">
        <Link to="/home" className="text-red-600 font-medium hover:underline">
          ← Back
        </Link>
      </nav>

      <h1 className="text-3xl font-bold text-red-600 mb-8 text-center">
        Find Your Bus
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex flex-col">
          <label htmlFor="from" className="mb-1 font-medium">
            From
          </label>
          <select
            id="from"
            name="from"
            onChange={handleInputChange}
            className="border p-2 rounded w-full"
            required
          >
            <option value="">Select departure city</option>
            <option value="lagos">Lagos</option>
            <option value="abuja">Abuja</option>
            <option value="port-harcourt">Port Harcourt</option>
            <option value="kano">Kano</option>
          </select>
        </div>

        <div className="flex flex-col">
          <label htmlFor="to" className="mb-1 font-medium">
            To
          </label>
          <select
            id="to"
            name="to"
            onChange={handleInputChange}
            className="border p-2 rounded w-full"
            required
          >
            <option value="">Select destination city</option>
            <option value="lagos">Lagos</option>
            <option value="abuja">Abuja</option>
            <option value="port-harcourt">Port Harcourt</option>
            <option value="kano">Kano</option>
          </select>
        </div>

        <div className="flex flex-col">
          <label htmlFor="date" className="mb-1 font-medium">
            Departure Date
          </label>
          <input
            id="date"
            name="date"
            type="date"
            value={searchData.date}
            onChange={handleInputChange}
            className="border p-2 rounded w-full"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-red-600 text-white font-semibold py-2 rounded hover:bg-red-700"
        >
          Search Buses
        </button>
      </form>
    </div>
  );
};

export default BookingDetails;
