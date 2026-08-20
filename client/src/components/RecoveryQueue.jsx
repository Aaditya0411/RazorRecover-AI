import React from "react";
import { Search, Filter, ArrowUpDown, ChevronRight, Play, CheckCircle2 } from "lucide-react";
import { formatINR, formatPercent, formatFailureReason, getPriorityColor, getStatusBadge } from "../utils/formatters";

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
    { value: "all", label: "All Failure Reasons" },
    { value: "insufficient_funds", label: "Insufficient Funds" },
    { value: "bank_declined", label: "Bank Declined" },
    { value: "expired_card", label: "Expired Card" },
    { value: "network_error", label: "Network Error" },
    { value: "upi_timeout", label: "UPI Timeout" },
    { value: "authentication_failure", label: "Auth Failure" }
  ];

  const priorities = [
    { value: "all", label: "All Priorities" },
    { value: "High", label: "High Priority (≥70%)" },
    { value: "Medium", label: "Medium Priority (40-69%)" },
    { value: "Low", label: "Low Priority (<40%)" }
  ];

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("desc");
    }
  };

  return (
    <div className="glass-card rounded-2xl border border-slate-800 p-6 shadow-xl">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight flex items-center space-x-2">
            <span>Recovery Inventory Queue</span>
            <span className="px-2.5 py-0.5 text-xs bg-slate-800 text-slate-300 rounded-full border border-slate-700 font-normal">
              {transactions.length} Transactions
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Prioritized failed transaction inventory with AI probability scores and recovery actions.
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Search Box */}
          <div className="relative flex-1 sm:flex-none min-w-[220px]">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search TXN ID or Customer..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-900/80 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-500 transition-all"
            />
          </div>

          {/* Failure Reason Filter */}
          <div className="relative">
            <select
              value={selectedReason}
              onChange={(e) => setSelectedReason(e.target.value)}
              className="px-3 py-2 bg-slate-900/80 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-sky-500 transition-all cursor-pointer"
            >
              {failureReasons.map((r) => (
                <option key={r.value} value={r.value} className="bg-slate-900 text-slate-200">
                  {r.label}
                </option>
              ))}
            </select>
          </div>

          {/* Priority Filter */}
          <div className="relative">
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="px-3 py-2 bg-slate-900/80 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-sky-500 transition-all cursor-pointer"
            >
              {priorities.map((p) => (
                <option key={p.value} value={p.value} className="bg-slate-900 text-slate-200">
                  {p.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-800 text-xs font-semibold text-slate-400 uppercase tracking-wider bg-slate-950/40">
              <th className="py-3.5 px-4 rounded-l-xl">Transaction & Customer</th>
              <th
                onClick={() => handleSort("amount")}
                className="py-3.5 px-4 cursor-pointer hover:text-white transition-colors"
              >
                <div className="flex items-center space-x-1">
                  <span>Amount</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="py-3.5 px-4">Failure Reason</th>
              <th
                onClick={() => handleSort("recoveryProbability")}
                className="py-3.5 px-4 cursor-pointer hover:text-white transition-colors"
              >
                <div className="flex items-center space-x-1">
                  <span>AI Probability</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="py-3.5 px-4">Est. Recovery</th>
              <th className="py-3.5 px-4">Priority</th>
              <th className="py-3.5 px-4">Recommended Action</th>
              <th className="py-3.5 px-4 text-right rounded-r-xl">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-xs">
            {isLoading ? (
              <tr>
                <td colSpan="8" className="py-12 text-center text-slate-400">
                  <div className="flex justify-center items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-sky-500 border-t-transparent rounded-full animate-spin"></div>
                    <span>Loading payment transactions...</span>
                  </div>
                </td>
              </tr>
            ) : transactions.length === 0 ? (
              <tr>
                <td colSpan="8" className="py-12 text-center text-slate-400">
                  No matching transactions found in recovery queue.
                </td>
              </tr>
            ) : (
              transactions.map((txn) => {
                const statusBadge = getStatusBadge(txn.status);
                const isRecovered = txn.status === "recovered";

                return (
                  <tr
                    key={txn.id}
                    className="hover:bg-slate-800/30 transition-colors group cursor-pointer"
                    onClick={() => onSelectTransaction(txn)}
                  >
                    {/* Transaction & Customer */}
                    <td className="py-3.5 px-4">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-mono font-semibold text-slate-200 group-hover:text-sky-400 transition-colors">
                            {txn.id}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-medium border ${statusBadge.color}`}
                          >
                            {statusBadge.label}
                          </span>
                        </div>
                        <p className="text-slate-400 text-[11px] mt-0.5">
                          {txn.customer?.name} • <span className="text-slate-500">{txn.paymentMethod}</span>
                        </p>
                      </div>
                    </td>

                    {/* Amount */}
                    <td className="py-3.5 px-4 font-semibold text-slate-100">
                      {formatINR(txn.amount)}
                    </td>

                    {/* Failure Reason */}
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 text-[11px]">
                        {formatFailureReason(txn.failureReason)}
                      </span>
                    </td>

                    {/* AI Probability */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-12 bg-slate-800 h-2 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              txn.recoveryProbability >= 70
                                ? "bg-emerald-400"
                                : txn.recoveryProbability >= 40
                                ? "bg-amber-400"
                                : "bg-rose-400"
                            }`}
                            style={{ width: `${txn.recoveryProbability}%` }}
                          ></div>
                        </div>
                        <span className="font-bold text-slate-200">
                          {formatPercent(txn.recoveryProbability)}
                        </span>
                      </div>
                    </td>

                    {/* Estimated Recovery */}
                    <td className="py-3.5 px-4 font-semibold text-sky-400">
                      {formatINR(txn.estimatedRecovery)}
                    </td>

                    {/* Priority */}
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border ${getPriorityColor(
                          txn.priority
                        )}`}
                      >
                        {txn.priority}
                      </span>
                    </td>

                    {/* Recommended Action */}
                    <td className="py-3.5 px-4 text-slate-300 font-medium">
                      {txn.recommendedAction}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end space-x-2">
                        {!isRecovered ? (
                          <button
                            onClick={() => onSimulateRecovery(txn)}
                            className="flex items-center space-x-1 px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-lg transition-all text-[11px] font-semibold"
                            title="Simulate AI Recovery execution"
                          >
                            <Play className="w-3 h-3 fill-current" />
                            <span>Simulate</span>
                          </button>
                        ) : (
                          <span className="flex items-center space-x-1 text-emerald-400 text-[11px] font-medium px-2 py-1 bg-emerald-500/10 rounded-lg">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Recovered</span>
                          </span>
                        )}

                        <button
                          onClick={() => onSelectTransaction(txn)}
                          className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-all"
                          title="View complete transaction breakdown"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
