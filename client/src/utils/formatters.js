/**
 * Utility formatters for RazorRecover AI Frontend
 */

export function formatINR(amount) {
  if (amount === undefined || amount === null) return "₹0";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(amount);
}

export function formatLakhs(amount) {
  if (amount === undefined || amount === null) return "₹0";
  if (amount >= 100000) {
    const lakhs = (amount / 100000).toFixed(2);
    return `₹${lakhs}L`;
  }
  return formatINR(amount);
}

export function formatPercent(value) {
  if (value === undefined || value === null) return "0%";
  return `${Math.round(value)}%`;
}

export function formatFailureReason(reason) {
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

export function getPriorityColor(priority) {
  switch (priority) {
    case "High":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    case "Medium":
      return "bg-amber-50 text-amber-700 border-amber-200";
    case "Low":
      return "bg-slate-100 text-slate-600 border-slate-200";
    default:
      return "bg-slate-100 text-slate-600 border-slate-200";
  }
}

export function getStatusBadge(status) {
  switch (status) {
    case "recovered":
      return { label: "Recovered", color: "bg-emerald-100 text-emerald-800 border-emerald-200" };
    case "in_recovery":
      return { label: "In Recovery", color: "bg-blue-100 text-blue-800 border-blue-200" };
    case "failed":
    default:
      return { label: "Failed", color: "bg-rose-50 text-rose-700 border-rose-200" };
  }
}

export function formatDate(isoString) {
  if (!isoString) return "N/A";
  const date = new Date(isoString);
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit"
  }).format(date);
}
