import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useHostel } from '../../context/HostelContext';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import {
  Bell,
  AlertTriangle,
  Info,
  CheckCircle2,
  Trash2,
  ExternalLink,
  ShieldAlert,
} from 'lucide-react';

export const AlertsPage: React.FC = () => {
  const navigate = useNavigate();
  const { alerts, dismissAlert, clearAllAlerts } = useHostel();
  const [severityFilter, setSeverityFilter] = useState<'all' | 'critical' | 'warning' | 'info'>(
    'all'
  );

  const filteredAlerts = alerts.filter((alert) => {
    if (alert.dismissed) return false;
    if (severityFilter !== 'all' && alert.severity !== severityFilter) return false;
    return true;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-white m-0 flex items-center gap-2">
            <Bell className="w-6 h-6 text-red-400" />
            System Alerts & Anomalies Log
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time threshold breaches, budget overruns, and device warnings
          </p>
        </div>

        <div className="flex items-center gap-3">
          {filteredAlerts.length > 0 && (
            <button
              onClick={clearAllAlerts}
              className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500/20 transition-all flex items-center gap-1.5"
            >
              <Trash2 className="w-4 h-4" /> Clear All Alerts
            </button>
          )}
        </div>
      </div>

      {/* Severity Filter Tabs */}
      <div className="flex items-center gap-2 p-1.5 rounded-xl bg-slate-900/90 border border-slate-800 w-fit">
        {(['all', 'critical', 'warning', 'info'] as const).map((sev) => (
          <button
            key={sev}
            onClick={() => setSeverityFilter(sev)}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg capitalize transition-all ${
              severityFilter === sev
                ? 'bg-cyan-500 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {sev}
          </button>
        ))}
      </div>

      {/* Alerts List */}
      <div className="space-y-3">
        {filteredAlerts.map((alert) => (
          <Card
            key={alert.id}
            className={`border transition-all ${
              alert.severity === 'critical'
                ? 'border-red-500/40 bg-red-950/20'
                : alert.severity === 'warning'
                ? 'border-amber-500/40 bg-amber-950/20'
                : 'border-cyan-500/30 bg-slate-900/60'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div
                  className={`p-2.5 rounded-xl shrink-0 ${
                    alert.severity === 'critical'
                      ? 'bg-red-500/20 text-red-400'
                      : alert.severity === 'warning'
                      ? 'bg-amber-500/20 text-amber-400'
                      : 'bg-cyan-500/20 text-cyan-400'
                  }`}
                >
                  {alert.severity === 'critical' ? (
                    <ShieldAlert className="w-5 h-5" />
                  ) : alert.severity === 'warning' ? (
                    <AlertTriangle className="w-5 h-5" />
                  ) : (
                    <Info className="w-5 h-5" />
                  )}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-white m-0">{alert.title}</h3>
                    <Badge
                      variant={
                        alert.severity === 'critical'
                          ? 'red'
                          : alert.severity === 'warning'
                          ? 'amber'
                          : 'cyan'
                      }
                      size="sm"
                    >
                      Room {alert.roomNumber}
                    </Badge>
                    <span className="text-[11px] text-slate-400">{alert.timestamp}</span>
                  </div>
                  <p className="text-xs text-slate-300">{alert.message}</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                <button
                  type="button"
                  onClick={() => navigate(`/admin/rooms/${alert.roomId}`)}
                  className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-900 text-cyan-400 border border-slate-800 hover:border-cyan-500/40 transition-colors flex items-center gap-1"
                >
                  Inspect Room <ExternalLink className="w-3 h-3" />
                </button>
                <button
                  type="button"
                  onClick={() => dismissAlert(alert.id)}
                  className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-900 text-slate-400 border border-slate-800 hover:text-white hover:bg-slate-800 transition-colors flex items-center gap-1"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Dismiss
                </button>
              </div>
            </div>
          </Card>
        ))}

        {filteredAlerts.length === 0 && (
          <div className="glass-panel p-12 text-center text-slate-400 space-y-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-200">No active alerts!</p>
            <p className="text-xs text-slate-500">All hostel rooms are operating within normal thresholds.</p>
          </div>
        )}
      </div>
    </div>
  );
};
