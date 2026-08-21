import React, { useState, useEffect } from 'react';
import { X, TrendingUp, Sparkles, Building2, User as UserIcon } from 'lucide-react';
import { useCrm } from '../../context/CrmContext';
import { OpportunityStage, Opportunity } from '../../types';

export const OpportunityModal: React.FC = () => {
  const {
    isOpportunityModalOpen,
    setIsOpportunityModalOpen,
    editingOpportunity,
    setEditingOpportunity,
    accounts,
    contacts,
    currentUser,
    addOpportunity,
    updateOpportunity,
  } = useCrm();

  const [name, setName] = useState('');
  const [accountId, setAccountId] = useState('');
  const [primaryContactId, setPrimaryContactId] = useState('');
  const [amount, setAmount] = useState<number>(100000);
  const [stage, setStage] = useState<OpportunityStage>('Qualification');
  const [probability, setProbability] = useState<number>(20);
  const [expectedCloseDate, setExpectedCloseDate] = useState('');
  const [leadSource, setLeadSource] = useState('Partner Referral');
  const [nextStep, setNextStep] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  // Default probability mapping
  const stageProbabilityMap: Record<OpportunityStage, number> = {
    Qualification: 20,
    'Needs Analysis': 40,
    Proposal: 60,
    Negotiation: 80,
    'Closed Won': 100,
    'Closed Lost': 0,
  };

  useEffect(() => {
    if (editingOpportunity) {
      setName(editingOpportunity.name);
      setAccountId(editingOpportunity.accountId);
      setPrimaryContactId(editingOpportunity.primaryContactId || '');
      setAmount(editingOpportunity.amount);
      setStage(editingOpportunity.stage);
      setProbability(editingOpportunity.probability);
      setExpectedCloseDate(editingOpportunity.expectedCloseDate);
      setLeadSource(editingOpportunity.leadSource);
      setNextStep(editingOpportunity.nextStep || '');
      setDescription(editingOpportunity.description || '');
    } else {
      setName('');
      setAccountId(accounts[0]?.id || '');
      setPrimaryContactId('');
      setAmount(120000);
      setStage('Qualification');
      setProbability(20);
      // default 60 days out
      const d = new Date();
      d.setDate(d.getDate() + 60);
      setExpectedCloseDate(d.toISOString().split('T')[0]);
      setLeadSource('Direct');
      setNextStep('Schedule initial discovery meeting');
      setDescription('');
    }
    setError('');
  }, [editingOpportunity, isOpportunityModalOpen, accounts]);

  if (!isOpportunityModalOpen) return null;

  const handleStageChange = (newStage: OpportunityStage) => {
    setStage(newStage);
    setProbability(stageProbabilityMap[newStage]);
  };

  // Contacts available for selected account
  const availableContacts = contacts.filter((c) => !accountId || c.accountId === accountId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Opportunity name is required');
      return;
    }
    if (!accountId) {
      setError('A valid client account must be linked (BR-03)');
      return;
    }

    const selectedAccount = accounts.find((a) => a.id === accountId);
    const selectedContact = contacts.find((c) => c.id === primaryContactId);

    const oppPayload = {
      name: name.trim(),
      accountId,
      accountName: selectedAccount?.name || 'Account',
      primaryContactId: selectedContact?.id,
      primaryContactName: selectedContact ? `${selectedContact.firstName} ${selectedContact.lastName}` : undefined,
      ownerId: currentUser?.id || 'usr-1',
      ownerName: currentUser?.name || 'Janaki Pawar',
      amount: Number(amount) || 0,
      probability: Number(probability) || 0,
      expectedRevenue: Math.round(((Number(amount) || 0) * (Number(probability) || 0)) / 100),
      stage,
      status: stage === 'Closed Won' ? ('Won' as const) : stage === 'Closed Lost' ? ('Lost' as const) : ('Open' as const),
      expectedCloseDate: expectedCloseDate || new Date().toISOString().split('T')[0],
      leadSource,
      nextStep: nextStep.trim(),
      description: description.trim(),
    };

    if (editingOpportunity) {
      updateOpportunity(editingOpportunity.id, oppPayload);
    } else {
      addOpportunity(oppPayload);
    }

    setIsOpportunityModalOpen(false);
    setEditingOpportunity(null);
  };

  const stages: OpportunityStage[] = [
    'Qualification',
    'Needs Analysis',
    'Proposal',
    'Negotiation',
    'Closed Won',
    'Closed Lost',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
      <div className="bg-[#161619] rounded-2xl border border-zinc-800 shadow-2xl max-w-2xl w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-zinc-800 flex items-center justify-between bg-[#121215] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-zinc-100">
                {editingOpportunity ? 'Edit Opportunity' : 'New Sales Opportunity'}
              </h3>
              <p className="text-xs text-zinc-400">Track deal progress throughout the sales lifecycle</p>
            </div>
          </div>
          <button
            onClick={() => {
              setIsOpportunityModalOpen(false);
              setEditingOpportunity(null);
            }}
            className="p-1.5 text-zinc-400 hover:text-zinc-200 rounded-lg hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1 text-xs">
          {error && (
            <div className="p-3 bg-rose-950/30 border border-rose-800/60 rounded-xl text-rose-300 text-xs font-medium">
              {error}
            </div>
          )}

          {/* Deal Name */}
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">
              Opportunity Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Apex - Enterprise Cloud Security Suite"
              className="w-full px-3.5 py-2 bg-[#121215] border border-zinc-800 rounded-lg text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          {/* Account & Primary Contact */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-zinc-400" /> Account (Client Company) *
              </label>
              <select
                required
                value={accountId}
                onChange={(e) => {
                  setAccountId(e.target.value);
                  setPrimaryContactId('');
                }}
                className="w-full px-3 py-2 bg-[#121215] border border-zinc-800 rounded-lg text-sm text-zinc-100 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              >
                <option value="">-- Select Linked Account --</option>
                {accounts.map((acc) => (
                  <option key={acc.id} value={acc.id}>
                    {acc.name} ({acc.industry})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1 flex items-center gap-1.5">
                <UserIcon className="w-3.5 h-3.5 text-zinc-400" /> Primary Contact
              </label>
              <select
                value={primaryContactId}
                onChange={(e) => setPrimaryContactId(e.target.value)}
                className="w-full px-3 py-2 bg-[#121215] border border-zinc-800 rounded-lg text-sm text-zinc-100 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              >
                <option value="">-- Optional / Select Contact --</option>
                {availableContacts.map((cnt) => (
                  <option key={cnt.id} value={cnt.id}>
                    {cnt.salutation} {cnt.firstName} {cnt.lastName} ({cnt.jobTitle})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Amount, Probability, Expected Revenue */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 bg-[#121215] border border-zinc-800 rounded-xl">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">
                Deal Amount ($ USD) *
              </label>
              <input
                type="number"
                min="0"
                step="1000"
                required
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full px-3 py-1.5 bg-[#161619] border border-zinc-800 rounded-lg text-sm font-semibold text-zinc-100 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">
                Win Probability (%)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={probability}
                  onChange={(e) => setProbability(Number(e.target.value))}
                  className="w-full accent-blue-600"
                />
                <span className="text-xs font-bold text-zinc-200 w-8 text-right">{probability}%</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-400 mb-1">
                Expected Revenue
              </label>
              <div className="text-sm font-bold text-emerald-400 pt-1">
                ${Math.round(((Number(amount) || 0) * (Number(probability) || 0)) / 100).toLocaleString()}
              </div>
            </div>
          </div>

          {/* Stage & Close Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">
                Sales Stage *
              </label>
              <select
                value={stage}
                onChange={(e) => handleStageChange(e.target.value as OpportunityStage)}
                className="w-full px-3 py-2 bg-[#121215] border border-zinc-800 rounded-lg text-sm text-zinc-100 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              >
                {stages.map((stg) => (
                  <option key={stg} value={stg}>
                    {stg}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">
                Target Close Date *
              </label>
              <input
                type="date"
                required
                value={expectedCloseDate}
                onChange={(e) => setExpectedCloseDate(e.target.value)}
                className="w-full px-3 py-2 bg-[#121215] border border-zinc-800 rounded-lg text-sm text-zinc-100 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Lead Source & Next Step */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">
                Lead Source
              </label>
              <select
                value={leadSource}
                onChange={(e) => setLeadSource(e.target.value)}
                className="w-full px-3 py-2 bg-[#121215] border border-zinc-800 rounded-lg text-sm text-zinc-100 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              >
                <option value="Direct">Direct</option>
                <option value="Partner Referral">Partner Referral</option>
                <option value="Visiting Card OCR">Visiting Card OCR</option>
                <option value="Web Form">Web Form</option>
                <option value="Event">Event / Conference</option>
                <option value="Phone Inquiry">Phone Inquiry</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">
                Next Step
              </label>
              <input
                type="text"
                value={nextStep}
                onChange={(e) => setNextStep(e.target.value)}
                placeholder="e.g. Schedule legal review meeting on Tuesday"
                className="w-full px-3 py-2 bg-[#121215] border border-zinc-800 rounded-lg text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">
              Description / Deal Context
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Key business pain points, scope of licenses, competitor landscape..."
              className="w-full px-3 py-2 bg-[#121215] border border-zinc-800 rounded-lg text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-zinc-800 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={() => {
                setIsOpportunityModalOpen(false);
                setEditingOpportunity(null);
              }}
              className="px-4 py-2 text-xs font-semibold text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 rounded-lg transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              id="save-opportunity-submit-btn"
              className="px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg shadow-sm shadow-blue-600/20 transition-all active:scale-[0.98] cursor-pointer"
            >
              {editingOpportunity ? 'Save Changes' : 'Create Opportunity'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
