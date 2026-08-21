import React, { useState } from 'react';
import { X, Trophy, AlertTriangle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useCrm } from '../../context/CrmContext';

export const CloseDealModal: React.FC = () => {
  const { closeDealModalState, setCloseDealModalState, updateOpportunityStage } = useCrm();
  const { isOpen, opportunity, targetStage } = closeDealModalState;

  const [reason, setReason] = useState('');
  const [error, setError] = useState('');

  if (!isOpen || !opportunity) return null;

  const isWon = targetStage === 'Closed Won';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) {
      setError(isWon ? 'Please share a brief win note / driver' : 'Please provide a loss reason for analytics (BR-04)');
      return;
    }

    if (isWon) {
      try {
        confetti({
          particleCount: 120,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#22c55e', '#8b5cf6', '#3b82f6', '#ec4899'],
        });
      } catch (err) {
        // ignore
      }
    }

    updateOpportunityStage(opportunity.id, targetStage, reason);
    setCloseDealModalState({ isOpen: false, opportunity: null, targetStage: 'Closed Won' });
    setReason('');
    setError('');
  };

  const wonPresets = [
    'Superior product capabilities & compliance',
    'Strong executive relationship & ROI metrics',
    'Best total cost of ownership & responsive pilot',
    'Customer expansion following successful Phase 1',
  ];

  const lostPresets = [
    'Competitor offered lower pricing / aggressive discount',
    'Customer budget was frozen or canceled',
    'Feature gap in legacy ERP integration',
    'Decision postponed to next fiscal year',
    'Internal sponsor moved to another organization',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-[#111625] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div
          className={`p-6 border-b ${
            isWon
              ? 'bg-emerald-500/10 dark:bg-emerald-950/20 border-emerald-500/20 dark:border-emerald-800/40'
              : 'bg-rose-500/10 dark:bg-rose-950/20 border-rose-500/20 dark:border-rose-800/40'
          } flex items-center justify-between`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-xs ${
                isWon ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
              }`}
            >
              {isWon ? <Trophy className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
            </div>
            <div>
              <h3 className={`text-base font-bold ${isWon ? 'text-emerald-700 dark:text-emerald-300' : 'text-rose-700 dark:text-rose-300'}`}>
                {isWon ? 'Mark Deal as Closed Won' : 'Mark Deal as Closed Lost'}
              </h3>
              <p className={`text-xs ${isWon ? 'text-emerald-600/80 dark:text-emerald-400/80' : 'text-rose-600/80 dark:text-rose-400/80'}`}>
                {opportunity.name} • ${opportunity.amount.toLocaleString()}
              </p>
            </div>
          </div>
          <button
            onClick={() =>
              setCloseDealModalState({ isOpen: false, opportunity: null, targetStage: 'Closed Won' })
            }
            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              {isWon ? 'Key Win Reason / Competitive Factor *' : 'Loss Reason (Required for Sales Governance) *'}
            </label>
            <textarea
              required
              rows={3}
              value={reason}
              onChange={(e) => {
                setReason(e.target.value);
                if (error) setError('');
              }}
              placeholder={
                isWon
                  ? 'e.g. Superior compliance architecture, rapid pilot turnaround, executive sponsor recommendation'
                  : 'e.g. Client delayed budget to Q1, competitor matched pricing, lack of custom connector'
              }
              className="w-full p-3 bg-slate-50 dark:bg-[#0E121E] border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
            />
            {error && <p className="text-xs font-medium text-rose-500 mt-1">{error}</p>}
          </div>

          {/* Quick Preset Buttons */}
          <div>
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Quick Selection Presets
            </div>
            <div className="flex flex-wrap gap-1.5">
              {(isWon ? wonPresets : lostPresets).map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setReason(preset)}
                  className="px-2.5 py-1 text-xs bg-slate-50 dark:bg-[#0E121E] hover:bg-slate-100 dark:hover:bg-[#182035] text-slate-700 dark:text-slate-300 rounded-lg border border-slate-200 dark:border-slate-800 transition-colors cursor-pointer text-left"
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={() =>
                setCloseDealModalState({ isOpen: false, opportunity: null, targetStage: 'Closed Won' })
              }
              className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              id="confirm-close-deal-btn"
              className={`px-5 py-2 text-xs font-semibold text-white rounded-lg transition-all shadow-sm active:scale-[0.98] cursor-pointer ${
                isWon
                  ? 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/30'
                  : 'bg-rose-600 hover:bg-rose-500 shadow-rose-600/30'
              }`}
            >
              {isWon ? 'Confirm Closed Won 🎉' : 'Confirm Closed Lost'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
