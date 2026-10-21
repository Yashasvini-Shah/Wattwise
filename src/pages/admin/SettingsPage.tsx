import React, { useState } from 'react';
import { useHostel } from '../../context/HostelContext';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import {
  Settings,
  DollarSign,
  Zap,
  Eye,
  RefreshCw,
  Save,
  CheckCircle,
  Sliders,
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { settings, updateSettings, resetSystemData } = useHostel();

  const [rateInput, setRateInput] = useState(settings.electricityRate.toString());
  const [limitInput, setLimitInput] = useState(settings.monthlyChargeLimit.toString());
  const [thresholdInput, setThresholdInput] = useState(
    settings.autoAlertThresholdWatts.toString()
  );
  const [currencySymbol, setCurrencySymbol] = useState(settings.currencySymbol);

  const [saveSuccess, setSaveSuccess] = useState(false);
  const [resetConfirmOpen, setResetConfirmOpen] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const rate = parseFloat(rateInput);
    const limit = parseFloat(limitInput);
    const threshold = parseInt(thresholdInput, 10);

    if (!isNaN(rate) && !isNaN(limit) && !isNaN(threshold)) {
      updateSettings({
        electricityRate: rate,
        monthlyChargeLimit: limit,
        autoAlertThresholdWatts: threshold,
        currencySymbol,
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
    }
  };

  const handleReset = () => {
    resetSystemData();
    setResetConfirmOpen(false);
    setRateInput('0.15');
    setLimitInput('50.00');
    setThresholdInput('1400');
    setCurrencySymbol('$');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black tracking-tight text-white m-0 flex items-center gap-2">
          <Settings className="w-6 h-6 text-cyan-400" />
          Admin System Settings
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Configure global electricity tariffs, room allocations, student preview mode, and alerts
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Settings Form (2 cols) */}
        <Card className="lg:col-span-2">
          <form onSubmit={handleSave} className="space-y-6">
            <h2 className="text-base font-bold text-white m-0 flex items-center gap-2 border-b border-slate-800 pb-3">
              <Sliders className="w-4 h-4 text-cyan-400" />
              Global Energy & Billing Tariff Configuration
            </h2>

            {/* Electricity Rate */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                  Electricity Rate per kWh
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  max="10"
                  required
                  value={rateInput}
                  onChange={(e) => setRateInput(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white font-mono focus:outline-none focus:border-cyan-500"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  Default: $0.15/kWh (or ₹8.00/kWh)
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-300 mb-1.5">
                  Currency Symbol
                </label>
                <select
                  value={currencySymbol}
                  onChange={(e) => setCurrencySymbol(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500"
                >
                  <option value="$">$ (USD)</option>
                  <option value="₹">₹ (INR)</option>
                  <option value="€">€ (EUR)</option>
                  <option value="£">£ (GBP)</option>
                </select>
              </div>
            </div>

            {/* Monthly Budget Limit */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-300 mb-1.5">
                  Default Room Monthly Budget Limit ({currencySymbol})
                </label>
                <input
                  type="number"
                  step="1"
                  min="10"
                  max="1000"
                  required
                  value={limitInput}
                  onChange={(e) => setLimitInput(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white font-mono focus:outline-none focus:border-cyan-500"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  Standard allocation per room per month
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-cyan-400" />
                  Auto-Alert Threshold (Watts)
                </label>
                <input
                  type="number"
                  step="50"
                  min="500"
                  max="5000"
                  required
                  value={thresholdInput}
                  onChange={(e) => setThresholdInput(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white font-mono focus:outline-none focus:border-cyan-500"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  Triggers warning if instantaneous room load exceeds this
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-800">
              {saveSuccess ? (
                <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1.5 animate-in fade-in">
                  <CheckCircle className="w-4 h-4" /> System settings updated!
                </span>
              ) : (
                <span className="text-xs text-slate-400">Changes take effect immediately</span>
              )}

              <button
                type="submit"
                className="px-5 py-2.5 text-xs font-bold rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 hover:from-cyan-400 hover:to-emerald-400 shadow-md shadow-cyan-500/20 flex items-center gap-2 transition-all"
              >
                <Save className="w-4 h-4" /> Save System Settings
              </button>
            </div>
          </form>
        </Card>

        {/* Student Preview Mode & Reset Card (1 col) */}
        <div className="space-y-6">
          {/* Student Preview Switcher */}
          <Card className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2 m-0">
                <Eye className="w-4 h-4 text-cyan-400" />
                Student Preview Mode
              </h3>
              <Badge variant={settings.studentPreviewMode ? 'amber' : 'slate'} size="sm">
                {settings.studentPreviewMode ? 'ACTIVE' : 'OFF'}
              </Badge>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Allows administrators to simulate and test the restricted student dashboard interface without needing student credentials.
            </p>

            <button
              type="button"
              onClick={() =>
                updateSettings({ studentPreviewMode: !settings.studentPreviewMode })
              }
              className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                settings.studentPreviewMode
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30'
                  : 'bg-slate-900 text-cyan-400 border border-slate-800 hover:bg-slate-800'
              }`}
            >
              <Eye className="w-4 h-4" />
              {settings.studentPreviewMode ? 'Disable Preview Mode' : 'Enable Student Preview Mode'}
            </button>
          </Card>

          {/* Reset System Data Card */}
          <Card className="border-red-500/20 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2 m-0">
                <RefreshCw className="w-4 h-4 text-red-400" />
                Reset System State
              </h3>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Resets all 25 room states, appliance configurations, alerts, and settings back to initial factory demo values in `localStorage`.
            </p>

            {resetConfirmOpen ? (
              <div className="space-y-2 animate-in fade-in">
                <p className="text-[11px] text-red-400 font-bold">Are you sure? This cannot be undone.</p>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleReset}
                    className="flex-1 py-2 text-xs font-bold rounded-lg bg-red-500 text-white hover:bg-red-600"
                  >
                    Confirm Reset
                  </button>
                  <button
                    type="button"
                    onClick={() => setResetConfirmOpen(false)}
                    className="px-3 py-2 text-xs text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setResetConfirmOpen(true)}
                className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500/20 transition-colors"
              >
                Reset All Local Data
              </button>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};
