/**
 * RazorRecover AI - Explainable Recovery Scoring Engine
 * 
 * Deterministic, rule-based scoring engine for predicting payment recovery probability,
 * estimating recoverable revenue, recommending optimal recovery actions, and prioritizing recovery queue inventory.
 * 
 * Future Upgrade Path:
 * This module can be seamlessly replaced with an ML model (XGBoost/LightGBM)
 * or LLM agent without altering the surrounding API contracts or UI components.
 */

// Centralized Configurable Weights Configuration
const RECOVERY_CONFIG = {
  // Base recovery rates by failure reason (0 to 100)
  failureReasonBase: {
    network_error: 85,
    upi_timeout: 75,
    bank_declined: 68,
    insufficient_funds: 52,
    authentication_failure: 58,
    expired_card: 42,
    unknown_failure: 35
  },

  // Payment method recovery factors (multiplier effect / bonus)
  paymentMethodReliability: {
    "UPI": +5,
    "Card": 0,
    "Net Banking": +8,
    "Wallet": -2
  },

  // Customer historical success rate impact factor (weight applied to customerSuccessRate 0..1)
  customerSuccessWeight: 25, // Adds up to +25 points for 100% success rate

  // Retry penalty per previous attempt (deducted per retry)
  retryPenaltyPerAttempt: 12, // -12 points per retry attempt

  // Transaction age decay (hours)
  // Fresh transactions (< 2 hours) get bonus, older transactions (> 12 hours) decay
  transactionAgeDecay: {
    freshBonus: +10,      // < 2 hours
    moderatePenalty: -5,  // 2 - 12 hours
    agedPenalty: -18     // > 12 hours
  },

  // Amount high-value factor boost (higher ticket value gets priority scoring focus)
  amountWeight: {
    highValueThreshold: 10000,
    highValueBonus: +6,
    midValueThreshold: 3000,
    midValueBonus: +2
  },

  // Recommended actions mapping by failure type
  recommendedActions: {
    insufficient_funds: "Smart Retry Later",
    bank_declined: "Offer Alternate Payment Method",
    expired_card: "Request Card Update",
    network_error: "Immediate Smart Retry",
    upi_timeout: "Retry UPI Payment",
    authentication_failure: "Send Payment Reminder",
    unknown_failure: "Manual Review"
  },

  // Strict Clamping bounds
  minProbability: 5,
  maxProbability: 95
};

/**
 * Analyzes a single transaction and generates explainable recovery metrics.
 * @param {Object} transaction 
 * @returns {Object} Recovery analysis output
 */
function analyzeTransaction(transaction) {
  const {
    amount = 0,
    failureReason = "unknown_failure",
    retryCount = 0,
    customerSuccessRate = 0.5,
    previousSuccessfulPayments = 0,
    transactionAge = 1,
    paymentMethod = "Card",
    customer = {}
  } = transaction;

  // 1. Base score from failure reason
  const baseScore = RECOVERY_CONFIG.failureReasonBase[failureReason] || RECOVERY_CONFIG.failureReasonBase.unknown_failure;

  // 2. Customer Trust factor
  const customerBonus = customerSuccessRate * RECOVERY_CONFIG.customerSuccessWeight;

  // 3. Retry penalty
  const retryPenalty = retryCount * RECOVERY_CONFIG.retryPenaltyPerAttempt;

  // 4. Age factor
  let ageFactor = 0;
  if (transactionAge < 2) {
    ageFactor = RECOVERY_CONFIG.transactionAgeDecay.freshBonus;
  } else if (transactionAge <= 12) {
    ageFactor = RECOVERY_CONFIG.transactionAgeDecay.moderatePenalty;
  } else {
    ageFactor = RECOVERY_CONFIG.transactionAgeDecay.agedPenalty;
  }

  // 5. Payment method reliability
  const methodFactor = RECOVERY_CONFIG.paymentMethodReliability[paymentMethod] || 0;

  // 6. Transaction Amount factor
  let amountFactor = 0;
  if (amount >= RECOVERY_CONFIG.amountWeight.highValueThreshold) {
    amountFactor = RECOVERY_CONFIG.amountWeight.highValueBonus;
  } else if (amount >= RECOVERY_CONFIG.amountWeight.midValueThreshold) {
    amountFactor = RECOVERY_CONFIG.amountWeight.midValueBonus;
  }

  // Calculate raw probability
  const rawProbability = baseScore + customerBonus - retryPenalty + ageFactor + methodFactor + amountFactor;

  // Clamp probability strictly between 5% and 95%
  const recoveryProbability = Math.min(
    RECOVERY_CONFIG.maxProbability,
    Math.max(RECOVERY_CONFIG.minProbability, Math.round(rawProbability))
  );

  // Expected Recoverable Revenue
  const estimatedRecovery = Math.round(amount * (recoveryProbability / 100));

  // Recommended Action
  const recommendedAction = RECOVERY_CONFIG.recommendedActions[failureReason] || "Manual Review";

  // Strict Priority Logic (Adheres strictly to requirement #2)
  // High: >= 70%, Medium: >= 40% & < 70%, Low: < 40%
  let priority = "Low";
  if (recoveryProbability >= 70) {
    priority = "High";
  } else if (recoveryProbability >= 40) {
    priority = "Medium";
  }

  // AI Explanation Generation
  const explanation = generateExplanation({
    customerName: customer.name || "The customer",
    failureReason,
    recoveryProbability,
    retryCount,
    customerSuccessRate,
    previousSuccessfulPayments,
    paymentMethod,
    recommendedAction,
    transactionAge
  });

  return {
    recoveryProbability,
    estimatedRecovery,
    recommendedAction,
    priority,
    aiExplanation: explanation,
    scoreBreakdown: {
      baseScore,
      customerBonus: Math.round(customerBonus),
      retryPenalty,
      ageFactor,
      methodFactor,
      amountFactor
    }
  };
}

/**
 * Helper to generate concise, human-readable AI explanation text
 */
function generateExplanation({
  customerName,
  failureReason,
  recoveryProbability,
  retryCount,
  customerSuccessRate,
  previousSuccessfulPayments,
  paymentMethod,
  recommendedAction,
  transactionAge
}) {
  const successPct = Math.round(customerSuccessRate * 100);
  const failureLabels = {
    network_error: "temporary network drop",
    upi_timeout: "UPI gateway timeout",
    bank_declined: "bank decline",
    insufficient_funds: "insufficient account balance",
    authentication_failure: "2FA authentication error",
    expired_card: "expired payment card"
  };

  const reasonDesc = failureLabels[failureReason] || "payment issue";

  if (recoveryProbability >= 70) {
    if (retryCount === 0) {
      return `${customerName} has a strong payment history (${previousSuccessfulPayments} past successful payments, ${successPct}% success rate). Because this ${reasonDesc} occurred on the first attempt, executing a ${recommendedAction.toLowerCase()} has a very high recovery probability of ${recoveryProbability}%.`;
    }
    return `${customerName} is a high-value customer with ${previousSuccessfulPayments} prior successful transactions. Despite ${retryCount} attempt(s), ${recommendedAction.toLowerCase()} retains a ${recoveryProbability}% recovery probability.`;
  } else if (recoveryProbability >= 40) {
    if (failureReason === "insufficient_funds") {
      return `Transaction failed due to ${reasonDesc}. Customer history shows a ${successPct}% completion rate. ${recommendedAction} scheduled for optimal salary cycle timing yields a ${recoveryProbability}% expected recovery.`;
    }
    return `Failure due to ${reasonDesc} on ${paymentMethod}. Customer has ${previousSuccessfulPayments} previous payments (${successPct}% success rate). ${recommendedAction} provides a moderate recovery probability of ${recoveryProbability}%.`;
  } else {
    if (retryCount >= 2) {
      return `Multiple retry attempts (${retryCount}) have failed and transaction age is ${transactionAge.toFixed(1)} hours. Recovery probability is low (${recoveryProbability}%). ${recommendedAction} is advised.`;
    }
    return `Low historical completion rate (${successPct}%) and ${reasonDesc} lower the recovery likelihood to ${recoveryProbability}%. Recommend ${recommendedAction.toLowerCase()}.`;
  }
}

/**
 * Batch analyze array of transactions
 */
function analyzeBatch(transactions) {
  return transactions.map(txn => {
    const analysis = analyzeTransaction(txn);
    return {
      ...txn,
      ...analysis
    };
  });
}

module.exports = {
  RECOVERY_CONFIG,
  analyzeTransaction,
  analyzeBatch
};
