# WattWise ⚡ Hostel Energy Management & Analytics Dashboard

**WattWise** is a polished, responsive, offline-first hostel energy monitoring and smart allocation dashboard designed with a modern dark electric theme. Built for academic demonstrations and smart campus energy management, WattWise provides real-time power telemetry, appliance control, budget limit enforcement, AI energy optimization insights, and exportable audit reports.

---

## 🚀 Short Description (For GitHub Repository Header)

> **WattWise**: An offline-first hostel energy management dashboard featuring real-time load telemetry, interactive appliance control, budget limit enforcement, AI energy insights, and role-based student/admin access. Built with Vite, React, TypeScript, Tailwind CSS & Recharts.

---

## ✨ Key Features

### 👤 Role-Based Authentication & Access
- **Admin Access**: Full control over global electricity tariffs ($/kWh or ₹/kWh), 25 room telemetry monitors, alert logs, AI recommendations, and system settings. *(Username: `admin`, Password: `12345`)*.
- **Student Access**: Restricted, focused interface for individual hostel rooms (Floors 1–5, Rooms 101–505). Allows 4 room residents to share account access. *(Username: `room301`, Password: `12345`)*.
- **Session Persistence**: Authentication, room selections, appliance states, and rate settings persist seamlessly via browser `localStorage`.
- **Student Preview Mode**: Admins can preview the student dashboard directly from settings without re-authenticating.

### ⚡ Real-Time Power Telemetry & Appliance Control
- **Interactive Appliances**: Toggle fans, lights, desk lamps, air conditioners/heaters, and mini-fridges with instant updates to room power load (Watts).
- **Dynamic Billing Calculation**: Live recalculation of daily consumption (kWh), estimated monthly bill ($/₹), and limit compliance percentage.
- **Limit Compliance Meter**: Visual indicators for rooms within limit (`Normal`), approaching budget cap (`Warning >85%`), or over limit (`Exceeded >100%`).

### 📊 Admin Analytics & Reporting
- **Executive Dashboard**: KPI summary cards, 24-hour hostel load trend chart, floor consumption breakdown, and room status grid.
- **Room Diagnostic Center**: Granular telemetry per room, 4-resident presence toggles, admin appliance overrides, and custom room budget cap configuration.
- **AI Energy Insights Engine**: Smart energy efficiency tips (e.g., automated unoccupied AC shutdown, peak load optimization) with 1-click execution.
- **Export & Audit Reports**: Tabular room report with 1-click **CSV file download** and print-optimized formatting (`window.print()`).

---

## 🛠️ Tech Stack

- **Framework**: Vite + React 19 + TypeScript
- **Styling**: Tailwind CSS v4 + Glassmorphism Theme (Dark mode with cyan/emerald/amber/red accents)
- **Routing**: React Router v7
- **Data Visualization**: Recharts
- **Icons**: Lucide React
- **Persistence**: Web Storage API (`localStorage`) — 100% Offline & Free

---

## 🔐 Demo Credentials Reference

| Role | Selection / Username | Password | Access Level |
| :--- | :--- | :--- | :--- |
| **Admin** | Username: `admin` | `12345` | Full Hostel Command Center |
| **Student** | Floor: `1–5` \| Room: `101–505` (e.g., `room301`) | `12345` | Room-Specific Control Dashboard |

---

## 💻 Local Development Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/YOUR_USERNAME/wattwise.git
   cd wattwise
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. **Build for production**:
   ```bash
   npm run build
   ```

---

## 🌐 Deploy Free on Vercel

```bash
npx vercel
```
Or connect your repository directly at [vercel.com](https://vercel.com).
