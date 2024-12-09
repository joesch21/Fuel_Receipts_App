import React, { useState } from "react";
import { saveTruckData } from "../dbHelper";

const TruckStartForm = ({ onSubmit }) => {
  const [truckId, setTruckId] = useState("");
  const [meterReading, setMeterReading] = useState("");
  const [compartments, setCompartments] = useState([{ id: 1, dip: "" }]);

  const handleAddCompartment = () => {
    setCompartments((prev) => [...prev, { id: prev.length + 1, dip: "" }]);
  };

  const handleCompartmentChange = (index, value) => {
    const updatedCompartments = [...compartments];
    updatedCompartments[index].dip = value;
    setCompartments(updatedCompartments);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const truckData = {
      truckId,
      meterReading,
      compartments,
    };

    await saveTruckData(truckData); // Save truck data to the database
    onSubmit();
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
      <button type="submit">Save Truck Data</button>
    </form>
  );
};

export default TruckStartForm;
