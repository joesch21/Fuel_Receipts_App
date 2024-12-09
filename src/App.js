import React, { useState, useEffect } from "react";
import {
  fetchTruckData,
  saveTruckData,
  fetchFillData,
  saveFillData,
  clearAllData,
} from "./dbHelper";
import "./App.css";

const App = () => {
  const [truckData, setTruckData] = useState({
    truckId: "",
    startMeter: "",
    startDip: "",
    endMeter: "",
    endDip: "",
  });

  const [bulkFill, setBulkFill] = useState({
    time: "",
    amount: "",
  });

  const [storedTruckData, setStoredTruckData] = useState([]);
  const [storedFills, setStoredFills] = useState([]);
  const [discrepancy, setDiscrepancy] = useState(null);

  // Load stored truck and fill data
  const loadTruckData = async () => {
    const data = await fetchTruckData();
    setStoredTruckData(data);
  };

  const loadFills = async () => {
    const data = await fetchFillData();
    setStoredFills(data);
  };

  useEffect(() => {
    loadTruckData();
    loadFills();
  }, []);

  // Save truck data
  const handleSaveTruckData = async (type) => {
    const truckDataToSave = { ...truckData, type };
    await saveTruckData(truckDataToSave);
    setTruckData({ truckId: "", startMeter: "", startDip: "", endMeter: "", endDip: "" });
    loadTruckData();
  };

  // Save bulk fill data
  const handleSaveBulkFill = async () => {
    await saveFillData(bulkFill);
    setBulkFill({ time: "", amount: "" });
    loadFills();
  };

  // Calculate discrepancy
  const calculateDiscrepancy = () => {
    if (storedTruckData.length === 0 || storedFills.length === 0) {
      alert("No sufficient data to calculate discrepancy.");
      return;
    }

    // Ensure valid meter readings
    const startMeter = parseFloat(storedTruckData[0].startMeter || 0);
    const endMeter = parseFloat(storedTruckData[0].endMeter || 0);

    if (endMeter <= startMeter) {
      alert("End meter reading must be greater than start meter reading.");
      return;
    }

    // Calculate Meter Fuel Used
    const meterFuelUsed = endMeter - startMeter;

    // Calculate Total Bulk Fuel Added
    const totalBulkFills = storedFills.reduce((sum, fill) => sum + parseFloat(fill.amount || 0), 0);

    // Calculate Discrepancy
    const discrepancy = meterFuelUsed - totalBulkFills;

    // Update State with Results
    setDiscrepancy({
      meterFuelUsed,
      totalBulkFills,
      discrepancy,
      loss: discrepancy > 0, // True if there’s a loss
    });
  };

  // Reset all data
  const handleResetData = async () => {
    if (window.confirm("This will delete all data. Are you sure?")) {
      await clearAllData();
      setStoredTruckData([]);
      setStoredFills([]);
      setDiscrepancy(null);
    }
  };

  return (
    <div className="App">
      <h1>Fuel Receipts App</h1>

      <h2>Start of Day</h2>
      <label>
        Truck ID:
        <input
          type="text"
          value={truckData.truckId}
          onChange={(e) => setTruckData({ ...truckData, truckId: e.target.value })}
        />
      </label>
      <label>
        Start Meter:
        <input
          type="number"
          value={truckData.startMeter}
          onChange={(e) => setTruckData({ ...truckData, startMeter: e.target.value })}
        />
      </label>
      <label>
        Start Dip:
        <input
          type="number"
          value={truckData.startDip}
          onChange={(e) => setTruckData({ ...truckData, startDip: e.target.value })}
        />
      </label>
      <button onClick={() => handleSaveTruckData("start")}>Save Start Data</button>

      <h2>Bulk Fill</h2>
      <label>
        Time:
        <input
          type="time"
          value={bulkFill.time}
          onChange={(e) => setBulkFill({ ...bulkFill, time: e.target.value })}
        />
      </label>
      <label>
        Amount (L):
        <input
          type="number"
          value={bulkFill.amount}
          onChange={(e) => setBulkFill({ ...bulkFill, amount: e.target.value })}
        />
      </label>
      <button onClick={handleSaveBulkFill}>Save Bulk Fill</button>

      <h2>End of Day</h2>
      <label>
        End Meter:
        <input
          type="number"
          value={truckData.endMeter}
          onChange={(e) => setTruckData({ ...truckData, endMeter: e.target.value })}
        />
      </label>
      <label>
        End Dip:
        <input
          type="number"
          value={truckData.endDip}
          onChange={(e) => setTruckData({ ...truckData, endDip: e.target.value })}
        />
      </label>
      <button onClick={() => handleSaveTruckData("end")}>Save End Data</button>

      <h2>Discrepancy Results</h2>
      <button onClick={calculateDiscrepancy}>Calculate</button>

      {discrepancy && (
        <div>
          <p><strong>Meter Fuel Used:</strong> {discrepancy.meterFuelUsed} L</p>
          <p><strong>Total Bulk Fills:</strong> {discrepancy.totalBulkFills} L</p>
          <p>
            <strong>Discrepancy:</strong> {Math.abs(discrepancy.discrepancy)} L 
            ({discrepancy.loss ? "Loss" : "Surplus"})
          </p>
        </div>
      )}

      <h2>Stored Data</h2>
      <h3>Truck Data</h3>
      {storedTruckData.length > 0 ? (
        <p>
          Truck ID: {storedTruckData[0].truckId}, Start Meter: {storedTruckData[0].startMeter}, End
          Meter: {storedTruckData[0].endMeter}, Start Dip: {storedTruckData[0].startDip}, End Dip:{" "}
          {storedTruckData[0].endDip}
        </p>
      ) : (
        <p>No truck data available.</p>
      )}

      <h3>Bulk Fills</h3>
      <ul>
        {storedFills.map((fill, idx) => (
          <li key={idx}>
            Time: {fill.time}, Amount: {fill.amount} L
          </li>
        ))}
      </ul>

      <button className="reset-button" onClick={handleResetData}>
        Reset Data
      </button>
    </div>
  );
};

export default App;
