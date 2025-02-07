import { useState } from "react";
import { useNavigate } from "react-router-dom";

const buses = [
  { id: 1, departureTime: "07:00", arrivalTime: "14:00", price: 15000 },
  { id: 2, departureTime: "10:00", arrivalTime: "16:00", price: 15500 },
  { id: 3, departureTime: "12:00", arrivalTime: "18:00", price: 15000 },
];

const BusSelection = () => {
  const [selectedBus, setSelectedBus] = useState<number | null>(null);
  const navigate = useNavigate();

  const handleBusSelect = (busId: number) => {
    setSelectedBus(busId);
  };

  const handleContinue = () => {
    if (selectedBus) {
      navigate(`/seat-selection/${selectedBus}`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-red-600 mb-8 text-center">Select Your Bus</h1>
      <div className="space-y-4">
        {buses.map((bus) => (
          <div
            key={bus.id}
            className={`p-6 border rounded-lg cursor-pointer ${
              selectedBus === bus.id ? "border-red-600 bg-red-50 shadow-md" : "border-gray-300"
            }`}
            onClick={() => handleBusSelect(bus.id)}
          >
            <p className="font-semibold text-lg">🚌 Departure: {bus.departureTime}</p>
            <p className="text-gray-600">Arrival: {bus.arrivalTime}</p>
          </div>
        ))}
      </div>
      <button
        onClick={handleContinue}
        disabled={!selectedBus}
        className={`w-full py-3 mt-4 text-white font-semibold rounded-lg ${
          selectedBus ? "bg-red-600 hover:bg-red-700" : "bg-gray-400 cursor-not-allowed"
        }`}
      >
        Continue to Seat Selection
      </button>
    </div>
  );
};

export default BusSelection;
