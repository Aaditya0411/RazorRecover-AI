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
      return "bg-emerald-500/10 text-emerald-400 border-emerald-500/30";
    case "Medium":
      return "bg-amber-500/10 text-amber-400 border-amber-500/30";
    case "Low":
      return "bg-rose-500/10 text-rose-400 border-rose-500/30";
    default:
      return "bg-slate-500/10 text-slate-400 border-slate-500/30";
  }
}

export function getStatusBadge(status) {
  switch (status) {
    case "recovered":
      return { label: "Recovered", color: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40" };
    case "in_recovery":
      return { label: "In Recovery", color: "bg-indigo-500/20 text-indigo-300 border-indigo-500/40" };
    case "failed":
    default:
      return { label: "Failed", color: "bg-rose-500/20 text-rose-300 border-rose-500/40" };
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
