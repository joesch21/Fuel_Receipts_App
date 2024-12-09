import Dexie from "dexie";

// Initialize Dexie.js database
const db = new Dexie("FuelReceiptsDatabase");

// Define database schema
db.version(1).stores({
  truckData: "++id, truckId, startMeter, endMeter, startDip, endDip, type", // Schema for truck data
  receiptData: "++id, fuelType, volume, price, totalCost", // Schema for receipt data
  fills: "++id, time, amount", // Schema for bulk fill data
});

// Save truck data (start or end of day)
export const saveTruckData = async (truckData) => {
  try {
    await db.truckData.add(truckData);
  } catch (error) {
    console.error("Error saving truck data:", error);
  }
};

// Fetch all truck data
export const fetchTruckData = async () => {
  try {
    return await db.truckData.toArray();
  } catch (error) {
    console.error("Error fetching truck data:", error);
    return [];
  }
};

// Save bulk fill data
export const saveFillData = async (fill) => {
  try {
    await db.fills.add(fill);
  } catch (error) {
    console.error("Error saving bulk fill data:", error);
  }
};

// Fetch all bulk fill data
export const fetchFillData = async () => {
  try {
    return await db.fills.toArray();
  } catch (error) {
    console.error("Error fetching bulk fill data:", error);
    return [];
  }
};

// Save receipt data
export const saveReceiptData = async (receiptData) => {
  try {
    await db.receiptData.add(receiptData);
  } catch (error) {
    console.error("Error saving receipt data:", error);
  }
};

// Fetch all receipt data
export const fetchReceiptData = async () => {
  try {
    return await db.receiptData.toArray();
  } catch (error) {
    console.error("Error fetching receipt data:", error);
    return [];
  }
};

// Clear all data from all tables
export const clearAllData = async () => {
  try {
    await db.truckData.clear();
    await db.fills.clear();
    await db.receiptData.clear();
    console.log("All data cleared successfully.");
  } catch (error) {
    console.error("Error clearing data:", error);
  }
};

export default db;
