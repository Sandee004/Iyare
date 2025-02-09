import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Intro from "./components/Intro";
import Home from "./components/Home";
import BookingDetails from "./components/BookingDetails";
import BusSelection from "./components/BusSelection";
import SeatSelection from "./components/SeatSelection";
import BookingConfirmation from "./components/BookingConfirmation";
import Signup from "./components/Signup";
import Login from "./components/Login";
import Payment from "./components/Payment";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Intro />} />
        <Route path="/home" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/booking" element={<BookingDetails />} />
        <Route path="/bus-selection" element={<BusSelection />} />
        <Route path="/seat-selection/:busId" element={<SeatSelection />} />
        <Route path="/booking-confirmation" element={<BookingConfirmation />} />
        <Route path="/payment" element={<Payment />} />
      </Routes>
    </Router>
  );
}

export default App;
