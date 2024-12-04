import React, { useState, useEffect } from "react";
import { Bubble } from "react-chartjs-2";
import { Chart as ChartJS, Title, Tooltip, Legend, BubbleController, CategoryScale, LinearScale, PointElement, Filler } from "chart.js";

// Register necessary components for Chart.js
ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BubbleController,
  CategoryScale,
  LinearScale,
  PointElement,
  Filler
);

const HousingAffordabilityEquity = () => {
  const [userIncome, setUserIncome] = useState(1200000); // Default user income

  // Data from CSV or API (same as before)
  const data = [
    { place: "LA", region: "Central LA", avgRent: 2500, avgIncome: 55000 },
    { place: "Malibu", region: "Westside Cities", avgRent: 4500, avgIncome: 130000 },
    { place: "Santa Monica", region: "Westside Cities", avgRent: 3000, avgIncome: 70000 },
    { place: "Beverly Hills", region: "Westside Cities", avgRent: 4000, avgIncome: 120000 },
    { place: "West Hollywood", region: "Westside Cities", avgRent: 3200, avgIncome: 80000 },
    { place: "Culver City", region: "Westside Cities", avgRent: 3100, avgIncome: 95000 },
    { place: "Manhattan Beach", region: "South Bay", avgRent: 3500, avgIncome: 100000 },
    { place: "Inglewood", region: "South Bay", avgRent: 2300, avgIncome: 55000 },
    { place: "Torrance", region: "South Bay", avgRent: 2600, avgIncome: 65000 },
    { place: "San Pedro", region: "South Bay", avgRent: 2400, avgIncome: 57000 },
    { place: "Lakewood", region: "Gateway Cities", avgRent: 2300, avgIncome: 75000 },
    { place: "Long Beach", region: "Gateway Cities", avgRent: 2600, avgIncome: 68000 },
    { place: "Artesia", region: "Gateway Cities", avgRent: 2200, avgIncome: 72000 },
    { place: "Huntington Park", region: "Gateway Cities", avgRent: 1900, avgIncome: 68000 },
    { place: "El Monte", region: "San Gabriel Valley", avgRent: 1800, avgIncome: 65000 },
    { place: "San Gabriel", region: "San Gabriel Valley", avgRent: 2000, avgIncome: 72000 },
    { place: "Pasadena", region: "San Gabriel Valley", avgRent: 2500, avgIncome: 85000 },
    { place: "Burbank", region: "San Fernando Valley", avgRent: 2400, avgIncome: 90000 },
    { place: "San Fernando", region: "San Fernando Valley", avgRent: 1800, avgIncome: 70000 },
    { place: "Agoura Hills", region: "San Fernando Valley", avgRent: 2200, avgIncome: 120000 },
    { place: "Glendale", region: "San Fernando Valley", avgRent: 2500, avgIncome: 110000 },
    { place: "Palmdale", region: "Antelope Valley", avgRent: 1800, avgIncome: 65000 },
    { place: "Lancaster", region: "Antelope Valley", avgRent: 1700, avgIncome: 60000 },
    { place: "Santa Clarita", region: "Santa Clarita", avgRent: 2200, avgIncome: 80000 },
  ];

  // Define region colors
  const regionColors = {
    "Central LA": "rgba(255, 99, 132, 0.6)",
    "Westside Cities": "rgba(54, 162, 235, 0.6)",
    "South Bay": "rgba(75, 192, 192, 0.6)",
    "Gateway Cities": "rgba(153, 102, 255, 0.6)",
    "San Gabriel Valley": "rgba(255, 159, 64, 0.6)",
    "San Fernando Valley": "rgba(255, 205, 86, 0.6)",
    "Antelope Valley": "rgba(231, 233, 237, 0.6)",
    "Santa Clarita": "rgba(99, 255, 132, 0.6)",
  };

  // Prepare data for the bubble chart
  const chartData = {
    labels: data.map((entry) => entry.place),
    datasets: [
      {
        label: "Average Rent vs Income",
        data: data.map((entry) => ({
          x: entry.avgIncome, // Avg Income on x-axis
          y: entry.avgRent,   // Avg Rent on y-axis
          r: 10,              // Bubble size
          region: entry.region,
        })),
        backgroundColor: data.map((entry) => regionColors[entry.region]), // Color by region
      },
    ],
  };

  // Bubble chart options
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
        labels: {
          boxWidth: 20,
          padding: 15,
          generateLabels: () => {
            return Object.keys(regionColors).map((region) => ({
              text: region,
              fillStyle: regionColors[region],
            }));
          },
        },
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem) => {
            return `Place: ${tooltipItem.label}, Rent: $${tooltipItem.raw.y}, Income: $${tooltipItem.raw.x}`;
          },
        },
      },
    },
    scales: {
      x: {
        min: 50000,
        max: 140000,
        title: {
          display: true,
          text: "Avg Income (USD)",
        },
      },
      y: {
        min: 1500,
        max: 5000,
        title: {
          display: true,
          text: "Avg Rent (USD)",
        },
      },
    },
  };

  // Filtered data based on user input
  const filteredData = data.filter((entry) => entry.avgRent <= userIncome);

  const filteredChartData = {
    labels: filteredData.map((entry) => entry.place),
    datasets: [
      {
        label: "Average Rent vs Income",
        data: filteredData.map((entry) => ({
          x: entry.avgIncome,
          y: entry.avgRent,
          r: 10,
          region: entry.region,
        })),
        backgroundColor: filteredData.map((entry) => regionColors[entry.region]),
      },
    ],
  };

  // Handle user income change
  const handleIncomeChange = (e) => {
    setUserIncome(e.target.value);
  };

  // Styles for the card view and chart container
  const styles = {
    cardContainer: {
      background: "#fff",
      borderRadius: "10px",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
      overflow: "hidden",
      width: "60%", // Adjust for side-by-side
      height: "500px",
      margin: "20px",
      padding: "20px",
      position: "relative",
    },
    titleBox: {
        color: "white",
        textAlign: "center",
        padding: "20px",
        marginBottom: "30px",
        borderRadius: "8px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        fontFamily: "Arial, sans-serif",
    },
    inputCard: {
      background: "#fff",
      borderRadius: "10px",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
      padding: "20px",
      position: "relative",
      width: "30%",
      height: "500px",
      margin: "20px",
    },
    inputField: {
      width: "80%",
      padding: "10px",
      fontSize: "16px",
      borderRadius: "5px",
      border: "1px solid #ccc",
    },
  };

  return (
    <div>
        <div style={styles.titleBox}>
            <h1 >Housing Affordability & Equity Analysis</h1>
        </div>

      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div style={styles.cardContainer}>
          <Bubble data={filteredChartData} options={options} />
        </div>

        <div style={styles.inputCard}>
          <div>
            <h3>Enter Your Income to Filter Results</h3>
            <input
              type="number"
              value={userIncome}
              onChange={handleIncomeChange}
              style={styles.inputField}
              placeholder="Your annual income"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HousingAffordabilityEquity;
