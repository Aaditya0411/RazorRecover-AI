import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid
} from "recharts";
import { formatINR, formatPercent, formatLakhs } from "../utils/formatters";
import { BarChart3, TrendingUp, AlertTriangle, Layers } from "lucide-react";

export default function AnalyticsView({ analytics = {}, summary = {}, isLoading = false }) {
  const { failureReasonData = [], paymentMethodData = [] } = analytics;
  const { estimatedRecoverableRevenue = 0, recoveryRate = 0, recoveredRevenue = 0 } = summary;

  if (isLoading) {
    return <div className="p-8 text-center text-slate-400">Loading analytics...</div>;
  }

  // Custom Tooltip for INR Currency
  const CustomCurrencyTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border border-slate-200 p-3 rounded-xl shadow-lg text-xs">
          <p className="font-bold text-slate-900 mb-1">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }} className="flex justify-between space-x-4 font-semibold">
              <span>{entry.name}:</span>
              <span>{formatINR(entry.value)}</span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center space-x-2">
          <BarChart3 className="w-5 h-5 text-blue-600" />
          <span>Revenue Recovery Analytics</span>
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Performance telemetry and channel-level recovery opportunities.
        </p>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm">
          <span className="text-xs font-semibold text-slate-500">Recoverable Revenue</span>
          <div className="text-2xl font-extrabold text-blue-600 mt-1">{formatLakhs(estimatedRecoverableRevenue)}</div>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm">
          <span className="text-xs font-semibold text-slate-500">Recovery Rate</span>
          <div className="text-2xl font-extrabold text-emerald-600 mt-1">{formatPercent(recoveryRate)}</div>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm">
          <span className="text-xs font-semibold text-slate-500">Recovered Revenue</span>
          <div className="text-2xl font-extrabold text-slate-900 mt-1">{formatINR(recoveredRevenue)}</div>
        </div>
      </div>

      {/* Two Strong Visualizations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 1. Recoverable Revenue by Failure Type */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center space-x-2">
            <TrendingUp className="w-4 h-4 text-blue-600" />
            <span>Recoverable Revenue by Failure Type</span>
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={failureReasonData} margin={{ top: 10, right: 10, left: 10, bottom: 25 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="reason" stroke="#64748b" fontSize={10} angle={-15} textAnchor="end" />
                <YAxis stroke="#64748b" fontSize={10} tickFormatter={(val) => `₹${val / 1000}k`} />
                <Tooltip content={<CustomCurrencyTooltip />} />
                <Bar dataKey="recoverableRevenue" name="Recoverable Revenue" fill="#2563eb" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 2. Recovery Probability by Payment Method */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center space-x-2">
            <Layers className="w-4 h-4 text-indigo-600" />
            <span>Recovery Probability by Payment Method</span>
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={paymentMethodData} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="method" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} domain={[0, 100]} tickFormatter={(val) => `${val}%`} />
                <Tooltip formatter={(val) => [`${val}%`, "Avg Probability"]} />
                <Bar dataKey="avgProbability" name="Avg Recovery Probability" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Failure Analysis Concise Insights */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm space-y-3">
        <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
          <AlertTriangle className="w-4 h-4 text-amber-500" />
          <span>Failure Analysis Insights</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="bg-slate-50 border border-slate-200/80 p-3 rounded-xl">
            <span className="font-bold text-blue-700 block mb-1">Network Errors</span>
            <p className="text-slate-600">Network errors generate the highest recovery rate with low effort.</p>
          </div>
          <div className="bg-slate-50 border border-slate-200/80 p-3 rounded-xl">
            <span className="font-bold text-emerald-700 block mb-1">Bank Declines</span>
            <p className="text-slate-600">Bank declines contribute the largest recoverable revenue pool (₹71.4k).</p>
          </div>
          <div className="bg-slate-50 border border-slate-200/80 p-3 rounded-xl">
            <span className="font-bold text-slate-700 block mb-1">Expired Cards</span>
            <p className="text-slate-600">Expired cards have low automatic recovery probability and need card updates.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
