import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";

const Intro = () => {
  const [showHome, setShowHome] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowHome(true);
    }, 4000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="flex items-center justify-center h-screen">
      {!showHome ? (
        <motion.div
          initial={{ scale: 0 }} // Start small
          animate={{ scale: 1 }} // Grow to normal size
          transition={{ duration: 2, ease: "easeOut" }} // 2s smooth animation
          className="bg-red-500 rounded-md w-12 h-12"
        ></motion.div>
      ) : (
        <div>
          <a>Create An Account</a>
          <a>Login</a>
          <Link to="/home">Continue without login</Link>
        </div>
      )}
    </div>
  );
};

export default Intro;
