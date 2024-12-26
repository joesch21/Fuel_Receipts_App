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

  // Save all data to localStorage in the background
  const saveToLocalStorage = (section) => {
    const dataToSave = {
      truckData,
      bulkFills,
      discrepancy,
    };

    localStorage.setItem("fuelReceiptsData", JSON.stringify(dataToSave));
    console.log(`${section} data saved to localStorage`);
    alert(`${section} data saved!`);
  };

  // Optional: Save all data to a file explicitly
  const saveToFile = (section) => {
    const dataToSave = {
      truckData,
      bulkFills,
      discrepancy,
    };

    const fileData = new Blob([JSON.stringify(dataToSave, null, 2)], {
      type: "application/json",
    });

    const link = document.createElement("a");
    link.href = URL.createObjectURL(fileData);
    link.download = "fuel_receipts_data.json";
    link.click();
    alert(`${section} data saved to file!`);
  };

  // Load data from a file or localStorage
  const loadFromFile = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const loadedData = JSON.parse(e.target.result);

          setTruckData((prev) => ({
            ...prev,
            ...loadedData.truckData,
          }));
          setBulkFills((prev) => [...prev, ...(loadedData.bulkFills || [])]);
          setDiscrepancy(loadedData.discrepancy || null);
          alert("Data loaded from file!");
        } catch (error) {
          alert("Error reading the file. Please upload a valid JSON file.");
          console.error("Error parsing file data:", error);
        }
      };
      reader.readAsText(file);
    } else {
      // Load data from localStorage as fallback
      const savedData = localStorage.getItem("fuelReceiptsData");
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        setTruckData(parsedData.truckData || {});
        setBulkFills(parsedData.bulkFills || []);
        setDiscrepancy(parsedData.discrepancy || null);
        alert("Data loaded from localStorage!");
      }
    }
  };

  // Save a bulk fill
  const handleSaveBulkFill = () => {
    if (!currentFill.time || !currentFill.amount) {
      alert("Please fill out all fields for the bulk fill.");
      return;
    }

    setBulkFills((prev) => [...prev, currentFill]);
    setCurrentFill({ time: "", amount: "" });
    saveToLocalStorage("Bulk Fills");
    alert("Bulk fill saved successfully!");
  };

  // Calculate and reconcile the discrepancy
  const calculateDiscrepancy = () => {
    const { startMeter, endMeter, startDip, endDip } = truckData;

    if (!startMeter || !endMeter || !startDip || !endDip || bulkFills.length === 0) {
      alert("Please ensure all data is entered before calculating discrepancy.");
      return;
    }

    // Calculate fuel usage
    const meterFuelUsed = parseFloat(endMeter) - parseFloat(startMeter);
    const dipDifference = parseFloat(startDip) - parseFloat(endDip);
    const calculatedFuelUsed = meterFuelUsed + dipDifference;

    // Calculate total bulk fills
    const totalBulkFills = bulkFills.reduce(
      (sum, fill) => sum + parseFloat(fill.amount || 0),
      0
    );

    // Calculate discrepancy
    const discrepancyValue = calculatedFuelUsed - totalBulkFills;

    setDiscrepancy({
      meterFuelUsed,
      dipDifference,
      calculatedFuelUsed,
      totalBulkFills,
      discrepancy: discrepancyValue,
    });

    saveToLocalStorage("Discrepancy");
    alert("Discrepancy calculated!");
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
      localStorage.removeItem("fuelReceiptsData");
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
      <button onClick={() => saveToLocalStorage("Start of Day")}>
        Save Start of Day
      </button>

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
      <button onClick={handleSaveBulkFill}>Add Bulk Fill</button>

      <h3>Saved Bulk Fills</h3>
      <ul>
        {bulkFills.map((fill, idx) => (
          <li key={idx}>
            Time: {fill.time}, Amount: {fill.amount} L
          </li>
        ))}
      </ul>

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
      <button onClick={() => saveToLocalStorage("End of Day")}>
        Save End of Day
      </button>

      {/* Discrepancy Results */}
      <button onClick={calculateDiscrepancy}>Calculate Discrepancy</button>
      {discrepancy && (
        <div>
          <h3>Discrepancy Results</h3>
          <p>
            <strong>Meter Fuel Used:</strong> {discrepancy.meterFuelUsed} L
          </p>
          <p>
            <strong>Dip Difference:</strong> {discrepancy.dipDifference} L
          </p>
          <p>
            <strong>Calculated Fuel Used:</strong> {discrepancy.calculatedFuelUsed} L
          </p>
          <p>
            <strong>Total Bulk Fills:</strong> {discrepancy.totalBulkFills} L
          </p>
          <p>
            <strong>Discrepancy:</strong> {Math.abs(discrepancy.discrepancy)} L
          </p>
        </div>
      )}

      {/* File Management Buttons */}
      <div>
        <button onClick={saveToFile}>Download JSON File</button>
        <input
          type="file"
          accept=".json"
          onChange={loadFromFile}
          style={{ marginTop: "10px" }}
        />
      </div>

      {/* Reset Button */}
      <button className="reset-button" onClick={handleResetData}>
        Reset Data
      </button>
    </div>
  );
};

export default App;
