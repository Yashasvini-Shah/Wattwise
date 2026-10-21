import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Grid,
  Sparkles,
  BarChart3,
  Bell,
  FileSpreadsheet,
  Settings,
  ShieldCheck,
} from 'lucide-react';
import { useHostel } from '../../context/HostelContext';
import { clsx } from 'clsx';

export const Sidebar: React.FC = () => {
  const { alerts, recommendations } = useHostel();

  const unreadAlertsCount = alerts.filter((a) => !a.dismissed).length;
  const pendingRecsCount = recommendations.filter((r) => !r.applied).length;

  const navItems = [
    {
      to: '/admin/overview',
      label: 'Overview',
      icon: LayoutDashboard,
    },
    {
      to: '/admin/rooms',
      label: 'Room Monitoring',
      icon: Grid,
    },
    {
      to: '/admin/insights',
      label: 'AI Energy Insights',
      icon: Sparkles,
      badge: pendingRecsCount > 0 ? pendingRecsCount : null,
      badgeColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    },
    {
      to: '/admin/analytics',
      label: 'Energy Analytics',
      icon: BarChart3,
    },
    {
      to: '/admin/alerts',
      label: 'Alerts & Logs',
      icon: Bell,
      badge: unreadAlertsCount > 0 ? unreadAlertsCount : null,
      badgeColor: 'bg-red-500/20 text-red-400 border-red-500/30',
    },
    {
      to: '/admin/reports',
      label: 'Reports & Export',
      icon: FileSpreadsheet,
    },
    {
      to: '/admin/settings',
      label: 'System Settings',
      icon: Settings,
    },
  ];

  return (
    <aside className="w-full md:w-64 shrink-0 glass-panel border-r border-slate-800/80 bg-slate-950/60 p-4">
      <div className="mb-4 hidden md:flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-900/60 border border-slate-800/80 text-xs text-slate-400">
        <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" />
        <span>Admin Command Panel</span>
      </div>

      <nav className="space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                clsx(
                  'flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all group',
                  isActive
                    ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 shadow-lg shadow-cyan-500/5'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900/80 hover:border-slate-800'
                )
              }
            >
              <div className="flex items-center gap-3">
                <Icon className="w-4 h-4 transition-transform group-hover:scale-110" />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className={clsx(
                    'text-[10px] font-bold px-2 py-0.5 rounded-full border',
                    item.badgeColor
                  )}
                >
                  {item.badge}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
};
