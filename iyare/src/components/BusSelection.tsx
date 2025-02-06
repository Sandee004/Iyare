import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const buses = [
  {
    id: 1,
    departureTime: "08:00",
    arrivalTime: "14:00",
    price: 5000,
    availableSeats: 25,
  },
  {
    id: 2,
    departureTime: "10:00",
    arrivalTime: "16:00",
    price: 5500,
    availableSeats: 18,
  },
  {
    id: 3,
    departureTime: "12:00",
    arrivalTime: "18:00",
    price: 5000,
    availableSeats: 30,
  },
  {
    id: 4,
    departureTime: "14:00",
    arrivalTime: "20:00",
    price: 4500,
    availableSeats: 22,
  },
];

const BusSelection = () => {
  const [selectedBus, setSelectedBus] = useState<number | null>(null);
  const navigate = useNavigate();

  const handleBusSelect = (busId: number) => {
    setSelectedBus(busId);
  };

  const handleContinue = () => {
    if (selectedBus) {
      const departureDate = new URLSearchParams(window.location.search).get(
        "departureDate"
      );
      navigate(
        `/seat-selection?busId=${selectedBus}&departureDate=${departureDate}`
      );
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Navbar with Back Button */}
      <nav className="mb-6">
        <Link
          to="/booking"
          className="text-red-600 font-semibold hover:underline"
        >
          ← Back to Booking
        </Link>
      </nav>

      <h1 className="text-3xl font-bold text-red-600 mb-8 text-center">
        Select Your Bus
      </h1>

      <div className="space-y-4">
        {buses.map((bus) => (
          <div
            key={bus.id}
            className={`p-6 border rounded-lg cursor-pointer transition-all duration-300 ${
              selectedBus === bus.id
                ? "border-red-600 bg-red-50 shadow-md"
                : "border-gray-300 hover:border-red-400 hover:bg-gray-100"
            }`}
            onClick={() => handleBusSelect(bus.id)}
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="font-semibold text-lg">
                  🚌 Departure: {bus.departureTime}
                </p>
                <p className="text-gray-600">Arrival: {bus.arrivalTime}</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-xl text-red-600">₦{bus.price}</p>
                <p className="text-sm text-gray-500">
                  {bus.availableSeats} seats available
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <button
          onClick={handleContinue}
          disabled={!selectedBus}
          className={`w-full py-3 text-white font-semibold rounded-lg transition-all ${
            selectedBus
              ? "bg-red-600 hover:bg-red-700"
              : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          Continue to Seat Selection
        </button>
      </div>
    </div>
  );
};

export default BusSelection;
