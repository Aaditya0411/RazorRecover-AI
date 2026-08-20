import React from "react";
import { Lightbulb, Sparkles, ArrowRight, ShieldCheck, Zap, Target, Cpu } from "lucide-react";

export default function AiInsightsView({ insights = [], isLoading = false }) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[1, 2, 3, 4].map(n => (
          <div key={n} className="bg-slate-900 border border-slate-800 rounded-2xl h-40 animate-pulse"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-sky-400" />
            <span>AI Automated Insights & Optimization Signals</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Real-time pattern intelligence extracted dynamically from current transaction telemetry.
          </p>
        </div>
        <div className="px-3 py-1 bg-sky-500/10 border border-sky-500/20 text-sky-400 rounded-xl text-xs font-semibold flex items-center space-x-1.5">
          <Cpu className="w-3.5 h-3.5" />
          <span>Explainable Engine Active</span>
        </div>
      </div>

      {/* Insights Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {insights.map((insight) => (
          <div
            key={insight.id || insight.title}
            className="glass-card glass-card-hover rounded-2xl border border-slate-800 p-5 relative overflow-hidden group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="px-2.5 py-1 bg-slate-900 text-slate-300 rounded-lg text-[11px] font-medium border border-slate-800">
                  {insight.category || "General"}
                </span>
                <span className="px-2.5 py-0.5 bg-sky-500/10 text-sky-400 rounded-full text-xs font-bold border border-sky-500/30">
                  {insight.badge}
                </span>
              </div>

              <h3 className="text-sm font-bold text-white mb-2 group-hover:text-sky-300 transition-colors">
                {insight.title}
              </h3>

              <p className="text-xs text-slate-300 leading-relaxed">
                {insight.description}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
              <span className="flex items-center space-x-1">
                <Target className="w-3.5 h-3.5 text-emerald-400" />
                <span>Impact Level: <strong className="text-slate-200">{insight.impact || "High"}</strong></span>
              </span>
              <span className="text-sky-400 font-semibold flex items-center space-x-1 group-hover:translate-x-1 transition-transform">
                <span>Optimizing</span>
                <ArrowRight className="w-3 h-3" />
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
