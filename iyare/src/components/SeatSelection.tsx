import { useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";

//const totalSeats = 14; // Adjusted to match your request
const unavailableSeats = [3, 7, 10]; // Example of booked seats

export default function SeatSelection() {
  const [selectedSeats, setSelectedSeats] = useState<number[]>([]);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const busId = searchParams.get("busId");
  //const departureDate = searchParams.get("departureDate");
  const handleSeatSelect = (seatNumber: number) => {
    if (selectedSeats.includes(seatNumber)) {
      setSelectedSeats(selectedSeats.filter((seat) => seat !== seatNumber));
    } else {
      setSelectedSeats([...selectedSeats, seatNumber]);
    }
  };

  const handleContinue = () => {
    if (selectedSeats.length > 0) {
      const departureDate = searchParams.get("departureDate");
      navigate(
        `/booking-confirmation?busId=${busId}&seats=${selectedSeats.join(
          ","
        )}&departureDate=${departureDate}`
      );
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Navbar */}
      <nav className="mb-6">
        <Link
          to="/bus-selection"
          className="text-red-600 font-semibold hover:underline"
        >
          ← Back to Bus Selection
        </Link>
      </nav>

      <h1 className="text-3xl font-bold text-red-600 mb-6 text-center">
        Select Your Seats
      </h1>

      {/* Bus Layout */}
      <div className="flex flex-col items-center space-y-4 bg-gray-100 p-6 rounded-lg shadow-md">
        {/* Driver & Assistant Row */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-gray-400 text-white p-3 rounded text-center">
            🚍 Driver
          </div>
          <div></div> {/* Empty space */}
          <button
            className={`w-12 h-12 rounded-md ${
              selectedSeats.includes(1) ? "bg-green-500" : "bg-gray-300"
            }`}
            onClick={() => handleSeatSelect(1)}
            disabled={unavailableSeats.includes(1)}
          >
            1
          </button>
        </div>

        {/* Passenger Rows */}
        <div className="grid grid-cols-3 gap-6">
          {[2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14].map((seatNumber) => (
            <button
              key={seatNumber}
              className={`w-12 h-12 text-white font-bold rounded-md ${
                unavailableSeats.includes(seatNumber)
                  ? "bg-red-500 cursor-not-allowed"
                  : selectedSeats.includes(seatNumber)
                  ? "bg-green-500"
                  : "bg-gray-300 hover:bg-gray-400"
              }`}
              onClick={() => handleSeatSelect(seatNumber)}
              disabled={unavailableSeats.includes(seatNumber)}
            >
              {seatNumber}
            </button>
          ))}
        </div>
      </div>

      {/* Summary & Continue Button */}
      <div className="mt-6 flex justify-between items-center">
        <p className="text-lg">
          Selected Seats:{" "}
          {selectedSeats.length > 0 ? selectedSeats.join(", ") : "None"}
        </p>
        <button
          onClick={handleContinue}
          disabled={selectedSeats.length === 0}
          className={`px-4 py-2 text-white font-semibold rounded-md ${
            selectedSeats.length > 0
              ? "bg-red-600 hover:bg-red-700"
              : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          Continue to Booking
        </button>
      </div>
    </div>
  );
}
