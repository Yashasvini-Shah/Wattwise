# WattWise - Project Master Context & Technical Reference for Gemini AI

> **Instructions for the User**:
> Upload or copy-paste this file into Gemini (gemini.google.com) whenever you need Gemini to answer questions, generate presentation slides, prepare viva Q&A, or write code modifications for your WattWise project.

---

## ⚡ 1. Project Overview
- **Project Name**: WattWise
- **Type**: Offline-First Hostel Energy Management & Monitoring System
- **Target Audience**: Hostel Administrators, Wardens, and Student Residents
- **Primary Goal**: Monitor live electrical loads, enforce room billing caps, provide AI energy optimization advice, and enable instant CSV audit reporting.

---

## 🛠️ 2. Tech Stack
- **Frontend Framework**: React 19 + TypeScript + Vite 8
- **Styling & UI**: Tailwind CSS v4 + Custom Glassmorphism Theme + CSS Variables
- **Icons**: Lucide React (`lucide-react`)
- **Charts & Data Visualization**: Recharts (`recharts`)
- **Routing**: React Router v7 (`react-router-dom`)
- **State Management & Storage**: React Context API (`AuthContext`, `HostelContext`) + Web Storage API (`localStorage`)

---

## 👥 3. Architecture & Key Features

### A. Role-Based Access Control (RBAC)
- **Admin**: Full visibility across all 5 floors and 25 rooms. Configures tariffs, room limit caps, auto-alert thresholds, reviews alerts, applies AI tips, exports CSVs, and toggles Student Preview Mode.
  - *Default Credentials*: Username `admin` | Password `12345`
- **Student**: Room-isolated dashboard (e.g. Room 301, Floor 3). Monitors microclimate (Temp/Humidity), live load, resident presence (4 residents), and toggles interactive appliances.
  - *Default Credentials*: Username `room<number>` (e.g. `room301`) | Password `12345`

### B. Live Physics & Telemetry Engine
- **Appliance Wattage Model**:
  - Ceiling Fan: 65W
  - LED Lights: 30W
  - Study Lamp: 15W
  - Air Conditioner: 1200W–1500W
  - Laptop Chargers: 90W
  - Mini Refrigerator: 150W
- **Instant Formulae**:
  - `Active Watts = Sum of all ON appliances`
  - `Daily kWh = Math.round((Active Watts * 0.018 * 24) * 10) / 10`
  - `Monthly Cost = Monthly kWh * Electricity Rate ($/kWh)`
  - `Budget Status`: `Normal` (<85%), `Warning` (85-100%), `Exceeded` (>100%)

---

## ❓ 4. Top Viva & Presentation Q&A for Gemini

### Q1: Is WattWise using a backend database like MongoDB or MySQL?
**Answer**: No. WattWise uses an offline-first architecture powered by the browser's `localStorage` API. This ensures zero hosting costs, lightning-fast response times, and zero API dependencies while fully preserving state across browser refreshes.

### Q2: How does appliance toggling affect energy calculations?
**Answer**: When a student or admin toggles an appliance switch, `HostelContext` immediately recalculates `activePowerWatts`, updates daily/monthly kWh projections, recalculates the estimated bill against the monthly limit cap, and updates the UI status badge (`Normal`, `Warning`, `Exceeded`) in real time.

### Q3: Why is React Router used?
**Answer**: React Router provides client-side single-page navigation without reloading the page. `vercel.json` rewrites all route paths back to `index.html` to prevent 404 errors on server refresh.

---

## 📌 5. Code Structure Sitemap
```
wattwise/
├── src/
│   ├── components/
│   │   ├── common/      # Badge, Card, Modal
│   │   └── layout/      # Header, Sidebar, AdminLayout, StudentLayout
│   ├── context/         # AuthContext.tsx, HostelContext.tsx
│   ├── pages/
│   │   ├── AuthPage.tsx
│   │   ├── admin/       # OverviewPage, RoomMonitoringPage, RoomDetailPage, AiInsightsPage, AnalyticsPage, AlertsPage, ReportsPage, SettingsPage
│   │   └── student/     # StudentDashboardPage.tsx
│   ├── types/           # hostel.ts
│   └── utils/           # mockData.ts, storage.ts, exportCsv.ts
├── vercel.json          # Deployment SPA rewrite rules
└── package.json
```
