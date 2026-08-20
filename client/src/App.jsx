import React, { useState, useEffect, useCallback } from "react";
import Navbar from "./components/Navbar";
import HeroOpportunitySection from "./components/HeroOpportunitySection";
import KpiCards from "./components/KpiCards";
import AiOpportunityPanel from "./components/AiOpportunityPanel";
import RecoveryQueue from "./components/RecoveryQueue";
import TransactionDetailModal from "./components/TransactionDetailModal";
import AiAnalysisModal from "./components/AiAnalysisModal";
import AnalyticsView from "./components/AnalyticsView";
import AiInsightsView from "./components/AiInsightsView";
import RecoverySimulationModal from "./components/RecoverySimulationModal";
import { api } from "./services/api";
import { CheckCircle2, AlertCircle } from "lucide-react";

export default function App() {
  const [activeTab, setActiveTab] = useState("queue");

  // Data States
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
  const [showAiModal, setShowAiModal] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  // Queue Controls
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedReason, setSelectedReason] = useState("all");
  const [selectedPriority, setSelectedPriority] = useState("all");
  const [sortBy, setSortBy] = useState("recoveryProbability");
  const [sortOrder, setSortOrder] = useState("desc");

  // Selected Modals
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [simulationTransaction, setSimulationTransaction] = useState(null);

  // Toast Notification
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

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

  useEffect(() => {
    loadSummary();
    loadAnalyticsAndInsights();
  }, [loadSummary, loadAnalyticsAndInsights]);

  useEffect(() => {
    loadTransactions();
  }, [loadTransactions]);

  // Handler: Run AI Analysis Scanner
  const handleRunAiAnalysis = async () => {
    setIsAnalyzing(true);
    setShowAiModal(true);
    try {
      const res = await api.runAiAnalysis();
      if (res.success) {
        await Promise.all([loadSummary(), loadTransactions(), loadAnalyticsAndInsights()]);
      }
    } catch (err) {
      showToast("Error running AI Analysis: " + err.message, "error");
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Handler: Reset Data
  const handleResetData = async () => {
    setIsResetting(true);
    try {
      const res = await api.reseed();
      if (res.success) {
        showToast("Synthetic dataset reset to default transactions.");
        await Promise.all([loadSummary(), loadTransactions(), loadAnalyticsAndInsights()]);
      }
    } catch (err) {
      showToast("Failed to reset dataset: " + err.message, "error");
    } finally {
      setIsResetting(false);
    }
  };

  // Handler: Simulate Recovery
  const handleConfirmSimulateRecovery = async (id) => {
    try {
      const res = await api.simulateRecovery(id);
      if (res.success) {
        showToast(`Successfully simulated recovery for transaction ${id}!`);
        await Promise.all([loadSummary(), loadTransactions(), loadAnalyticsAndInsights()]);
      }
    } catch (err) {
      showToast("Simulation failed: " + err.message, "error");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce">
          <div
            className={`flex items-center space-x-2 px-4 py-3 rounded-2xl shadow-lg border text-xs font-bold ${
              toast.type === "error"
                ? "bg-rose-900 text-white border-rose-700"
                : "bg-slate-900 text-white border-slate-800"
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
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === "queue" && (
          <>
            {/* 1. Main Hero / Recovery Opportunity Focal Point */}
            <HeroOpportunitySection summary={summary} isLoading={isLoadingSummary} />

            {/* 2. Compact KPI Cards Row */}
            <KpiCards summary={summary} isLoading={isLoadingSummary} />

            {/* 3. AI Recovery Opportunities Actionable Panel */}
            <AiOpportunityPanel analytics={analytics} />

            {/* 4. Clean Recovery Queue Table */}
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
          </>
        )}

        {/* Tab 2: Analytics */}
        {activeTab === "analytics" && (
          <AnalyticsView analytics={analytics} summary={summary} isLoading={isLoadingAnalytics} />
        )}

        {/* Tab 3: AI Insights */}
        {activeTab === "insights" && (
          <AiInsightsView insights={insights} isLoading={isLoadingInsights} />
        )}
      </main>

      {/* AI Analysis Step-by-Step Scanner Modal */}
      <AiAnalysisModal
        isOpen={showAiModal}
        onClose={() => setShowAiModal(false)}
        summary={summary}
      />

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

      {/* Recovery Simulation Step-by-Step Modal */}
      {simulationTransaction && (
        <RecoverySimulationModal
          transaction={simulationTransaction}
          onClose={() => setSimulationTransaction(null)}
          onConfirmSimulate={handleConfirmSimulateRecovery}
        />
      )}

      {/* Footer */}
      <footer className="border-t border-slate-200/80 bg-white py-4 text-center text-xs text-slate-500 font-medium">
        <p>RazorRecover AI — Intelligent Payment Revenue Recovery Platform</p>
      </footer>
    </div>
  );
}
