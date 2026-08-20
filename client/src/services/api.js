/**
 * REST API Client for RazorRecover AI
 */

const API_BASE = "/api";

async function request(endpoint, options = {}) {
  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers
      },
      ...options
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || `API Error (${res.status})`);
    }
    return data;
  } catch (err) {
    console.error(`[API Error] ${endpoint}:`, err.message);
    throw err;
  }
}

export const api = {
  // Fetch transactions with query params
  getTransactions: (params = {}) => {
    const query = new URLSearchParams();
    if (params.search) query.append("search", params.search);
    if (params.failureReason) query.append("failureReason", params.failureReason);
    if (params.priority) query.append("priority", params.priority);
    if (params.status) query.append("status", params.status);
    if (params.sortBy) query.append("sortBy", params.sortBy);
    if (params.sortOrder) query.append("sortOrder", params.sortOrder);
    
    const queryString = query.toString() ? `?${query.toString()}` : "";
    return request(`/transactions${queryString}`);
  },

  // Fetch single transaction details
  getTransactionById: (id) => request(`/transactions/${id}`),

  // Fetch summary KPI cards
  getSummary: () => request("/summary"),

  // Fetch analytics charts data
  getAnalytics: () => request("/analytics"),

  // Fetch dynamic AI dataset insights
  getInsights: () => request("/insights"),

  // Run batch AI re-analysis
  runAiAnalysis: () => request("/recovery/analyze", { method: "POST" }),

  // Simulate recovery for a transaction
  simulateRecovery: (id) => request(`/recovery/${id}/simulate`, { method: "POST" }),

  // Reseed dataset
  reseed: () => request("/seed", { method: "POST" })
};
