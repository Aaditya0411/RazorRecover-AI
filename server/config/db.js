const mongoose = require("mongoose");

let isMongoConnected = false;

async function connectDB() {
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    console.log("--------------------------------------------------");
    console.log("[DB Info] MONGODB_URI not provided.");
    console.log("[DB Info] Using built-in In-Memory Synthetic Store.");
    console.log("[DB Info] Zero-config mode active - No MongoDB setup required!");
    console.log("--------------------------------------------------");
    isMongoConnected = false;
    return false;
  }

  try {
    // Attempt Mongoose connection with 3 sec timeout
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 3000
    });
    isMongoConnected = true;
    console.log("--------------------------------------------------");
    console.log(`[DB Success] MongoDB connected successfully to ${mongoUri}`);
    console.log("--------------------------------------------------");
    return true;
  } catch (err) {
    console.warn("--------------------------------------------------");
    console.warn(`[DB Warning] Could not connect to MongoDB (${err.message}).`);
    console.warn("[DB Warning] Falling back automatically to In-Memory Synthetic Store.");
    console.warn("--------------------------------------------------");
    isMongoConnected = false;
    return false;
  }
}

function getIsMongoConnected() {
  return isMongoConnected;
}

module.exports = {
  connectDB,
  getIsMongoConnected
};
