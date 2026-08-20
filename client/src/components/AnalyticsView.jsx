import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
  AreaChart,
  Area
} from "recharts";
import { formatINR, formatPercent } from "../utils/formatters";
import { BarChart3, PieChart as PieIcon, TrendingUp, Layers } from "lucide-react";

const COLORS = ["#0284c7", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"];

export default function AnalyticsView({ analytics = {}, isLoading = false }) {
  const {
    failureReasonData = [],
    paymentMethodData = [],
    probabilityBracketData = [],
    priorityDistribution = []
  } = analytics;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl h-80 animate-pulse"></div>
          <div className="bg-slate-900 border border-slate-800 rounded-2xl h-80 animate-pulse"></div>
        </div>
      </div>
    );
  }

  // Custom Tooltip for INR Currency
  const CustomCurrencyTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 border border-slate-700 p-3 rounded-xl shadow-xl text-xs">
          <p className="font-bold text-slate-200 mb-1">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }} className="flex justify-between space-x-4">
              <span>{entry.name}:</span>
              <span className="font-semibold">{formatINR(entry.value)}</span>
            </p>
          ))}
        </div>
      );
    };
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div>
        <h2 className="text-xl font-bold text-white tracking-tight flex items-center space-x-2">
          <BarChart3 className="w-5 h-5 text-sky-400" />
          <span>Payment Recovery Intelligence Analytics</span>
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Deep-dive telemetry on failure reasons, recoverable revenue distribution, and payment method performance.
        </p>
      </div>

      {/* Grid 1: Revenue by Failure Type (Bar Chart) & Failure Reason Distribution (Pie Chart) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue by Failure Type */}
        <div className="glass-card rounded-2xl border border-slate-800 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <TrendingUp className="w-4 h-4 text-sky-400" />
              <span>Failed Revenue vs Estimated Recoverable</span>
            </h3>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={failureReasonData} margin={{ top: 10, right: 10, left: 10, bottom: 25 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="reason" stroke="#64748b" fontSize={10} interval={0} angle={-15} textAnchor="end" />
                <YAxis stroke="#64748b" fontSize={10} tickFormatter={(val) => `₹${val / 1000}k`} />
                <Tooltip content={<CustomCurrencyTooltip />} />
                <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "10px" }} />
                <Bar dataKey="totalRevenue" name="Total Failed Revenue" fill="#334155" radius={[4, 4, 0, 0]} />
                <Bar dataKey="recoverableRevenue" name="Estimated Recoverable" fill="#0284c7" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Failure Reason Volume Distribution (Pie Chart) */}
        <div className="glass-card rounded-2xl border border-slate-800 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <PieIcon className="w-4 h-4 text-emerald-400" />
              <span>Failure Reason Share</span>
            </h3>
          </div>
          <div className="h-72 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={failureReasonData}
                  dataKey="count"
                  nameKey="reason"
                  cx="50%"
                  cy="50%"
                  outerRadius={95}
                  innerRadius={50}
                  paddingAngle={3}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {failureReasonData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, name) => [`${value} transactions`, name]}
                  contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", borderRadius: "12px", fontSize: "12px" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Grid 2: Recovery Opportunities by Payment Method & AI Score Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recovery Opportunities by Payment Method */}
        <div className="glass-card rounded-2xl border border-slate-800 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <Layers className="w-4 h-4 text-amber-400" />
              <span>Recovery Opportunities by Payment Method</span>
            </h3>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={paymentMethodData} layout="vertical" margin={{ top: 10, right: 20, left: 20, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis type="number" stroke="#64748b" fontSize={10} tickFormatter={(val) => `₹${val / 1000}k`} />
                <YAxis dataKey="method" type="category" stroke="#64748b" fontSize={11} />
                <Tooltip content={<CustomCurrencyTooltip />} />
                <Legend wrapperStyle={{ fontSize: "11px" }} />
                <Bar dataKey="totalAmount" name="Total Volume" fill="#1e293b" radius={[0, 4, 4, 0]} />
                <Bar dataKey="recoverableAmount" name="Recoverable Revenue" fill="#10b981" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recovery Probability Distribution (Histogram / Bracket Chart) */}
        <div className="glass-card rounded-2xl border border-slate-800 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <TrendingUp className="w-4 h-4 text-indigo-400" />
              <span>AI Recovery Probability Distribution</span>
            </h3>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={probabilityBracketData} margin={{ top: 10, right: 20, left: 10, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="bracket" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip
                  formatter={(val) => [`${val} Transactions`, "Count"]}
                  contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", borderRadius: "12px", fontSize: "12px" }}
                />
                <Area type="monotone" dataKey="count" name="Transactions" stroke="#6366f1" fill="#6366f1" fillOpacity={0.25} strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
