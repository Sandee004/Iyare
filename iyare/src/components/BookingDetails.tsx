import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const BookingDetails = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [searchData, setSearchData] = useState({
    travellingFrom: "",
    travellingTo: "",
    departureDate: "",
  });

  const [routes, setRoutes] = useState<
    { id: number; departure_city: string; destination_city: string }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        const response = await fetch(
          "https://iyare-backend.onrender.com/api/routes"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch routes");
        }
        const data = await response.json();
        setRoutes(data);
      } catch {
        setError("No routes available");
      } finally {
        setLoading(false);
      }
    };

    fetchRoutes();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setSearchData({ ...searchData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const selectedRoute = routes.find(
      (route) =>
        route.departure_city === searchData.travellingFrom &&
        route.destination_city === searchData.travellingTo
    );

    if (!selectedRoute) {
      alert("Invalid route selection.");
      return;
    }

    const selectedDate = new Date(searchData.departureDate);
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    if (selectedDate < currentDate) {
      alert("Departure date cannot be in the past.");
      return;
    }
    setIsLoading(false);

    navigate("/bus-selection", {
      state: {
        routeId: selectedRoute.id,
        departureDate: searchData.departureDate,
      },
    });
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <nav className="flex items-center mb-6">
        <Link to="/home" className="text-red-600 font-medium hover:underline">
          ← Back
        </Link>
      </nav>
      <h1 className="text-3xl font-bold text-red-600 mb-8 text-center">
        Find Your Bus
      </h1>

      {loading ? (
        <p className="text-center">Loading routes...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col">
            <label htmlFor="from" className="mb-1 font-medium">
              From
            </label>
            <select
              id="from"
              name="travellingFrom"
              onChange={handleInputChange}
              className="border p-2 rounded w-full"
              required
            >
              <option value="">Select departure city</option>
              {routes.map((route) => (
                <option key={route.id} value={route.departure_city}>
                  {route.departure_city}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col">
            <label htmlFor="to" className="mb-1 font-medium">
              To
            </label>
            <select
              id="to"
              name="travellingTo"
              onChange={handleInputChange}
              className="border p-2 rounded w-full"
              required
            >
              <option value="">Select destination city</option>
              {routes.map((route) => (
                <option key={route.id} value={route.destination_city}>
                  {route.destination_city}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col">
            <label htmlFor="date" className="mb-1 font-medium">
              Departure Date
            </label>
            <input
              id="date"
              name="departureDate"
              type="date"
              value={searchData.departureDate}
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
      )}

      {isLoading && (
        <div className="fixed inset-0 bg-black/60 bg-opacity-50 flex justify-center items-center z-50">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-white"></div>
        </div>
      )}
    </div>
  );
};

export default BookingDetails;
