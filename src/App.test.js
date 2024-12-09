import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import App from "./App";

test("renders the app title", () => {
  render(<App />);
  const titleElement = screen.getByText(/Fuel Receipts App/i);
  expect(titleElement).toBeInTheDocument();
});

test("allows entering truck data and saves it", () => {
  render(<App />);

  // Enter truck data
  const truckIdInput = screen.getByLabelText(/Truck ID/i);
  const startMeterInput = screen.getByLabelText(/Start Meter/i);

  fireEvent.change(truckIdInput, { target: { value: "TR123" } });
  fireEvent.change(startMeterInput, { target: { value: "1000" } });

  // Click Save button
  const saveButton = screen.getByText(/Save Start Data/i);
  fireEvent.click(saveButton);

  // Check if truck data was saved (should reload storedTruckData)
  const storedTruckData = screen.getByText(/TR123/i);
  expect(storedTruckData).toBeInTheDocument();
});

test("calculates discrepancy correctly", () => {
  render(<App />);

  // Enter truck data
  const startMeterInput = screen.getByLabelText(/Start Meter/i);
  const endMeterInput = screen.getByLabelText(/End Meter/i);
  fireEvent.change(startMeterInput, { target: { value: "1000" } });
  fireEvent.change(endMeterInput, { target: { value: "1200" } });

  // Save start and end data
  const saveStartButton = screen.getByText(/Save Start Data/i);
  const saveEndButton = screen.getByText(/Save End Data/i);
  fireEvent.click(saveStartButton);
  fireEvent.click(saveEndButton);

  // Enter bulk fill data
  const fillAmountInput = screen.getByLabelText(/Amount/i);
  fireEvent.change(fillAmountInput, { target: { value: "190" } });

  const saveFillButton = screen.getByText(/Save Bulk Fill/i);
  fireEvent.click(saveFillButton);

  // Calculate discrepancy
  const calculateButton = screen.getByText(/Calculate/i);
  fireEvent.click(calculateButton);

  // Check discrepancy result
  const discrepancyText = screen.getByText(/Loss/i);
  expect(discrepancyText).toBeInTheDocument();
});
