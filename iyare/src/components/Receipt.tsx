"use client";

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  PDFDownloadLink,
} from "@react-pdf/renderer";

interface ReceiptData {
  name: string;
  seats: string;
  departureDate: string;
}

// Create the PDF Document component
// Adjust the ReceiptDocument component
const ReceiptDocument = ({ receiptData }: { receiptData: ReceiptData }) => (
  <Document>
    <Page
      size={{ width: 216, height: 140 }} // Medium size, between A4 and receipt size
      style={styles.page}
    >
      {/* Header Section */}
      <View style={styles.header}>
        <Text style={styles.title}>Iyare Group of Motors</Text>
        <Text style={styles.subTitle}>Your Trusted Travel Partner</Text>
      </View>

      {/* Line Separator */}
      <View style={styles.line} />

      {/* Details Section */}
      <View style={styles.section}>
        <Text style={styles.text}>
          <Text style={styles.label}>Passenger Name:</Text> {receiptData.name}
        </Text>
        <Text style={styles.text}>
          <Text style={styles.label}>Seat Number(s):</Text> {receiptData.seats}
        </Text>
        <Text style={styles.text}>
          <Text style={styles.label}>Departure Date:</Text>{" "}
          {receiptData.departureDate}
        </Text>
      </View>

      {/* Line Separator */}
      <View style={styles.line} />

      {/* Footer Section */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Please present this receipt at the boarding station.
        </Text>
      </View>
    </Page>
  </Document>
);

const styles = StyleSheet.create({
  page: {
    paddingVertical: 10,
    paddingHorizontal: 5, // Adds padding for cleaner look
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  header: {
    textAlign: "center",
    marginBottom: 5,
  },
  title: {
    fontSize: 15,
    fontWeight: "bold",
    color: "red",
  },
  subTitle: {
    fontSize: 9,
    color: "gray",
  },
  section: {
    marginVertical: 5,
    paddingHorizontal: 5,
  },
  text: {
    fontSize: 10,
    marginBottom: 2,
  },
  label: {
    fontWeight: "bold",
  },
  line: {
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    marginVertical: 5,
  },
  footer: {
    textAlign: "center",
    marginTop: 5,
  },
  footerText: {
    fontSize: 9,
    color: "gray",
  },
});

export default function Receipt() {
  const [receiptData, setReceiptData] = useState<ReceiptData>({
    name: "",
    seats: "",
    departureDate: "",
  });

  useEffect(() => {
    const storedUserDetails = localStorage.getItem("user");
    const storedReceiptData = localStorage.getItem("receiptData");

    if (storedReceiptData) {
      setReceiptData(JSON.parse(storedReceiptData));
    } else {
      const user = storedUserDetails ? JSON.parse(storedUserDetails) : {};
      setReceiptData({
        name: user.name || "",
        seats: localStorage.getItem("selectedseat") || "",
        departureDate: localStorage.getItem("departureDate") || "",
      });
    }
  }, []);

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

      <PDFDownloadLink
        document={<ReceiptDocument receiptData={receiptData} />}
        fileName="booking-receipt.pdf"
      >
        {({ loading }) =>
          loading ? (
            <button className="mt-6 w-full bg-gray-400 text-white py-2 rounded-md font-semibold">
              Preparing Document...
            </button>
          ) : (
            <button className="mt-6 w-full bg-red-600 text-white py-2 rounded-md font-semibold hover:bg-red-700 transition">
              Download Receipt
            </button>
          )
        }
      </PDFDownloadLink>

      <Link
        to="/"
        className="block text-center mt-4 text-red-600 font-semibold hover:underline"
      >
        Return Home
      </Link>
    </div>
  );
}
