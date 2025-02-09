import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";

export default function SeatSelection() {
  const [selectedSeats, setSelectedSeats] = useState<number[]>([]);
  const [unavailableSeats, setUnavailableSeats] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const { busId } = useParams();
  console.log("Bus ID from URL:", busId);
  const totalSeats = 14; // Adjust this based on the bus configuration

  // Fetch unavailable seats from the backend
  useEffect(() => {
    const fetchSeats = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/buses/${busId}/seats`
        );
        const data = await response.json();
        setUnavailableSeats(data.unavailableSeats || []);
      } catch (error) {
        console.error("Error fetching seats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSeats();
  }, [busId]);

  const handleSeatSelect = (seatNumber: number) => {
    setSelectedSeats((prevSelected) =>
      prevSelected.includes(seatNumber)
        ? prevSelected.filter((seat) => seat !== seatNumber)
        : [...prevSelected, seatNumber]
    );
  };

  const handleContinue = async () => {
    if (selectedSeats.length === 0) return;
  
    try {
      const departureDate = new Date().toISOString().split("T")[0];
      const token = localStorage.getItem("token");
  
      const payload = {
        busId,
        seats: selectedSeats,
        departureDate,
      };
  
      console.log("Sending payload:", payload); // Add this to debug
  
      const response = await fetch(`http://localhost:5000/api/book-seat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
  
      const responseData = await response.json();
      console.log("Response:", responseData); // Add this to debug
  
      if (response.ok) {
        navigate(
          `/booking-confirmation?busId=${busId}&seats=${selectedSeats.join(
            ","
          )}&departureDate=${departureDate}`
        );
      } else {
        alert(responseData.message || "Failed to book seats. Please try again.");
      }
    } catch (error) {
      console.error("Error booking seats:", error);
    }
  };

  
  if (loading) {
    return <p className="text-center text-lg">Loading seats...</p>;
  }

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
        {/* Driver Seat */}
        <div className="grid grid-cols-3 gap-4 items-center">
          <div className="bg-gray-400 text-white p-3 rounded text-center">
            🚍 Driver
          </div>
          <div></div>
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

        {/* Passenger Seats */}
        <div className="grid grid-cols-3 gap-6">
          {Array.from({ length: totalSeats - 1 }, (_, i) => i + 2).map(
            (seatNumber) => (
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
            )
          )}
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
