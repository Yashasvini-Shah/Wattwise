import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { HostelProvider, useHostel } from './context/HostelContext';

import { AuthPage } from './pages/AuthPage';
import { AdminLayout } from './components/layout/AdminLayout';
import { StudentLayout } from './components/layout/StudentLayout';

import { OverviewPage } from './pages/admin/OverviewPage';
import { RoomMonitoringPage } from './pages/admin/RoomMonitoringPage';
import { RoomDetailPage } from './pages/admin/RoomDetailPage';
import { AiInsightsPage } from './pages/admin/AiInsightsPage';
import { AnalyticsPage } from './pages/admin/AnalyticsPage';
import { AlertsPage } from './pages/admin/AlertsPage';
import { ReportsPage } from './pages/admin/ReportsPage';
import { SettingsPage } from './pages/admin/SettingsPage';

import { StudentDashboardPage } from './pages/student/StudentDashboardPage';

// Protected Admin Guard
const AdminRouteGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { authState } = useAuth();
  if (!authState.isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  if (authState.user?.role !== 'admin') {
    return <Navigate to="/student/dashboard" replace />;
  }
  return <>{children}</>;
};

// Protected Student Guard
const StudentRouteGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { authState } = useAuth();
  const { settings } = useHostel();

  if (!authState.isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // Admin can access student dashboard if studentPreviewMode is active
  if (authState.user?.role === 'admin' && !settings.studentPreviewMode) {
    return <Navigate to="/admin/overview" replace />;
  }

  return <>{children}</>;
};

export const AppRoutes: React.FC = () => {
  const { authState } = useAuth();
  const { settings } = useHostel();

  return (
    <Routes>
      {/* Public Auth Route */}
      <Route
        path="/"
        element={
          authState.isAuthenticated ? (
            authState.user?.role === 'admin' && !settings.studentPreviewMode ? (
              <Navigate to="/admin/overview" replace />
            ) : (
              <Navigate to="/student/dashboard" replace />
            )
          ) : (
            <AuthPage />
          )
        }
      />

      {/* Protected Admin Routes */}
      <Route
        path="/admin"
        element={
          <AdminRouteGuard>
            <AdminLayout />
          </AdminRouteGuard>
        }
      >
        <Route index element={<Navigate to="/admin/overview" replace />} />
        <Route path="overview" element={<OverviewPage />} />
        <Route path="rooms" element={<RoomMonitoringPage />} />
        <Route path="rooms/:id" element={<RoomDetailPage />} />
        <Route path="insights" element={<AiInsightsPage />} />
        <Route path="analytics" element={<AnalyticsPage />} />
        <Route path="alerts" element={<AlertsPage />} />
        <Route path="reports" element={<ReportsPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>

      {/* Protected Student Routes */}
      <Route
        path="/student"
        element={
          <StudentRouteGuard>
            <StudentLayout />
          </StudentRouteGuard>
        }
      >
        <Route index element={<Navigate to="/student/dashboard" replace />} />
        <Route path="dashboard" element={<StudentDashboardPage />} />
      </Route>

      {/* Catch-all redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export function App() {
  return (
    <Router>
      <AuthProvider>
        <HostelProvider>
          <AppRoutes />
        </HostelProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
