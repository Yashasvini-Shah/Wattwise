import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useHostel } from '../../context/HostelContext';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import {
  ArrowLeft,
  Zap,
  Thermometer,
  Droplets,
  Users,
  Power,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  Sliders,
  Save,
} from 'lucide-react';

export const RoomDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { rooms, settings, toggleAppliance, toggleResidentPresence, updateRoomLimit } =
    useHostel();

  const room = rooms.find((r) => r.id === id);

  const [customLimitInput, setCustomLimitInput] = useState<string>(
    room?.customLimit?.toString() || settings.monthlyChargeLimit.toString()
  );
  const [saveSuccess, setSaveSuccess] = useState(false);

  if (!room) {
    return (
      <div className="p-8 text-center space-y-4">
        <p className="text-slate-400">Room not found.</p>
        <button
          onClick={() => navigate('/admin/rooms')}
          className="text-xs text-cyan-400 hover:underline"
        >
          &larr; Back to Room Monitoring
        </button>
      </div>
    );
  }

  const currentLimit = room.customLimit ?? settings.monthlyChargeLimit;
  const estimatedCost = room.monthlyUsageKwh * settings.electricityRate;
  const percentUsed = Math.min(100, Math.round((estimatedCost / currentLimit) * 100));

  const handleSaveLimit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(customLimitInput);
    if (!isNaN(val) && val > 0) {
      updateRoomLimit(room.id, val);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Breadcrumb & Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/admin/rooms')}
          className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-cyan-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Room Monitoring
        </button>

        <div className="flex items-center gap-2">
          {room.status === 'exceeded' && (
            <Badge variant="red" icon={<AlertTriangle className="w-3.5 h-3.5" />}>
              Exceeded Monthly Limit
            </Badge>
          )}
          {room.status === 'warning' && (
            <Badge variant="amber" icon={<AlertTriangle className="w-3.5 h-3.5" />}>
              Approaching Limit
            </Badge>
          )}
          {room.status === 'normal' && (
            <Badge variant="emerald" icon={<CheckCircle className="w-3.5 h-3.5" />}>
              Normal Operations
            </Badge>
          )}
        </div>
      </div>

      {/* Main Header Details */}
      <div className="glass-panel p-6 border-cyan-500/30 bg-gradient-to-r from-slate-900 via-slate-900 to-cyan-950/30">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-black text-white tracking-tight m-0">
                Room {room.roomNumber} Diagnostic Center
              </h1>
              <Badge variant="cyan">Floor {room.floor}</Badge>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Admin Granular Controls & Microclimate Telemetry
            </p>
          </div>

          <div className="flex items-center gap-4 bg-slate-950/80 p-3.5 rounded-xl border border-slate-800">
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

      {/* Metric Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Live Power Load Card */}
        <Card className="border-cyan-500/20">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-slate-400">Current Load</span>
            <Zap className="w-5 h-5 text-cyan-400" />
          </div>
          <div className="my-4">
            <div className="text-4xl font-extrabold text-white font-mono">
              {room.activePowerWatts} <span className="text-lg font-sans text-cyan-400">Watts</span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Estimated Daily: <strong className="text-slate-200">{room.dailyUsageKwh} kWh</strong>
            </p>
          </div>
        </Card>

        {/* Cost & Budget Allocation Card */}
        <Card className="border-emerald-500/20">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-slate-400">
              Est. Monthly Bill
            </span>
            <DollarSign className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="my-4">
            <div className="text-4xl font-extrabold text-white font-mono">
              {settings.currencySymbol}
              {estimatedCost.toFixed(2)}
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Allocated Cap: {settings.currencySymbol}
              {currentLimit.toFixed(2)} ({percentUsed}% consumed)
            </p>
          </div>
          <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800">
            <div
              className={`h-full ${
                percentUsed > 100
                  ? 'bg-red-500'
                  : percentUsed > 85
                  ? 'bg-amber-500'
                  : 'bg-emerald-400'
              }`}
              style={{ width: `${percentUsed}%` }}
            />
          </div>
        </Card>

        {/* Custom Limit Adjustment Form */}
        <Card>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase text-slate-400 flex items-center gap-1.5">
              <Sliders className="w-4 h-4 text-cyan-400" />
              Room Budget Limit
            </span>
          </div>

          <form onSubmit={handleSaveLimit} className="space-y-3 mt-3">
            <div>
              <label className="block text-[11px] text-slate-400 mb-1">
                Custom Limit ({settings.currencySymbol}):
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  step="1"
                  min="10"
                  max="500"
                  value={customLimitInput}
                  onChange={(e) => setCustomLimitInput(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 text-xs font-bold bg-cyan-500 text-slate-950 rounded-lg hover:bg-cyan-400 transition-colors flex items-center gap-1 shrink-0"
                >
                  <Save className="w-3.5 h-3.5" /> Save
                </button>
              </div>
            </div>
            {saveSuccess && (
              <p className="text-[11px] text-emerald-400 font-semibold animate-in fade-in">
                Budget cap updated successfully!
              </p>
            )}
          </form>
        </Card>
      </div>

      {/* Occupants & Appliance Management */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Residents Occupancy list */}
        <Card className="md:col-span-1 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 m-0">
              <Users className="w-4 h-4 text-cyan-400" />
              Room Residents
            </h3>
            <Badge variant="cyan" size="sm">
              {room.residents.filter((r) => r.isPresent).length} / 4 Present
            </Badge>
          </div>

          <div className="space-y-2">
            {room.residents.map((resident) => (
              <div
                key={resident.id}
                onClick={() => toggleResidentPresence(room.id, resident.id)}
                className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                  resident.isPresent
                    ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                    : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="text-xs font-bold text-white">{resident.name}</div>
                  <div className="text-[10px] text-slate-400">ID: {resident.id}</div>
                </div>
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded border border-slate-800">
                  {resident.isPresent ? 'Present' : 'Away'}
                </span>
              </div>
            ))}
          </div>
        </Card>

        {/* Appliances Control Grid */}
        <Card className="md:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2 m-0">
                <Power className="w-4 h-4 text-cyan-400" />
                Appliance Telemetry & Override Controls
              </h3>
              <p className="text-xs text-slate-400">Admin direct toggle capability</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {room.appliances.map((app) => (
              <div
                key={app.id}
                className={`p-3.5 rounded-xl border transition-all flex items-center justify-between ${
                  app.isOn
                    ? 'bg-slate-900/90 border-cyan-500/40'
                    : 'bg-slate-950/60 border-slate-800 opacity-70'
                }`}
              >
                <div>
                  <div className="text-xs font-bold text-white">{app.name}</div>
                  <div className="text-[11px] font-mono text-cyan-400">{app.powerWatts} W</div>
                </div>

                <button
                  type="button"
                  onClick={() => toggleAppliance(room.id, app.id)}
                  className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                    app.isOn ? 'bg-cyan-500' : 'bg-slate-800'
                  }`}
                >
                  <div
                    className={`bg-slate-950 w-4 h-4 rounded-full shadow-md transform transition-transform ${
                      app.isOn ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};
