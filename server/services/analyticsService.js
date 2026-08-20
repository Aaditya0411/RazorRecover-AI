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

  // Recovery Rate calculation
  const overallPotentialRate = totalFailedRevenue > 0 
    ? Math.round((estimatedRecoverableRevenue / totalFailedRevenue) * 100) 
    : 0;

  return {
    totalFailedCount: failedTxns.length,
    totalFailedRevenue,
    estimatedRecoverableRevenue,
    highPriorityCount,
    recoveredRevenue,
    totalRecoveredCount,
    recoveryRate: overallPotentialRate
  };
}

function calculateAnalytics(transactions = []) {
  // 1. Failure Reason Distribution
  const failureReasonMap = {};
  const failureReasonRevenue = {};

  // 2. Payment Method Breakdown
  const paymentMethodMap = {};

  // 3. Priority Breakdown
  const priorityMap = { High: 0, Medium: 0, Low: 0 };
  const priorityRevenueMap = { High: 0, Medium: 0, Low: 0 };

  // 4. Probability Brackets
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
      failureReasonRevenue[reason] = { total: 0, recoverable: 0 };
    }
    failureReasonRevenue[reason].total += t.amount || 0;
    failureReasonRevenue[reason].recoverable += t.estimatedRecovery || 0;

    const method = t.paymentMethod || "Other";
    if (!paymentMethodMap[method]) {
      paymentMethodMap[method] = { count: 0, totalAmount: 0, recoverableAmount: 0 };
    }
    paymentMethodMap[method].count += 1;
    paymentMethodMap[method].totalAmount += t.amount || 0;
    paymentMethodMap[method].recoverableAmount += t.estimatedRecovery || 0;

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
    recoverableRevenue: failureReasonRevenue[key].recoverable
  }));

  const paymentMethodData = Object.keys(paymentMethodMap).map(key => ({
    method: key,
    count: paymentMethodMap[key].count,
    totalAmount: paymentMethodMap[key].totalAmount,
    recoverableAmount: paymentMethodMap[key].recoverableAmount
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

  // Insight 1: Highest Recovery Probability Category
  const reasonGroup = {};
  failedTxns.forEach(t => {
    if (!reasonGroup[t.failureReason]) {
      reasonGroup[t.failureReason] = { totalProb: 0, count: 0, totalAmount: 0 };
    }
    reasonGroup[t.failureReason].totalProb += t.recoveryProbability || 0;
    reasonGroup[t.failureReason].count += 1;
    reasonGroup[t.failureReason].totalAmount += t.amount || 0;
  });

  let topReason = null;
  let topProb = 0;

  Object.keys(reasonGroup).forEach(r => {
    const avgProb = Math.round(reasonGroup[r].totalProb / reasonGroup[r].count);
    if (avgProb > topProb) {
      topProb = avgProb;
      topReason = r;
    }
  });

  if (topReason) {
    insights.push({
      id: "ins-1",
      title: "Highest Recovery Opportunity",
      category: "Conversion",
      description: `${formatFailureReason(topReason)} failures exhibit the highest recovery probability at ${topProb}%. Automated immediate retry triggers should be enabled for this category.`,
      impact: "High",
      badge: `${topProb}% Probability`
    });
  }

  // Insight 2: High Priority Inventory Revenue
  const highPriorityTxns = failedTxns.filter(t => t.priority === "High");
  const highPriorityRevenue = highPriorityTxns.reduce((acc, t) => acc + (t.amount || 0), 0);
  insights.push({
    id: "ins-2",
    title: "High-Priority Revenue Inventory",
    category: "Revenue",
    description: `₹${highPriorityRevenue.toLocaleString('en-IN')} across ${highPriorityTxns.length} failed transactions represents immediate high-probability recoverable revenue inventory.`,
    impact: "High",
    badge: `₹${highPriorityRevenue.toLocaleString('en-IN')}`
  });

  // Insight 3: Customer History Impact
  const loyalCustomers = failedTxns.filter(t => (t.customerSuccessRate || 0) >= 0.85);
  const loyalAvgProb = loyalCustomers.length > 0 
    ? Math.round(loyalCustomers.reduce((acc, t) => acc + t.recoveryProbability, 0) / loyalCustomers.length) 
    : 80;

  insights.push({
    id: "ins-3",
    title: "Customer Trust Index Advantage",
    category: "Customer Insights",
    description: `Customers with >85% historical payment completion show an average recovery rate of ${loyalAvgProb}%. Alternative payment routing works best for this segment.`,
    impact: "Medium",
    badge: "Strong History"
  });

  // Insight 4: Expired Cards routing suggestion
  const expiredCardCount = failedTxns.filter(t => t.failureReason === "expired_card").length;
  insights.push({
    id: "ins-4",
    title: "Payment Method Routing Optimization",
    category: "Routing",
    description: `${expiredCardCount} expired card failures should be automatically routed to seamless WhatsApp/SMS card update flows instead of immediate retry calls.`,
    impact: "Medium",
    badge: "Actionable"
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
