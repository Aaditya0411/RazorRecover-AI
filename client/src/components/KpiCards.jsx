import React from "react";
import { AlertCircle, TrendingUp, DollarSign, ShieldAlert } from "lucide-react";
import { formatLakhs, formatPercent, formatINR } from "../utils/formatters";

export default function KpiCards({ summary = {}, isLoading = false }) {
  const {
    totalFailedRevenue = 0,
    estimatedRecoverableRevenue = 0,
    recoveryRate = 0,
    highPriorityCount = 0,
    recoveredRevenue = 0,
    totalRecoveredCount = 0
  } = summary;

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[1, 2, 3, 4].map(n => (
          <div key={n} className="bg-white border border-slate-200 rounded-2xl p-4 h-32 animate-pulse"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* 1. Failed Revenue */}
      <div className="fintech-card p-4 relative overflow-hidden flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500">Failed Revenue</span>
          <div className="p-1.5 bg-rose-50 text-rose-600 rounded-lg border border-rose-100">
            <AlertCircle className="w-3.5 h-3.5" />
          </div>
        </div>
        <div className="mt-2">
          <div className="text-xl font-bold text-slate-900 tracking-tight">
            {formatLakhs(totalFailedRevenue)}
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Gross uncollected revenue
          </p>
        </div>
      </div>

      {/* 2. Recoverable */}
      <div className="fintech-card p-4 relative overflow-hidden flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500">Recoverable</span>
          <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg border border-blue-100">
            <TrendingUp className="w-3.5 h-3.5" />
          </div>
        </div>
        <div className="mt-2">
          <div className="text-xl font-bold text-blue-600 tracking-tight">
            {formatLakhs(estimatedRecoverableRevenue)}
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5">
            High/Medium recovery potential
          </p>
        </div>
      </div>

      {/* 3. Recovery Rate */}
      <div className="fintech-card p-4 relative overflow-hidden flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500">Recovery Rate</span>
          <div className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg border border-emerald-100">
            <DollarSign className="w-3.5 h-3.5" />
          </div>
        </div>
        <div className="mt-2">
          <div className="text-xl font-bold text-emerald-600 tracking-tight">
            {formatPercent(recoveryRate)}
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5">
            {totalRecoveredCount > 0
              ? `${formatINR(recoveredRevenue)} recovered`
              : "Predicted conversion efficiency"}
          </p>
        </div>
      </div>

      {/* 4. High Priority */}
      <div className="fintech-card p-4 relative overflow-hidden flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500">High Priority</span>
          <div className="p-1.5 bg-amber-50 text-amber-600 rounded-lg border border-amber-100">
            <ShieldAlert className="w-3.5 h-3.5" />
          </div>
        </div>
        <div className="mt-2">
          <div className="text-xl font-bold text-amber-600 tracking-tight">
            {highPriorityCount}
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Probability score ≥ 70%
          </p>
        </div>
      </div>
    </div>
  );
}
