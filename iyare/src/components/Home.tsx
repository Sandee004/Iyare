import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Home = () => {
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const handleBookNow = () => {
    const isAuthenticated = !!localStorage.getItem("token"); // Directly check token
    if (!isAuthenticated) {
      setShowModal(true);
    } else {
      navigate("/booking");
    }
  };

  return (
    <div
      className="h-screen flex flex-col items-center justify-center bg-cover bg-center text-white"
      style={{
        backgroundImage:
          "url('https://media.istockphoto.com/id/1188198006/photo/a-rent-bus-is-drive.jpg?s=1024x1024&w=is&k=20&c=zb8W2qscsro1KG1ZwI_pCD9Kcc7_ZDGYfSTXd_sjjMk=')",
      }}
    >
      <div className="bg-black/50 p-8 rounded-lg text-center">
        <h1 className="text-4xl font-bold mb-4">Welcome to Iyare Motors</h1>
        <p className="text-lg mb-6">
          Book your trip in seconds and travel with ease.
        </p>

        <button
          onClick={handleBookNow}
          className="bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg transition"
        >
          Book Now
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center text-black">
            <h2 className="text-xl font-bold mb-4">Sign Up or Login</h2>
            <p className="mb-4">You need an account to book a seat.</p>
            <div className="flex justify-center space-x-4">
              <Link
                to="/login"
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="bg-green-500 text-white px-4 py-2 rounded"
              >
                Sign Up
              </Link>
            </div>
            <button
              onClick={() => setShowModal(false)}
              className="mt-4 bg-gray-500 text-white px-4 py-2 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
