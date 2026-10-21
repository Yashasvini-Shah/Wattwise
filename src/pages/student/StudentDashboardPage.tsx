import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useHostel } from '../../context/HostelContext';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import {
  Zap,
  Thermometer,
  Droplets,
  Users,
  Power,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  Fan,
  Lightbulb,
  Tv,
  Laptop,
  Snowflake,
  Flame,
  Info,
} from 'lucide-react';
import type { ApplianceType } from '../../types/hostel';

export const StudentDashboardPage: React.FC = () => {
  const { authState } = useAuth();
  const { rooms, settings, toggleAppliance, toggleResidentPresence } = useHostel();

  const userRoomId = authState.user?.roomId || '301';
  const room = rooms.find((r) => r.id === userRoomId) || rooms[0];

  if (!room) {
    return <div className="p-8 text-center text-slate-400">Room data not found.</div>;
  }

  const currentLimit = room.customLimit ?? settings.monthlyChargeLimit;
  const estimatedMonthlyCost = room.monthlyUsageKwh * settings.electricityRate;
  const percentUsed = Math.min(100, Math.round((estimatedMonthlyCost / currentLimit) * 100));

  const presentCount = room.residents.filter((r) => r.isPresent).length;

  const getApplianceIcon = (type: ApplianceType) => {
    switch (type) {
      case 'fan':
        return <Fan className="w-5 h-5" />;
      case 'light':
      case 'lamp':
        return <Lightbulb className="w-5 h-5" />;
      case 'ac':
        return <Snowflake className="w-5 h-5" />;
      case 'laptop':
        return <Laptop className="w-5 h-5" />;
      case 'fridge':
        return <Tv className="w-5 h-5" />;
      default:
        return <Power className="w-5 h-5" />;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Banner Card */}
      <div className="glass-panel p-6 border-cyan-500/30 bg-gradient-to-r from-slate-900 via-slate-900/90 to-cyan-950/40 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-3">
              <span className="text-3xl font-black text-white tracking-tight">
                Room {room.roomNumber}
              </span>
              <Badge variant="cyan" size="md">
                Floor {room.floor}
              </Badge>
              {room.status === 'normal' && (
                <Badge variant="emerald" icon={<CheckCircle className="w-3.5 h-3.5" />}>
                  Optimal Energy Status
                </Badge>
              )}
              {room.status === 'warning' && (
                <Badge variant="amber" icon={<AlertTriangle className="w-3.5 h-3.5" />}>
                  Approaching Budget Limit
                </Badge>
              )}
              {room.status === 'exceeded' && (
                <Badge variant="red" icon={<AlertTriangle className="w-3.5 h-3.5" />}>
                  Budget Exceeded!
                </Badge>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Shared Resident Dashboard • Real-time load and limit monitoring
            </p>
          </div>

          <div className="flex items-center gap-4 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
            <div className="flex items-center gap-2">
              <Thermometer className="w-4 h-4 text-cyan-400" />
              <div>
                <div className="text-[10px] text-slate-400 uppercase">Room Temp</div>
                <div className="text-sm font-bold text-slate-100">{room.temperature}°C</div>
              </div>
            </div>
            <div className="h-6 w-px bg-slate-800" />
            <div className="flex items-center gap-2">
              <Droplets className="w-4 h-4 text-blue-400" />
              <div>
                <div className="text-[10px] text-slate-400 uppercase">Humidity</div>
                <div className="text-sm font-bold text-slate-100">{room.humidity}%</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main KPI Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Real-time Load Card */}
        <Card className="flex flex-col justify-between border-cyan-500/20">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Live Power Load
            </span>
            <Zap className="w-5 h-5 text-cyan-400 animate-pulse" />
          </div>
          <div className="my-4">
            <div className="text-4xl font-extrabold text-white font-mono tracking-tight">
              {room.activePowerWatts} <span className="text-xl text-cyan-400 font-sans">Watts</span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Est. Daily Consumption: <strong className="text-slate-200">{room.dailyUsageKwh} kWh</strong>
            </p>
          </div>
          <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800">
            <div
              className="bg-cyan-400 h-full transition-all duration-300"
              style={{ width: `${Math.min(100, (room.activePowerWatts / 2000) * 100)}%` }}
            />
          </div>
        </Card>

        {/* Monthly Cost & Limit Card */}
        <Card className="flex flex-col justify-between border-emerald-500/20">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Est. Monthly Charge
            </span>
            <DollarSign className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="my-4">
            <div className="text-4xl font-extrabold text-white font-mono tracking-tight">
              {settings.currencySymbol}
              {estimatedMonthlyCost.toFixed(2)}{' '}
              <span className="text-xs font-normal text-slate-400">/ {settings.currencySymbol}{currentLimit.toFixed(2)} limit</span>
            </div>
            <div className="flex items-center justify-between text-xs mt-2">
              <span className="text-slate-400">Limit Consumption:</span>
              <span
                className={`font-bold ${
                  percentUsed > 100
                    ? 'text-red-400'
                    : percentUsed > 85
                    ? 'text-amber-400'
                    : 'text-emerald-400'
                }`}
              >
                {percentUsed}%
              </span>
            </div>
          </div>
          <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden border border-slate-800">
            <div
              className={`h-full transition-all duration-300 ${
                percentUsed > 100
                  ? 'bg-red-500 glow-red'
                  : percentUsed > 85
                  ? 'bg-amber-500 glow-amber'
                  : 'bg-emerald-400 glow-emerald'
              }`}
              style={{ width: `${percentUsed}%` }}
            />
          </div>
        </Card>

        {/* Occupancy Card */}
        <Card className="flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Resident Occupancy
            </span>
            <Users className="w-5 h-5 text-cyan-400" />
          </div>
          <div className="my-3">
            <div className="text-2xl font-bold text-white mb-2">
              {presentCount} / 4 Residents Present
            </div>
            <div className="space-y-1.5">
              {room.residents.map((resident) => (
                <div
                  key={resident.id}
                  onClick={() => toggleResidentPresence(room.id, resident.id)}
                  className={`flex items-center justify-between px-2.5 py-1 rounded-lg text-xs cursor-pointer border transition-all ${
                    resident.isPresent
                      ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                      : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:border-slate-700'
                  }`}
                  title="Click to toggle presence"
                >
                  <span className="font-medium">{resident.name}</span>
                  <span className="text-[10px] font-bold uppercase">
                    {resident.isPresent ? 'Present' : 'Away'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* Interactive Appliance Controls */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white m-0">Interactive Room Appliances</h2>
            <p className="text-xs text-slate-400">
              Toggle appliances to instantly observe live load changes & monthly bill impact.
            </p>
          </div>
          <Badge variant="cyan" size="sm">
            {room.appliances.filter((a) => a.isOn).length} Active Now
          </Badge>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {room.appliances.map((appliance) => {
            const isControllable = appliance.controllableByStudent;
            return (
              <div
                key={appliance.id}
                className={`glass-panel p-4 rounded-xl border transition-all ${
                  appliance.isOn
                    ? 'border-cyan-500/40 bg-slate-900/90 shadow-lg shadow-cyan-500/5'
                    : 'border-slate-800 bg-slate-950/60 opacity-80'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2.5 rounded-xl border ${
                        appliance.isOn
                          ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30'
                          : 'bg-slate-900 text-slate-500 border-slate-800'
                      }`}
                    >
                      {getApplianceIcon(appliance.type)}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-100 m-0">{appliance.name}</h3>
                      <span className="text-xs font-mono text-slate-400">
                        {appliance.powerWatts} Watts
                      </span>
                    </div>
                  </div>

                  {/* Toggle switch */}
                  {isControllable ? (
                    <button
                      type="button"
                      onClick={() => toggleAppliance(room.id, appliance.id)}
                      className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-200 ease-in-out ${
                        appliance.isOn ? 'bg-cyan-500' : 'bg-slate-800'
                      }`}
                      aria-label={`Toggle ${appliance.name}`}
                    >
                      <div
                        className={`bg-slate-950 w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ease-in-out ${
                          appliance.isOn ? 'translate-x-6' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  ) : (
                    <span className="text-[10px] bg-slate-900 text-slate-400 px-2 py-0.5 rounded border border-slate-800">
                      System Managed
                    </span>
                  )}
                </div>

                <div className="mt-3 pt-3 border-t border-slate-800/60 flex justify-between items-center text-xs">
                  <span className="text-slate-400">Status:</span>
                  <span
                    className={`font-semibold ${
                      appliance.isOn ? 'text-cyan-400' : 'text-slate-500'
                    }`}
                  >
                    {appliance.isOn ? 'ON (Active)' : 'OFF'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Energy Efficiency Recommendation Card */}
      {percentUsed > 80 && (
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3">
          <Info className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="text-xs text-amber-200">
            <strong className="font-bold">Eco Tip for Room {room.roomNumber}:</strong> Your monthly bill is at {percentUsed}% of the admin budget limit. Turning off the Air Conditioner or Fan when leaving the room will reduce projected cost by up to ${((room.activePowerWatts * 0.015 * 30) * 0.15).toFixed(2)}/mo.
          </div>
        </div>
      )}
    </div>
  );
};
