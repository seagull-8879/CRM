import React from 'react';
import {
  BarChart3,
  PieChart,
  Trophy,
} from 'lucide-react';
import { useCrm } from '../../context/CrmContext';
import { OpportunityStage } from '../../types';

export const AnalyticsView: React.FC = () => {
  const { opportunities, accounts } = useCrm();

  const openDeals = opportunities.filter((o) => o.status === 'Open');
  const wonDeals = opportunities.filter((o) => o.status === 'Won');
  const lostDeals = opportunities.filter((o) => o.status === 'Lost');

  const totalWonRev = wonDeals.reduce((sum, o) => sum + o.amount, 0);
  const totalLostRev = lostDeals.reduce((sum, o) => sum + o.amount, 0);
  const totalOpenRev = openDeals.reduce((sum, o) => sum + o.amount, 0);
  const totalExpectedRev = openDeals.reduce((sum, o) => sum + o.expectedRevenue, 0);

  const winRate =
    wonDeals.length + lostDeals.length > 0
      ? Math.round((wonDeals.length / (wonDeals.length + lostDeals.length)) * 100)
      : 100;

  // Pipeline by Stage
  const stages: OpportunityStage[] = [
    'Qualification',
    'Needs Analysis',
    'Proposal',
    'Negotiation',
    'Closed Won',
    'Closed Lost',
  ];

  const stageData = stages.map((stg) => {
    const oppsInStage = opportunities.filter((o) => o.stage === stg);
    const sum = oppsInStage.reduce((acc, o) => acc + o.amount, 0);
    return {
      stage: stg,
      count: oppsInStage.length,
      amount: sum,
    };
  });

  const maxStageAmount = Math.max(...stageData.map((d) => d.amount), 1);

  // Lead Source Breakdown
  const sourcesMap: Record<string, { count: number; amount: number }> = {};
  opportunities.forEach((o) => {
    const src = o.leadSource || 'Direct';
    if (!sourcesMap[src]) sourcesMap[src] = { count: 0, amount: 0 };
    sourcesMap[src].count += 1;
    sourcesMap[src].amount += o.amount;
  });

  return (
    <div id="crm-analytics-view" className="p-3.5 sm:p-6 space-y-5 sm:space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-[#111625] p-4 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800/80 shadow-xs transition-colors">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">Executive Analytics & Reports</h1>
            <span className="text-xs font-bold text-purple-600 dark:text-purple-400 bg-purple-500/10 border border-purple-500/20 px-2.5 py-0.5 rounded-full">
              Live Pipeline BI
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Real-time conversion metrics, deal velocity, win/loss analytics, and revenue forecasts
          </p>
        </div>
      </div>

      {/* Primary KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-white dark:bg-[#111625] border border-slate-200 dark:border-slate-800/80 rounded-2xl shadow-xs transition-colors">
          <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total Pipeline Value</div>
          <div className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">
            ${(totalOpenRev + totalWonRev).toLocaleString()}
          </div>
          <div className="text-xs text-blue-600 dark:text-blue-400 font-medium mt-1">
            ${totalOpenRev.toLocaleString()} actively in pipeline
          </div>
        </div>

        <div className="p-5 bg-white dark:bg-[#111625] border border-slate-200 dark:border-slate-800/80 rounded-2xl shadow-xs transition-colors">
          <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Win Rate (Won / Closed)</div>
          <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">{winRate}%</div>
          <div className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">
            {wonDeals.length} Won vs {lostDeals.length} Lost
          </div>
        </div>

        <div className="p-5 bg-white dark:bg-[#111625] border border-slate-200 dark:border-slate-800/80 rounded-2xl shadow-xs transition-colors">
          <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Weighted Forecast (Exp Rev)</div>
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 mt-1">
            ${totalExpectedRev.toLocaleString()}
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">Based on probability scoring</div>
        </div>

        <div className="p-5 bg-white dark:bg-[#111625] border border-slate-200 dark:border-slate-800/80 rounded-2xl shadow-xs transition-colors">
          <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Average Deal Size</div>
          <div className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">
            ${opportunities.length ? Math.round((totalOpenRev + totalWonRev) / opportunities.length).toLocaleString() : '0'}
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">Across {opportunities.length} opportunities</div>
        </div>
      </div>

      {/* Visual Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Pipeline Stage Funnel & Value Distribution */}
        <div className="p-6 bg-white dark:bg-[#111625] border border-slate-200 dark:border-slate-800/80 rounded-2xl shadow-xs space-y-4 transition-colors">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <span>Pipeline by Sales Stage</span>
            </h3>
            <span className="text-xs font-bold text-slate-400">Total Value ($)</span>
          </div>

          <div className="space-y-3 pt-2">
            {stageData.map((d) => {
              const pct = Math.round((d.amount / maxStageAmount) * 100);
              return (
                <div key={d.stage} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{d.stage}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-500 dark:text-slate-400">{d.count} deals</span>
                      <span className="font-bold text-slate-900 dark:text-slate-100">${d.amount.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="w-full h-3 bg-slate-100 dark:bg-[#0E121E] border border-slate-200 dark:border-slate-800/80 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        d.stage === 'Closed Won'
                          ? 'bg-emerald-500'
                          : d.stage === 'Closed Lost'
                          ? 'bg-rose-500'
                          : 'bg-gradient-to-r from-purple-600 to-blue-600'
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Chart 2: Lead Acquisition Sources */}
        <div className="p-6 bg-white dark:bg-[#111625] border border-slate-200 dark:border-slate-800/80 rounded-2xl shadow-xs space-y-4 transition-colors">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <PieChart className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>Lead Source & Acquisition Channels</span>
            </h3>
          </div>

          <div className="space-y-3 pt-2">
            {Object.entries(sourcesMap).map(([source, val]) => (
              <div
                key={source}
                className="p-3 bg-slate-50 dark:bg-[#0E121E] border border-slate-200 dark:border-slate-800 rounded-xl flex items-center justify-between text-xs"
              >
                <div>
                  <div className="font-bold text-slate-900 dark:text-slate-100">{source}</div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">{val.count} linked opportunities</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-blue-600 dark:text-blue-400">${val.amount.toLocaleString()}</div>
                  <div className="text-[10px] text-slate-400">Total pipeline value</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Closed Deals Governance & Win/Loss Audit Breakdown */}
      <div className="p-6 bg-white dark:bg-[#111625] border border-slate-200 dark:border-slate-800/80 rounded-2xl shadow-xs space-y-4 transition-colors">
        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Trophy className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>Closed Won & Closed Lost Governance Analysis (BR-04)</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
          {/* Won Deals Column */}
          <div className="p-4 bg-emerald-500/5 dark:bg-emerald-950/20 border border-emerald-500/20 dark:border-emerald-900/40 rounded-xl space-y-3">
            <div className="font-bold text-emerald-700 dark:text-emerald-400 text-xs uppercase tracking-wider flex items-center justify-between">
              <span>Winning Opportunities</span>
              <span className="text-emerald-700 dark:text-emerald-400 font-bold">${totalWonRev.toLocaleString()}</span>
            </div>
            <div className="space-y-2">
              {wonDeals.map((w) => (
                <div key={w.id} className="p-2.5 bg-white dark:bg-[#0E121E] border border-slate-200 dark:border-slate-800 rounded-lg text-xs">
                  <div className="font-semibold text-slate-900 dark:text-slate-100 flex items-center justify-between">
                    <span>{w.name}</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">${w.amount.toLocaleString()}</span>
                  </div>
                  <div className="text-[11px] text-slate-600 dark:text-slate-400 mt-1">
                    Win Factor: <span className="text-emerald-700 dark:text-emerald-300 font-medium">{w.wonLostReason || 'N/A'}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Lost Deals Column */}
          <div className="p-4 bg-rose-500/5 dark:bg-rose-950/20 border border-rose-500/20 dark:border-rose-900/40 rounded-xl space-y-3">
            <div className="font-bold text-rose-700 dark:text-rose-400 text-xs uppercase tracking-wider flex items-center justify-between">
              <span>Lost Opportunities</span>
              <span className="text-rose-700 dark:text-rose-400 font-bold">${totalLostRev.toLocaleString()}</span>
            </div>
            <div className="space-y-2">
              {lostDeals.length === 0 ? (
                <div className="text-slate-400 text-xs p-4 text-center">No lost opportunities recorded.</div>
              ) : (
                lostDeals.map((l) => (
                  <div key={l.id} className="p-2.5 bg-white dark:bg-[#0E121E] border border-slate-200 dark:border-slate-800 rounded-lg text-xs">
                    <div className="font-semibold text-slate-900 dark:text-slate-100 flex items-center justify-between">
                      <span>{l.name}</span>
                      <span className="font-bold text-rose-600 dark:text-rose-400">${l.amount.toLocaleString()}</span>
                    </div>
                    <div className="text-[11px] text-slate-600 dark:text-slate-400 mt-1">
                      Reason: <span className="text-rose-700 dark:text-rose-300 font-medium">{l.wonLostReason || 'N/A'}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
