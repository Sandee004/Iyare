import { Link } from "react-router-dom";

const Home = () => {
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

        <Link
          to="/booking"
          className="bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg transition"
        >
          Book Now
        </Link>
      </div>
    </div>
  );
};

export default Home;
