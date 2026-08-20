import React, { useState } from "react";
import { X, Play, CheckCircle2, AlertCircle, ArrowRight, RotateCcw } from "lucide-react";
import { formatINR, formatPercent, formatFailureReason } from "../utils/formatters";

export default function RecoverySimulationModal({ transaction, onClose, onConfirmSimulate }) {
  const [step, setStep] = useState("initial"); // 'initial' | 'analyzing' | 'attempting' | 'success'

  if (!transaction) return null;

  const { id, amount, recoveryProbability, estimatedRecovery, recommendedAction, failureReason, customer } = transaction;

  const handleStartSimulation = async () => {
    setStep("analyzing");
    
    setTimeout(() => {
      setStep("attempting");
      
      setTimeout(async () => {
        await onConfirmSimulate(id);
        setStep("success");
      }, 1000);
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-6 shadow-2xl relative space-y-4 animate-in fade-in zoom-in-95">
        {/* Sandbox Badge */}
        <div className="flex items-center justify-between">
          <span className="px-2.5 py-0.5 bg-amber-50 border border-amber-200 text-amber-700 text-[10px] font-bold rounded-full">
            Demo Simulation Sandbox
          </span>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-700">
            <X className="w-4 h-4" />
          </button>
        </div>

        {step === "initial" && (
          <div className="space-y-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Simulate Payment Recovery</h3>
              <p className="text-xs text-slate-500">Test AI automated recovery execution on transaction {id}</p>
            </div>

            {/* Before Metrics Card */}
            <div className="bg-slate-50 border border-slate-200/80 p-4 rounded-2xl space-y-2.5 text-xs">
              <div className="flex justify-between items-center pb-2 border-b border-slate-200/60">
                <span className="text-slate-500">Failed Payment</span>
                <span className="font-bold text-slate-900 text-sm">{formatINR(amount)}</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-slate-200/60">
                <span className="text-slate-500">AI Probability</span>
                <span className="font-bold text-blue-600">{formatPercent(recoveryProbability)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Expected Recovery</span>
                <span className="font-extrabold text-blue-700">{formatINR(estimatedRecovery)}</span>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-100 p-3 rounded-xl text-xs text-blue-800">
              Action: <strong className="font-bold">{recommendedAction}</strong>
            </div>

            <div className="flex space-x-2 pt-2">
              <button
                onClick={onClose}
                className="w-1/2 py-2 bg-slate-100 text-slate-700 font-semibold text-xs rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleStartSimulation}
                className="w-1/2 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-sm flex items-center justify-center space-x-1.5"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Simulate Recovery</span>
              </button>
            </div>
          </div>
        )}

        {(step === "analyzing" || step === "attempting") && (
          <div className="py-8 text-center space-y-4">
            <div className="w-12 h-12 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">
                {step === "analyzing" ? "Analyzing payment channel..." : "Executing smart recovery attempt..."}
              </h4>
              <div className="flex justify-center items-center space-x-2 mt-3 text-xs text-slate-500 font-medium">
                <span className={step === "analyzing" ? "text-blue-600 font-bold" : "text-slate-400"}>Analyzing</span>
                <ArrowRight className="w-3 h-3 text-slate-400" />
                <span className={step === "attempting" ? "text-blue-600 font-bold" : "text-slate-400"}>Recovery attempt</span>
                <ArrowRight className="w-3 h-3 text-slate-400" />
                <span className="text-slate-300">Payment recovered</span>
              </div>
            </div>
          </div>
        )}

        {step === "success" && (
          <div className="py-4 text-center space-y-4">
            <div className="w-12 h-12 bg-emerald-100 border border-emerald-200 rounded-full flex items-center justify-center mx-auto text-emerald-600">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider block">Payment Recovered</span>
              <h3 className="text-2xl font-black text-slate-900 mt-0.5">{formatINR(amount)}</h3>
              <p className="text-xs text-slate-500 mt-1">
                Dashboard metrics, recovered revenue, and recovery rate updated in real-time.
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-sm"
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
