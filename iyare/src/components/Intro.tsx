import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const Intro = () => {
  const [showHome, setShowHome] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowHome(true);
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className="h-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: 'url("/your-background-image.jpg")' }}
    >
      {!showHome ? (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 2, ease: "easeOut" }}
          onAnimationComplete={() => {
            setTimeout(() => {
              document.getElementById("animated-div")?.classList.add("spin");
            }, 500);
          }}
          id="animated-div"
          className="bg-red-500 rounded-md w-12 h-12"
        />
      ) : (
        <div className="flex flex-col items-center gap-4 bg-white bg-opacity-80 p-6 rounded-lg shadow-lg w-72">
          <Link
            to="/signup"
            className="px-6 py-3 w-full bg-red-600 text-white rounded-lg shadow-md text-center hover:bg-red-700 transition"
          >
            Create An Account
          </Link>
          <Link
            to="/login"
            className="px-6 py-3 w-full border-2 border-red-600 text-red-600 rounded-lg shadow-md text-center hover:bg-red-600 hover:text-white transition"
          >
            Login
          </Link>
          <Link
            to="/home"
            className="px-6 py-3 w-full text-gray-700 rounded-lg shadow-md text-center hover:bg-gray-200 transition"
          >
            Continue without login
          </Link>
        </div>
      )}
    </div>
  );
};

export default Intro;
