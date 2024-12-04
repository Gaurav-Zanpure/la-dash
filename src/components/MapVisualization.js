import React, { useRef, useEffect, useState, forwardRef} from "react";
import * as d3 from "d3";
import geoData from "../data/la-county-geojson.json"; // Replace with your actual GeoJSON file
import HousingAffordabilityEquity from "./HousingAffordabilityEquity";
import CrimeAndSafety from "./CrimeAndSafety";
import PublicResources from "./PublicResources";
import Transportation from "./Transportation";
import Insights from "./Insights";

const MapVisualization = forwardRef(({ housingRef , crimeRef , publicResRef , transportationRef , insightsRef}, ref) => {
  const svgRef = useRef(null);
  const [hoveredServiceArea, setHoveredServiceArea] = useState(null);

  // Data for service area statistics
  const serviceAreaData = {
    "Antelope Valley": { safety: 70, rent: "$1,800–$2,500", delay: "30–45 min" },
    "San Fernando Valley": { safety: 65, rent: "$2,500–$3,500", delay: "30–45 min" },
    "San Gabriel Valley": { safety: 75, rent: "$2,800–$4,000", delay: "25–40 min" },
    "Central LA": { safety: 55, rent: "$3,500–$5,000", delay: "45–60 min" },
    "South Bay": { safety: 76, rent: "$3,200–$4,500", delay: "30–45 min" },
    "Westside Cities": { safety: 85, rent: "$4,000–$6,000", delay: "20–30 min" },
    "Gateway Cities": { safety: 60, rent: "$2,000–$3,200", delay: "30–50 min" },
    "Santa Clarita Valley": { safety: 80, rent: "$2,800–$3,800", delay: "35–50 min" },
  };

  // Color gradient for Service Areas
  const serviceAreaColors = {
    "Antelope Valley": "#a50026",
    "San Fernando Valley": "#f46d43",
    "San Gabriel Valley": "#fdae61",
    "Central LA": "#d73027",
    "South Bay": "#fee08b",
    "Westside Cities": "#1a9850",
    "Gateway Cities": "#fdae61",
    "Santa Clarita Valley": "#66bd63"
  }  

  const howHappy = {
    "#1a9850": "Most Happy",       // Green
    "#66bd63": "Very High Happiness", // Light Green
    "#fee08b": "Moderate Happiness",  // Yellow
    "#fdae61": "Low Happiness",       // Orange
    "#f46d43": "Very Low Happiness",  // Orange-Red
    "#a50026": "Least Happy"          // Dark Red
  };

  // Map each place to its service area name
  const placeToServiceAreaName = {
    // Service Area 1: Antelope Valley
    "Acton": "Antelope Valley", "Agua Dulce": "Antelope Valley", "Antelope Acres": "Antelope Valley",
    "Lake Los Angeles": "Antelope Valley", "Littlerock": "Antelope Valley", "Palmdale": "Antelope Valley",
    "Quartz Hill": "Antelope Valley", "Rosamond": "Antelope Valley", "Tehachapi": "Antelope Valley",
    "Willow Springs": "Antelope Valley", "Lancaster": "Antelope Valley", "Leona Valley": "Antelope Valley",
    "Elizabeth Lake": "Antelope Valley", "Desert View Highlands": "Antelope Valley", "Fairmont": "Antelope Valley",
    "Lake Hughes": "Antelope Valley", "Pearblossom": "Antelope Valley", "Sun Village": "Antelope Valley",
    "Pine Canyon": "Antelope Valley", "Mojave": "Antelope Valley", "Three Points": "Antelope Valley",
    "Valyermo": "Antelope Valley", "Juniper Hills": "Antelope Valley", "Green Valley": "Antelope Valley", "Northwest Antelope Valley": "Antelope Valley", "Northeast Antelope Valley": "Antelope Valley", "Northwest Palmdale": "Antelope Valley", "Southeast Antelope Valley": "Antelope Valley",

    // Service Area 2: San Fernando Valley
    "Agoura Hills": "San Fernando Valley", "Arleta": "San Fernando Valley", "Canoga Park": "San Fernando Valley",
    "Chatsworth": "San Fernando Valley", "Encino": "San Fernando Valley", "Glendale": "San Fernando Valley",
    "Granada Hills": "San Fernando Valley", "Hidden Hills": "San Fernando Valley", "North Hollywood": "San Fernando Valley",
    "Northridge": "San Fernando Valley", "Panorama City": "San Fernando Valley", "Reseda": "San Fernando Valley",
    "San Fernando": "San Fernando Valley", "Sherman Oaks": "San Fernando Valley", "Studio City": "San Fernando Valley",
    "Tarzana": "San Fernando Valley", "Van Nuys": "San Fernando Valley", "West Hills": "San Fernando Valley",
    "Woodland Hills": "San Fernando Valley", "Westlake Village": "San Fernando Valley", "Valley Village": "San Fernando Valley",
    "North Hills": "San Fernando Valley", "South Valley": "San Fernando Valley",
    "Calabasas": "San Fernando Valley", "Burbank": "San Fernando Valley", "Toluca Lake": "San Fernando Valley", "Winnetka": "San Fernando Valley", "Chatsworth Reservoir": "San Fernando Valley", "Lake Balboa": "San Fernando Valley", "Sepulveda Basin": "San Fernando Valley", "Valley Glen": "San Fernando Valley", "Porter Ranch": "San Fernando Valley", "Unincorporated Santa Susana Mountains": "San Fernando Valley", "Mission Hills": "San Fernando Valley", "Pacoima": "San Fernando Valley", "Sun Valley": "San Fernando Valley", "Shadow Hills": "San Fernando Valley", "Hansen Dam": "San Fernando Valley",  "Sylmar": "San Fernando Valley", "Lopez/Kagel Canyons": "San Fernando Valley", "Lake View Terrace": "San Fernando Valley", "Sunland": "San Fernando Valley", "Tujunga": "San Fernando Valley", "Tujunga Canyons": "San Fernando Valley",

    // Service Area 3: San Gabriel Valley
    "Alhambra": "San Gabriel Valley", "Arcadia": "San Gabriel Valley", "Baldwin Park": "San Gabriel Valley", "Claremont": "San Gabriel Valley",
    "Covina": "San Gabriel Valley", "Duarte": "San Gabriel Valley", "El Monte": "San Gabriel Valley", "Glendora": "San Gabriel Valley",
    "Irwindale": "San Gabriel Valley", "La Puente": "San Gabriel Valley", "La Verne": "San Gabriel Valley", "Monrovia": "San Gabriel Valley",
    "Pasadena": "San Gabriel Valley", "Pomona": "San Gabriel Valley", "Rosemead": "San Gabriel Valley", "San Dimas": "San Gabriel Valley",
    "San Gabriel": "San Gabriel Valley", "South Pasadena": "San Gabriel Valley", "Temple City": "San Gabriel Valley",
    "West Covina": "San Gabriel Valley", "West San Gabriel Valley": "San Gabriel Valley", "La Habra Heights": "San Gabriel Valley", "North Whittier": "San Gabriel Valley", "La Crescenta-Montrose": "San Gabriel Valley", "La Cañada Flintridge": "San Gabriel Valley",
    "Angeles Crest": "San Gabriel Valley", "Altadena": "San Gabriel Valley", "Bradbury": "San Gabriel Valley", "Sierra Madre": "San Gabriel Valley", "East San Gabriel": "San Gabriel Valley", "San Marino": "San Gabriel Valley", "East Pasadena": "San Gabriel Valley", 
    "Azusa": "San Gabriel Valley", "Vincent": "San Gabriel Valley", "Citrus": "San Gabriel Valley",
    "Mayflower Village": "San Gabriel Valley", "North El Monte": "San Gabriel Valley", "San Pasqual": "San Gabriel Valley", "South San Gabriel": "San Gabriel Valley", "Whittier Narrows": "San Gabriel Valley", "South El Monte": "San Gabriel Valley", "Avocado Heights": "San Gabriel Valley", "Industry": "San Gabriel Valley", "South San Jose Hills": "San Gabriel Valley", "Valinda": "San Gabriel Valley", "West Puente Valley": "San Gabriel Valley", 
    "Charter Oak": "San Gabriel Valley", "West San Dimas": "San Gabriel Valley", "Ramona": "San Gabriel Valley", "Walnut": "San Gabriel Valley", "Hacienda Heights": "San Gabriel Valley", "Diamond Bar": "San Gabriel Valley", "Rowland Heights": "San Gabriel Valley", "South Diamond Bar": "San Gabriel Valley",

    // Service Area 4: Central LA (Central LA)
    "Beverly Grove": "Central LA", "Carthay": "Central LA", "Chinatown": "Central LA", "Downtown": "Central LA", "Echo Park": "Central LA", "Fairfax": "Central LA", "Glassell Park": "Central LA", "Hollywood": "Central LA",
    "Hollywood Hills": "Central LA", "Hollywood Hills West": "Central LA", "Koreatown": "Central LA",
    "Larchmont": "Central LA", "Little Tokyo": "Central LA", "Los Feliz": "Central LA", "Mid-City": "Central LA", "Mid-Wilshire": "Central LA",
    "Pico-Robertson": "Central LA", "Pico-Union": "Central LA", "South Los Angeles": "Central LA",
    "Westlake": "Central LA", "Wilshire": "Central LA", "Boyle Heights": "Central LA",
    "Lincoln Heights": "Central LA", "El Sereno": "Central LA", "Arlington Heights": "Central LA", "Harvard Heights": "Central LA", "Hancock Park": "Central LA", "Windsor Square": "Central LA",
    "East Hollywood": "Central LA", "Silver Lake": "Central LA", "Elysian Park": "Central LA",
    "Montecito Heights": "Central LA", "Cypress Park": "Central LA", "Mount Washington": "Central LA", "Elysian Valley": "Central LA", "Highland Park": "Central LA", "Atwater Village": "Central LA", "Griffith Park": "Central LA", "Eagle Rock": "Central LA",

    // Service Area 5: South Bay
    "Carson": "South Bay", "El Segundo": "South Bay", "Gardena": "South Bay", "Hawthorne": "South Bay", "Hermosa Beach": "South Bay",
    "Inglewood": "South Bay", "Lawndale": "South Bay", "Lomita": "South Bay", "Manhattan Beach": "South Bay",
    "Palos Verdes Estates": "South Bay", "Redondo Beach": "South Bay", "Torrance": "South Bay", "West Carson": "South Bay",
    "Baldwin Hills": "South Bay", "Compton": "South Bay",
    "Florence-Graham": "South Bay", "Harbor City": "South Bay", "Lennox": "South Bay", "North Long Beach": "South Bay", "South Bay": "South Bay", "West Athens": "South Bay", "Westmont": "South Bay",
    "Willowbrook": "South Bay", "Watts": "South Bay", "Rancho Dominguez": "South Bay","Ladera Heights": "South Bay", "View Park-Windsor Hills": "South Bay",
    "Hyde Park": "South Bay", "Chesterfield Square": "South Bay", "Harvard Park": "South Bay", "Manchester Square": "South Bay", 
    "Gramercy Park": "South Bay", "Del Aire": "South Bay", "Alondra Park": "South Bay", "Athens": "South Bay", "Rancho Palos Verdes": "South Bay",
    "Rolling Hills Estates": "South Bay", "Rolling Hills": "South Bay", "San Pedro": "South Bay", "Harbor Gateway": "South Bay", "West Compton": "South Bay",
    "Broadway-Manchester": "South Bay", "Green Meadows": "South Bay", "Vermont Vista": "South Bay", "East Compton": "South Bay", "Vermont-Slauson": "South Bay", "Baldwin Hills/Crenshaw": "South Bay", "Leimert Park": "South Bay", "Vermont Knolls": "South Bay", "Florence": "South Bay", "Florence-Firestone": "South Bay", "Vermont Square": "South Bay", "South Park": "South Bay", "Jefferson Park": "South Bay",  "Exposition Park": "South Bay", "West Adams": "South Bay", "Adams-Normandie": "South Bay", "Central-Alameda": "South Bay", 
    "Historic South-Central": "South Bay", "University Park": "South Bay",

    // Service Area 6: Westside Cities
    "Beverly Hills": "Westside Cities", "Bel-Air": "Westside Cities", "Brentwood": "Westside Cities", "Century City": "Westside Cities",
    "Culver City": "Westside Cities", "Marina del Rey": "Westside Cities", "Pacific Palisades": "Westside Cities", "Playa del Rey": "Westside Cities",
    "Playa Vista": "Westside Cities", "Santa Monica": "Westside Cities", "Venice": "Westside Cities", "West Hollywood": "Westside Cities",
    "Westwood": "Westside Cities", "Westchester": "Westside Cities", "Malibu" : "Westside Cities", "Unincorporated Santa Monica Mountains": "Westside Cities",
    "Topanga": "Westside Cities", "Veterans Administration": "Westside Cities", "Sawtelle" :  "Westside Cities","West Los Angeles": "Westside Cities", "Rancho Park": "Westside Cities","Cheviot Hills": "Westside Cities",
    "Palms": "Westside Cities", "Mar Vista": "Westside Cities", "Del Rey": "Westside Cities",
    "Beverlywood" : "Westside Cities", "Beverly Crest": "Westside Cities",

    // Service Area 7: Gateway Cities
    "East Los Angeles": "Gateway Cities", "Monterey Park": "Gateway Cities", "Pico Rivera": "Gateway Cities", "Huntington Park": "Gateway Cities", "Maywood": "Gateway Cities", "Bell": "Gateway Cities", "Cudahy": "Gateway Cities", "Bell Gardens": "Gateway Cities",
    "South Gate": "Gateway Cities", "Walnut Park": "Gateway Cities", "Lynwood": "Gateway Cities", "Paramount": "Gateway Cities", "Bellflower": "Gateway Cities",
    "Commerce": "Gateway Cities", "Montebello": "Gateway Cities", "Vernon": "Gateway Cities", "Downey": "Gateway Cities", "Wilmington": "Gateway Cities",
    "Long Beach": "Gateway Cities", "Lakewood": "Gateway Cities", "Signal Hill": "Gateway Cities", "Hawaiian Gardens": "Gateway Cities", "Cerritos": "Gateway Cities", "Artesia": "Gateway Cities", "Santa Fe Springs": "Gateway Cities",
    "La Mirada": "Gateway Cities", "Norwalk": "Gateway Cities", "South Whittier": "Gateway Cities", "East La Mirada": "Gateway Cities", "Whittier": "Gateway Cities", "West Whittier-Los Nietos": "Gateway Cities", "Unincorporated Catalina Island": "Gateway Cities",

    // Service Area 8: Santa Clarita Valley
    "Canyon Country": "Santa Clarita Valley", "Castaic": "Santa Clarita Valley", "Newhall": "Santa Clarita Valley",
    "Saugus": "Santa Clarita Valley", "Stevenson Ranch": "Santa Clarita Valley", "Valencia": "Santa Clarita Valley", "Ridge Route": "Santa Clarita Valley", "Val Verde": "Santa Clarita Valley", "Hasley Canyon": "Santa Clarita Valley", "Castaic Canyons": "Santa Clarita Valley", "Santa Clarita": "Santa Clarita Valley",
  };

    // Helper to find all places in a service area
  const getPlacesInServiceArea = (serviceArea) => {
    return Object.keys(placeToServiceAreaName).filter(
      (place) => placeToServiceAreaName[place] === serviceArea
    );
  };

  useEffect(() => {
    const width = window.innerWidth * 0.9; // 90% of the window width for larger size
    const height = window.innerHeight * 0.8; // 80% of the window height for larger size
  
    const projection = d3.geoMercator().fitSize([width, height], geoData);
    const path = d3.geoPath().projection(projection);
  
    const svg = d3.select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .style("border", "1px solid #ccc")
      .style("background-color", "#f4f4f4"); // Set background color for the map area
  
    svg.selectAll("*").remove(); // Clear previous elements
  
    // Draw regions and color them based on service area
    svg.selectAll(".region")
      .data(geoData.features)
      .enter().append("path")
      .attr("class", "region")
      .attr("d", path)
      .attr("fill", (d) => {
        const serviceAreaName = placeToServiceAreaName[d.properties.name];
        return serviceAreaName ? serviceAreaColors[serviceAreaName] : "#ccc";
      })
      .attr("stroke", "#fff")
      .attr("stroke-width", 0.5)
      .on("click", (event, d) => {
        const serviceAreaName = placeToServiceAreaName[d.properties.name];
        if (!serviceAreaName) return;
  
        // Highlight all regions in the same service area
        highlightServiceArea(serviceAreaName);
      })
      .on("mouseover", (event, d) => {
        const serviceAreaName = placeToServiceAreaName[d.properties.name];
        if (!serviceAreaName) return;

        // Set hovered service area
        setHoveredServiceArea(serviceAreaName);

        // Highlight regions of the same service area
        highlightServiceArea(serviceAreaName);
        const areaData = serviceAreaData[serviceAreaName];

        const tooltipContent = `
          <strong>Service Area:</strong> ${serviceAreaName}<br>
          <table style="width: 100%; font-size: 12px; border-collapse: collapse;">
            <tr>
              <td><strong>Area Safety:</strong></td>
              <td>${areaData.safety}</td>
            </tr>
            <tr>
              <td><strong>Average Rent:</strong></td>
              <td>${areaData.rent}</td>
            </tr>
            <tr>
              <td><strong>Traffic Delay:</strong></td>
              <td>${areaData.delay}</td>
            </tr>
          </table>
        `;
        
        d3.select("#tooltip")
          .style("opacity", 1)
          .html(tooltipContent)
          .style("left", `${event.pageX + 10}px`)
          .style("top", `${event.pageY + 10}px`);
      })
      .on("mouseout", () => {
        // Reset hover effects
        resetServiceAreaHighlight();
        setHoveredServiceArea(null);

        // Optionally hide tooltip
        d3.select("#tooltip").style("opacity", 0);
      });
  
    // Highlight all regions in a given service area
    const highlightServiceArea = (serviceAreaName) => {
      svg.selectAll(".region")
        .style("opacity", (d) => {
          const placeName = d.properties.name;
          const belongsToServiceArea = placeToServiceAreaName[placeName] === serviceAreaName;
          return belongsToServiceArea ? 1 : 0.5; // Highlight the regions of the selected service area
        })
        .style("stroke", (d) => {
          const placeName = d.properties.name;
          return placeToServiceAreaName[placeName] === serviceAreaName ? "#000" : "#fff"; // Add stroke to highlighted areas
        });
    };
  
    // Reset all regions' colors to their original state
    const resetServiceAreaHighlight = () => {
      svg.selectAll(".region")
        .style("opacity", 1)  // Reset opacity to 1
        .style("stroke", "#fff");  // Reset stroke to default
    };
  
    // Adding the legend
    const legendWidth = 150;
    const legendHeight = Object.keys(howHappy).length * 25;

    const legend = svg.append("g")
      .attr("transform", `translate(${width - legendWidth - 20}, 20)`);

    Object.keys(howHappy).forEach((color, i) => {
      // Add the rectangle for the color
      legend.append("rect")
        .attr("x", 0)
        .attr("y", i * 25)
        .attr("width", 20)
        .attr("height", 20)
        .attr("fill", color); // Use the color key as the rectangle fill

      // Add the corresponding label (meaning)
      legend.append("text")
        .attr("x", 25) // Position text a bit more to the right (inside the box)
        .attr("y", i * 25 + 15) // Vertically centered in the box
        .attr("font-size", "10px") // Adjust font size to avoid overflow
        .attr("dominant-baseline", "middle") // Vertically center the text
        .text(howHappy[color]); // Use the value (meaning) as the label
    });
  }, []);

  return (
    <div style={{ width: '100%', height: '100vh', position: 'relative' }}>
      <div>
      {/* Welcome Box */}
      <div style={styles.welcomeBox}>
        <h2>Welcome to the LA County Well-Being Dashboard</h2>
        <p>
          Explore insights into housing affordability, safety, public resources, and environmental trends to make informed decisions about your community.
        </p>
      </div>

      <div style={styles.titleBox}>
        <h1>Choropleth Map: Visualizing LA County's Service Areas</h1>
      </div>

       {/* Description Section */}
       <div style={styles.descriptionBox}>
        <p>
          This choropleth map visualizes the happiness levels across the 8 service areas of LA County. Areas are color-coded by their happiness levels, ranging from 'Most Happy' to 'Least Happy'. As you hover over any service area, the map will show key statistics like safety, average rent, and traffic delay. These important factors help you understand the well-being and livability of each region in a clear, interactive way.
        </p>
      </div>

    </div>
      <svg ref={svgRef}></svg>

      {/* New Component */}
      <div ref={housingRef}>
        <HousingAffordabilityEquity />
      </div>

      <div ref={crimeRef}>
        <CrimeAndSafety />
      </div>

      <div ref={publicResRef}>
        <PublicResources />
      </div>

      <div ref={transportationRef}>
        <Transportation />
      </div>

      <div ref={insightsRef}>
        <Insights />
      </div>
      
      {/* Tooltip */}
      <div id="tooltip" style={{
        position: 'absolute',
        background: '#fff',
        padding: '5px 10px',
        borderRadius: '5px',
        boxShadow: '0 2px 6px rgba(0, 0, 0, 0.2)',
        pointerEvents: 'none',
        opacity: 0, // Hidden by default
        transition: 'opacity 0.2s'
      }}></div>
    </div>
  );
});

const styles = {
  welcomeBox: {
    backgroundColor: "#f9f9f9",
    padding: "40px 20px",  // Increased padding for more height
    marginBottom: "20px",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    textAlign: "center",
    fontFamily: "Arial, sans-serif",
    fontSize: "25px",
    border: "1px solid #ddd",
    backgroundImage: "url('https://lamag.com/.image/c_limit%2Ccs_srgb%2Cq_auto:eco%2Cw_1400/MTk3NTU2NDAzNjczMTc5ODQy/los-angeles-skyline.webp')",
    backgroundSize: "cover", // Ensure the image covers the entire space
    backgroundPosition: "center", // Center the image
    color: "white", // White text for contrast
    textShadow: "2px 2px 4px rgba(0, 0, 0, 0.6)",  // Text shadow for better readability
    height: "300px",  // Adjusted height for better visibility of the background
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
  descriptionBox: {
    textAlign: "center",
    fontSize: "16px",
    color: "#444",
    padding: "20px",
    margin: "0 auto", // Centers the text block
    maxWidth: "1000px", // Limits the width for a more compact view
    lineHeight: "1.6",
    fontFamily: "Arial, sans-serif",
  },
};

export default MapVisualization;
//   useEffect(() => {
//     const width = window.innerWidth * 0.9;
//     const height = window.innerHeight * 0.8;

//     const projection = d3.geoMercator().fitSize([width, height], geoData);
//     const path = d3.geoPath().projection(projection);

//     const svg = d3.select(svgRef.current)
//       .attr("width", width)
//       .attr("height", height)
//       .style("border", "1px solid #ccc")
//       .style("background-color", "#f4f4f4");

//     svg.selectAll("*").remove();

//     const tooltip = d3.select(tooltipRef.current)
//       .style("position", "absolute")
//       .style("visibility", "hidden")
//       .style("background-color", "rgba(0, 0, 0, 0.7)")
//       .style("color", "#fff")
//       .style("padding", "8px")
//       .style("border-radius", "4px")
//       .style("font-size", "12px");

//     svg.selectAll(".region")
//       .data(geoData.features)
//       .enter().append("path")
//       .attr("class", "region")
//       .attr("d", path)
//       .attr("fill", (d) => {
//         const serviceAreaName = placeToServiceAreaName[d.properties.name];
//         return serviceAreaName ? serviceAreaColors[serviceAreaName] : "#ccc";
//       })
//       .attr("stroke", "#fff")
//       .attr("stroke-width", 0.5)
//       .on("mouseover", (event, d) => {
//         const placeName = d.properties.name;
//         const serviceAreaName = placeToServiceAreaName[placeName];
//         tooltip.style("visibility", "visible")
//           .text(serviceAreaName
//             ? `${placeName}: ${serviceAreaName}`
//             : `${placeName}: No service area`);
//         d3.select(event.target).style("fill", "#999");
//       })
//       .on("mousemove", (event) => {
//         tooltip.style("top", `${event.pageY + 10}px`)
//           .style("left", `${event.pageX + 10}px`);
//       })
//       .on("mouseout", (event, d) => {
//         const serviceAreaName = placeToServiceAreaName[d.properties.name];
//         d3.select(event.target).style("fill", serviceAreaName ? serviceAreaColors[serviceAreaName] : "#ccc");
//         tooltip.style("visibility", "hidden");
//       })
//       .on("click", (event, d) => {
//         const serviceAreaName = placeToServiceAreaName[d.properties.name];
//         if (!serviceAreaName) return;
//         setSelectedArea(serviceAreaName);

//         if (selectedAreaRef.current) {
//           selectedAreaRef.current.scrollIntoView({
//             behavior: "smooth",
//             block: "start",
//           });
//         }
//       });

//     const legendWidth = 150;
//     const legendHeight = Object.keys(serviceAreaColors).length * 25;

//     const legend = svg.append("g")
//       .attr("transform", `translate(${width - legendWidth - 20}, 20)`);

//     Object.keys(serviceAreaColors).forEach((serviceArea, i) => {
//       legend.append("rect")
//         .attr("x", 0)
//         .attr("y", i * 25)
//         .attr("width", 20)
//         .attr("height", 20)
//         .attr("fill", serviceAreaColors[serviceArea]);

//       legend.append("text")
//         .attr("x", 30)
//         .attr("y", i * 25 + 15)
//         .attr("font-size", "12px")
//         .text(serviceArea);
//     });
//   }, []);

//   return (
//     <div style={{ width: '100%', height: '100vh', position: 'relative' }}>
//       <svg ref={svgRef}></svg>
//       <div ref={tooltipRef}></div>
      
//     </div>
//   );
// };

// export default MapVisualization;