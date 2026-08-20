import React from "react";
import { AlertCircle, TrendingUp, DollarSign, ShieldAlert, CheckCircle2 } from "lucide-react";
import { formatINR, formatPercent } from "../utils/formatters";

export default function KpiCards({ summary = {}, isLoading = false }) {
  const {
    totalFailedCount = 0,
    totalFailedRevenue = 0,
    estimatedRecoverableRevenue = 0,
    highPriorityCount = 0,
    recoveryRate = 0,
    recoveredRevenue = 0,
    totalRecoveredCount = 0
  } = summary;

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[1, 2, 3, 4].map(n => (
          <div key={n} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 animate-pulse h-32"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* 1. Total Failed Revenue */}
      <div className="glass-card glass-card-hover rounded-2xl p-5 relative overflow-hidden group">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-400">Total Failed Revenue</span>
          <div className="p-2 bg-rose-500/10 text-rose-400 rounded-xl border border-rose-500/20">
            <AlertCircle className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-2xl font-bold text-white tracking-tight">
            {formatINR(totalFailedRevenue)}
          </div>
          <p className="text-xs text-slate-400 mt-1 flex items-center space-x-1">
            <span>{totalFailedCount} failed transactions</span>
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-rose-500 to-amber-500"></div>
      </div>

      {/* 2. Estimated Recoverable Revenue */}
      <div className="glass-card glass-card-hover rounded-2xl p-5 relative overflow-hidden group">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-400">Estimated Recoverable</span>
          <div className="p-2 bg-sky-500/10 text-sky-400 rounded-xl border border-sky-500/20">
            <TrendingUp className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-2xl font-bold text-sky-400 tracking-tight">
            {formatINR(estimatedRecoverableRevenue)}
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Predicted by AI recovery scoring engine
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-sky-500 to-indigo-500"></div>
      </div>

      {/* 3. Recovery Rate */}
      <div className="glass-card glass-card-hover rounded-2xl p-5 relative overflow-hidden group">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-400">Recovery Rate</span>
          <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20">
            <DollarSign className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-2xl font-bold text-emerald-400 tracking-tight">
            {formatPercent(recoveryRate)}
          </div>
          <p className="text-xs text-slate-400 mt-1 flex items-center space-x-1">
            {totalRecoveredCount > 0 && (
              <span className="text-emerald-400 font-medium">
                {formatINR(recoveredRevenue)} already recovered ({totalRecoveredCount})
              </span>
            )}
            {totalRecoveredCount === 0 && <span>Expected conversion efficiency</span>}
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-500"></div>
      </div>

      {/* 4. High Priority Cases */}
      <div className="glass-card glass-card-hover rounded-2xl p-5 relative overflow-hidden group">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-400">High Priority Cases</span>
          <div className="p-2 bg-amber-500/10 text-amber-400 rounded-xl border border-amber-500/20">
            <ShieldAlert className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-2xl font-bold text-amber-400 tracking-tight">
            {highPriorityCount}
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Recovery probability ≥ 70%
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 to-rose-500"></div>
      </div>
    </div>
  );
}
