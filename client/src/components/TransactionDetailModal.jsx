import React from "react";
import { X, Sparkles, ArrowRight, ShieldCheck, Clock, CheckCircle2, RotateCcw } from "lucide-react";
import { formatINR, formatPercent, formatFailureReason, getPriorityColor, formatDate } from "../utils/formatters";

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
    status,
    recoveryProbability,
    estimatedRecovery,
    recommendedAction,
    priority,
    aiExplanation,
    customer = {}
  } = transaction;

  const isRecovered = status === "recovered";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-xl w-full p-6 shadow-2xl relative space-y-5 animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center space-x-3">
            <span className="font-mono text-lg font-extrabold text-slate-900">{id}</span>
            <span className="font-bold text-slate-900 text-base">{formatINR(amount)}</span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
              {formatFailureReason(failureReason)}
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Recovery Score Badge */}
        <div className="flex items-center justify-between bg-blue-50/70 border border-blue-100 p-3.5 rounded-2xl">
          <div>
            <span className="text-[11px] font-semibold text-blue-600 uppercase tracking-wider block">Recovery Score</span>
            <span className="text-2xl font-black text-blue-700">{formatPercent(recoveryProbability)}</span>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getPriorityColor(priority)}`}>
            {priority} probability
          </span>
        </div>

        {/* Why? Explanation Section */}
        <div className="bg-slate-50 border border-slate-200/80 p-4 rounded-2xl space-y-1.5">
          <h4 className="text-xs font-bold text-slate-900 flex items-center space-x-1.5">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Why?</span>
          </h4>
          <p className="text-xs text-slate-700 leading-relaxed font-medium">
            "{aiExplanation}"
          </p>
        </div>

        {/* Recovery Opportunity Comparison */}
        <div className="bg-slate-50 border border-slate-200/80 p-4 rounded-2xl space-y-2">
          <h4 className="text-xs font-bold text-slate-900">Recovery Opportunity</h4>
          <div className="flex items-center justify-between text-xs">
            <div>
              <span className="text-slate-500 block text-[11px]">Original payment</span>
              <span className="font-bold text-slate-900 text-sm">{formatINR(amount)}</span>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400" />
            <div className="text-right">
              <span className="text-blue-600 font-semibold block text-[11px]">Expected recovery</span>
              <span className="font-extrabold text-blue-700 text-sm">{formatINR(estimatedRecovery)}</span>
            </div>
          </div>
        </div>

        {/* Recommended Action */}
        <div className="bg-emerald-50/70 border border-emerald-100 p-3.5 rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block">Recommended Action</span>
            <span className="font-extrabold text-emerald-900 text-sm">{recommendedAction}</span>
          </div>
          <span className="px-2.5 py-1 bg-emerald-600 text-white rounded-lg text-xs font-semibold">
            Ready
          </span>
        </div>

        {/* Customer Payment History */}
        <div className="bg-slate-50 border border-slate-200/80 p-4 rounded-2xl space-y-2">
          <h4 className="text-xs font-bold text-slate-900 flex items-center space-x-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-slate-600" />
            <span>Customer Payment History ({customer.name || "Customer"})</span>
          </h4>
          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="bg-white p-2 rounded-xl border border-slate-200">
              <span className="text-slate-500 text-[10px] block">Successful</span>
              <span className="font-bold text-slate-900">{previousSuccessfulPayments}</span>
            </div>
            <div className="bg-white p-2 rounded-xl border border-slate-200">
              <span className="text-slate-500 text-[10px] block">Failed Attempts</span>
              <span className="font-bold text-slate-900">{retryCount + 1}</span>
            </div>
            <div className="bg-white p-2 rounded-xl border border-slate-200">
              <span className="text-slate-500 text-[10px] block">Success Rate</span>
              <span className="font-bold text-blue-600">{formatPercent(customerSuccessRate * 100)}</span>
            </div>
          </div>
        </div>

        {/* Recovery Timeline */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold text-slate-900 flex items-center space-x-1.5">
            <Clock className="w-3.5 h-3.5 text-slate-500" />
            <span>Recovery Timeline</span>
          </h4>
          <div className="flex items-center justify-between text-[11px] text-slate-600 bg-slate-100 p-2.5 rounded-xl">
            <span>Payment failed</span>
            <ArrowRight className="w-3 h-3 text-slate-400" />
            <span>AI analyzed</span>
            <ArrowRight className="w-3 h-3 text-slate-400" />
            <span>Action recommended</span>
            <ArrowRight className="w-3 h-3 text-slate-400" />
            <span className="font-semibold text-blue-600">Smart retry</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 flex items-center justify-between border-t border-slate-100">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-all"
          >
            Close
          </button>

          {!isRecovered ? (
            <button
              onClick={() => {
                onSimulateRecovery(transaction);
                onClose();
              }}
              className="flex items-center space-x-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Simulate Recovery</span>
            </button>
          ) : (
            <span className="flex items-center space-x-1 text-emerald-700 text-xs font-bold px-3 py-1.5 bg-emerald-50 rounded-xl border border-emerald-200">
              <CheckCircle2 className="w-4 h-4" />
              <span>Payment Recovered</span>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
