"use client";

import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

interface ReceiptData {
  name: string;
  seats: string;
  departureDate: string;
}

export default function Receipt() {
  const [receiptData, setReceiptData] = useState<ReceiptData>({
    name: "",
    seats: "",
    departureDate: "",
  });

  const [searchParams] = useSearchParams();

  useEffect(() => {
    const storedData = localStorage.getItem("receiptData");
    if (storedData) {
      setReceiptData(JSON.parse(storedData));
    } else {
      setReceiptData({
        name: searchParams.get("name") || "",
        seats: searchParams.get("seats") || "",
        departureDate: searchParams.get("departureDate") || "",
      });
    }
  }, [searchParams]);

  const downloadReceipt = () => {
    const receiptElement = document.getElementById("receipt-content");
    if (!receiptElement) return;

    html2canvas(receiptElement).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF();
      pdf.addImage(imgData, "PNG", 10, 10, 180, 100);
      pdf.save("booking-receipt.pdf");
    });
  };

  return (
    <div className="max-w-lg mx-auto p-6 border rounded-lg shadow-lg mt-10 bg-white">
      <div id="receipt-content" className="text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-2">
          Iyare Group of Motors
        </h1>
        <p className="text-gray-600 text-sm">Your Trusted Travel Partner</p>
        <hr className="my-4" />

        <div className="text-left space-y-2">
          <p>
            <span className="font-semibold">Passenger Name:</span>{" "}
            {receiptData.name}
          </p>
          <p>
            <span className="font-semibold">Seat Number(s):</span>{" "}
            {receiptData.seats}
          </p>
          <p>
            <span className="font-semibold">Departure Date:</span>{" "}
            {receiptData.departureDate}
          </p>
        </div>

        <hr className="my-4" />
        <p className="text-sm text-gray-500">
          Please present this receipt at the boarding station.
        </p>
      </div>

      <button
        onClick={downloadReceipt}
        className="mt-6 w-full bg-red-600 text-white py-2 rounded-md font-semibold hover:bg-red-700 transition"
      >
        Download Receipt
      </button>

      <Link
        to="/"
        className="block text-center mt-4 text-red-600 font-semibold hover:underline"
      >
        Return Home
      </Link>
    </div>
  );
}
