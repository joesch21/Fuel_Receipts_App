import React, { useState } from "react";
import "./App.css";

const App = () => {
  const [truckData, setTruckData] = useState({
    truckId: "",
    startMeter: "",
    startDip: "",
    endMeter: "",
    endDip: "",
  });

  const [bulkFills, setBulkFills] = useState([]);
  const [currentFill, setCurrentFill] = useState({
    time: "",
    amount: "",
  });

  const [discrepancy, setDiscrepancy] = useState(null);

  // Save Start Data
  const handleSaveStartData = () => {
    if (!truckData.truckId || !truckData.startMeter || !truckData.startDip) {
      alert("Please fill out all fields for the start of day.");
      return;
    }
    alert("Start data saved successfully!");
  };

  // Save End Data
  const handleSaveEndData = () => {
    if (!truckData.endMeter || !truckData.endDip) {
      alert("Please fill out all fields for the end of day.");
      return;
    }

    if (parseFloat(truckData.endMeter) <= parseFloat(truckData.startMeter)) {
      alert("End meter reading must be greater than start meter reading.");
      return;
    }

    alert("End data saved successfully!");
  };

  // Save Bulk Fill
  const handleSaveBulkFill = () => {
    if (!currentFill.time || !currentFill.amount) {
      alert("Please fill out all fields for the bulk fill.");
      return;
    }

    setBulkFills([...bulkFills, currentFill]);
    setCurrentFill({ time: "", amount: "" });
    alert("Bulk fill saved successfully!");
  };

  // Calculate Discrepancy
  const calculateDiscrepancy = () => {
    if (
      !truckData.startMeter ||
      !truckData.endMeter ||
      !truckData.startDip ||
      !truckData.endDip ||
      bulkFills.length === 0
    ) {
      alert("Please ensure all data is entered before calculating discrepancy.");
      return;
    }

    // Meter Fuel Used
    const meterFuelUsed =
      parseFloat(truckData.endMeter) - parseFloat(truckData.startMeter);

    // Dip Difference
    const dipDifference =
      parseFloat(truckData.startDip) - parseFloat(truckData.endDip);

    // Calculated Fuel Used
    const calculatedFuelUsed = meterFuelUsed + dipDifference;

    // Total Bulk Fills
    const totalBulkFills = bulkFills.reduce(
      (sum, fill) => sum + parseFloat(fill.amount || 0),
      0
    );

    // Discrepancy
    const discrepancyValue = calculatedFuelUsed - totalBulkFills;

    setDiscrepancy({
      meterFuelUsed,
      dipDifference,
      calculatedFuelUsed,
      totalBulkFills,
      discrepancy: discrepancyValue,
      status: discrepancyValue > 0 ? "Loss" : "Surplus",
    });
  };

  // Reset All Data
  const handleResetData = () => {
    if (window.confirm("This will reset all data. Are you sure?")) {
      setTruckData({
        truckId: "",
        startMeter: "",
        startDip: "",
        endMeter: "",
        endDip: "",
      });
      setBulkFills([]);
      setDiscrepancy(null);
      setCurrentFill({ time: "", amount: "" });
      alert("All data has been reset!");
    }
  };

  return (
    <div className="App">
      <h1>Fuel Receipts App</h1>

      {/* Start of Day Section */}
      <h2>Start of Day</h2>
      <label>
        Truck ID:
        <input
          type="text"
          value={truckData.truckId}
          onChange={(e) =>
            setTruckData({ ...truckData, truckId: e.target.value })
          }
        />
      </label>
      <label>
        Start Meter:
        <input
          type="number"
          value={truckData.startMeter}
          onChange={(e) =>
            setTruckData({ ...truckData, startMeter: e.target.value })
          }
        />
      </label>
      <label>
        Start Dip:
        <input
          type="number"
          value={truckData.startDip}
          onChange={(e) =>
            setTruckData({ ...truckData, startDip: e.target.value })
          }
        />
      </label>
      <button onClick={handleSaveStartData}>Save Start Data</button>

      {/* Bulk Fill Section */}
      <h2>Bulk Fill</h2>
      <label>
        Time:
        <input
          type="time"
          value={currentFill.time}
          onChange={(e) =>
            setCurrentFill({ ...currentFill, time: e.target.value })
          }
        />
      </label>
      <label>
        Amount (L):
        <input
          type="number"
          value={currentFill.amount}
          onChange={(e) =>
            setCurrentFill({ ...currentFill, amount: e.target.value })
          }
        />
      </label>
      <button onClick={handleSaveBulkFill}>Save Bulk Fill</button>

      {/* End of Day Section */}
      <h2>End of Day</h2>
      <label>
        End Meter:
        <input
          type="number"
          value={truckData.endMeter}
          onChange={(e) =>
            setTruckData({ ...truckData, endMeter: e.target.value })
          }
        />
      </label>
      <label>
        End Dip:
        <input
          type="number"
          value={truckData.endDip}
          onChange={(e) =>
            setTruckData({ ...truckData, endDip: e.target.value })
          }
        />
      </label>
      <button onClick={handleSaveEndData}>Save End Data</button>

      {/* Discrepancy Results */}
      <h2>Discrepancy Results</h2>
      <button onClick={calculateDiscrepancy}>Calculate</button>

      {discrepancy && (
        <div>
          <p>
            <strong>Meter Fuel Used:</strong> {discrepancy.meterFuelUsed} L
          </p>
          <p>
            <strong>Dip Difference:</strong> {discrepancy.dipDifference} L
          </p>
          <p>
            <strong>Calculated Fuel Used:</strong>{" "}
            {discrepancy.calculatedFuelUsed} L
          </p>
          <p>
            <strong>Total Bulk Fills:</strong> {discrepancy.totalBulkFills} L
          </p>
          <p>
            <strong>Discrepancy:</strong> {Math.abs(discrepancy.discrepancy)} L (
            {discrepancy.status})
          </p>
        </div>
      )}

      {/* Stored Data */}
      <h2>Stored Data</h2>
      <h3>Truck Data</h3>
      <p>
        Truck ID: {truckData.truckId || "N/A"}, Start Meter:{" "}
        {truckData.startMeter || "N/A"}, End Meter:{" "}
        {truckData.endMeter || "N/A"}, Start Dip:{" "}
        {truckData.startDip || "N/A"}, End Dip: {truckData.endDip || "N/A"}
      </p>

      <h3>Bulk Fills</h3>
      <ul>
        {bulkFills.map((fill, idx) => (
          <li key={idx}>
            Time: {fill.time}, Amount: {fill.amount} L
          </li>
        ))}
      </ul>

      {/* Reset Button */}
      <button className="reset-button" onClick={handleResetData}>
        Reset Data
      </button>
    </div>
  );
};

export default App;
