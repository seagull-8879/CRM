import React, { useState } from 'react';
import {
  X,
  TrendingUp,
  Building2,
  User as UserIcon,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  Edit2,
  Mail,
  Phone,
  Trophy,
  AlertTriangle,
  Clock,
} from 'lucide-react';
import { useCrm } from '../../context/CrmContext';
import { OpportunityStage } from '../../types';

export const OpportunityDetailModal: React.FC = () => {
  const {
    selectedOpportunityForDetail,
    setSelectedOpportunityForDetail,
    opportunities,
    accounts,
    contacts,
    activities,
    updateOpportunityStage,
    setEditingOpportunity,
    setIsOpportunityModalOpen,
    setSelectedAccountIdFor360,
    setCloseDealModalState,
  } = useCrm();

  const [aiInsight, setAiInsight] = useState<{
    summary?: string;
    winFactors?: string[];
    risks?: string[];
    suggestedNextSteps?: string[];
    healthScore?: number;
  } | null>(null);

  const [loadingAi, setLoadingAi] = useState(false);

  if (!selectedOpportunityForDetail) return null;

  const opp = opportunities.find((o) => o.id === selectedOpportunityForDetail.id) || selectedOpportunityForDetail;
  const account = accounts.find((a) => a.id === opp.accountId);
  const contact = contacts.find((c) => c.id === opp.primaryContactId);
  const relatedActivities = activities.filter(
    (a) => a.relatedToType === 'Opportunity' && a.relatedToId === opp.id
  );

  const stages: OpportunityStage[] = [
    'Qualification',
    'Needs Analysis',
    'Proposal',
    'Negotiation',
    'Closed Won',
  ];

  const currentStageIndex = stages.indexOf(opp.stage);

  const fetchAiInsights = async () => {
    setLoadingAi(true);
    try {
      const res = await fetch('/api/ai/opportunity-insight', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          opportunity: opp,
          account,
          recentActivities: relatedActivities.slice(0, 4),
        }),
      });
      const data = await res.json();
      setAiInsight(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingAi(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-[#111625] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-4xl w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150 max-h-[94vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-start justify-between bg-slate-50 dark:bg-[#0E121E] shrink-0">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-purple-600 to-blue-600 text-white flex items-center justify-center shadow-xs shrink-0">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">{opp.name}</h2>
                <span
                  className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${
                    opp.status === 'Won'
                      ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                      : opp.status === 'Lost'
                      ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                      : 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20'
                  }`}
                >
                  {opp.status.toUpperCase()} • {opp.stage}
                </span>
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-4 flex-wrap">
                <button
                  onClick={() => {
                    setSelectedAccountIdFor360(opp.accountId);
                    setSelectedOpportunityForDetail(null);
                  }}
                  className="flex items-center gap-1 text-purple-600 dark:text-purple-400 hover:underline font-medium cursor-pointer"
                >
                  <Building2 className="w-3.5 h-3.5" />
                  {opp.accountName}
                </button>
                <span>Owner: {opp.ownerName}</span>
                <span>Target Close: {opp.expectedCloseDate}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setEditingOpportunity(opp);
                setIsOpportunityModalOpen(true);
              }}
              className="p-2 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer text-xs font-medium flex items-center gap-1 border border-slate-200 dark:border-slate-800"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>Edit</span>
            </button>
            <button
              onClick={() => setSelectedOpportunityForDetail(null)}
              className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Stage Chevron Path */}
        <div className="px-6 py-3 bg-slate-50 dark:bg-[#0E121E] border-b border-slate-200 dark:border-slate-800 overflow-x-auto shrink-0">
          <div className="flex items-center gap-1 min-w-[620px]">
            {stages.map((stageName, idx) => {
              const isPast = currentStageIndex > idx && opp.stage !== 'Closed Lost';
              const isCurrent = opp.stage === stageName;

              return (
                <button
                  key={stageName}
                  onClick={() => {
                    if (stageName === 'Closed Won') {
                      setCloseDealModalState({ isOpen: true, opportunity: opp, targetStage: 'Closed Won' });
                    } else {
                      updateOpportunityStage(opp.id, stageName);
                    }
                  }}
                  className={`flex-1 py-2 px-3 text-xs font-semibold rounded-md transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    isCurrent
                      ? 'bg-purple-600 text-white shadow-xs'
                      : isPast
                      ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20'
                      : 'bg-white dark:bg-[#161619] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
                  }`}
                >
                  {isPast && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />}
                  <span>{stageName}</span>
                </button>
              );
            })}

            {/* Closed Lost Trigger */}
            <button
              onClick={() =>
                setCloseDealModalState({ isOpen: true, opportunity: opp, targetStage: 'Closed Lost' })
              }
              className={`py-2 px-3 text-xs font-semibold rounded-md transition-all flex items-center justify-center gap-1 cursor-pointer ${
                opp.stage === 'Closed Lost'
                  ? 'bg-rose-600 text-white'
                  : 'bg-white dark:bg-[#161619] text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 border border-rose-200 dark:border-rose-900/40'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Closed Lost</span>
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6 text-xs text-slate-700 dark:text-slate-300">
          {/* Key Metrics Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 bg-slate-50 dark:bg-[#0E121E] border border-slate-200 dark:border-slate-800 rounded-xl">
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Deal Value</div>
              <div className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-0.5">${opp.amount.toLocaleString()}</div>
            </div>
            <div className="p-3.5 bg-slate-50 dark:bg-[#0E121E] border border-slate-200 dark:border-slate-800 rounded-xl">
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Probability</div>
              <div className="text-xl font-bold text-purple-600 dark:text-purple-400 mt-0.5">{opp.probability}%</div>
            </div>
            <div className="p-3.5 bg-slate-50 dark:bg-[#0E121E] border border-slate-200 dark:border-slate-800 rounded-xl">
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Expected Revenue</div>
              <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                ${opp.expectedRevenue.toLocaleString()}
              </div>
            </div>
            <div className="p-3.5 bg-slate-50 dark:bg-[#0E121E] border border-slate-200 dark:border-slate-800 rounded-xl">
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Lead Source</div>
              <div className="text-sm font-semibold text-slate-800 dark:text-slate-200 mt-1 truncate">{opp.leadSource}</div>
            </div>
          </div>

          {/* Won / Lost Reason Banner if closed */}
          {opp.wonLostReason && (
            <div
              className={`p-4 rounded-xl border ${
                opp.status === 'Won'
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-800 dark:text-emerald-300'
                  : 'bg-rose-500/10 border-rose-500/30 text-rose-800 dark:text-rose-300'
              }`}
            >
              <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider mb-1">
                {opp.status === 'Won' ? <Trophy className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> : <AlertTriangle className="w-4 h-4 text-rose-600 dark:text-rose-400" />}
                {opp.status === 'Won' ? 'Deal Win Driver' : 'Closed Lost Reason'}
              </div>
              <div className="text-sm font-medium">{opp.wonLostReason}</div>
              {opp.actualCloseDate && (
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">Closed Date: {opp.actualCloseDate}</div>
              )}
            </div>
          )}

          {/* Primary Contact & Account Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Account Card */}
            <div className="p-4 bg-slate-50 dark:bg-[#0E121E] border border-slate-200 dark:border-slate-800 rounded-xl">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center justify-between">
                <span>Account Overview</span>
                <Building2 className="w-4 h-4 text-slate-400" />
              </div>
              {account ? (
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">{account.name}</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {account.industry} • {account.businessSegment} • {(account.annualRevenue / 1000000).toFixed(1)}M Rev
                  </p>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 line-clamp-2">{account.description}</p>
                </div>
              ) : (
                <div className="text-xs text-slate-400">Linked to account ID: {opp.accountId}</div>
              )}
            </div>

            {/* Primary Contact Card */}
            <div className="p-4 bg-slate-50 dark:bg-[#0E121E] border border-slate-200 dark:border-slate-800 rounded-xl">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center justify-between">
                <span>Primary Contact</span>
                <UserIcon className="w-4 h-4 text-slate-400" />
              </div>
              {contact ? (
                <div>
                  <div className="flex items-center gap-3">
                    {contact.profileImage ? (
                      <img
                        src={contact.profileImage}
                        alt={contact.firstName}
                        className="w-10 h-10 rounded-full object-cover border border-slate-300 dark:border-slate-700"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold text-sm">
                        {contact.firstName[0]}
                        {contact.lastName[0]}
                      </div>
                    )}
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                        {contact.salutation} {contact.firstName} {contact.lastName}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{contact.jobTitle}</p>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center gap-3 text-xs">
                    <a
                      href={`mailto:${contact.email}`}
                      className="text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1"
                    >
                      <Mail className="w-3.5 h-3.5" /> {contact.email}
                    </a>
                    {contact.phone && (
                      <a href={`tel:${contact.phone}`} className="text-slate-500 dark:text-slate-400 flex items-center gap-1">
                        <Phone className="w-3.5 h-3.5" /> {contact.phone}
                      </a>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-xs text-slate-400 py-3">
                  No primary contact linked yet. Edit opportunity to link a contact.
                </div>
              )}
            </div>
          </div>

          {/* Next Step & Deal Scope */}
          <div className="p-4 bg-purple-50/50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-900/40 rounded-xl">
            <div className="text-xs font-bold text-purple-700 dark:text-purple-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <ArrowRight className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" /> Active Next Step
            </div>
            <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
              {opp.nextStep || 'No immediate next step documented.'}
            </p>
            {opp.description && (
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 pt-2 border-t border-purple-200 dark:border-slate-800">
                {opp.description}
              </p>
            )}
          </div>

          {/* AI Deal Coach & Win Strategy Engine */}
          <div className="p-5 bg-purple-50/50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-900/40 rounded-2xl">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-purple-600 to-blue-600 text-white flex items-center justify-center shadow-xs">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">AI Deal Coach & Opportunity Advisor</h4>
                  <p className="text-xs text-purple-600 dark:text-purple-400">Powered by Gemini 3.7 Flash Deal Intelligence</p>
                </div>
              </div>
              <button
                id="generate-ai-deal-insights-btn"
                onClick={fetchAiInsights}
                disabled={loadingAi}
                className="px-3 py-1.5 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white rounded-lg text-xs font-semibold shadow-xs transition-all active:scale-[0.98] cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{loadingAi ? 'Analyzing Deal...' : aiInsight ? 'Re-Analyze' : 'Analyze Deal'}</span>
              </button>
            </div>

            {aiInsight ? (
              <div className="space-y-4 pt-2">
                <div className="p-3 bg-white dark:bg-[#0E121E] border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
                  {aiInsight.summary}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
                    <div className="text-xs font-bold text-emerald-700 dark:text-emerald-300 uppercase tracking-wider mb-2 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> Win Accelerators
                    </div>
                    <ul className="space-y-1.5 text-xs text-emerald-800 dark:text-emerald-200">
                      {aiInsight.winFactors?.map((f, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="text-emerald-600 dark:text-emerald-400 font-bold">•</span>
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl">
                    <div className="text-xs font-bold text-amber-700 dark:text-amber-300 uppercase tracking-wider mb-2 flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" /> Deal Risk Flags
                    </div>
                    <ul className="space-y-1.5 text-xs text-amber-800 dark:text-amber-200">
                      {aiInsight.risks?.map((r, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="text-amber-600 dark:text-amber-400 font-bold">•</span>
                          <span>{r}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {aiInsight.suggestedNextSteps && (
                  <div className="p-3 bg-white dark:bg-[#0E121E] border border-slate-200 dark:border-slate-800 rounded-xl">
                    <div className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider mb-1.5">
                      Recommended Strategic Actions
                    </div>
                    <div className="space-y-1 text-xs text-slate-700 dark:text-slate-300">
                      {aiInsight.suggestedNextSteps.map((step, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <span className="w-4 h-4 rounded-full bg-purple-500/20 text-purple-600 dark:text-purple-400 text-[10px] font-bold flex items-center justify-center shrink-0">
                            {i + 1}
                          </span>
                          <span>{step}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-xs text-purple-700/80 dark:text-purple-300/80 pt-1">
                Click "Analyze Deal" to get real-time win probability drivers, risk assessments, and next-best actions.
              </p>
            )}
          </div>

          {/* Activity Log for this deal */}
          <div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-400" /> Opportunity History & Milestones
            </div>
            {relatedActivities.length === 0 ? (
              <div className="p-4 text-center text-xs text-slate-400 border border-dashed border-slate-300 dark:border-slate-800 rounded-xl">
                No custom activities logged for this opportunity yet.
              </div>
            ) : (
              <div className="space-y-2">
                {relatedActivities.map((act) => (
                  <div
                    key={act.id}
                    className="p-3 bg-slate-50 dark:bg-[#0E121E] border border-slate-200 dark:border-slate-800 rounded-xl flex items-start gap-3 text-xs"
                  >
                    <div className="w-2 h-2 rounded-full bg-purple-600 mt-1.5 shrink-0" />
                    <div className="flex-1">
                      <div className="font-semibold text-slate-900 dark:text-slate-100">{act.title}</div>
                      <div className="text-slate-600 dark:text-slate-400 mt-0.5">{act.description}</div>
                      <div className="text-[10px] text-slate-400 mt-1">
                        {new Date(act.timestamp).toLocaleString()} • by {act.userName}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
