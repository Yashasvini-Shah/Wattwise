import React from 'react';
import { Zap, WifiOff, LogOut, User, Eye, RefreshCw } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useHostel } from '../../context/HostelContext';
import { Badge } from '../common/Badge';

export const Header: React.FC = () => {
  const { authState, logout } = useAuth();
  const { rooms, settings, updateSettings } = useHostel();

  const totalHostelWatts = rooms.reduce((sum, r) => sum + r.activePowerWatts, 0);
  const totalHostelKw = (totalHostelWatts / 1000).toFixed(1);

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-800/80 bg-slate-950/80 px-4 py-3 sm:px-6">
      <div className="flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-cyan-500 to-emerald-400 text-slate-950 shadow-lg shadow-cyan-500/20">
            <Zap className="h-6 w-6 fill-slate-950 stroke-slate-950" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-white m-0 leading-none">
                Watt<span className="text-cyan-400">Wise</span>
              </h1>
              <span className="text-[10px] font-semibold tracking-wider uppercase bg-cyan-950 text-cyan-400 px-1.5 py-0.5 rounded border border-cyan-800/60">
                v2.0
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">Hostel Energy Management</p>
          </div>
        </div>

        {/* Center / Status info */}
        <div className="hidden md:flex items-center gap-4">
          <Badge variant="slate" icon={<WifiOff className="w-3.5 h-3.5 text-emerald-400" />}>
            Local Simulation Mode (Offline)
          </Badge>

          {authState.user?.role === 'admin' && (
            <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-slate-900/80 border border-slate-800 text-xs text-slate-300">
              <Zap className="w-3.5 h-3.5 text-cyan-400" />
              <span>
                Hostel Load: <strong className="text-cyan-400 font-mono">{totalHostelKw} kW</strong>
              </span>
            </div>
          )}

          {settings.studentPreviewMode && authState.user?.role === 'admin' && (
            <button
              onClick={() => updateSettings({ studentPreviewMode: false })}
              className="flex items-center gap-1.5 text-xs bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2.5 py-1 rounded-lg hover:bg-amber-500/30 transition-colors"
              title="Click to exit preview"
            >
              <Eye className="w-3.5 h-3.5" />
              Previewing Student View (Exit)
            </button>
          )}
        </div>

        {/* Right User Controls */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-right">
            <div className="hidden sm:block">
              <div className="text-xs font-semibold text-slate-200">
                {authState.user?.role === 'admin' ? 'Administrator' : `Room ${authState.user?.roomId}`}
              </div>
              <div className="text-[11px] text-slate-400 capitalize">
                {authState.user?.role === 'admin'
                  ? 'Full Access'
                  : `Floor ${authState.user?.floorId} Resident`}
              </div>
            </div>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-800 border border-slate-700 text-cyan-400">
              <User className="h-4 w-4" />
            </div>
          </div>

          <button
            onClick={logout}
            className="flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-red-400 hover:bg-red-500/10 border border-slate-800 hover:border-red-500/30 px-3 py-2 rounded-lg transition-all"
            title="Log out or switch user"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
};
