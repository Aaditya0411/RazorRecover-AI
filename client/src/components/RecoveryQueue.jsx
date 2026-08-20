import React from "react";
import { Search, ChevronRight, Eye, CheckCircle2 } from "lucide-react";
import { formatINR, formatPercent, formatFailureReason, getStatusBadge } from "../utils/formatters";

export default function RecoveryQueue({
  transactions = [],
  isLoading = false,
  searchTerm = "",
  setSearchTerm,
  selectedReason = "all",
  setSelectedReason,
  selectedPriority = "all",
  setSelectedPriority,
  sortBy = "recoveryProbability",
  setSortBy,
  sortOrder = "desc",
  setSortOrder,
  onSelectTransaction,
  onSimulateRecovery
}) {
  const failureReasons = [
    { value: "all", label: "All Failures" },
    { value: "insufficient_funds", label: "Insufficient Funds" },
    { value: "bank_declined", label: "Bank Declined" },
    { value: "expired_card", label: "Expired Card" },
    { value: "network_error", label: "Network Error" },
    { value: "upi_timeout", label: "UPI Timeout" },
    { value: "authentication_failure", label: "Auth Failure" }
  ];

  const priorities = [
    { value: "all", label: "All Priorities" },
    { value: "High", label: "High Probability (≥70%)" },
    { value: "Medium", label: "Medium Probability (40-69%)" },
    { value: "Low", label: "Low Probability (<40%)" }
  ];

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm mb-6">
      {/* Header & Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-base font-bold text-slate-900 tracking-tight flex items-center space-x-2">
            <span>Recovery Queue</span>
            <span className="px-2 py-0.5 text-xs bg-slate-100 text-slate-600 rounded-full font-medium border border-slate-200">
              {transactions.length}
            </span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Prioritized payment failures ranked by expected recovery value.
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Search Box */}
          <div className="relative flex-1 sm:flex-none min-w-[200px]">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search TXN ID or customer..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
            />
          </div>

          {/* Failure Filter */}
          <select
            value={selectedReason}
            onChange={(e) => setSelectedReason(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:border-blue-500 cursor-pointer font-medium"
          >
            {failureReasons.map((r) => (
              <option key={r.value} value={r.value}>
                {r.label}
              </option>
            ))}
          </select>

          {/* Priority Filter */}
          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:border-blue-500 cursor-pointer font-medium"
          >
            {priorities.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 text-[11px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50/50">
              <th className="py-3 px-4 rounded-l-xl">Transaction</th>
              <th className="py-3 px-4">Amount</th>
              <th className="py-3 px-4">Failure</th>
              <th className="py-3 px-4">Recovery Probability</th>
              <th className="py-3 px-4">Expected Recovery</th>
              <th className="py-3 px-4 text-right rounded-r-xl">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {isLoading ? (
              <tr>
                <td colSpan="6" className="py-8 text-center text-slate-400">
                  Loading recovery queue...
                </td>
              </tr>
            ) : transactions.length === 0 ? (
              <tr>
                <td colSpan="6" className="py-8 text-center text-slate-400">
                  No matching transactions in queue.
                </td>
              </tr>
            ) : (
              transactions.map((txn) => {
                const isRecovered = txn.status === "recovered";
                const prob = txn.recoveryProbability || 0;

                return (
                  <tr
                    key={txn.id}
                    onClick={() => onSelectTransaction(txn)}
                    className="hover:bg-blue-50/40 transition-colors group cursor-pointer"
                  >
                    {/* Transaction & Customer */}
                    <td className="py-3.5 px-4">
                      <div>
                        <span className="font-mono font-bold text-slate-900 group-hover:text-blue-600 transition-colors block">
                          {txn.id}
                        </span>
                        <span className="text-slate-500 text-[11px]">
                          {txn.customer?.name} • {txn.paymentMethod}
                        </span>
                      </div>
                    </td>

                    {/* Amount */}
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      {formatINR(txn.amount)}
                    </td>

                    {/* Failure */}
                    <td className="py-3.5 px-4">
                      <span className="inline-block px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px] font-medium border border-slate-200">
                        {formatFailureReason(txn.failureReason)}
                      </span>
                    </td>

                    {/* Recovery Probability Indicator */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-20 bg-slate-100 h-2 rounded-full overflow-hidden border border-slate-200">
                          <div
                            className={`h-full rounded-full ${
                              prob >= 70
                                ? "bg-emerald-500"
                                : prob >= 40
                                ? "bg-amber-500"
                                : "bg-slate-400"
                            }`}
                            style={{ width: `${prob}%` }}
                          ></div>
                        </div>
                        <span className="font-bold text-slate-800">
                          {formatPercent(prob)}
                        </span>
                      </div>
                    </td>

                    {/* Expected Recovery */}
                    <td className="py-3.5 px-4 font-extrabold text-blue-700">
                      {formatINR(txn.estimatedRecovery)}
                    </td>

                    {/* Action */}
                    <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end space-x-2">
                        {isRecovered ? (
                          <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                            Recovered
                          </span>
                        ) : (
                          <button
                            onClick={() => onSelectTransaction(txn)}
                            className="px-3 py-1 bg-slate-100 hover:bg-blue-600 hover:text-white text-slate-700 font-semibold rounded-lg text-xs transition-all border border-slate-200 hover:border-blue-600 flex items-center space-x-1"
                          >
                            <Eye className="w-3 h-3" />
                            <span>View</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Responsive Cards View */}
      <div className="sm:hidden space-y-3">
        {transactions.map((txn) => (
          <div
            key={txn.id}
            onClick={() => onSelectTransaction(txn)}
            className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 cursor-pointer"
          >
            <div className="flex justify-between items-center">
              <span className="font-mono font-bold text-slate-900">{txn.id}</span>
              <span className="font-bold text-slate-900">{formatINR(txn.amount)}</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-500">{txn.customer?.name}</span>
              <span className="font-semibold text-blue-600">{formatPercent(txn.recoveryProbability)} Prob</span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-slate-200 text-xs">
              <span className="text-slate-600">Est. {formatINR(txn.estimatedRecovery)}</span>
              <span className="text-blue-600 font-semibold flex items-center space-x-1">
                <span>View Details</span>
                <ChevronRight className="w-3 h-3" />
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
