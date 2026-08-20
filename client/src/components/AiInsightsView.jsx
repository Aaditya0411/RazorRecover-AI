import React from "react";
import { Lightbulb, Sparkles, ArrowRight, Target, ShieldCheck } from "lucide-react";

export default function AiInsightsView({ insights = [], isLoading = false }) {
  if (isLoading) {
    return <div className="p-8 text-center text-slate-400">Loading AI Insights...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Title & Subtitle */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center space-x-2">
          <Lightbulb className="w-5 h-5 text-blue-600" />
          <span>AI Insights</span>
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Signals detected from failed payment patterns.
        </p>
      </div>

      {/* Insight Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {insights.map((insight) => (
          <div
            key={insight.id || insight.title}
            className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold border border-slate-200">
                  {insight.category || "Insight"}
                </span>
                <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full text-xs font-bold border border-blue-100">
                  {insight.badge}
                </span>
              </div>

              <h3 className="text-sm font-bold text-slate-900 mb-1.5 group-hover:text-blue-600 transition-colors">
                {insight.title}
              </h3>

              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                {insight.description}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span className="flex items-center space-x-1">
                <Target className="w-3.5 h-3.5 text-emerald-600" />
                <span>Impact: <strong className="text-slate-800 font-semibold">{insight.impact || "High"}</strong></span>
              </span>
              <span className="text-blue-600 font-semibold flex items-center space-x-1 group-hover:translate-x-1 transition-transform">
                <span>Actionable</span>
                <ArrowRight className="w-3 h-3" />
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
