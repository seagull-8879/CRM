import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  PieChart,
  DollarSign,
  Trophy,
  AlertTriangle,
  Users,
  Building2,
  Calendar,
  Layers,
} from 'lucide-react';
import { useCrm } from '../../context/CrmContext';
import { OpportunityStage } from '../../types';

export const AnalyticsView: React.FC = () => {
  const { opportunities, accounts, contacts } = useCrm();

  const [timeRange, setTimeRange] = useState<'All' | 'Q1' | 'Q2' | 'Q3' | 'Q4'>('All');

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

  // Industry Breakdown
  const industryMap: Record<string, number> = {};
  accounts.forEach((a) => {
    industryMap[a.industry] = (industryMap[a.industry] || 0) + 1;
  });

  return (
    <div id="crm-analytics-view" className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-zinc-100 tracking-tight">Executive Analytics & Reports</h1>
            <span className="text-xs font-bold text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2.5 py-0.5 rounded-full">
              Live Pipeline BI
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Real-time conversion metrics, deal velocity, win/loss analytics, and revenue forecasts
          </p>
        </div>
      </div>

      {/* Primary KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-[#161619] border border-zinc-800 rounded-2xl shadow-xs">
          <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Total Pipeline Value</div>
          <div className="text-2xl font-bold text-zinc-100 mt-1">
            ${(totalOpenRev + totalWonRev).toLocaleString()}
          </div>
          <div className="text-xs text-blue-400 font-medium mt-1">
            ${totalOpenRev.toLocaleString()} actively in negotiation
          </div>
        </div>

        <div className="p-5 bg-[#161619] border border-zinc-800 rounded-2xl shadow-xs">
          <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Win Rate (Won / Closed)</div>
          <div className="text-2xl font-bold text-emerald-400 mt-1">{winRate}%</div>
          <div className="text-xs text-zinc-400 font-medium mt-1">
            {wonDeals.length} Won vs {lostDeals.length} Lost
          </div>
        </div>

        <div className="p-5 bg-[#161619] border border-zinc-800 rounded-2xl shadow-xs">
          <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Weighted Forecast (Exp Rev)</div>
          <div className="text-2xl font-bold text-indigo-400 mt-1">
            ${totalExpectedRev.toLocaleString()}
          </div>
          <div className="text-xs text-zinc-400 font-medium mt-1">Based on probability scoring</div>
        </div>

        <div className="p-5 bg-[#161619] border border-zinc-800 rounded-2xl shadow-xs">
          <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Average Deal Size</div>
          <div className="text-2xl font-bold text-zinc-100 mt-1">
            ${opportunities.length ? Math.round((totalOpenRev + totalWonRev) / opportunities.length).toLocaleString() : '0'}
          </div>
          <div className="text-xs text-zinc-400 font-medium mt-1">Across {opportunities.length} total opportunities</div>
        </div>
      </div>

      {/* Visual Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Pipeline Stage Funnel & Value Distribution */}
        <div className="p-6 bg-[#161619] border border-zinc-800 rounded-2xl shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-zinc-100 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-blue-400" />
              <span>Pipeline by Sales Stage</span>
            </h3>
            <span className="text-xs font-bold text-zinc-500">Total Value ($)</span>
          </div>

          <div className="space-y-3 pt-2">
            {stageData.map((d) => {
              const pct = Math.round((d.amount / maxStageAmount) * 100);
              return (
                <div key={d.stage} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-zinc-200">{d.stage}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-zinc-500">{d.count} deals</span>
                      <span className="font-bold text-zinc-100">${d.amount.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="w-full h-3 bg-[#121215] border border-zinc-800/80 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        d.stage === 'Closed Won'
                          ? 'bg-emerald-500'
                          : d.stage === 'Closed Lost'
                          ? 'bg-rose-500'
                          : 'bg-blue-600'
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
        <div className="p-6 bg-[#161619] border border-zinc-800 rounded-2xl shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-zinc-100 flex items-center gap-2">
              <PieChart className="w-4 h-4 text-indigo-400" />
              <span>Lead Source & Acquisition Channels</span>
            </h3>
          </div>

          <div className="space-y-3 pt-2">
            {Object.entries(sourcesMap).map(([source, val]) => (
              <div
                key={source}
                className="p-3 bg-[#121215] border border-zinc-800 rounded-xl flex items-center justify-between text-xs"
              >
                <div>
                  <div className="font-bold text-zinc-100">{source}</div>
                  <div className="text-[11px] text-zinc-500">{val.count} linked opportunities</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-blue-400">${val.amount.toLocaleString()}</div>
                  <div className="text-[10px] text-zinc-500">Total pipeline value</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Closed Deals Governance & Win/Loss Audit Breakdown */}
      <div className="p-6 bg-[#161619] border border-zinc-800 rounded-2xl shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-zinc-100 flex items-center gap-2">
          <Trophy className="w-4 h-4 text-emerald-400" />
          <span>Closed Won & Closed Lost Governance Analysis (BR-04)</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
          {/* Won Deals Column */}
          <div className="p-4 bg-emerald-950/20 border border-emerald-900/40 rounded-xl space-y-3">
            <div className="font-bold text-emerald-400 text-xs uppercase tracking-wider flex items-center justify-between">
              <span>Winning Opportunities</span>
              <span className="text-emerald-400 font-bold">${totalWonRev.toLocaleString()}</span>
            </div>
            <div className="space-y-2">
              {wonDeals.map((w) => (
                <div key={w.id} className="p-2.5 bg-[#121215] border border-zinc-800 rounded-lg text-xs">
                  <div className="font-semibold text-zinc-100 flex items-center justify-between">
                    <span>{w.name}</span>
                    <span className="font-bold text-emerald-400">${w.amount.toLocaleString()}</span>
                  </div>
                  <div className="text-[11px] text-zinc-400 mt-1">
                    Win Factor: <span className="text-emerald-300 font-medium">{w.wonLostReason || 'N/A'}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Lost Deals Column */}
          <div className="p-4 bg-rose-950/20 border border-rose-900/40 rounded-xl space-y-3">
            <div className="font-bold text-rose-400 text-xs uppercase tracking-wider flex items-center justify-between">
              <span>Lost Opportunities</span>
              <span className="text-rose-400 font-bold">${totalLostRev.toLocaleString()}</span>
            </div>
            <div className="space-y-2">
              {lostDeals.length === 0 ? (
                <div className="text-zinc-500 text-xs p-4 text-center">No lost opportunities recorded.</div>
              ) : (
                lostDeals.map((l) => (
                  <div key={l.id} className="p-2.5 bg-[#121215] border border-zinc-800 rounded-lg text-xs">
                    <div className="font-semibold text-zinc-100 flex items-center justify-between">
                      <span>{l.name}</span>
                      <span className="font-bold text-rose-400">${l.amount.toLocaleString()}</span>
                    </div>
                    <div className="text-[11px] text-zinc-400 mt-1">
                      Reason: <span className="text-rose-300 font-medium">{l.wonLostReason || 'N/A'}</span>
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
