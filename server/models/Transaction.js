const mongoose = require("mongoose");
const { getIsMongoConnected } = require("../config/db");
const { initialTransactions } = require("../utils/seedData");
const { analyzeBatch, analyzeTransaction } = require("../services/recoveryEngine");

// Mongoose Schema Definition
const transactionSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    customer: {
      name: String,
      email: String,
      tier: String
    },
    amount: { type: Number, required: true },
    paymentMethod: { type: String, required: true },
    failureReason: { type: String, required: true },
    retryCount: { type: Number, default: 0 },
    customerSuccessRate: { type: Number, default: 0.5 },
    previousSuccessfulPayments: { type: Number, default: 0 },
    transactionAge: { type: Number, default: 1 },
    timestamp: { type: String, default: () => new Date().toISOString() },
    status: { type: String, enum: ["failed", "recovered", "in_recovery"], default: "failed" },
    
    // AI Recovery Engine fields
    recoveryProbability: Number,
    estimatedRecovery: Number,
    recommendedAction: String,
    priority: { type: String, enum: ["High", "Medium", "Low"] },
    aiExplanation: String,
    scoreBreakdown: Object
  },
  { timestamps: true }
);

const MongooseTransaction = mongoose.model("Transaction", transactionSchema);

// In-Memory Data Store (Fallback)
let inMemoryTransactions = analyzeBatch(initialTransactions);

class TransactionRepository {
  static async seed(data = initialTransactions) {
    const analyzed = analyzeBatch(data);
    if (getIsMongoConnected()) {
      await MongooseTransaction.deleteMany({});
      await MongooseTransaction.insertMany(analyzed);
    } else {
      inMemoryTransactions = [...analyzed];
    }
    return analyzed;
  }

  static async find({ search, failureReason, priority, status, sortBy, sortOrder = "desc" }) {
    let items = [];

    if (getIsMongoConnected()) {
      const query = {};
      if (failureReason) query.failureReason = failureReason;
      if (priority) query.priority = priority;
      if (status) query.status = status;
      if (search) {
        query.$or = [
          { id: new RegExp(search, "i") },
          { "customer.name": new RegExp(search, "i") },
          { "customer.email": new RegExp(search, "i") }
        ];
      }

      const sortObj = {};
      if (sortBy) {
        sortObj[sortBy] = sortOrder === "asc" ? 1 : -1;
      } else {
        sortObj.timestamp = -1;
      }

      items = await MongooseTransaction.find(query).sort(sortObj).lean();
    } else {
      // In-Memory Filtering & Sorting
      items = [...inMemoryTransactions];

      if (failureReason && failureReason !== "all") {
        items = items.filter(t => t.failureReason === failureReason);
      }

      if (priority && priority !== "all") {
        items = items.filter(t => t.priority === priority);
      }

      if (status && status !== "all") {
        items = items.filter(t => t.status === status);
      }

      if (search) {
        const q = search.toLowerCase();
        items = items.filter(
          t =>
            (t.id && t.id.toLowerCase().includes(q)) ||
            (t.customer && t.customer.name && t.customer.name.toLowerCase().includes(q)) ||
            (t.customer && t.customer.email && t.customer.email.toLowerCase().includes(q))
        );
      }

      if (sortBy) {
        items.sort((a, b) => {
          let valA = a[sortBy];
          let valB = b[sortBy];

          if (sortBy === "customer") {
            valA = a.customer?.name || "";
            valB = b.customer?.name || "";
          }

          if (typeof valA === "string") {
            return sortOrder === "asc"
              ? valA.localeCompare(valB)
              : valB.localeCompare(valA);
          }

          return sortOrder === "asc" ? (valA || 0) - (valB || 0) : (valB || 0) - (valA || 0);
        });
      } else {
        items.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      }
    }

    return items;
  }

  static async findById(id) {
    if (getIsMongoConnected()) {
      return await MongooseTransaction.findOne({ id }).lean();
    } else {
      return inMemoryTransactions.find(t => t.id === id) || null;
    }
  }

  static async update(id, updateFields) {
    if (getIsMongoConnected()) {
      return await MongooseTransaction.findOneAndUpdate({ id }, updateFields, { new: true }).lean();
    } else {
      const idx = inMemoryTransactions.findIndex(t => t.id === id);
      if (idx !== -1) {
        inMemoryTransactions[idx] = {
          ...inMemoryTransactions[idx],
          ...updateFields
        };
        return inMemoryTransactions[idx];
      }
      return null;
    }
  }

  static async reanalyzeAll() {
    let items = [];
    if (getIsMongoConnected()) {
      items = await MongooseTransaction.find({}).lean();
    } else {
      items = [...inMemoryTransactions];
    }

    const reanalyzed = analyzeBatch(items);

    if (getIsMongoConnected()) {
      for (const item of reanalyzed) {
        await MongooseTransaction.updateOne({ id: item.id }, item);
      }
    } else {
      inMemoryTransactions = reanalyzed;
    }

    return reanalyzed;
  }
}

module.exports = TransactionRepository;
