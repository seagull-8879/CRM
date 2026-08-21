import React, { useState } from 'react';
import {
  TrendingUp,
  DollarSign,
  Trophy,
  AlertTriangle,
  Plus,
  Search,
  Kanban,
  Table as TableIcon,
  Clock,
  Edit2,
  Sparkles,
  CheckSquare,
} from 'lucide-react';
import { useCrm } from '../../context/CrmContext';
import { OpportunityStage } from '../../types';

export const HomeView: React.FC = () => {
  const {
    opportunities,
    tasks,
    activities,
    accounts,
    contacts,
    setIsOpportunityModalOpen,
    setEditingOpportunity,
    setSelectedOpportunityForDetail,
    setSelectedAccountIdFor360,
    toggleTaskStatus,
    setCloseDealModalState,
    setIsOcrScannerOpen,
    currentUser,
  } = useCrm();

  const [viewMode, setViewMode] = useState<'table' | 'kanban'>('table');
  const [searchQuery, setSearchQuery] = useState('');
  const [stageFilter, setStageFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'amount' | 'closeDate' | 'name' | 'stage'>('amount');
  const [sortOrder] = useState<'asc' | 'desc'>('desc');

  // KPI Calculations
  const openDeals = opportunities.filter((o) => o.status === 'Open');
  const wonDeals = opportunities.filter((o) => o.status === 'Won');
  const lostDeals = opportunities.filter((o) => o.status === 'Lost');

  const openPipelineValue = openDeals.reduce((sum, o) => sum + o.amount, 0);
  const totalExpectedRevenue = openDeals.reduce((sum, o) => sum + o.expectedRevenue, 0);
  const totalWonValue = wonDeals.reduce((sum, o) => sum + o.amount, 0);
  const totalLostValue = lostDeals.reduce((sum, o) => sum + o.amount, 0);

  const winRate =
    wonDeals.length + lostDeals.length > 0
      ? Math.round((wonDeals.length / (wonDeals.length + lostDeals.length)) * 100)
      : 100;

  // Filtered & Sorted Opportunities
  const filteredOpportunities = opportunities
    .filter((opp) => {
      const matchSearch =
        opp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        opp.accountName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (opp.primaryContactName && opp.primaryContactName.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchStage = stageFilter === 'ALL' || opp.stage === stageFilter;
      const matchStatus = statusFilter === 'ALL' || opp.status === statusFilter;

      return matchSearch && matchStage && matchStatus;
    })
    .sort((a, b) => {
      let comparison = 0;
      if (sortBy === 'amount') comparison = a.amount - b.amount;
      else if (sortBy === 'closeDate') comparison = a.expectedCloseDate.localeCompare(b.expectedCloseDate);
      else if (sortBy === 'name') comparison = a.name.localeCompare(b.name);
      else if (sortBy === 'stage') comparison = a.stage.localeCompare(b.stage);

      return sortOrder === 'desc' ? -comparison : comparison;
    });

  const stagesList: OpportunityStage[] = [
    'Qualification',
    'Needs Analysis',
    'Proposal',
    'Negotiation',
    'Closed Won',
    'Closed Lost',
  ];

  const pendingTasks = tasks.filter((t) => t.status !== 'Completed').slice(0, 5);
  const recentActivityList = activities.slice(0, 6);

  return (
    <div id="home-dashboard-view" className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-[#111625] p-6 rounded-2xl shadow-xs border border-slate-200 dark:border-slate-800/80 transition-colors">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs uppercase tracking-widest font-bold text-purple-600 dark:text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
              Welcome back
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              • {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Hello, {currentUser?.name || 'Sales Professional'}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xl">
            Live opportunity pipeline & performance overview. You have {openDeals.length} active deals representing ${openPipelineValue.toLocaleString()} in total pipeline value.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsOcrScannerOpen(true)}
            className="px-4 py-2.5 bg-purple-500/10 hover:bg-purple-500/20 text-purple-700 dark:text-purple-300 rounded-xl text-xs font-semibold flex items-center gap-2 border border-purple-500/25 transition-all active:scale-[0.98] cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <span>Scan Visiting Card</span>
          </button>
          <button
            onClick={() => {
              setEditingOpportunity(null);
              setIsOpportunityModalOpen(true);
            }}
            className="px-4 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-md shadow-purple-900/20 transition-all active:scale-[0.98] cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>New Opportunity</span>
          </button>
        </div>
      </div>

      {/* KPI Cards (Open, Won, Lost, Pipeline Value) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Pipeline Value */}
        <div className="p-5 bg-white dark:bg-[#111625] border border-slate-200 dark:border-slate-800/80 rounded-2xl shadow-xs transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Open Pipeline Value
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 flex items-center justify-center font-bold">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-2">
            ${openPipelineValue.toLocaleString()}
          </div>
          <div className="flex items-center gap-2 mt-2 text-xs text-slate-500 dark:text-slate-400">
            <span className="font-semibold text-blue-600 dark:text-blue-400">{openDeals.length} Open Deals</span>
            <span>• Exp: ${totalExpectedRevenue.toLocaleString()}</span>
          </div>
        </div>

        {/* Won Value */}
        <div className="p-5 bg-white dark:bg-[#111625] border border-slate-200 dark:border-slate-800/80 rounded-2xl shadow-xs transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Closed Won Value
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center justify-center font-bold">
              <Trophy className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-2">
            ${totalWonValue.toLocaleString()}
          </div>
          <div className="flex items-center gap-2 mt-2 text-xs text-slate-500 dark:text-slate-400">
            <span className="font-semibold text-emerald-600 dark:text-emerald-400">{wonDeals.length} Deals Won</span>
            <span>• Win Rate: {winRate}%</span>
          </div>
        </div>

        {/* Closed Lost */}
        <div className="p-5 bg-white dark:bg-[#111625] border border-slate-200 dark:border-slate-800/80 rounded-2xl shadow-xs transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Closed Lost
            </span>
            <div className="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 flex items-center justify-center font-bold">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-rose-600 dark:text-rose-400 mt-2">
            ${totalLostValue.toLocaleString()}
          </div>
          <div className="flex items-center gap-2 mt-2 text-xs text-slate-500 dark:text-slate-400">
            <span className="font-semibold text-rose-600 dark:text-rose-400">{lostDeals.length} Deals Lost</span>
            <span>• Governed Reasons</span>
          </div>
        </div>

        {/* Total Managed Opportunities */}
        <div className="p-5 bg-white dark:bg-[#111625] border border-slate-200 dark:border-slate-800/80 rounded-2xl shadow-xs transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Total Opportunities
            </span>
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 flex items-center justify-center font-bold">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-2">
            {opportunities.length}
          </div>
          <div className="flex items-center gap-2 mt-2 text-xs text-slate-500 dark:text-slate-400">
            <span className="font-semibold text-purple-600 dark:text-purple-400">{accounts.length} Accounts</span>
            <span>• {contacts.length} Contacts</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Opportunities Primary Workspace (Left 2/3) + Activities & Tasks (Right 1/3) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Primary Opportunity Workspace */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white dark:bg-[#111625] border border-slate-200 dark:border-slate-800/80 rounded-2xl shadow-xs p-5 transition-colors">
            {/* Header & Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-800/80">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">Opportunities Workspace</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Manage active deals, advance stages, and close revenue
                </p>
              </div>

              {/* View Mode Toggle & Add Deal */}
              <div className="flex items-center gap-2">
                <div className="flex items-center bg-slate-100 dark:bg-[#0E121E] p-1 rounded-lg border border-slate-200 dark:border-slate-800">
                  <button
                    onClick={() => setViewMode('table')}
                    className={`p-1.5 rounded-md text-xs font-medium transition-all cursor-pointer ${
                      viewMode === 'table'
                        ? 'bg-white dark:bg-slate-800 text-purple-600 dark:text-slate-100 shadow-xs'
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                    }`}
                    title="Table View"
                  >
                    <TableIcon className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('kanban')}
                    className={`p-1.5 rounded-md text-xs font-medium transition-all cursor-pointer ${
                      viewMode === 'kanban'
                        ? 'bg-white dark:bg-slate-800 text-purple-600 dark:text-slate-100 shadow-xs'
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                    }`}
                    title="Kanban Board View"
                  >
                    <Kanban className="w-4 h-4" />
                  </button>
                </div>

                <button
                  onClick={() => {
                    setEditingOpportunity(null);
                    setIsOpportunityModalOpen(true);
                  }}
                  className="px-3 py-1.5 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white rounded-lg text-xs font-semibold shadow-xs flex items-center gap-1 transition-all cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Deal</span>
                </button>
              </div>
            </div>

            {/* Filter Bar */}
            <div className="pt-3 pb-1 flex flex-wrap items-center gap-2.5">
              <div className="relative flex-1 min-w-[180px]">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter opportunities..."
                  className="w-full pl-8.5 pr-3 py-1.5 bg-slate-50 dark:bg-[#0E121E] border border-slate-200 dark:border-slate-800 rounded-lg text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                />
              </div>

              <select
                value={stageFilter}
                onChange={(e) => setStageFilter(e.target.value)}
                className="px-2.5 py-1.5 bg-slate-50 dark:bg-[#0E121E] border border-slate-200 dark:border-slate-800 rounded-lg text-xs text-slate-700 dark:text-slate-300 focus:outline-hidden focus:ring-2 focus:ring-purple-500/20"
              >
                <option value="ALL">All Stages</option>
                {stagesList.map((stg) => (
                  <option key={stg} value={stg}>
                    {stg}
                  </option>
                ))}
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-2.5 py-1.5 bg-slate-50 dark:bg-[#0E121E] border border-slate-200 dark:border-slate-800 rounded-lg text-xs text-slate-700 dark:text-slate-300 focus:outline-hidden focus:ring-2 focus:ring-purple-500/20"
              >
                <option value="ALL">All Statuses</option>
                <option value="Open">Open Deals</option>
                <option value="Won">Closed Won</option>
                <option value="Lost">Closed Lost</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-2.5 py-1.5 bg-slate-50 dark:bg-[#0E121E] border border-slate-200 dark:border-slate-800 rounded-lg text-xs text-slate-700 dark:text-slate-300 focus:outline-hidden focus:ring-2 focus:ring-purple-500/20"
              >
                <option value="amount">Sort by Amount</option>
                <option value="closeDate">Sort by Close Date</option>
                <option value="name">Sort by Name</option>
                <option value="stage">Sort by Stage</option>
              </select>
            </div>

            {/* View Mode 1: Table View */}
            {viewMode === 'table' ? (
              <div className="mt-4 overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-xl">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-[#0E121E] border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-semibold uppercase tracking-wider">
                      <th className="py-3 px-4">Opportunity</th>
                      <th className="py-3 px-4">Account & Contact</th>
                      <th className="py-3 px-4">Stage</th>
                      <th className="py-3 px-4 text-right">Amount</th>
                      <th className="py-3 px-4">Probability</th>
                      <th className="py-3 px-4">Close Date</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800/80">
                    {filteredOpportunities.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-8 text-center text-slate-400">
                          No opportunities found matching the selected filters.
                        </td>
                      </tr>
                    ) : (
                      filteredOpportunities.map((opp) => (
                        <tr
                          key={opp.id}
                          className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors group cursor-pointer"
                          onClick={() => setSelectedOpportunityForDetail(opp)}
                        >
                          <td className="py-3 px-4 font-semibold text-slate-900 dark:text-slate-100 max-w-[200px]">
                            <div className="truncate group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                              {opp.name}
                            </div>
                            <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                              Owner: {opp.ownerName}
                            </div>
                          </td>

                          <td className="py-3 px-4 max-w-[180px]">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedAccountIdFor360(opp.accountId);
                              }}
                              className="text-blue-600 dark:text-blue-400 hover:underline font-medium truncate block text-left"
                            >
                              {opp.accountName}
                            </button>
                            {opp.primaryContactName && (
                              <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                                {opp.primaryContactName}
                              </div>
                            )}
                          </td>

                          <td className="py-3 px-4">
                            <span
                              className={`inline-block px-2 py-0.5 rounded-md font-semibold text-[11px] border ${
                                opp.stage === 'Closed Won'
                                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                                  : opp.stage === 'Closed Lost'
                                  ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20'
                                  : opp.stage === 'Negotiation'
                                  ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20'
                                  : 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20'
                              }`}
                            >
                              {opp.stage}
                            </span>
                          </td>

                          <td className="py-3 px-4 text-right font-bold text-slate-900 dark:text-slate-100">
                            ${opp.amount.toLocaleString()}
                          </td>

                          <td className="py-3 px-4">
                            <div className="flex items-center gap-1.5">
                              <div className="w-16 h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                                <div
                                  className={`h-full ${
                                    opp.probability >= 80
                                      ? 'bg-emerald-500'
                                      : opp.probability >= 50
                                      ? 'bg-blue-500'
                                      : 'bg-amber-500'
                                  }`}
                                  style={{ width: `${opp.probability}%` }}
                                />
                              </div>
                              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold">
                                {opp.probability}%
                              </span>
                            </div>
                          </td>

                          <td className="py-3 px-4 text-slate-700 dark:text-slate-300 whitespace-nowrap">
                            {opp.expectedCloseDate}
                          </td>

                          <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                            <div className="flex items-center justify-end gap-1">
                              {opp.status === 'Open' && (
                                <>
                                  <button
                                    onClick={() =>
                                      setCloseDealModalState({
                                        isOpen: true,
                                        opportunity: opp,
                                        targetStage: 'Closed Won',
                                      })
                                    }
                                    title="Mark Won"
                                    className="p-1 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/15 rounded-md transition-colors cursor-pointer"
                                  >
                                    <Trophy className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() =>
                                      setCloseDealModalState({
                                        isOpen: true,
                                        opportunity: opp,
                                        targetStage: 'Closed Lost',
                                      })
                                    }
                                    title="Mark Lost"
                                    className="p-1 text-rose-600 dark:text-rose-400 hover:bg-rose-500/15 rounded-md transition-colors cursor-pointer"
                                  >
                                    <AlertTriangle className="w-3.5 h-3.5" />
                                  </button>
                                </>
                              )}
                              <button
                                onClick={() => {
                                  setEditingOpportunity(opp);
                                  setIsOpportunityModalOpen(true);
                                }}
                                className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors cursor-pointer"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            ) : (
              /* View Mode 2: Kanban View */
              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 xl:grid-cols-6 gap-3 overflow-x-auto pb-2">
                {stagesList.map((stg) => {
                  const stageOpps = filteredOpportunities.filter((o) => o.stage === stg);
                  const stageSum = stageOpps.reduce((sum, o) => sum + o.amount, 0);

                  return (
                    <div
                      key={stg}
                      className="bg-slate-50 dark:bg-[#0E121E] border border-slate-200 dark:border-slate-800 rounded-xl p-3 flex flex-col min-w-[200px]"
                    >
                      <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800 mb-2.5">
                        <div className="font-bold text-xs text-slate-800 dark:text-slate-200 truncate">{stg}</div>
                        <span className="text-[10px] font-semibold bg-white dark:bg-[#18181B] border border-slate-200 dark:border-slate-800 px-1.5 py-0.5 rounded text-slate-700 dark:text-slate-300">
                          {stageOpps.length}
                        </span>
                      </div>
                      <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-2">
                        ${stageSum.toLocaleString()}
                      </div>

                      <div className="space-y-2 flex-1 overflow-y-auto max-h-[460px]">
                        {stageOpps.map((opp) => (
                          <div
                            key={opp.id}
                            onClick={() => setSelectedOpportunityForDetail(opp)}
                            className="p-2.5 bg-white dark:bg-[#18181B] border border-slate-200 dark:border-slate-800 rounded-lg shadow-2xs hover:border-purple-500/50 hover:bg-purple-50/20 dark:hover:bg-[#1F1F24] transition-all cursor-pointer group"
                          >
                            <div className="font-semibold text-xs text-slate-900 dark:text-slate-100 group-hover:text-purple-600 dark:group-hover:text-purple-400 line-clamp-2">
                              {opp.name}
                            </div>
                            <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 truncate">
                              {opp.accountName}
                            </div>
                            <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px]">
                              <span className="font-bold text-slate-900 dark:text-slate-100">
                                ${opp.amount.toLocaleString()}
                              </span>
                              <span className="text-slate-500 dark:text-slate-400">{opp.expectedCloseDate}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Upcoming Tasks & Recent Activities */}
        <div className="space-y-6">
          {/* Upcoming Tasks Widget */}
          <div className="bg-white dark:bg-[#111625] border border-slate-200 dark:border-slate-800/80 rounded-2xl shadow-xs p-5 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 flex items-center justify-center font-bold">
                  <CheckSquare className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Upcoming Tasks</h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">Action items and follow-ups</p>
                </div>
              </div>
              <span className="text-xs font-bold text-purple-600 dark:text-purple-400 bg-purple-500/10 border border-purple-500/20 px-2 py-0.5 rounded-full">
                {pendingTasks.length} Due
              </span>
            </div>

            <div className="space-y-2.5">
              {pendingTasks.length === 0 ? (
                <div className="p-4 text-center text-xs text-slate-400 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
                  All scheduled tasks completed!
                </div>
              ) : (
                pendingTasks.map((t) => (
                  <div
                    key={t.id}
                    className="p-3 bg-slate-50 dark:bg-[#0E121E] hover:bg-slate-100 dark:hover:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-xl flex items-start gap-2.5 transition-colors group"
                  >
                    <input
                      type="checkbox"
                      checked={t.status === 'Completed'}
                      onChange={() => toggleTaskStatus(t.id)}
                      className="mt-0.5 accent-purple-600 rounded cursor-pointer"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-semibold text-slate-900 dark:text-slate-100 line-clamp-2">
                        {t.title}
                      </div>
                      <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-500 dark:text-slate-400">
                        <span
                          className={`font-semibold px-1.5 py-0.2 rounded border ${
                            t.priority === 'High'
                              ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20'
                              : t.priority === 'Medium'
                              ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
                              : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700'
                          }`}
                        >
                          {t.priority}
                        </span>
                        <span>Due: {t.dueDate}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Recent Activity Feed Widget */}
          <div className="bg-white dark:bg-[#111625] border border-slate-200 dark:border-slate-800/80 rounded-2xl shadow-xs p-5 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 flex items-center justify-center font-bold">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Recent Activities</h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">Real-time CRM audit stream</p>
                </div>
              </div>
            </div>

            <div className="space-y-3 relative before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
              {recentActivityList.map((act) => (
                <div key={act.id} className="relative pl-6 text-xs">
                  <div className="absolute left-1 top-1.5 w-2.5 h-2.5 rounded-full bg-purple-600 border-2 border-white dark:border-[#111625]" />
                  <div className="font-semibold text-slate-900 dark:text-slate-100">{act.title}</div>
                  <div className="text-slate-500 dark:text-slate-400 mt-0.5 text-[11px] line-clamp-2">
                    {act.description}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1">
                    {new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {act.userName}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
