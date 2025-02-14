import { useState, useEffect, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function SeatSelection() {
  const [selectedSeats, setSelectedSeats] = useState<number[]>([]);
  const [unavailableSeats, setUnavailableSeats] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const busId = useMemo(() => localStorage.getItem("busId") || "", []);
  const totalSeats = 13;

  interface Seat {
    status: string;
    seat_number: string;
  }

  useEffect(() => {
    const fetchSeats = async () => {
      if (!busId) return;
      try {
        const response = await fetch(
          `https://iyare-backend.onrender.com/api/buses/${busId}/seats`
        );
        const data = await response.json();

        const bookedSeats = data
          .filter((seat: Seat) => seat.status === "booked")
          .map((seat: Seat) => parseInt(seat.seat_number, 10));
        setUnavailableSeats(bookedSeats);
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
      const token = localStorage.getItem("token");

      // Re-check seat availability before booking
      const checkAvailability = await fetch(
        `https://iyare-backend.onrender.com/api/buses/${busId}/seats`
      );
      const seatData = await checkAvailability.json();

      const unavailableSeatNumbers: number[] = seatData
        .filter(
          (seat: { status: string; seat_number: string }) =>
            seat.status === "booked"
        )
        .map((seat: { seat_number: string }) => parseInt(seat.seat_number, 10));

      const conflictingSeats = selectedSeats.filter((seat) =>
        unavailableSeatNumbers.includes(seat)
      );

      if (conflictingSeats.length > 0) {
        alert(
          `Sorry, the following seats are no longer available: ${conflictingSeats.join(
            ", "
          )}. Please select other seats.`
        );
        setUnavailableSeats(unavailableSeatNumbers);
        return;
      }

      const payload = {
        busId,
        seats: selectedSeats,
        departureDate: new Date().toISOString().split("T")[0],
      };

      const response = await fetch(
        `https://iyare-backend.onrender.com/api/book-seat`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      const responseData = await response.json();
      if (response.ok) {
        localStorage.setItem("selectedseat", JSON.stringify(selectedSeats));
        navigate(
          `/booking-confirmation?busId=${busId}&seats=${selectedSeats.join(
            ","
          )}&departureDate=${payload.departureDate}`
        );
      } else {
        alert(
          responseData.message || "Failed to book seats. Please try again."
        );
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
              unavailableSeats.includes(1)
                ? "bg-red-500 cursor-not-allowed"
                : selectedSeats.includes(1)
                ? "bg-green-500"
                : "bg-gray-300 hover:bg-gray-400"
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
