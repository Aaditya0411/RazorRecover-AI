import React from "react";
import { X, User, CreditCard, Clock, AlertTriangle, Cpu, TrendingUp, CheckCircle, RotateCcw, ArrowRight, ShieldCheck, DollarSign } from "lucide-react";
import { formatINR, formatPercent, formatFailureReason, getPriorityColor, formatDate, getStatusBadge } from "../utils/formatters";

export default function TransactionDetailModal({ transaction, onClose, onSimulateRecovery }) {
  if (!transaction) return null;

  const {
    id,
    amount,
    paymentMethod,
    failureReason,
    retryCount,
    customerSuccessRate,
    previousSuccessfulPayments,
    transactionAge,
    timestamp,
    status,
    recoveryProbability,
    estimatedRecovery,
    recommendedAction,
    priority,
    aiExplanation,
    scoreBreakdown = {},
    customer = {}
  } = transaction;

  const isRecovered = status === "recovered";
  const statusBadge = getStatusBadge(status);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="glass-card border border-slate-800 rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative">
        {/* Modal Header */}
        <div className="sticky top-0 bg-slate-900/95 backdrop-blur-md px-6 py-4 border-b border-slate-800 flex items-center justify-between z-10">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-sky-500/10 text-sky-400 rounded-xl border border-sky-500/20">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-mono text-lg font-bold text-white">{id}</h3>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusBadge.color}`}>
                  {statusBadge.label}
                </span>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getPriorityColor(priority)}`}>
                  {priority} Priority
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Created: {formatDate(timestamp)} ({transactionAge.toFixed(1)} hrs ago)
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          {/* Top Key Metrics Banner */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4">
              <span className="text-xs text-slate-400 font-medium">Failed Transaction Amount</span>
              <div className="text-2xl font-bold text-white mt-1">{formatINR(amount)}</div>
              <span className="text-[11px] text-slate-500">Method: {paymentMethod}</span>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4">
              <span className="text-xs text-slate-400 font-medium">AI Recovery Probability</span>
              <div className="text-2xl font-bold text-sky-400 mt-1">{formatPercent(recoveryProbability)}</div>
              <span className="text-[11px] text-slate-500">Deterministic Score</span>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4">
              <span className="text-xs text-slate-400 font-medium">Estimated Recoverable</span>
              <div className="text-2xl font-bold text-emerald-400 mt-1">{formatINR(estimatedRecovery)}</div>
              <span className="text-[11px] text-slate-500">amount × probability</span>
            </div>
          </div>

          {/* AI Explanation & Recommendation Panel */}
          <div className="bg-gradient-to-br from-sky-950/40 to-indigo-950/40 border border-sky-500/20 rounded-2xl p-5 relative overflow-hidden">
            <div className="flex items-center space-x-2 text-sky-400 mb-2">
              <Cpu className="w-5 h-5" />
              <h4 className="font-bold text-sm text-white">Explainable AI Analysis & Recommended Action</h4>
            </div>

            <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-400">RECOMMENDED ACTION</span>
                <span className="text-xs font-bold text-emerald-400 px-2 py-0.5 bg-emerald-500/10 rounded-md border border-emerald-500/20">
                  {recommendedAction}
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed italic">
                "{aiExplanation}"
              </p>
            </div>

            {/* Score Factor Breakdown */}
            <div className="space-y-2">
              <span className="text-xs font-semibold text-slate-400">AI Scoring Factors Breakdown</span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                <div className="bg-slate-900/90 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-[11px] text-slate-400 block">Base Failure Score</span>
                  <span className="font-semibold text-slate-200">{scoreBreakdown.baseScore || 0} pts</span>
                </div>
                <div className="bg-slate-900/90 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-[11px] text-slate-400 block">Customer Trust Bonus</span>
                  <span className="font-semibold text-emerald-400">+{scoreBreakdown.customerBonus || 0} pts</span>
                </div>
                <div className="bg-slate-900/90 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-[11px] text-slate-400 block">Retry Penalty</span>
                  <span className="font-semibold text-rose-400">-{scoreBreakdown.retryPenalty || 0} pts</span>
                </div>
                <div className="bg-slate-900/90 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-[11px] text-slate-400 block">Age Decay Factor</span>
                  <span className={`font-semibold ${scoreBreakdown.ageFactor >= 0 ? "text-emerald-400" : "text-amber-400"}`}>
                    {scoreBreakdown.ageFactor >= 0 ? `+${scoreBreakdown.ageFactor}` : scoreBreakdown.ageFactor} pts
                  </span>
                </div>
                <div className="bg-slate-900/90 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-[11px] text-slate-400 block">Method Reliability</span>
                  <span className="font-semibold text-sky-400">
                    {scoreBreakdown.methodFactor >= 0 ? `+${scoreBreakdown.methodFactor}` : scoreBreakdown.methodFactor} pts
                  </span>
                </div>
                <div className="bg-slate-900/90 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-[11px] text-slate-400 block">Value Factor</span>
                  <span className="font-semibold text-indigo-400">+{scoreBreakdown.amountFactor || 0} pts</span>
                </div>
              </div>
            </div>
          </div>

          {/* Customer Profile & Payment History */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4">
              <div className="flex items-center space-x-2 text-slate-300 font-semibold text-xs mb-3">
                <User className="w-4 h-4 text-sky-400" />
                <span>Customer Profile</span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">Name</span>
                  <span className="font-medium text-slate-200">{customer.name || "N/A"}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">Email</span>
                  <span className="font-medium text-slate-200">{customer.email || "N/A"}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-400">Tier</span>
                  <span className="font-semibold text-amber-400">{customer.tier || "Standard"}</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4">
              <div className="flex items-center space-x-2 text-slate-300 font-semibold text-xs mb-3">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Historical Payment Signals</span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">Past Successful Payments</span>
                  <span className="font-semibold text-emerald-400">{previousSuccessfulPayments} payments</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">Historical Completion Rate</span>
                  <span className="font-semibold text-sky-400">{formatPercent(customerSuccessRate * 100)}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-400">Previous Retry Count</span>
                  <span className="font-semibold text-amber-400">{retryCount} retries</span>
                </div>
              </div>
            </div>
          </div>

          {/* Failure & Recovery Timeline */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4">
            <div className="flex items-center space-x-2 text-slate-300 font-semibold text-xs mb-4">
              <Clock className="w-4 h-4 text-indigo-400" />
              <span>Recovery Timeline & Lifecycle</span>
            </div>

            <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
              {/* Event 1: Payment Attempt */}
              <div className="relative">
                <div className="absolute -left-6 top-0 w-4 h-4 rounded-full bg-rose-500/20 border-2 border-rose-500 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-rose-500"></div>
                </div>
                <div>
                  <span className="text-xs font-semibold text-slate-200 block">Initial Payment Attempt Failed</span>
                  <p className="text-[11px] text-slate-400">
                    Reason: {formatFailureReason(failureReason)} via {paymentMethod} • {formatDate(timestamp)}
                  </p>
                </div>
              </div>

              {/* Event 2: AI Analysis */}
              <div className="relative">
                <div className="absolute -left-6 top-0 w-4 h-4 rounded-full bg-sky-500/20 border-2 border-sky-500 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-sky-500"></div>
                </div>
                <div>
                  <span className="text-xs font-semibold text-slate-200 block">Explainable AI Analysis Executed</span>
                  <p className="text-[11px] text-slate-400">
                    Assigned Priority: <strong className="text-sky-400">{priority}</strong> • Predicted Probability: <strong className="text-sky-400">{recoveryProbability}%</strong>
                  </p>
                </div>
              </div>

              {/* Event 3: Current Status */}
              <div className="relative">
                <div className={`absolute -left-6 top-0 w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                  isRecovered ? "bg-emerald-500/20 border-emerald-500" : "bg-amber-500/20 border-amber-500"
                }`}>
                  <div className={`w-1.5 h-1.5 rounded-full ${isRecovered ? "bg-emerald-500" : "bg-amber-500"}`}></div>
                </div>
                <div>
                  <span className="text-xs font-semibold text-slate-200 block">
                    {isRecovered ? "Revenue Successfully Recovered" : `Action Ready: ${recommendedAction}`}
                  </span>
                  <p className="text-[11px] text-slate-400">
                    {isRecovered ? "Transaction status updated to Recovered." : "Awaiting merchant or automated engine execution."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="sticky bottom-0 bg-slate-900/95 backdrop-blur-md px-6 py-4 border-t border-slate-800 flex items-center justify-between z-10">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl transition-all"
          >
            Close
          </button>

          {!isRecovered && (
            <button
              onClick={() => {
                onSimulateRecovery(transaction);
                onClose();
              }}
              className="flex items-center space-x-2 px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-emerald-500/20 transition-all hover:scale-[1.02]"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Simulate Recovery ({formatINR(amount)})</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
