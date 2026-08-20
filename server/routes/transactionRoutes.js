const express = require("express");
const router = express.Router();

const {
  getTransactions,
  getTransactionById,
  getSummary,
  getAnalytics,
  getInsights,
  analyzeTransactions,
  getRecommendation,
  simulateRecovery,
  seedDatabase
} = require("../controllers/transactionController");

// Data Retrieval APIs
router.get("/transactions", getTransactions);
router.get("/transactions/:id", getTransactionById);
router.get("/summary", getSummary);
router.get("/analytics", getAnalytics);
router.get("/insights", getInsights);

// AI & Recovery Execution APIs
router.post("/recovery/analyze", analyzeTransactions);
router.post("/recovery/:id/recommend", getRecommendation);
router.post("/recovery/:id/simulate", simulateRecovery);

// Utility API
router.post("/seed", seedDatabase);

module.exports = router;
