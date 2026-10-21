import React, { useState } from 'react';
import { useHostel } from '../../context/HostelContext';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { generate24HourTrend } from '../../utils/mockData';
import { BarChart3, PieChart as PieIcon, Calendar, Zap, TrendingUp } from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
  Legend,
} from 'recharts';

export const AnalyticsPage: React.FC = () => {
  const { rooms, settings } = useHostel();
  const [timeRange, setTimeRange] = useState<'today' | '7days' | '30days'>('30days');

  const trendData = generate24HourTrend();

  // Appliance category power breakdown
  const applianceTotals: Record<string, number> = {};
  rooms.forEach((room) => {
    room.appliances.forEach((app) => {
      if (app.isOn) {
        applianceTotals[app.name] = (applianceTotals[app.name] || 0) + app.powerWatts;
      }
    });
  });

  const COLORS = ['#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#3b82f6'];

  const appliancePieData = Object.keys(applianceTotals).map((name) => ({
    name,
    watts: applianceTotals[name],
  }));

  // Top 5 consuming rooms
  const sortedRooms = [...rooms]
    .sort((a, b) => b.monthlyUsageKwh - a.monthlyUsageKwh)
    .slice(0, 5)
    .map((r) => ({
      room: `Room ${r.roomNumber}`,
      kwh: r.monthlyUsageKwh,
      cost: parseFloat((r.monthlyUsageKwh * settings.electricityRate).toFixed(2)),
    }));

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header & Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-white m-0 flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-cyan-400" />
            Hostel Energy Analytics Hub
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Historical consumption trends, load distribution, and appliance share
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-900/90 p-1.5 rounded-xl border border-slate-800">
          <Calendar className="w-4 h-4 text-slate-400 ml-2" />
          {(['today', '7days', '30days'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg capitalize transition-all ${
                timeRange === range
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {range === '7days' ? '7 Days' : range === '30days' ? '30 Days' : 'Today'}
            </button>
          ))}
        </div>
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Appliance Share Pie Chart */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-white m-0 flex items-center gap-2">
                <PieIcon className="w-4 h-4 text-cyan-400" />
                Active Appliance Load Distribution
              </h2>
              <p className="text-xs text-slate-400">Share of total active wattage</p>
            </div>
            <Badge variant="cyan" size="sm">
              Live Share
            </Badge>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={appliancePieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={4}
                  dataKey="watts"
                >
                  {appliancePieData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '0.75rem',
                    color: '#f8fafc',
                    fontSize: '12px',
                  }}
                  formatter={(val: any) => [`${val} Watts`, 'Power']}
                />
                <Legend
                  wrapperStyle={{ fontSize: '11px', color: '#94a3b8' }}
                  layout="horizontal"
                  align="center"
                  verticalAlign="bottom"
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Top Consuming Rooms Bar Chart */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-white m-0 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-amber-400" />
                Top 5 Consuming Hostel Rooms
              </h2>
              <p className="text-xs text-slate-400">Monthly projected consumption (kWh)</p>
            </div>
            <Badge variant="amber" size="sm">
              High Demand
            </Badge>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sortedRooms} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis type="number" stroke="#64748b" fontSize={11} unit=" kWh" />
                <YAxis dataKey="room" type="category" stroke="#64748b" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '0.75rem',
                    color: '#f8fafc',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="kwh" fill="#f59e0b" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
};
