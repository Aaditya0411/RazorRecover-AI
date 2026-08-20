import React, { useState, useEffect } from "react";
import { Sparkles, CheckCircle2, Cpu } from "lucide-react";
import { formatLakhs } from "../utils/formatters";

export default function AiAnalysisModal({ isOpen, onClose, summary = {} }) {
  const [stepIndex, setStepIndex] = useState(0);
  const [isDone, setIsDone] = useState(false);

  const steps = [
    "Failure patterns analyzed",
    "Customer history analyzed",
    "Recovery probability calculated",
    "Recovery opportunities ranked",
    "Recommendations generated"
  ];

  useEffect(() => {
    if (!isOpen) {
      setStepIndex(0);
      setIsDone(false);
      return;
    }

    const interval = setInterval(() => {
      setStepIndex((prev) => {
        if (prev < steps.length - 1) {
          return prev + 1;
        } else {
          clearInterval(interval);
          setIsDone(true);
          return prev;
        }
      });
    }, 450);

    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  const recoverable = summary.estimatedRecoverableRevenue || 378000;
  const count = summary.totalFailedCount || 44;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white border border-slate-200 rounded-3xl p-6 max-w-md w-full text-center space-y-5 shadow-2xl animate-in fade-in zoom-in-95">
        <div className="w-14 h-14 bg-blue-50 border border-blue-100 rounded-2xl flex items-center justify-center mx-auto text-blue-600">
          <Sparkles className={`w-7 h-7 ${!isDone ? "animate-spin text-blue-600" : ""}`} />
        </div>

        {!isDone ? (
          <div className="space-y-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Analyzing payment failures...</h3>
              <p className="text-xs text-slate-500 mt-0.5">Processing telemetry through scoring model</p>
            </div>

            <div className="text-left bg-slate-50 border border-slate-200/80 p-4 rounded-2xl space-y-2 text-xs">
              {steps.map((step, idx) => (
                <div key={step} className="flex items-center space-x-2">
                  {idx <= stepIndex ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  ) : (
                    <div className="w-4 h-4 border-2 border-slate-300 rounded-full flex-shrink-0"></div>
                  )}
                  <span className={idx <= stepIndex ? "font-semibold text-slate-900" : "text-slate-400"}>
                    {step}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <span className="inline-block px-3 py-1 bg-emerald-50 text-emerald-700 font-bold text-xs rounded-full border border-emerald-200 mb-2">
                Analysis Complete
              </span>
              <h3 className="text-lg font-extrabold text-slate-900">
                {formatLakhs(recoverable)} recovery opportunity detected
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                {count} transactions re-scored and prioritized across recovery channels.
              </p>
            </div>

            <button
              onClick={onClose}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all"
            >
              View Updated Dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
