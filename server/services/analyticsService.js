/**
 * Analytics and Dynamic AI Insights Service for RazorRecover AI
 */

function calculateSummary(transactions = []) {
  const failedTxns = transactions.filter(t => t.status === "failed");
  const recoveredTxns = transactions.filter(t => t.status === "recovered");

  const totalFailedRevenue = failedTxns.reduce((sum, t) => sum + (t.amount || 0), 0);
  const estimatedRecoverableRevenue = failedTxns.reduce((sum, t) => sum + (t.estimatedRecovery || 0), 0);
  const highPriorityCount = failedTxns.filter(t => t.priority === "High").length;
  
  const recoveredRevenue = recoveredTxns.reduce((sum, t) => sum + (t.amount || 0), 0);
  const totalRecoveredCount = recoveredTxns.length;

  const recoveryRate = totalFailedRevenue > 0 
    ? Math.round((estimatedRecoverableRevenue / totalFailedRevenue) * 100) 
    : 0;

  return {
    totalFailedCount: failedTxns.length,
    totalFailedRevenue,
    estimatedRecoverableRevenue,
    highPriorityCount,
    recoveredRevenue,
    totalRecoveredCount,
    recoveryRate
  };
}

function calculateAnalytics(transactions = []) {
  const failureReasonMap = {};
  const failureReasonRevenue = {};
  const paymentMethodMap = {};
  const priorityMap = { High: 0, Medium: 0, Low: 0 };
  const priorityRevenueMap = { High: 0, Medium: 0, Low: 0 };

  const probabilityBrackets = {
    "80-100%": 0,
    "60-79%": 0,
    "40-59%": 0,
    "20-39%": 0,
    "<20%": 0
  };

  transactions.forEach(t => {
    const reason = t.failureReason || "unknown";
    failureReasonMap[reason] = (failureReasonMap[reason] || 0) + 1;
    
    if (!failureReasonRevenue[reason]) {
      failureReasonRevenue[reason] = { total: 0, recoverable: 0, totalProb: 0, count: 0 };
    }
    failureReasonRevenue[reason].total += t.amount || 0;
    failureReasonRevenue[reason].recoverable += t.estimatedRecovery || 0;
    failureReasonRevenue[reason].totalProb += t.recoveryProbability || 0;
    failureReasonRevenue[reason].count += 1;

    const method = t.paymentMethod || "Other";
    if (!paymentMethodMap[method]) {
      paymentMethodMap[method] = { count: 0, totalAmount: 0, recoverableAmount: 0, totalProb: 0 };
    }
    paymentMethodMap[method].count += 1;
    paymentMethodMap[method].totalAmount += t.amount || 0;
    paymentMethodMap[method].recoverableAmount += t.estimatedRecovery || 0;
    paymentMethodMap[method].totalProb += t.recoveryProbability || 0;

    if (t.priority) {
      priorityMap[t.priority] = (priorityMap[t.priority] || 0) + 1;
      priorityRevenueMap[t.priority] = (priorityRevenueMap[t.priority] || 0) + (t.amount || 0);
    }

    const prob = t.recoveryProbability || 0;
    if (prob >= 80) probabilityBrackets["80-100%"] += 1;
    else if (prob >= 60) probabilityBrackets["60-79%"] += 1;
    else if (prob >= 40) probabilityBrackets["40-59%"] += 1;
    else if (prob >= 20) probabilityBrackets["20-39%"] += 1;
    else probabilityBrackets["<20%"] += 1;
  });

  const failureReasonData = Object.keys(failureReasonRevenue).map(key => ({
    reason: formatFailureReason(key),
    rawReason: key,
    count: failureReasonMap[key] || 0,
    totalRevenue: failureReasonRevenue[key].total,
    recoverableRevenue: failureReasonRevenue[key].recoverable,
    avgProbability: Math.round(failureReasonRevenue[key].totalProb / failureReasonRevenue[key].count)
  }));

  const paymentMethodData = Object.keys(paymentMethodMap).map(key => ({
    method: key,
    count: paymentMethodMap[key].count,
    totalAmount: paymentMethodMap[key].totalAmount,
    recoverableAmount: paymentMethodMap[key].recoverableAmount,
    avgProbability: Math.round(paymentMethodMap[key].totalProb / paymentMethodMap[key].count)
  }));

  const probabilityBracketData = Object.keys(probabilityBrackets).map(key => ({
    bracket: key,
    count: probabilityBrackets[key]
  }));

  return {
    failureReasonData,
    paymentMethodData,
    probabilityBracketData,
    priorityDistribution: [
      { name: "High", count: priorityMap.High, revenue: priorityRevenueMap.High },
      { name: "Medium", count: priorityMap.Medium, revenue: priorityRevenueMap.Medium },
      { name: "Low", count: priorityMap.Low, revenue: priorityRevenueMap.Low }
    ]
  };
}

function generateDatasetInsights(transactions = []) {
  const failedTxns = transactions.filter(t => t.status === "failed");
  if (failedTxns.length === 0) {
    return [
      {
        id: "ins-1",
        title: "All Payments Recovered",
        category: "Performance",
        description: "Zero failed transactions remaining in the recovery queue.",
        impact: "High",
        badge: "Optimal"
      }
    ];
  }

  const insights = [];

  // Insight 1: Highest Recovery Opportunity
  const networkTxns = failedTxns.filter(t => t.failureReason === "network_error");
  const netAvg = networkTxns.length > 0 ? Math.round(networkTxns.reduce((a, b) => a + b.recoveryProbability, 0) / networkTxns.length) : 92;
  insights.push({
    id: "ins-1",
    title: "Highest Opportunity Category",
    category: "Highest Opportunity",
    description: `Network errors have a ${netAvg}% average recovery probability. Immediate automated retries should be triggered for this segment.`,
    impact: "High",
    badge: `${netAvg}% Avg Probability`
  });

  // Insight 2: Revenue Risk / Bank Declines
  const bankDeclines = failedTxns.filter(t => t.failureReason === "bank_declined");
  const bankRecoverable = bankDeclines.reduce((a, b) => a + (b.estimatedRecovery || 0), 0);
  insights.push({
    id: "ins-2",
    title: "Revenue Risk Pool",
    category: "Revenue Risk",
    description: `Bank declines account for ₹${bankRecoverable.toLocaleString('en-IN')} of potentially recoverable revenue inventory across ${bankDeclines.length} transactions.`,
    impact: "High",
    badge: `₹${(bankRecoverable / 1000).toFixed(0)}k Inventory`
  });

  // Insight 3: Recommended Strategy
  insights.push({
    id: "ins-3",
    title: "Recommended Action Strategy",
    category: "Recommended Strategy",
    description: `Prioritize recent high-value bank declines for alternate payment routing flows (UPI/Card link via SMS) instead of automatic gateway retries.`,
    impact: "Medium",
    badge: "Actionable"
  });

  // Insight 4: Expired Cards routing suggestion
  const expiredCount = failedTxns.filter(t => t.failureReason === "expired_card").length;
  insights.push({
    id: "ins-4",
    title: "Expired Card Routing Optimization",
    category: "Routing Strategy",
    description: `${expiredCount} expired card failures should be automatically routed to card-update self-service pages rather than repeated gateway attempts.`,
    impact: "Medium",
    badge: "Low Auto Recovery"
  });

  return insights;
}

function formatFailureReason(reason) {
  const map = {
    insufficient_funds: "Insufficient Funds",
    bank_declined: "Bank Declined",
    expired_card: "Expired Card",
    network_error: "Network Error",
    upi_timeout: "UPI Timeout",
    authentication_failure: "Authentication Failure",
    unknown_failure: "Unknown Failure"
  };
  return map[reason] || reason;
}

module.exports = {
  calculateSummary,
  calculateAnalytics,
  generateDatasetInsights
};
