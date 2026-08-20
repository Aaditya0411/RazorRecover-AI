import React, { useState } from "react";
import { X, Play, CheckCircle2, AlertTriangle, ArrowRight, ShieldCheck, DollarSign, Sparkles } from "lucide-react";
import { formatINR, formatPercent, formatFailureReason } from "../utils/formatters";

export default function RecoverySimulationModal({ transaction, onClose, onConfirmSimulate }) {
  const [isExecuting, setIsExecuting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!transaction) return null;

  const { id, amount, recoveryProbability, estimatedRecovery, recommendedAction, failureReason, customer } = transaction;

  const handleSimulate = async () => {
    setIsExecuting(true);
    // Simulate short network delay for visual impact
    setTimeout(async () => {
      await onConfirmSimulate(id);
      setIsExecuting(false);
      setIsSuccess(true);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="glass-card border border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl relative overflow-hidden">
        {/* Top Warning Banner marking as Demo/Simulation */}
        <div className="bg-amber-500/10 border border-amber-500/20 text-amber-300 text-[11px] px-3 py-1.5 rounded-xl mb-4 flex items-center space-x-1.5 font-medium">
          <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />
          <span>Interactive Sandbox Demo — No actual bank/Razorpay charge will occur.</span>
        </div>

        {/* Modal Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20">
              <Play className="w-4 h-4 fill-current" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Revenue Recovery Simulation</h3>
              <p className="text-xs text-slate-400">Execute AI recommended recovery action on transaction</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {!isSuccess ? (
          <div className="space-y-4">
            {/* Transaction Metrics Comparison */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-3">
              <div className="flex justify-between items-center text-xs pb-2 border-b border-slate-800">
                <span className="text-slate-400">Transaction ID</span>
                <span className="font-mono font-bold text-white">{id}</span>
              </div>
              <div className="flex justify-between items-center text-xs pb-2 border-b border-slate-800">
                <span className="text-slate-400">Customer</span>
                <span className="font-semibold text-slate-200">{customer?.name || "Customer"}</span>
              </div>
              <div className="flex justify-between items-center text-xs pb-2 border-b border-slate-800">
                <span className="text-slate-400">Failure Reason</span>
                <span className="font-medium text-amber-400">{formatFailureReason(failureReason)}</span>
              </div>
              <div className="flex justify-between items-center text-xs pb-2 border-b border-slate-800">
                <span className="text-slate-400">Original Amount</span>
                <span className="font-bold text-white text-sm">{formatINR(amount)}</span>
              </div>
              <div className="flex justify-between items-center text-xs pb-2 border-b border-slate-800">
                <span className="text-slate-400">AI Recovery Probability</span>
                <span className="font-bold text-sky-400">{formatPercent(recoveryProbability)}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">Expected Recovery Value</span>
                <span className="font-bold text-emerald-400 text-sm">{formatINR(estimatedRecovery)}</span>
              </div>
            </div>

            {/* Recommended Action Summary */}
            <div className="bg-sky-950/30 border border-sky-500/20 rounded-xl p-3 text-xs">
              <span className="text-[11px] font-semibold text-sky-400 block mb-1">AUTOMATED ACTION TRIGGERED</span>
              <p className="text-slate-200 font-medium">"{recommendedAction}"</p>
            </div>

            {/* Simulation Action Buttons */}
            <div className="flex items-center space-x-3 pt-2">
              <button
                onClick={onClose}
                disabled={isExecuting}
                className="w-1/2 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl transition-all"
              >
                Cancel
              </button>

              <button
                onClick={handleSimulate}
                disabled={isExecuting}
                className="w-1/2 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-emerald-500/20 flex items-center justify-center space-x-2 transition-all"
              >
                {isExecuting ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Simulating...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Confirm & Recover</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-6 space-y-4">
            <div className="w-12 h-12 bg-emerald-500/20 border border-emerald-500/40 rounded-full flex items-center justify-center mx-auto text-emerald-400">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base font-bold text-white">Revenue Recovered!</h4>
              <p className="text-xs text-slate-300 mt-1">
                Successfully recovered <strong className="text-emerald-400">{formatINR(amount)}</strong> into your merchant balance.
              </p>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-slate-400">
              Dashboard KPIs, recovery rate, and total recovered revenue have been updated in real-time.
            </div>
            <button
              onClick={onClose}
              className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-xl transition-all"
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
