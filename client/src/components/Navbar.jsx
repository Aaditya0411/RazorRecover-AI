import React from "react";
import { Sparkles, Layers, BarChart3, Lightbulb, RefreshCw, Cpu, CheckCircle2 } from "lucide-react";

export default function Navbar({
  activeTab,
  setActiveTab,
  onRunAiAnalysis,
  isAnalyzing,
  onResetData,
  isResetting
}) {
  return (
    <header className="bg-white border-b border-slate-200/80 sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Branding Logo & Compact Subtitle */}
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-sm shadow-blue-600/30">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" />
                <path d="M21 3v5h-5" />
              </svg>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-base text-slate-900 tracking-tight">RazorRecover</span>
                <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded-md border border-blue-100">
                  AI
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block font-normal">
                Intelligent Payment Revenue Recovery
              </p>
            </div>
          </div>

          {/* Center: Navigation Tabs */}
          <nav className="flex items-center space-x-1 bg-slate-100/80 p-1 rounded-xl border border-slate-200/60">
            <button
              onClick={() => setActiveTab("queue")}
              className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === "queue"
                  ? "bg-white text-slate-900 shadow-sm font-semibold"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Recovery Queue</span>
            </button>

            <button
              onClick={() => setActiveTab("analytics")}
              className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === "analytics"
                  ? "bg-white text-slate-900 shadow-sm font-semibold"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Analytics</span>
            </button>

            <button
              onClick={() => setActiveTab("insights")}
              className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === "insights"
                  ? "bg-white text-slate-900 shadow-sm font-semibold"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
              }`}
            >
              <Lightbulb className="w-3.5 h-3.5" />
              <span>AI Insights</span>
            </button>
          </nav>

          {/* Right: Last Analyzed & Run AI Analysis Button */}
          <div className="flex items-center space-x-3">
            <div className="hidden lg:flex items-center space-x-1.5 text-[11px] text-slate-500 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Last analyzed: <strong className="text-slate-700">Just now</strong></span>
            </div>

            <button
              onClick={onResetData}
              disabled={isResetting}
              title="Reset dataset to default demo transactions"
              className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-all border border-slate-200"
            >
              <RefreshCw className={`w-4 h-4 ${isResetting ? "animate-spin text-blue-600" : ""}`} />
            </button>

            <button
              onClick={onRunAiAnalysis}
              disabled={isAnalyzing}
              className="flex items-center space-x-2 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs font-semibold rounded-xl shadow-sm transition-all disabled:opacity-50"
            >
              <Sparkles className={`w-3.5 h-3.5 ${isAnalyzing ? "animate-spin" : ""}`} />
              <span>{isAnalyzing ? "Analyzing..." : "Run AI Analysis"}</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
