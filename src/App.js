import React, { useState, useRef, useEffect } from "react";
import MapVisualization from "./components/MapVisualization";
import HousingAffordabilityEquity from "./components/HousingAffordabilityEquity";
import CrimeAndSafety from "./components/CrimeAndSafety";
import PublicResources from "./components/PublicResources";
import Transportation from "./components/Transportation";
import Insights from "./components/Insights";
import "./App.css";

function App() {
  const [activeTab, setActiveTab] = useState("Overview");
  const [hasScrolled, setHasScrolled] = useState(false); // Track if the scroll has already happened

  // Create a ref for HousingAffordabilityEquity
  const housingRef = useRef(null);
  // Create a ref for Crime And Safety
  const crimeRef = useRef(null);
  // Create a ref for Public Resources
  const publicResRef = useRef(null);
  // Create a ref for Transportation
  const transportationRef = useRef(null);
  // Create a ref for Insights
  const insightsRef = useRef(null);


  const handleTabClick = (tab) => {
    setActiveTab(tab);

    // Scroll to specific section when the tab is clicked
    if (tab === "Housing" && housingRef.current) {
      housingRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    } else if (tab === "Crime & Safety" && crimeRef.current) {
      crimeRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }else if (tab === "Public Resources" && publicResRef.current) {
      publicResRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }else if (tab === "Transportation" && transportationRef.current) {
      transportationRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }else if (tab === "Insights" && insightsRef.current) {
      insightsRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // Reset the scroll flag when switching tabs, so it's ready for the next time "Housing" is clicked
  useEffect(() => {
    if (activeTab !== "Housing") {
      setHasScrolled(false);
    }
    if (activeTab !== "Crime & Safety") {
      setHasScrolled(false);
    }
    if (activeTab !== "Public Resources") {
      setHasScrolled(false);
    }
    if (activeTab !== "Transportation") {
      setHasScrolled(false);
    }
    if (activeTab !== "Insights") {
      setHasScrolled(false);
    }
  }, [activeTab]);

  return (
    <div>
      <h1>LA County Dashboard</h1>
      <div className="tabs">
        {["Overview", "Housing", "Crime & Safety", "Public Resources", "Transportation", "Insights"].map((tab) => (
          <button
            key={tab}
            className={`tab-button ${activeTab === tab ? "active" : ""}`}
            onClick={() => handleTabClick(tab)}
          >
            {tab}
          </button>
        ))}
      </div>
      <div className="tab-content">
        {activeTab === "Overview" && <MapVisualization />}
        
        {/* Pass the housingRef to the MapVisualization */}
        {activeTab === "Housing" && (
          <MapVisualization housingRef={housingRef}>
            {/* The HousingAffordabilityEquity will be inside MapVisualization */}
            <HousingAffordabilityEquity />
          </MapVisualization>
        )}
        
        {activeTab === "Crime & Safety" && (
          <MapVisualization crimeRef={crimeRef}>
            {/* The CrimeAndSafety will be inside MapVisualization */}
            <CrimeAndSafety />
          </MapVisualization>
        )}

        {activeTab === "Public Resources" && (
          <MapVisualization publicResRef={publicResRef}>
            {/* The PublicResources will be inside MapVisualization */}
            <PublicResources />
          </MapVisualization>
        )}

        {activeTab === "Transportation" && (
          <MapVisualization transportationRef={transportationRef}>
            {/* The PublicResources will be inside MapVisualization */}
            <Transportation />
          </MapVisualization>
        )}

        {activeTab === "Insights" && (
          <MapVisualization insightsRef={insightsRef}>
            {/* The PublicResources will be inside MapVisualization */}
            <Insights />
          </MapVisualization>
        )}
      </div>
    </div>
  );
}

export default App;
