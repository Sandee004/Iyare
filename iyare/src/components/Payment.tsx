import { useNavigate } from "react-router-dom";

const Payment = () => {
  const navigate = useNavigate();
  const submitForm = () => {
    navigate("/receipt");
  };
  return (
    <>
      <p>Payment page to be added here</p>
      <button
        onClick={submitForm}
        className="w-full bg-red-600 text-center text-white py-2 mt-20 rounded-md font-semibold hover:bg-red-700 transition"
      >
        I have made payment
      </button>
    </>
  );
};

export default Payment;
