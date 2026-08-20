# RazorRecover AI — Intelligent Payment Revenue Recovery Platform

[![Track](https://img.shields.io/badge/Razorpay%20AI%20Builder%20Internship-Track%203%3A%20AI%20Revenue%20Recovery-0284c7?style=for-the-badge)](https://razorpay.com)
[![Status](https://img.shields.io/badge/Demo-Ready%20%26%20Runnable-10b981?style=for-the-badge)](#)
[![License](https://img.shields.io/badge/License-MIT-slate?style=for-the-badge)](LICENSE)

> **"Don't just flag failed payments — decide which payments are worth recovering, how to recover them, and how much revenue can be saved."**

---

## 🚀 Problem Statement

Businesses lose substantial revenue daily due to payment failures stemming from bank declines, network dropouts, UPI gateway timeouts, expired credit cards, insufficient balances, and 2FA authentication errors. Standard payment dashboards simply present a transaction as "Failed" without providing actionable intelligence.

**RazorRecover AI** closes this gap by transforming static payment failure logs into a dynamic, prioritized recovery pipeline:
```
Failed Payment ➔ Analyze Failure ➔ Predict Recovery Probability ➔ Recommend Action ➔ Prioritize Queue ➔ Estimate Recoverable Revenue
```

---

## ✨ Key Features & Highlights

1. **Explainable AI Recovery Engine**: Multi-factor scoring engine analyzing failure reasons, customer trust signals, retry count decay, transaction age, payment method reliability, and ticket value.
2. **Deterministic & Configurable Weights**: All scoring factors are centralized in `server/services/recoveryEngine.js` with probabilities clamped strictly between **5% and 95%**.
3. **Zero-Config Database Fallback**: Built-in dual-mode persistence (`server/config/db.js`). Automatically uses an in-memory synthetic transaction store if `MONGODB_URI` is not present, allowing evaluators to run the project out-of-the-box without installing MongoDB.
4. **Interactive Recovery Simulator**: Merchants can select any failed transaction, execute a "Simulate Recovery" action, and observe live updates to recovered revenue, recovery rate, and total recovered transaction counters.
5. **Dynamic AI Dataset Insights**: Programmatically extracts actionable insights directly from live transaction telemetry (e.g., top probability failure types, high-priority revenue inventory, expired card routing strategies).
6. **Telemetry Analytics Dashboard**: Interactive Recharts visualizations including failed vs recoverable revenue bar charts, failure category donut charts, payment method opportunity breakdowns, and probability distributions.
7. **Internship Demo UI**: Built with React, Vite, and Tailwind CSS following modern fintech dashboard standards with high contrast dark glassmorphism, responsive tables, loading/empty states, search, filtering, and multi-column sorting.

---

## 🛠️ Architecture & Tech Stack

```
PROJECT-AI/
├── client/                   # Frontend SPA (React 18 + Vite + Tailwind CSS + Recharts)
│   ├── src/
│   │   ├── components/       # Navbar, KpiCards, RecoveryQueue, DetailModal, Analytics, Insights, Simulator
│   │   ├── services/api.js   # REST API client
│   │   └── utils/            # Formatters (INR ₹, probability, date, badges)
│   └── vite.config.js        # Vite config with API proxy to port 5000
└── server/                   # Backend REST Service (Node.js + Express)
    ├── config/db.js          # MongoDB connector with auto in-memory fallback
    ├── services/
    │   ├── recoveryEngine.js # Configurable Explainable AI Recovery Scoring Engine
    │   └── analyticsService.js# Analytics aggregations & dynamic dataset insight generator
    ├── models/Transaction.js # Mongoose schema & mock transactional repository
    ├── controllers/          # Request handlers for summary, queue, analytics, simulation
    └── routes/               # Express REST routes (/api/transactions, /api/summary, /api/recovery/*)
```

- **Frontend**: React 18, Vite, Tailwind CSS, Recharts, Lucide React icons
- **Backend**: Node.js, Express.js, Cors, Dotenv
- **Database**: Dual Mode — MongoDB (via Mongoose) or built-in In-Memory Synthetic Store
- **Intelligence**: Centralized Explainable AI Recovery Engine

---

## 📊 AI Scoring & Priority Logic

### Recovery Probability Formula:
```
Base Score (by Failure Reason)
+ Customer Trust Bonus (Success Rate × 25)
- Retry Penalty (Retry Count × 12)
+ Age Factor (Fresh <2h: +10, 2-12h: -5, >12h: -18)
+ Payment Method Reliability (UPI: +5, NetBanking: +8, Card: 0, Wallet: -2)
+ Transaction Amount Factor (High Value ≥₹10k: +6)
--------------------------------------------------
Result: Clamped strictly between 5% and 95%
```

### Recovery Action Mapping:
| Failure Reason | Recommended Next Action |
| :--- | :--- |
| `insufficient_funds` | **Smart Retry Later** |
| `bank_declined` | **Offer Alternate Payment Method** |
| `expired_card` | **Request Card Update** |
| `network_error` | **Immediate Smart Retry** |
| `upi_timeout` | **Retry UPI Payment** |
| `authentication_failure` | **Send Payment Reminder** |
| `unknown_failure` | **Manual Review** |

### Priority Assignment Rules:
- 🟢 **High Priority**: Recovery Probability $\ge 70\%$
- 🟡 **Medium Priority**: Recovery Probability $\ge 40\%$ and $< 70\%$
- 🔴 **Low Priority**: Recovery Probability $< 40\%$

---

## 📡 REST API Documentation

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/summary` | Returns top KPI metrics (failed revenue, recoverable revenue, recovery rate, high-priority count, recovered total) |
| `GET` | `/api/transactions` | Returns transactions queue with search (`search`), failure reason (`failureReason`), priority (`priority`), sort (`sortBy`, `sortOrder`) |
| `GET` | `/api/transactions/:id` | Returns complete details, AI score breakdown, and timeline for a single transaction |
| `GET` | `/api/analytics` | Returns aggregations for Recharts (failure reason share, revenue breakdown, payment method stats) |
| `GET` | `/api/insights` | Returns dynamic AI insights extracted from current dataset telemetry |
| `POST` | `/api/recovery/analyze` | Executes batch AI scan across all transactions and updates scores |
| `POST` | `/api/recovery/:id/recommend` | Returns targeted recommendation & score factors for a specific transaction |
| `POST` | `/api/recovery/:id/simulate` | Simulates successful recovery execution and updates status to `recovered` |
| `POST` | `/api/seed` | Resets dataset to initial 45 synthetic Indian transactions |

---

## ⚡ Quick Start & Setup Instructions

### Prerequisites
- Node.js (v18.x or higher)
- npm (v9.x or higher)

### 1. Installation
Run setup command from root to install all root, client, and server dependencies:
```bash
npm run setup
```

### 2. Running in Development Mode
Start both Node backend (`http://localhost:5000`) and Vite frontend (`http://localhost:5173`) concurrently:
```bash
npm run dev
```

Open your browser at **`http://localhost:5173`**.

---

## 🎯 5-Minute Demo Flow for Hackathon / Internship Presentation

1. **Introduction (30s)**:
   - Present the problem: standard dashboards leave failed revenue on the table. Show **RazorRecover AI** top KPI cards (Total Failed Revenue vs Estimated Recoverable Revenue & Recovery Rate).
2. **Recovery Inventory Queue & Filtering (1m)**:
   - Walk through the Recovery Queue table. Filter by `Bank Declined` or `High Priority`. Demonstrate sorting by `AI Probability` and searching for `TXN-1042`.
3. **Explainable AI Breakdown & Detail Modal (1.5m)**:
   - Click transaction `TXN-1042` (₹7,999 Bank Decline, 82% recovery probability).
   - Point out the plain-language AI explanation, the score factors breakdown (base score, customer trust bonus, retry penalty, age decay), and the recovery lifecycle timeline.
4. **Interactive Revenue Recovery Simulation (1m)**:
   - Click **"Simulate Recovery"** on a transaction.
   - Show the sandbox confirmation dialog comparing original amount vs predicted recovery value.
   - Click **"Confirm & Recover"**. Point out how the top KPI cards (Recovered Revenue, Recovery Rate %, High Priority count) update live!
5. **Analytics & AI Insights (1m)**:
   - Switch to **Analytics** tab to showcase Recharts failure category distribution and payment method recovery opportunities.
   - Switch to **AI Insights** tab to highlight dataset-driven optimization signals.

---

## 🔮 Future ML / LLM Upgrade Architecture

The platform is designed with clean service separation to allow replacing the explainable deterministic engine with production ML models without modifying APIs or UI:
- **Predictive Model**: Replace `server/services/recoveryEngine.js` with an XGBoost/LightGBM binary classifier trained on historical payment attempt telemetry.
- **Propensity Model**: Train customer-level propensity scoring for payment method selection.
- **LLM Explanation Layer**: Connect Claude/GPT-4 via LangChain to auto-generate personalized recovery messages (WhatsApp/SMS) per transaction.

---

## ⚠️ Limitations & Notes
- **Synthetic Data**: Uses 45 synthetic Indian payment records with realistic Indian amounts (₹750 to ₹42,000) and payment methods (UPI, Card, Net Banking, Wallet). No real customer or payment data is stored or processed.
- **Simulation Mode**: The "Simulate Recovery" feature is an interactive UI sandbox designed to demonstrate real-time revenue recovery lifecycle updates.

---

## 📄 License

Distributed under the MIT License. See [`LICENSE`](LICENSE) for details.
