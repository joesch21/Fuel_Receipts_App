import React, { useState } from "react";
import Tesseract from "tesseract.js";

const ReceiptExtractor = ({ image, onExtract }) => {
  const [processing, setProcessing] = useState(false);
  const [extractedData, setExtractedData] = useState(null);

  const extractText = async () => {
    setProcessing(true);
    try {
      const { data: { text } } = await Tesseract.recognize(image, "eng", {
        logger: (info) => console.log(info),
      });
      console.log("Extracted Text:", text);

      // Parse extracted text into structured data
      const parsedData = parseReceiptText(text);
      setExtractedData(parsedData);
      onExtract(parsedData); // Send parsed data back to parent
    } catch (error) {
      console.error("Error extracting text:", error);
    } finally {
      setProcessing(false);
    }
  };

  const parseReceiptText = (text) => {
    // Example parsing logic - Adjust as per receipt format
    const lines = text.split("\n");
    return {
      fuelType: extractField(lines, /Fuel Type[:\s]+(.+)/i),
      volume: extractField(lines, /Volume[:\s]+([\d.]+)/i),
      price: extractField(lines, /Price per Liter[:\s]+([\d.]+)/i),
      totalCost: extractField(lines, /Total Cost[:\s]+([\d.]+)/i),
    };
  };

  const extractField = (lines, regex) => {
    for (const line of lines) {
      const match = line.match(regex);
      if (match) return match[1].trim();
    }
    return null;
  };

  return (
    <div>
      <h2>Extract Receipt Data</h2>
      <button onClick={extractText} disabled={processing}>
        {processing ? "Processing..." : "Extract Data"}
      </button>
      {extractedData && (
        <div>
          <h3>Extracted Data:</h3>
          <p><strong>Fuel Type:</strong> {extractedData.fuelType || "N/A"}</p>
          <p><strong>Volume:</strong> {extractedData.volume || "N/A"} L</p>
          <p><strong>Price/Liter:</strong> {extractedData.price || "N/A"}</p>
          <p><strong>Total Cost:</strong> {extractedData.totalCost || "N/A"}</p>
        </div>
      )}
    </div>
  );
};

export default ReceiptExtractor;
