import React from "react";

const CrimeAndSafety = () => {
  const styles = {
    titleBox: {
      color: "white",
      textAlign: "center",
      padding: "20px",
      marginBottom: "30px",
      borderRadius: "8px",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
      fontFamily: "Arial, sans-serif",
    },
  };

  return (
    <div style={styles.titleBox}>
      <h1>Crime And Safety</h1>
    </div>
  );
};

export default CrimeAndSafety;