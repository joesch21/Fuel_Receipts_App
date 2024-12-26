import React, { useState, useEffect } from "react";

const TruckStartForm = ({ onSubmit }) => {
  const [truckId, setTruckId] = useState("");
  const [meterReading, setMeterReading] = useState("");
  const [compartments, setCompartments] = useState([{ id: 1, dip: "" }]);

  // Save data to localStorage
  const saveDataLocally = () => {
    const truckData = {
      truckId,
      meterReading,
      compartments,
    };
    localStorage.setItem("truckData", JSON.stringify(truckData));
    alert("Data saved locally on your device!");
  };

  // Load data from localStorage
  const loadDataLocally = () => {
    const storedData = localStorage.getItem("truckData");
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      setTruckId(parsedData.truckId || "");
      setMeterReading(parsedData.meterReading || "");
      setCompartments(parsedData.compartments || []);
      alert("Data loaded successfully!");
    } else {
      alert("No saved data found!");
    }
  };

  // Save data to a local file
  const saveToFile = () => {
    const truckData = {
      truckId,
      meterReading,
      compartments,
    };

    const fileData = new Blob([JSON.stringify(truckData, null, 2)], {
      type: "application/json",
    });

    const link = document.createElement("a");
    link.href = URL.createObjectURL(fileData);
    link.download = "truckData.json";
    link.click();
    alert("Data saved to a file!");
  };

  // Load data from a file
  const loadFromFile = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const uploadedData = JSON.parse(e.target.result);
        setTruckId(uploadedData.truckId || "");
        setMeterReading(uploadedData.meterReading || "");
        setCompartments(uploadedData.compartments || []);
        alert("Data loaded from file!");
      };
      reader.readAsText(file);
    }
  };

  // Automatically load data on component mount (optional)
  useEffect(() => {
    const storedData = localStorage.getItem("truckData");
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      setTruckId(parsedData.truckId || "");
      setMeterReading(parsedData.meterReading || "");
      setCompartments(parsedData.compartments || []);
    }
  }, []);

  const handleAddCompartment = () => {
    setCompartments((prev) => [...prev, { id: prev.length + 1, dip: "" }]);
  };

  const handleCompartmentChange = (index, value) => {
    const updatedCompartments = [...compartments];
    updatedCompartments[index].dip = value;
    setCompartments(updatedCompartments);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const truckData = { truckId, meterReading, compartments };
    console.log("Submitting Data: ", truckData);
    saveDataLocally(); // Save to local storage after submission
    onSubmit(); // Call parent component's onSubmit handler
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Truck Start of Day</h2>
      <div>
        <label>Truck ID:</label>
        <input
          type="text"
          value={truckId}
          onChange={(e) => setTruckId(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Meter Reading:</label>
        <input
          type="number"
          value={meterReading}
          onChange={(e) => setMeterReading(e.target.value)}
          required
        />
      </div>
      <div>
        <h3>Compartments</h3>
        {compartments.map((comp, index) => (
          <div key={index}>
            <label>Compartment {index + 1} Dip:</label>
            <input
              type="number"
              value={comp.dip}
              onChange={(e) => handleCompartmentChange(index, e.target.value)}
              required
            />
          </div>
        ))}
        <button type="button" onClick={handleAddCompartment}>
          Add Compartment
        </button>
      </div>
      <div>
        <button type="button" onClick={saveDataLocally}>
          Save Locally
        </button>
        <button type="button" onClick={loadDataLocally}>
          Load Locally
        </button>
      </div>
      <div>
        <button type="button" onClick={saveToFile}>
          Save to File
        </button>
        <input
          type="file"
          accept=".json"
          onChange={loadFromFile}
          style={{ marginTop: "10px" }}
        />
      </div>
      <button type="submit">Save Truck Data</button>
    </form>
  );
};

export default TruckStartForm;
