const TransactionRepository = require("../models/Transaction");
const { analyzeTransaction } = require("../services/recoveryEngine");
const { calculateSummary, calculateAnalytics, generateDatasetInsights } = require("../services/analyticsService");

// 1. GET /api/transactions
async function getTransactions(req, res) {
  try {
    const { search, failureReason, priority, status, sortBy, sortOrder } = req.query;
    const transactions = await TransactionRepository.find({
      search,
      failureReason,
      priority,
      status,
      sortBy,
      sortOrder
    });
    return res.json({ success: true, count: transactions.length, data: transactions });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch transactions", error: error.message });
  }
}

// 2. GET /api/transactions/:id
async function getTransactionById(req, res) {
  try {
    const { id } = req.params;
    const transaction = await TransactionRepository.findById(id);
    if (!transaction) {
      return res.status(404).json({ success: false, message: `Transaction with ID ${id} not found` });
    }
    return res.json({ success: true, data: transaction });
  } catch (error) {
    console.error("Error fetching transaction details:", error);
    return res.status(500).json({ success: false, message: "Error fetching transaction details", error: error.message });
  }
}

// 3. GET /api/summary
async function getSummary(req, res) {
  try {
    const allTransactions = await TransactionRepository.find({});
    const summary = calculateSummary(allTransactions);
    return res.json({ success: true, data: summary });
  } catch (error) {
    console.error("Error calculating summary:", error);
    return res.status(500).json({ success: false, message: "Error calculating summary metrics", error: error.message });
  }
}

// 4. GET /api/analytics
async function getAnalytics(req, res) {
  try {
    const allTransactions = await TransactionRepository.find({});
    const analytics = calculateAnalytics(allTransactions);
    return res.json({ success: true, data: analytics });
  } catch (error) {
    console.error("Error generating analytics:", error);
    return res.status(500).json({ success: false, message: "Error generating analytics data", error: error.message });
  }
}

// 5. GET /api/insights
async function getInsights(req, res) {
  try {
    const allTransactions = await TransactionRepository.find({});
    const insights = generateDatasetInsights(allTransactions);
    return res.json({ success: true, data: insights });
  } catch (error) {
    console.error("Error generating AI insights:", error);
    return res.status(500).json({ success: false, message: "Error generating AI insights", error: error.message });
  }
}

// 6. POST /api/recovery/analyze
async function analyzeTransactions(req, res) {
  try {
    const updatedTransactions = await TransactionRepository.reanalyzeAll();
    const summary = calculateSummary(updatedTransactions);
    return res.json({
      success: true,
      message: "AI Recovery Engine analysis completed successfully across all transactions.",
      analyzedCount: updatedTransactions.length,
      summary
    });
  } catch (error) {
    console.error("Error re-analyzing transactions:", error);
    return res.status(500).json({ success: false, message: "Error executing AI analysis", error: error.message });
  }
}

// 7. POST /api/recovery/:id/recommend
async function getRecommendation(req, res) {
  try {
    const { id } = req.params;
    const transaction = await TransactionRepository.findById(id);
    if (!transaction) {
      return res.status(404).json({ success: false, message: `Transaction with ID ${id} not found` });
    }
    const analysis = analyzeTransaction(transaction);
    return res.json({
      success: true,
      data: {
        transactionId: id,
        amount: transaction.amount,
        customer: transaction.customer,
        failureReason: transaction.failureReason,
        ...analysis
      }
    });
  } catch (error) {
    console.error("Error getting recommendation:", error);
    return res.status(500).json({ success: false, message: "Error generating recommendation", error: error.message });
  }
}

// 8. POST /api/recovery/:id/simulate
async function simulateRecovery(req, res) {
  try {
    const { id } = req.params;
    const transaction = await TransactionRepository.findById(id);
    if (!transaction) {
      return res.status(404).json({ success: false, message: `Transaction with ID ${id} not found` });
    }

    if (transaction.status === "recovered") {
      return res.status(400).json({ success: false, message: "Transaction has already been recovered." });
    }

    // Mark as recovered
    const updatedTransaction = await TransactionRepository.update(id, {
      status: "recovered",
      recoveredAt: new Date().toISOString()
    });

    // Recalculate summary metrics
    const allTransactions = await TransactionRepository.find({});
    const updatedSummary = calculateSummary(allTransactions);

    return res.json({
      success: true,
      message: `Recovery successfully simulated for transaction ${id}`,
      data: {
        transaction: updatedTransaction,
        recoveredAmount: transaction.amount,
        originalProbability: transaction.recoveryProbability,
        estimatedRecovery: transaction.estimatedRecovery,
        summary: updatedSummary
      }
    });
  } catch (error) {
    console.error("Error simulating recovery:", error);
    return res.status(500).json({ success: false, message: "Error executing recovery simulation", error: error.message });
  }
}

// 9. POST /api/seed
async function seedDatabase(req, res) {
  try {
    const seeded = await TransactionRepository.seed();
    const summary = calculateSummary(seeded);
    return res.json({
      success: true,
      message: "Database reseeded successfully with synthetic payment dataset.",
      count: seeded.length,
      summary
    });
  } catch (error) {
    console.error("Error seeding database:", error);
    return res.status(500).json({ success: false, message: "Failed to seed database", error: error.message });
  }
}

module.exports = {
  getTransactions,
  getTransactionById,
  getSummary,
  getAnalytics,
  getInsights,
  analyzeTransactions,
  getRecommendation,
  simulateRecovery,
  seedDatabase
};
