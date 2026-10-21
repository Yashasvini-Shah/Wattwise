import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useHostel } from '../../context/HostelContext';
import { Badge } from '../../components/common/Badge';
import {
  Grid,
  Search,
  Filter,
  Zap,
  Users,
  AlertTriangle,
  CheckCircle,
  ExternalLink,
  SlidersHorizontal,
} from 'lucide-react';

export const RoomMonitoringPage: React.FC = () => {
  const navigate = useNavigate();
  const { rooms, settings } = useHostel();

  const [selectedFloor, setSelectedFloor] = useState<number | 'all'>('all');
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'normal' | 'warning' | 'exceeded'>(
    'all'
  );
  const [searchQuery, setSearchQuery] = useState('');

  const filteredRooms = rooms.filter((room) => {
    // Floor filter
    if (selectedFloor !== 'all' && room.floor !== selectedFloor) return false;

    // Status filter
    if (selectedStatus !== 'all' && room.status !== selectedStatus) return false;

    // Search query
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const matchNum = room.roomNumber.toString().includes(q);
      const matchRes = room.residents.some((r) => r.name.toLowerCase().includes(q));
      if (!matchNum && !matchRes) return false;
    }

    return true;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-white m-0 flex items-center gap-2">
            <Grid className="w-6 h-6 text-cyan-400" />
            Hostel Room Monitoring
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time power load, occupancy, and budget compliance across 25 hostel rooms
          </p>
        </div>
        <Badge variant="cyan" size="md">
          {filteredRooms.length} of 25 Rooms Shown
        </Badge>
      </div>

      {/* Filter Controls Bar */}
      <div className="glass-panel p-4 rounded-xl space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Search Input */}
          <div className="md:col-span-5 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search room (e.g. 301) or resident name..."
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
            />
          </div>

          {/* Floor Selector */}
          <div className="md:col-span-4 flex items-center gap-1.5 overflow-x-auto">
            <span className="text-xs text-slate-400 shrink-0 font-medium flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" />
              Floor:
            </span>
            <button
              onClick={() => setSelectedFloor('all')}
              className={`px-2.5 py-1 text-xs rounded-lg border font-semibold transition-all ${
                selectedFloor === 'all'
                  ? 'bg-cyan-500 text-slate-950 border-cyan-400'
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
              }`}
            >
              All
            </button>
            {[1, 2, 3, 4, 5].map((f) => (
              <button
                key={f}
                onClick={() => setSelectedFloor(f)}
                className={`px-2.5 py-1 text-xs rounded-lg border font-semibold transition-all ${
                  selectedFloor === f
                    ? 'bg-cyan-500 text-slate-950 border-cyan-400'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
                }`}
              >
                F{f}
              </button>
            ))}
          </div>

          {/* Status Filter */}
          <div className="md:col-span-3 flex items-center gap-1.5">
            <span className="text-xs text-slate-400 shrink-0 font-medium flex items-center gap-1">
              <SlidersHorizontal className="w-3.5 h-3.5" />
              Status:
            </span>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as any)}
              className="bg-slate-900 border border-slate-800 text-slate-200 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-cyan-500 w-full"
            >
              <option value="all">All Statuses</option>
              <option value="normal">Normal</option>
              <option value="warning">Warning (&gt;85%)</option>
              <option value="exceeded">Exceeded Limit</option>
            </select>
          </div>
        </div>
      </div>

      {/* Rooms Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredRooms.map((room) => {
          const estimatedCost = room.monthlyUsageKwh * settings.electricityRate;
          const currentLimit = room.customLimit ?? settings.monthlyChargeLimit;
          const activeAppCount = room.appliances.filter((a) => a.isOn).length;
          const presentResidentsCount = room.residents.filter((r) => r.isPresent).length;

          return (
            <div
              key={room.id}
              onClick={() => navigate(`/admin/rooms/${room.id}`)}
              className={`glass-panel p-4 rounded-xl border cursor-pointer glass-panel-hover flex flex-col justify-between space-y-4 ${
                room.status === 'exceeded'
                  ? 'border-red-500/40 bg-red-950/20 shadow-red-500/5'
                  : room.status === 'warning'
                  ? 'border-amber-500/40 bg-amber-950/20 shadow-amber-500/5'
                  : 'border-slate-800'
              }`}
            >
              {/* Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-black text-white m-0">Room {room.roomNumber}</h3>
                  <span className="text-xs text-slate-400">Floor {room.floor}</span>
                </div>
                {room.status === 'exceeded' && (
                  <Badge variant="red" size="sm" icon={<AlertTriangle className="w-3 h-3" />}>
                    Exceeded
                  </Badge>
                )}
                {room.status === 'warning' && (
                  <Badge variant="amber" size="sm" icon={<AlertTriangle className="w-3 h-3" />}>
                    Warning
                  </Badge>
                )}
                {room.status === 'normal' && (
                  <Badge variant="emerald" size="sm" icon={<CheckCircle className="w-3 h-3" />}>
                    Normal
                  </Badge>
                )}
              </div>

              {/* Power & Cost */}
              <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5 text-cyan-400" /> Live Power:
                  </span>
                  <strong className="font-mono text-cyan-300 font-bold">
                    {room.activePowerWatts} W
                  </strong>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Est. Charge:</span>
                  <strong className="font-mono text-slate-200">
                    {settings.currencySymbol}
                    {estimatedCost.toFixed(2)} / {settings.currencySymbol}
                    {currentLimit.toFixed(0)}
                  </strong>
                </div>

                <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${
                      room.status === 'exceeded'
                        ? 'bg-red-500'
                        : room.status === 'warning'
                        ? 'bg-amber-500'
                        : 'bg-cyan-400'
                    }`}
                    style={{
                      width: `${Math.min(100, (estimatedCost / currentLimit) * 100)}%`,
                    }}
                  />
                </div>
              </div>

              {/* Occupants & Appliances count */}
              <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                <span className="flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-slate-400" />
                  {presentResidentsCount}/4 Present
                </span>
                <span>{activeAppCount} Appliances ON</span>
              </div>

              {/* Quick Action Footer */}
              <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-xs text-cyan-400 font-semibold group-hover:text-cyan-300">
                <span>View Deep Diagnostics</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </div>
            </div>
          );
        })}
      </div>

      {filteredRooms.length === 0 && (
        <div className="glass-panel p-12 text-center text-slate-400 space-y-3">
          <p className="text-sm font-semibold">No rooms match the selected filters.</p>
          <button
            onClick={() => {
              setSelectedFloor('all');
              setSelectedStatus('all');
              setSearchQuery('');
            }}
            className="text-xs text-cyan-400 hover:underline"
          >
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
};
