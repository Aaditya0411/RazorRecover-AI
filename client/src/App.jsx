import React, { useState, useEffect, useCallback } from "react";
import Navbar from "./components/Navbar";
import KpiCards from "./components/KpiCards";
import RecoveryQueue from "./components/RecoveryQueue";
import TransactionDetailModal from "./components/TransactionDetailModal";
import AnalyticsView from "./components/AnalyticsView";
import AiInsightsView from "./components/AiInsightsView";
import RecoverySimulationModal from "./components/RecoverySimulationModal";
import { api } from "./services/api";
import { Cpu, CheckCircle2, AlertCircle } from "lucide-react";

export default function App() {
  const [activeTab, setActiveTab] = useState("queue");

  // Telemetry States
  const [summary, setSummary] = useState({});
  const [transactions, setTransactions] = useState([]);
  const [analytics, setAnalytics] = useState({});
  const [insights, setInsights] = useState([]);

  // Loading States
  const [isLoadingSummary, setIsLoadingSummary] = useState(true);
  const [isLoadingTransactions, setIsLoadingTransactions] = useState(true);
  const [isLoadingAnalytics, setIsLoadingAnalytics] = useState(true);
  const [isLoadingInsights, setIsLoadingInsights] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  // Queue Filters & Sorting
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedReason, setSelectedReason] = useState("all");
  const [selectedPriority, setSelectedPriority] = useState("all");
  const [sortBy, setSortBy] = useState("recoveryProbability");
  const [sortOrder, setSortOrder] = useState("desc");

  // Modals & Drawers
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [simulationTransaction, setSimulationTransaction] = useState(null);

  // Toast Notification
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Fetch KPI Summary
  const loadSummary = useCallback(async () => {
    setIsLoadingSummary(true);
    try {
      const res = await api.getSummary();
      if (res.success) setSummary(res.data);
    } catch (err) {
      console.error("Failed to load summary:", err);
    } finally {
      setIsLoadingSummary(false);
    }
  }, []);

  // Fetch Queue Transactions
  const loadTransactions = useCallback(async () => {
    setIsLoadingTransactions(true);
    try {
      const res = await api.getTransactions({
        search: searchTerm,
        failureReason: selectedReason,
        priority: selectedPriority,
        sortBy,
        sortOrder
      });
      if (res.success) setTransactions(res.data);
    } catch (err) {
      console.error("Failed to load transactions:", err);
    } finally {
      setIsLoadingTransactions(false);
    }
  }, [searchTerm, selectedReason, selectedPriority, sortBy, sortOrder]);

  // Fetch Analytics & Insights
  const loadAnalyticsAndInsights = useCallback(async () => {
    setIsLoadingAnalytics(true);
    setIsLoadingInsights(true);
    try {
      const [analyticsRes, insightsRes] = await Promise.all([
        api.getAnalytics(),
        api.getInsights()
      ]);
      if (analyticsRes.success) setAnalytics(analyticsRes.data);
      if (insightsRes.success) setInsights(insightsRes.data);
    } catch (err) {
      console.error("Failed to load analytics/insights:", err);
    } finally {
      setIsLoadingAnalytics(false);
      setIsLoadingInsights(false);
    }
  }, []);

  // Initial Load & Filter Changes
  useEffect(() => {
    loadSummary();
    loadAnalyticsAndInsights();
  }, [loadSummary, loadAnalyticsAndInsights]);

  useEffect(() => {
    loadTransactions();
  }, [loadTransactions]);

  // Handler: Run AI Analysis (Requirement #14)
  const handleRunAiAnalysis = async () => {
    setIsAnalyzing(true);
    try {
      // Short visual delay to display scanning animation state
      await new Promise(resolve => setTimeout(resolve, 1200));
      const res = await api.runAiAnalysis();
      if (res.success) {
        showToast("AI Recovery Engine successfully scanned and re-scored all transactions!");
        await Promise.all([loadSummary(), loadTransactions(), loadAnalyticsAndInsights()]);
      }
    } catch (err) {
      showToast("Error running AI Analysis: " + err.message, "error");
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Handler: Reset/Reseed Data
  const handleResetData = async () => {
    setIsResetting(true);
    try {
      const res = await api.reseed();
      if (res.success) {
        showToast("Synthetic dataset reset to default 45 demo transactions.");
        await Promise.all([loadSummary(), loadTransactions(), loadAnalyticsAndInsights()]);
      }
    } catch (err) {
      showToast("Failed to reset dataset: " + err.message, "error");
    } finally {
      setIsResetting(false);
    }
  };

  // Handler: Simulate Recovery Execution (Requirement #15)
  const handleConfirmSimulateRecovery = async (id) => {
    try {
      const res = await api.simulateRecovery(id);
      if (res.success) {
        showToast(`Successfully simulated recovery for transaction ${id}!`);
        // Refresh summary, transactions queue, analytics
        await Promise.all([loadSummary(), loadTransactions(), loadAnalyticsAndInsights()]);
      }
    } catch (err) {
      showToast("Simulation failed: " + err.message, "error");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-sky-500 selection:text-white">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce">
          <div
            className={`flex items-center space-x-2 px-4 py-3 rounded-2xl shadow-2xl border text-xs font-semibold ${
              toast.type === "error"
                ? "bg-rose-950/90 border-rose-500/40 text-rose-200"
                : "bg-emerald-950/90 border-emerald-500/40 text-emerald-200"
            }`}
          >
            {toast.type === "error" ? (
              <AlertCircle className="w-4 h-4 text-rose-400" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            )}
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      {/* AI Analysis Scanning Overlay State */}
      {isAnalyzing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md">
          <div className="glass-card border border-sky-500/30 rounded-3xl p-8 max-w-md w-full text-center space-y-4 shadow-2xl">
            <div className="w-16 h-16 bg-sky-500/10 border border-sky-500/30 rounded-full flex items-center justify-center mx-auto text-sky-400">
              <Cpu className="w-8 h-8 animate-spin" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Analyzing Payment Failure Patterns...</h3>
              <p className="text-xs text-slate-400 mt-1">
                Calculating recovery probability vectors, expected revenue, and optimal retry actions.
              </p>
            </div>
            <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
              <div className="bg-gradient-to-r from-sky-500 to-indigo-500 h-full w-full animate-pulse"></div>
            </div>
          </div>
        </div>
      )}

      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onRunAiAnalysis={handleRunAiAnalysis}
        isAnalyzing={isAnalyzing}
        onResetData={handleResetData}
        isResetting={isResetting}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* KPI Header Cards */}
        <KpiCards summary={summary} isLoading={isLoadingSummary} />

        {/* Tab 1: Recovery Queue */}
        {activeTab === "queue" && (
          <RecoveryQueue
            transactions={transactions}
            isLoading={isLoadingTransactions}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            selectedReason={selectedReason}
            setSelectedReason={setSelectedReason}
            selectedPriority={selectedPriority}
            setSelectedPriority={setSelectedPriority}
            sortBy={sortBy}
            setSortBy={setSortBy}
            sortOrder={sortOrder}
            setSortOrder={setSortOrder}
            onSelectTransaction={(txn) => setSelectedTransaction(txn)}
            onSimulateRecovery={(txn) => setSimulationTransaction(txn)}
          />
        )}

        {/* Tab 2: Analytics */}
        {activeTab === "analytics" && (
          <AnalyticsView analytics={analytics} isLoading={isLoadingAnalytics} />
        )}

        {/* Tab 3: AI Insights */}
        {activeTab === "insights" && (
          <AiInsightsView insights={insights} isLoading={isLoadingInsights} />
        )}
      </main>

      {/* Transaction Detail Modal */}
      {selectedTransaction && (
        <TransactionDetailModal
          transaction={selectedTransaction}
          onClose={() => setSelectedTransaction(null)}
          onSimulateRecovery={(txn) => {
            setSelectedTransaction(null);
            setSimulationTransaction(txn);
          }}
        />
      )}

      {/* Recovery Simulation Modal */}
      {simulationTransaction && (
        <RecoverySimulationModal
          transaction={simulationTransaction}
          onClose={() => setSimulationTransaction(null)}
          onConfirmSimulate={handleConfirmSimulateRecovery}
        />
      )}

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-4 text-center text-xs text-slate-500">
        <p>
          RazorRecover AI — Track 3: AI Revenue Recovery • Explainable Recovery Engine Demo Platform
        </p>
      </footer>
    </div>
  );
}
