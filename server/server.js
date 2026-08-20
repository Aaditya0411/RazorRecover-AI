const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

// Load environment variables
dotenv.config();

const { connectDB } = require("./config/db");
const TransactionRepository = require("./models/Transaction");
const transactionRoutes = require("./routes/transactionRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use("/api", transactionRoutes);

// Root health check endpoint
app.get("/", (req, res) => {
  res.json({
    name: "RazorRecover AI - Intelligent Payment Revenue Recovery Platform",
    status: "Operational",
    version: "1.0.0",
    docs: "/api/summary"
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("Unhandled Error:", err);
  res.status(500).json({ success: false, message: "Internal Server Error", error: err.message });
});

// Start Server & Initialize Database
async function startServer() {
  await connectDB();
  
  // Initialize repository seed data
  try {
    await TransactionRepository.seed();
    console.log("[Data Engine] Synthetic payment transaction dataset successfully initialized.");
  } catch (err) {
    console.error("[Data Engine Error] Failed to initialize seed data:", err);
  }

  app.listen(PORT, () => {
    console.log(`==================================================`);
    console.log(`RazorRecover AI Backend Server Running on Port ${PORT}`);
    console.log(`API Base URL: http://localhost:${PORT}/api`);
    console.log(`==================================================`);
  });
}

startServer();
