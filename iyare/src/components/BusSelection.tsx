import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const BusSelection = () => {
  interface Bus {
    id: number;
    bus_name: string;
    departure_time: string;
    available_seats: number;
    total_seats: number;
  }

  const [buses, setBuses] = useState<Bus[]>([]);
  const [selectedBus, setSelectedBus] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const location = useLocation();
  const navigate = useNavigate();

  // Get data from navigation state
  const routeId = location.state?.routeId;
  const departureDate = location.state?.departureDate;

  useEffect(() => {
    if (!routeId) {
      setError("No route selected.");
      setIsLoading(false);
      return;
    }

    const fetchBuses = async () => {
      try {
        const response = await fetch(
          `https://iyare-backend.onrender.com/api/buses/${routeId}?date=${departureDate}`
        );
        if (!response.ok) {
          throw new Error("No buses available for this route.");
        }
        const data = await response.json();
        setBuses(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBuses();
  }, [routeId, departureDate]);

  const handleBusSelect = (busId: number) => {
    setSelectedBus(busId);
  };

  const handleContinue = () => {
    if (selectedBus) {
      navigate(`/seat-selection/${selectedBus}`);
    }
  };

  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-red-600 mb-8 text-center">
        Select Your Bus
      </h1>
      <div className="space-y-4">
        {buses.length > 0 ? (
          buses.map((bus) => (
            <div
              key={bus.id}
              className={`p-6 border rounded-lg cursor-pointer ${
                selectedBus === bus.id
                  ? "border-red-600 bg-red-50 shadow-md"
                  : "border-gray-300"
              }`}
              onClick={() => handleBusSelect(bus.id)}
            >
              <p className="font-semibold text-lg">🚌 {bus.bus_name}</p>
              <p className="text-gray-600">Departure: {bus.departure_time}</p>
              <p className="text-gray-600">
                Seats Available: {bus.available_seats}/{bus.total_seats}
              </p>
            </div>
          ))
        ) : (
          <p className="text-center">No buses available for this route.</p>
        )}
      </div>
      <button
        onClick={handleContinue}
        disabled={!selectedBus}
        className="w-full bg-red-600 text-white font-semibold py-2 rounded hover:bg-red-700 mt-5"
      >
        Continue to Seat Selection
      </button>

      {isLoading && (
        <div className="fixed inset-0 bg-black/60 bg-opacity-50 flex justify-center items-center z-50">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-white"></div>
        </div>
      )}
    </div>
  );
};

export default BusSelection;
