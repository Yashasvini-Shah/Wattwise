import React from 'react';
import { useHostel } from '../../context/HostelContext';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import {
  Sparkles,
  Zap,
  TrendingDown,
  CheckCircle,
  AlertCircle,
  Clock,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';

export const AiInsightsPage: React.FC = () => {
  const { recommendations, applyRecommendation } = useHostel();

  const totalPotentialSavings = recommendations.reduce((sum, r) => {
    if (r.applied) return sum;
    const match = r.potentialSavings.match(/\$([\d.]+)/);
    return sum + (match ? parseFloat(match[1]) : 0);
  }, 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-white m-0 flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-emerald-400" />
            AI Energy Efficiency Insights
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Automated load optimization, anomaly detection, and energy savings engine
          </p>
        </div>

        <div className="glass-panel px-4 py-2 rounded-xl border border-emerald-500/30 flex items-center gap-3">
          <div className="p-2 rounded-lg bg-emerald-500/15 text-emerald-400">
            <TrendingDown className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] text-slate-400 uppercase font-semibold">
              Potential Savings
            </div>
            <div className="text-base font-extrabold text-white font-mono">
              ${totalPotentialSavings.toFixed(2)} / month
            </div>
          </div>
        </div>
      </div>

      {/* Recommendations Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {recommendations.map((rec) => (
          <Card
            key={rec.id}
            className={`border transition-all flex flex-col justify-between ${
              rec.applied
                ? 'border-slate-800 opacity-60 bg-slate-950/40'
                : 'border-emerald-500/30 bg-gradient-to-b from-slate-900/90 to-slate-950/90 shadow-xl shadow-emerald-500/5'
            }`}
          >
            <div>
              {/* Category & Impact Header */}
              <div className="flex items-center justify-between mb-3">
                <Badge
                  variant={rec.impact === 'high' ? 'emerald' : 'cyan'}
                  size="sm"
                  icon={<Zap className="w-3 h-3" />}
                >
                  {rec.impact.toUpperCase()} IMPACT
                </Badge>

                {rec.roomId && (
                  <span className="text-xs font-semibold text-slate-300 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                    Room {rec.roomId}
                  </span>
                )}
              </div>

              {/* Title & Description */}
              <h3 className="text-base font-bold text-white mb-2">{rec.title}</h3>
              <p className="text-xs text-slate-300 leading-relaxed mb-4">{rec.description}</p>
            </div>

            {/* Savings & Action */}
            <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
              <div>
                <div className="text-[10px] text-slate-400 uppercase">Estimated Savings</div>
                <div className="text-sm font-extrabold text-emerald-400 font-mono">
                  {rec.potentialSavings}
                </div>
              </div>

              {rec.applied ? (
                <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/30">
                  <CheckCircle className="w-4 h-4" /> Applied
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => applyRecommendation(rec.id)}
                  className="px-4 py-2 text-xs font-bold rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 hover:from-emerald-400 hover:to-cyan-400 shadow-md shadow-emerald-500/20 flex items-center gap-1.5 transition-all"
                >
                  {rec.actionText}
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </Card>
        ))}
      </div>

      {/* AI Energy Tip Banner */}
      <div className="glass-panel p-5 rounded-xl border border-cyan-500/20 bg-slate-900/60 flex items-start gap-4">
        <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 shrink-0">
          <ShieldAlert className="w-6 h-6" />
        </div>
        <div className="text-xs text-slate-300 space-y-1">
          <h4 className="text-sm font-bold text-white m-0">Continuous Hostel Telemetry Engine</h4>
          <p>
            WattWise AI monitors thermal comfort vs appliance power draw every 15 minutes. Smart eco-rules prevent unnecessary HVAC runtimes when room occupants leave for lectures, cutting hostel utility overhead by up to 24%.
          </p>
        </div>
      </div>
    </div>
  );
};
