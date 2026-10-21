import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useHostel } from '../../context/HostelContext';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { generate24HourTrend } from '../../utils/mockData';
import {
  Zap,
  DollarSign,
  Building,
  AlertTriangle,
  ArrowUpRight,
  TrendingUp,
  BarChart2,
  Users,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  CartesianGrid,
} from 'recharts';

export const OverviewPage: React.FC = () => {
  const navigate = useNavigate();
  const { rooms, settings, alerts } = useHostel();

  const totalWatts = rooms.reduce((sum, r) => sum + r.activePowerWatts, 0);
  const totalKw = (totalWatts / 1000).toFixed(2);

  const totalMonthlyKwh = rooms.reduce((sum, r) => sum + r.monthlyUsageKwh, 0);
  const totalMonthlyCost = (totalMonthlyKwh * settings.electricityRate).toFixed(2);

  const totalResidentsPresent = rooms.reduce(
    (sum, r) => sum + r.residents.filter((res) => res.isPresent).length,
    0
  );
  const maxPossibleResidents = rooms.length * 4;
  const occupancyPercentage = Math.round((totalResidentsPresent / maxPossibleResidents) * 100);

  const activeAlerts = alerts.filter((a) => !a.dismissed);
  const overLimitRoomsCount = rooms.filter((r) => r.status === 'exceeded').length;

  const trendData = generate24HourTrend();

  // Floor aggregated energy load data
  const floorData = [1, 2, 3, 4, 5].map((floorNum) => {
    const floorRooms = rooms.filter((r) => r.floor === floorNum);
    const floorWatts = floorRooms.reduce((sum, r) => sum + r.activePowerWatts, 0);
    const floorMonthlyKwh = floorRooms.reduce((sum, r) => sum + r.monthlyUsageKwh, 0);
    return {
      floor: `Floor ${floorNum}`,
      loadKw: parseFloat((floorWatts / 1000).toFixed(2)),
      monthlyKwh: Math.round(floorMonthlyKwh),
    };
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-white m-0">
            Executive Energy Overview
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time analytics across all 5 floors and 25 hostel rooms
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/admin/rooms')}
            className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/30 transition-all flex items-center gap-1.5"
          >
            Monitor Rooms
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Top KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-cyan-500/20">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Total Hostel Load
            </span>
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400">
              <Zap className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-black text-white font-mono">{totalKw} kW</div>
            <div className="flex items-center gap-1 text-xs text-cyan-400 mt-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>{totalWatts} Active Watts</span>
            </div>
          </div>
        </Card>

        <Card className="border-emerald-500/20">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Projected Monthly Cost
            </span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-black text-white font-mono">
              {settings.currencySymbol}
              {totalMonthlyCost}
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Rate: <strong className="text-slate-200">{settings.currencySymbol}{settings.electricityRate}/kWh</strong>
            </p>
          </div>
        </Card>

        <Card className="border-blue-500/20">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Hostel Occupancy
            </span>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-black text-white font-mono">{occupancyPercentage}%</div>
            <p className="text-xs text-slate-400 mt-1">
              <strong className="text-slate-200">{totalResidentsPresent}</strong> / {maxPossibleResidents} Residents Present
            </p>
          </div>
        </Card>

        <Card className="border-amber-500/20">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Budget & Load Alerts
            </span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <div className="text-3xl font-black text-white font-mono">{activeAlerts.length}</div>
            <div className="flex items-center gap-1">
              {overLimitRoomsCount > 0 && (
                <Badge variant="red" size="sm">
                  {overLimitRoomsCount} Exceeded
                </Badge>
              )}
            </div>
          </div>
        </Card>
      </div>

      {/* Visual Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 24h Trend Chart (2 cols) */}
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-white m-0 flex items-center gap-2">
                <BarChart2 className="w-4 h-4 text-cyan-400" />
                24-Hour Energy Load Profile (kW)
              </h2>
              <p className="text-xs text-slate-400">Aggregated hostel electrical demand curve</p>
            </div>
            <Badge variant="cyan" size="sm">
              Live Simulation
            </Badge>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="cyanGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="hour" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} unit=" kW" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '0.75rem',
                    color: '#f8fafc',
                    fontSize: '12px',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="totalKw"
                  stroke="#06b6d4"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#cyanGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Floor Breakdown Bar Chart (1 col) */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-white m-0 flex items-center gap-2">
                <Building className="w-4 h-4 text-emerald-400" />
                Load by Floor (kW)
              </h2>
              <p className="text-xs text-slate-400">Current power allocation</p>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={floorData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="floor" stroke="#64748b" fontSize={10} />
                <YAxis stroke="#64748b" fontSize={11} unit=" kW" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '0.75rem',
                    color: '#f8fafc',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="loadKw" fill="#10b981" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Room Status Summary Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-white m-0">Quick Room Status Summary</h2>
          <button
            onClick={() => navigate('/admin/rooms')}
            className="text-xs text-cyan-400 hover:underline font-semibold"
          >
            View All 25 Rooms &rarr;
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {rooms.slice(0, 10).map((room) => {
            const cost = (room.monthlyUsageKwh * settings.electricityRate).toFixed(1);
            return (
              <div
                key={room.id}
                onClick={() => navigate(`/admin/rooms/${room.id}`)}
                className={`glass-panel p-3.5 rounded-xl border cursor-pointer glass-panel-hover flex flex-col justify-between ${
                  room.status === 'exceeded'
                    ? 'border-red-500/40 bg-red-950/20'
                    : room.status === 'warning'
                    ? 'border-amber-500/40 bg-amber-950/20'
                    : 'border-slate-800'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-sm text-white">Room {room.roomNumber}</span>
                  <span className="text-[10px] text-slate-400">F{room.floor}</span>
                </div>
                <div className="my-2">
                  <div className="text-xs font-mono font-bold text-cyan-400">
                    {room.activePowerWatts} W
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Est: {settings.currencySymbol}{cost}
                  </div>
                </div>
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-slate-400">
                    {room.residents.filter((r) => r.isPresent).length}/4 Present
                  </span>
                  {room.status === 'exceeded' && (
                    <span className="text-red-400 font-bold">Over Limit</span>
                  )}
                  {room.status === 'warning' && (
                    <span className="text-amber-400 font-bold">Warning</span>
                  )}
                  {room.status === 'normal' && (
                    <span className="text-emerald-400 font-medium">Normal</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
