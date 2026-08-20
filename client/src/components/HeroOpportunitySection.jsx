import React from "react";
import { ArrowRight, TrendingUp, Sparkles } from "lucide-react";
import { formatLakhs, formatPercent } from "../utils/formatters";

export default function HeroOpportunitySection({ summary = {}, isLoading = false }) {
  const {
    totalFailedRevenue = 0,
    estimatedRecoverableRevenue = 0,
    recoveryRate = 0
  } = summary;

  if (isLoading) {
    return (
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm animate-pulse h-48 mb-6"></div>
    );
  }

  // Calculate SVG Circle Stroke Offset for clean Donut
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (recoveryRate / 100) * circumference;

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm mb-6 relative overflow-hidden">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Left Side: Massive Metric & Recovery Path */}
        <div className="space-y-3 max-w-xl">
          <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 bg-blue-50 border border-blue-100 rounded-full text-blue-700 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Recovery Pipeline Opportunity</span>
          </div>

          <div>
            <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              {formatLakhs(estimatedRecoverableRevenue)}
            </div>
            <p className="text-sm font-semibold text-slate-700 mt-0.5">
              Estimated recoverable revenue
            </p>
            <p className="text-xs text-slate-500 mt-1">
              <strong className="text-slate-800">{formatPercent(recoveryRate)}</strong> of failed revenue currently has an actionable recovery opportunity.
            </p>
          </div>

          {/* Visual Breakdown Path: ₹4.49L failed revenue → ₹3.78L potential recovery */}
          <div className="pt-2 flex items-center space-x-3 text-xs">
            <div className="px-3 py-1.5 bg-slate-100 rounded-xl border border-slate-200/80">
              <span className="text-slate-500 font-medium block text-[10px]">TOTAL FAILED</span>
              <span className="font-bold text-slate-800">{formatLakhs(totalFailedRevenue)}</span>
            </div>

            <ArrowRight className="w-4 h-4 text-slate-400 flex-shrink-0" />

            <div className="px-3 py-1.5 bg-blue-50 rounded-xl border border-blue-200">
              <span className="text-blue-600 font-medium block text-[10px]">POTENTIAL RECOVERY</span>
              <span className="font-bold text-blue-700">{formatLakhs(estimatedRecoverableRevenue)}</span>
            </div>
          </div>
        </div>

        {/* Right Side: Clean Donut Progress Focal Point */}
        <div className="flex items-center space-x-6 bg-slate-50/70 border border-slate-200/60 p-4 rounded-2xl">
          <div className="relative w-28 h-28 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r={radius}
                className="text-slate-200"
                strokeWidth="10"
                stroke="currentColor"
                fill="transparent"
              />
              <circle
                cx="50"
                cy="50"
                r={radius}
                className="text-blue-600 transition-all duration-1000 ease-out"
                strokeWidth="10"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                stroke="currentColor"
                fill="transparent"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-xl font-black text-slate-900 leading-none">
                {formatPercent(recoveryRate)}
              </span>
              <span className="text-[9px] font-semibold text-slate-500 uppercase tracking-tight mt-0.5">
                Yield
              </span>
            </div>
          </div>

          <div className="space-y-1">
            <h4 className="text-xs font-bold text-slate-900">Recovery Opportunity</h4>
            <p className="text-[11px] text-slate-500 leading-tight max-w-[140px]">
              Calculated dynamically via failure telemetry & customer trust signals.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
