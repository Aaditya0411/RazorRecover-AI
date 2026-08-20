/**
 * RazorRecover AI - Explainable Recovery Scoring Engine
 * 
 * Configurable, deterministic scoring engine for predicting payment recovery probability,
 * estimating recoverable revenue, recommending optimal recovery actions, and prioritizing recovery inventory.
 * 
 * Score distribution is realistic across High (>=70%), Medium (40-69%), and Low (<40%) brackets.
 */

// Centralized Configurable Weights Configuration
const RECOVERY_CONFIG = {
  // Base recovery rates by failure reason (0 to 100)
  failureReasonBase: {
    network_error: 78,
    upi_timeout: 72,
    bank_declined: 60,
    insufficient_funds: 45,
    authentication_failure: 50,
    expired_card: 32,
    unknown_failure: 25
  },

  // Payment method recovery factors
  paymentMethodReliability: {
    "UPI": +4,
    "Card": 0,
    "Net Banking": +6,
    "Wallet": -4
  },

  // Customer historical success rate impact factor
  customerSuccessWeight: 20, // Adds up to +20 points for 100% success rate

  // Retry penalty per previous attempt
  retryPenaltyPerAttempt: 14, // -14 points per retry attempt

  // Transaction age decay (hours)
  transactionAgeDecay: {
    freshBonus: +6,        // < 2 hours
    moderatePenalty: -6,   // 2 - 12 hours
    agedPenalty: -20       // > 12 hours
  },

  // Amount high-value factor boost
  amountWeight: {
    highValueThreshold: 15000,
    highValueBonus: +4,
    midValueThreshold: 5000,
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

  // Clamping bounds
  minProbability: 12,
  maxProbability: 95
};

/**
 * Analyzes a single transaction and calculates explainable recovery metrics.
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

  // Calculate raw score
  const rawProbability = baseScore + customerBonus - retryPenalty + ageFactor + methodFactor + amountFactor;

  // Clamp probability strictly between 12% and 95%
  const recoveryProbability = Math.min(
    RECOVERY_CONFIG.maxProbability,
    Math.max(RECOVERY_CONFIG.minProbability, Math.round(rawProbability))
  );

  // Expected Recoverable Revenue
  const estimatedRecovery = Math.round(amount * (recoveryProbability / 100));

  // Recommended Action
  const recommendedAction = RECOVERY_CONFIG.recommendedActions[failureReason] || "Manual Review";

  // Priority Logic (High: >=70%, Medium: 40-69%, Low: <40%)
  let priority = "Low";
  if (recoveryProbability >= 70) {
    priority = "High";
  } else if (recoveryProbability >= 40) {
    priority = "Medium";
  }

  // AI Explanation Text
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
  
  if (failureReason === "network_error") {
    return `Network errors are historically highly recoverable. This transaction is recent (${transactionAge.toFixed(1)}h) and ${customerName} has a strong payment history (${previousSuccessfulPayments} successful payments).`;
  }
  
  if (failureReason === "bank_declined") {
    if (recoveryProbability >= 70) {
      return `Bank declines for regular customers (${successPct}% success rate) show high recovery when offered an alternate payment method like UPI or another card.`;
    }
    return `Bank declined the transaction. Offering an alternate payment method provides a moderate recovery opportunity.`;
  }

  if (failureReason === "upi_timeout") {
    return `UPI gateway timeout on a high-completion account. A quick retry or mandate reminder yields a ${recoveryProbability}% expected recovery.`;
  }

  if (failureReason === "insufficient_funds") {
    return `Transaction failed due to insufficient balance. Scheduling a smart retry during mid-month or salary cycle yields a ${recoveryProbability}% likelihood.`;
  }

  if (failureReason === "expired_card") {
    return `Expired card details detected. Automatic retries have low success rate; routing to an interactive card-update flow is recommended.`;
  }

  if (retryCount >= 2) {
    return `Multiple retry attempts (${retryCount}) have failed and transaction age is ${transactionAge.toFixed(1)}h. Manual review or direct customer reach-out is advised.`;
  }

  return `Failure due to ${failureReason.replace('_', ' ')}. Customer has ${previousSuccessfulPayments} past successful transactions. ${recommendedAction} is recommended.`;
}

function analyzeBatch(transactions) {
  return transactions.map(txn => ({
    ...txn,
    ...analyzeTransaction(txn)
  }));
}

module.exports = {
  RECOVERY_CONFIG,
  analyzeTransaction,
  analyzeBatch
};
