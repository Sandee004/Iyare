import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Intro from "./components/Intro";
import Home from "./components/Home";
import BookingDetails from "./components/BookingDetails";
import BusSelection from "./components/BusSelection";
import SeatSelection from "./components/SeatSelection";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Intro />} />
        <Route path="/home" element={<Home />} />
        <Route path="/booking" element={<BookingDetails />} />
        <Route path="/bus-selection" element={<BusSelection />} />
        <Route path="/seat-selection" element={<SeatSelection />} />
      </Routes>
    </Router>
  );
}

export default App;
