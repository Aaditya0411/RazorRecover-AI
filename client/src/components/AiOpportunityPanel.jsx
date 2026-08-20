import React from "react";
import { Sparkles, ArrowRight, Zap, RefreshCw, CreditCard } from "lucide-react";
import { formatINR, formatPercent } from "../utils/formatters";

export default function AiOpportunityPanel({ analytics = {} }) {
  const { failureReasonData = [] } = analytics;

  // Extract top 3 failure categories
  const networkItem = failureReasonData.find(d => d.rawReason === "network_error") || {
    recoverableRevenue: 48250,
    avgProbability: 92,
    reason: "Network Errors"
  };

  const bankItem = failureReasonData.find(d => d.rawReason === "bank_declined") || {
    recoverableRevenue: 71400,
    avgProbability: 76,
    reason: "Bank Declines"
  };

  const upiItem = failureReasonData.find(d => d.rawReason === "upi_timeout") || {
    recoverableRevenue: 32800,
    avgProbability: 88,
    reason: "UPI Timeouts"
  };

  const opportunities = [
    {
      id: "op-1",
      title: "Network Errors",
      recoverable: networkItem.recoverableRevenue || 48250,
      prob: networkItem.avgProbability || 92,
      action: "Immediate Smart Retry",
      icon: Zap,
      accent: "text-blue-600 bg-blue-50 border-blue-100"
    },
    {
      id: "op-2",
      title: "Bank Declines",
      recoverable: bankItem.recoverableRevenue || 71400,
      prob: bankItem.avgProbability || 76,
      action: "Offer Alternate Payment",
      icon: CreditCard,
      accent: "text-indigo-600 bg-indigo-50 border-indigo-100"
    },
    {
      id: "op-3",
      title: "UPI Timeouts",
      recoverable: upiItem.recoverableRevenue || 32800,
      prob: upiItem.avgProbability || 88,
      action: "Retry UPI Payment",
      icon: RefreshCw,
      accent: "text-emerald-600 bg-emerald-50 border-emerald-100"
    }
  ];

  return (
    <div className="mb-6 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-1.5">
          <Sparkles className="w-4 h-4 text-blue-600" />
          <span>AI Recovery Opportunities</span>
        </h3>
        <span className="text-[11px] text-slate-500 font-medium">Ranked by recoverable inventory value</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {opportunities.map((op) => {
          const Icon = op.icon;
          return (
            <div
              key={op.id}
              className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-slate-900 text-sm">{op.title}</span>
                  <div className={`p-1.5 rounded-lg border ${op.accent}`}>
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-baseline space-x-1">
                    <span className="text-lg font-extrabold text-slate-900">{formatINR(op.recoverable)}</span>
                    <span className="text-xs font-medium text-slate-500">recoverable</span>
                  </div>
                  <p className="text-xs font-semibold text-blue-600">
                    {formatPercent(op.prob)} average recovery probability
                  </p>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-600 font-medium">{op.action}</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-1 transition-transform group-hover:text-blue-600" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
