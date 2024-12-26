import React, { useState, useEffect } from "react";
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
    const [currentFill, setCurrentFill] = useState({ time: "", amount: "" });
    const [discrepancy, setDiscrepancy] = useState(null);

    // --- Data Management ---

    // Load initial data from localStorage on component mount
    useEffect(() => {
        const savedData = localStorage.getItem("fuelReceiptsData");
        if (savedData) {
            const parsedData = JSON.parse(savedData);
            setTruckData(parsedData.truckData || {});
            setBulkFills(parsedData.bulkFills || []);
            setDiscrepancy(parsedData.discrepancy || null);
        }
    }, []);

    // Save data to localStorage whenever relevant state changes
    useEffect(() => {
        const dataToSave = { truckData, bulkFills, discrepancy };
        localStorage.setItem("fuelReceiptsData", JSON.stringify(dataToSave));
    }, [truckData, bulkFills, discrepancy]);

    // Download data as a text file
    const downloadData = () => {
        const dataToSave = `
Truck Data:
  Truck ID: ${truckData.truckId}
  Start Meter: ${truckData.startMeter}
  Start Dip: ${truckData.startDip}
  End Meter: ${truckData.endMeter}
  End Dip: ${truckData.endDip}

Bulk Fills:
${bulkFills.map(fill => `  Time: ${fill.time}, Amount: ${fill.amount} L`).join('\n')}

Discrepancy:
  ${discrepancy ? 
    `Meter Fuel Used: ${discrepancy.meterFuelUsed} L
     Dip Difference: ${discrepancy.dipDifference} L
     Calculated Fuel Used: ${discrepancy.calculatedFuelUsed} L
     Total Bulk Fills: ${discrepancy.totalBulkFills} L
     Discrepancy: ${Math.abs(discrepancy.discrepancy)} L`
    : 'Not calculated'}
`;

        const fileData = new Blob([dataToSave], { type: "text/plain" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(fileData);

        const now = new Date();
        const formattedDate = now.toLocaleDateString().replace(/\//g, '-');
        const formattedTime = now.toLocaleTimeString().replace(/:/g, '-');
        const filename = `fuel_receipts_data_${formattedDate}_${formattedTime}.txt`;

        link.download = filename;
        link.click();
    };

    // Load data from a text file and display on a card
    const loadData = (event) => {
      if (event.target.files && event.target.files[0]) {
          const reader = new FileReader();
          reader.onload = (e) => {
              try {
                  const fileContent = e.target.result;
  
                  // --- Custom Parsing Logic ---
  
                  const lines = fileContent.split('\n');
                  const truckData = {};
                  const bulkFills = [];
                  let discrepancy = null;
  
                  let currentSection = "";
  
                  for (const line of lines) {
                      if (line.startsWith("Truck Data:")) {
                          currentSection = "truckData";
                      } else if (line.startsWith("Bulk Fills:")) {
                          currentSection = "bulkFills";
                      } else if (line.startsWith("Discrepancy:")) {
                          currentSection = "discrepancy";
                      } else if (line.trim() !== "" && currentSection) {
                          const parts = line.trim().split(':');
                          if (parts.length === 2) {
                              const key = parts[0].trim().toLowerCase().replace(' ', '_');
                              const value = parts[1].trim();
  
                              if (currentSection === "truckData") {
                                  truckData[key] = value;
                              } else if (currentSection === "bulkFills") {
                                  const fillParts = value.split(',');
                                  if (fillParts.length === 2) {
                                      const time = fillParts[0].trim().split(' ')[1];
                                      const amount = fillParts[1].trim().split(' ')[0];
                                      bulkFills.push({ time, amount });
                                  }
                              } else if (currentSection === "discrepancy" && value !== 'Not calculated') {
                                  const discrepancyParts = value.split(' ');
                                  const meterFuelUsed = parseFloat(discrepancyParts[3]);
                                  const dipDifference = parseFloat(discrepancyParts[6]);
                                  const calculatedFuelUsed = parseFloat(discrepancyParts[9]);
                                  const totalBulkFills = parseFloat(discrepancyParts[12]);
                                  const discrepancyValue = parseFloat(discrepancyParts[15]); // Corrected index
                                  discrepancy = {
                                      meterFuelUsed,
                                      dipDifference,
                                      calculatedFuelUsed,
                                      totalBulkFills,
                                      discrepancy: discrepancyValue,
                                  };
                              }
                          }
                      }
                  }
  
                  // --- Display data on a card ---
  
                  // Construct the card content here
                  const cardContent = `
                      Truck Data:
                        Truck ID: ${truckData.truckId}
                        Start Meter: ${truckData.startMeter}
                        Start Dip: ${truckData.startDip}
                        End Meter: ${truckData.endMeter}
                        End Dip: ${truckData.endDip}
  
                      Bulk Fills:
                      ${bulkFills.map(fill => `  Time: ${fill.time}, Amount: ${fill.amount} L`).join('\n')}
  
                      Discrepancy:
                        ${discrepancy ?
                          `Meter Fuel Used: ${discrepancy.meterFuelUsed} L
                           Dip Difference: ${discrepancy.dipDifference} L
                           Calculated Fuel Used: ${discrepancy.calculatedFuelUsed} L
                           Total Bulk Fills: ${discrepancy.totalBulkFills} L
                           Discrepancy: ${Math.abs(discrepancy.discrepancy)} L`
                          : 'Not calculated'}
                  `;
  
                  // Now you can use cardContent in your alert or card component
                  alert(cardContent);
  
              } catch (error) {
                  alert("Error loading the data. Please ensure the file is valid.");
                  console.error("Error parsing file data:", error);
              }
          };
          reader.readAsText(event.target.files[0]);
      }
  };

    // --- Calculations ---

    const calculateDiscrepancy = () => {
        const { startMeter, endMeter, startDip, endDip } = truckData;

        if (!startMeter || !endMeter || !startDip || !endDip || bulkFills.length === 0) {
            alert("Please ensure all data is entered before calculating discrepancy.");
            return;
        }

        const meterFuelUsed = parseFloat(endMeter) - parseFloat(startMeter);
        const dipDifference = parseFloat(startDip) - parseFloat(endDip);
        const calculatedFuelUsed = meterFuelUsed + dipDifference;
        const totalBulkFills = bulkFills.reduce((sum, fill) => sum + parseFloat(fill.amount || 0), 0);
        const discrepancyValue = calculatedFuelUsed - totalBulkFills;

        setDiscrepancy({
            meterFuelUsed,
            dipDifference,
            calculatedFuelUsed,
            totalBulkFills,
            discrepancy: discrepancyValue,
        });
    };

    // --- Event Handlers ---

    const handleSaveStartOfDay = () => {
        if (!truckData.truckId || !truckData.startMeter || !truckData.startDip) {
            alert("Please fill out all fields for Start of Day.");
            return;
        }
        alert("Start of Day data saved!"); 
    };

    const handleSaveBulkFill = () => {
        if (!currentFill.time || !currentFill.amount) {
            alert("Please fill out all fields for the bulk fill.");
            return;
        }

        setBulkFills((prev) => [...prev, currentFill]);
        setCurrentFill({ time: "", amount: "" });
        alert("Bulk fill saved successfully!");
    };

    const handleSaveEndOfDay = () => {
        if (!truckData.endMeter || !truckData.endDip) {
            alert("Please fill out all fields for End of Day.");
            return;
        }
        alert("End of Day data saved!"); 
    };

    const handleResetData = () => {
        if (window.confirm("This will reset all data. Are you sure?")) {
            setTruckData({ truckId: "", startMeter: "", startDip: "", endMeter: "", endDip: "" });
            setBulkFills([]);
            setDiscrepancy(null);
            setCurrentFill({ time: "", amount: "" });
            localStorage.removeItem("fuelReceiptsData");
            alert("All data has been reset!");
        }
    };

    // --- JSX Rendering ---

    return (
        <div className="App">
            <h1>Fuel Receipts App</h1>

            {/* Start of Day Section */}
            <h2>Start of Day</h2>
            <label>
                Truck ID:
                <input type="text" value={truckData.truckId} onChange={(e) => setTruckData({ ...truckData, truckId: e.target.value })} />
            </label>
            <label>
                Start Meter:
                <input type="number" value={truckData.startMeter} onChange={(e) => setTruckData({ ...truckData, startMeter: e.target.value })} />
            </label>
            <label>
                Start Dip:
                <input type="number" value={truckData.startDip} onChange={(e) => setTruckData({ ...truckData, startDip: e.target.value })} />
            </label>
            <button onClick={handleSaveStartOfDay}>Save Start of Day</button>

            {/* Bulk Fill Section */}
            <h2>Bulk Fill</h2>
            <label>
                Time:
                <input type="time" value={currentFill.time} onChange={(e) => setCurrentFill({ ...currentFill, time: e.target.value })} />
            </label>
            <label>
                Amount (L):
                <input type="number" value={currentFill.amount} onChange={(e) => setCurrentFill({ ...currentFill, amount: e.target.value })} />
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
                <input type="number" value={truckData.endMeter} onChange={(e) => setTruckData({ ...truckData, endMeter: e.target.value })} />
            </label>
            <label>
                End Dip:
                <input type="number" value={truckData.endDip} onChange={(e) => setTruckData({ ...truckData, endDip: e.target.value })} />
            </label>
            <button onClick={handleSaveEndOfDay}>Save End of Day</button>

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
                <button onClick={downloadData}>Download Data</button>
                <input type="file" accept=".txt" onChange={loadData} style={{ marginTop: "10px" }} />
            </div>

            {/* Reset Button */}
            <button className="reset-button" onClick={handleResetData}>
                Reset Data
            </button>
        </div>
    );
};

export default App;