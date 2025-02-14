"use client";

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Document,
  Page,
  Text,
  Image,
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
      <Image
        src="https://media.istockphoto.com/id/1188198006/photo/a-rent-bus-is-drive.jpg?s=1024x1024&w=is&k=20&c=zb8W2qscsro1KG1ZwI_pCD9Kcc7_ZDGYfSTXd_sjjMk=" // Replace with your image URL or local path
        style={styles.backgroundImage}
      />

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
    backgroundColor: "black",
    paddingVertical: 10,
    paddingHorizontal: 5, // Adds padding for cleaner look
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  backgroundImage: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    zIndex: -1, // Send image behind the text
    opacity: 0.2, // Make it subtle for readability
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
    color: "white",
  },
  text: {
    fontSize: 10,
    marginBottom: 2,
    color: "white",
  },
  label: {
    fontWeight: "bold",
    color: "white",
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
        to="/home"
        className="block text-center mt-4 text-red-600 font-semibold hover:underline"
      >
        Return Home
      </Link>
    </div>
  );
}
