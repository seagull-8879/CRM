import React, { useState } from 'react';
import {
  X,
  Building2,
  Users,
  TrendingUp,
  FileText,
  Clock,
  Globe,
  Phone,
  Mail,
  Plus,
  Edit2,
  Trash2,
  DollarSign,
  Briefcase,
  MapPin,
  File,
  Upload,
} from 'lucide-react';
import { useCrm } from '../../context/CrmContext';

export const AccountDetailDrawer: React.FC = () => {
  const {
    selectedAccountIdFor360,
    setSelectedAccountIdFor360,
    accounts,
    contacts,
    opportunities,
    activities,
    notes,
    files,
    setEditingAccount,
    setIsAccountModalOpen,
    deleteAccount,
    setSelectedContactIdFor360,
    setSelectedOpportunityForDetail,
    setIsContactModalOpen,
    setEditingContact,
    setIsOpportunityModalOpen,
    setEditingOpportunity,
    addFile,
  } = useCrm();

  const [activeTab, setActiveTab] = useState<'profile' | 'contacts' | 'opportunities' | 'files' | 'history'>('profile');

  if (!selectedAccountIdFor360) return null;

  const account = accounts.find((a) => a.id === selectedAccountIdFor360);
  if (!account) return null;

  const relatedContacts = contacts.filter((c) => c.accountId === account.id);
  const relatedOpps = opportunities.filter((o) => o.accountId === account.id);
  const relatedActivities = activities.filter(
    (a) => a.relatedToType === 'Account' && a.relatedToId === account.id
  );
  const relatedFiles = files.filter(
    (f) => f.relatedToType === 'Account' && f.relatedToId === account.id
  );

  const totalWonRev = relatedOpps
    .filter((o) => o.status === 'Won')
    .reduce((sum, o) => sum + o.amount, 0);

  const totalOpenPipe = relatedOpps
    .filter((o) => o.status === 'Open')
    .reduce((sum, o) => sum + o.amount, 0);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (!fileList || fileList.length === 0) return;
    const uploaded = fileList[0];

    addFile({
      name: uploaded.name,
      size: uploaded.size,
      type: uploaded.type || 'application/pdf',
      category: 'Contract',
      relatedToType: 'Account',
      relatedToId: account.id,
      relatedToName: account.name,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/70 backdrop-blur-xs">
      <div className="bg-[#121215] w-full max-w-3xl h-full shadow-2xl flex flex-col border-l border-zinc-800 animate-in slide-in-from-right duration-200">
        {/* Drawer Header */}
        <div className="p-6 border-b border-zinc-800 bg-[#161619] shrink-0">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-xs font-bold text-lg">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-xl font-bold text-zinc-100">{account.name}</h2>
                  <span
                    className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border ${
                      account.rating === 'Hot'
                        ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                        : account.rating === 'Warm'
                        ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                        : 'bg-zinc-800 text-zinc-300 border-zinc-700'
                    }`}
                  >
                    {account.rating} Lead
                  </span>
                </div>
                <div className="text-xs text-zinc-400 mt-1 flex items-center gap-3 flex-wrap">
                  <span>{account.industry}</span>
                  <span>•</span>
                  <span>{account.businessSegment}</span>
                  <span>•</span>
                  <span>Owner: {account.ownerName}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setEditingAccount(account);
                  setIsAccountModalOpen(true);
                }}
                className="p-2 text-zinc-300 hover:text-zinc-100 hover:bg-zinc-800 rounded-lg text-xs font-medium flex items-center gap-1 border border-zinc-800 cursor-pointer"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Edit</span>
              </button>
              <button
                onClick={() => setSelectedAccountIdFor360(null)}
                className="p-2 text-zinc-400 hover:text-zinc-200 rounded-lg hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-zinc-800">
            <div className="p-2.5 bg-[#121215] border border-zinc-800 rounded-xl">
              <div className="text-[10px] font-semibold text-zinc-500 uppercase">Annual Revenue</div>
              <div className="text-sm font-bold text-zinc-100 mt-0.5">
                ${(account.annualRevenue / 1000000).toFixed(1)}M USD
              </div>
            </div>
            <div className="p-2.5 bg-[#121215] border border-zinc-800 rounded-xl">
              <div className="text-[10px] font-semibold text-zinc-500 uppercase">Open Pipeline</div>
              <div className="text-sm font-bold text-blue-400 mt-0.5">
                ${totalOpenPipe.toLocaleString()}
              </div>
            </div>
            <div className="p-2.5 bg-[#121215] border border-zinc-800 rounded-xl">
              <div className="text-[10px] font-semibold text-zinc-500 uppercase">Closed Won Revenue</div>
              <div className="text-sm font-bold text-emerald-400 mt-0.5">
                ${totalWonRev.toLocaleString()}
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 border-b border-zinc-800 flex items-center gap-2 overflow-x-auto shrink-0 bg-[#161619]">
          {[
            { id: 'profile', label: 'Company Data', icon: Building2 },
            { id: 'contacts', label: `Contacts (${relatedContacts.length})`, icon: Users },
            { id: 'opportunities', label: `Opportunities (${relatedOpps.length})`, icon: TrendingUp },
            { id: 'files', label: `Documents (${relatedFiles.length})`, icon: FileText },
            { id: 'history', label: 'Activities & Audit', icon: Clock },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-3 px-3 text-xs font-semibold border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'border-blue-500 text-blue-400'
                    : 'border-transparent text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 text-xs space-y-6 text-zinc-300">
          {/* Tab 1: Profile & Addresses */}
          {activeTab === 'profile' && (
            <div className="space-y-5">
              {/* Core Information */}
              <div className="p-4 bg-[#161619] border border-zinc-800 rounded-xl space-y-3">
                <div className="font-bold text-zinc-100 text-xs uppercase tracking-wider">
                  Account Core Information
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div>
                    <div className="text-zinc-500 text-[11px]">Account Number</div>
                    <div className="font-semibold text-zinc-200">{account.accountNumber || 'N/A'}</div>
                  </div>
                  <div>
                    <div className="text-zinc-500 text-[11px]">Website</div>
                    {account.website ? (
                      <a
                        href={account.website}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-400 hover:underline font-semibold flex items-center gap-1"
                      >
                        <Globe className="w-3 h-3" /> Visit Site
                      </a>
                    ) : (
                      <div className="text-zinc-500">None</div>
                    )}
                  </div>
                  <div>
                    <div className="text-zinc-500 text-[11px]">Phone</div>
                    <div className="font-semibold text-zinc-200">{account.phone || 'None'}</div>
                  </div>
                  <div>
                    <div className="text-zinc-500 text-[11px]">Employees</div>
                    <div className="font-semibold text-zinc-200">{account.employees} people</div>
                  </div>
                  <div>
                    <div className="text-zinc-500 text-[11px]">Ownership</div>
                    <div className="font-semibold text-zinc-200">{account.ownership}</div>
                  </div>
                  <div>
                    <div className="text-zinc-500 text-[11px]">Customer Status</div>
                    <div className="font-semibold text-zinc-200">{account.customerStatus}</div>
                  </div>
                </div>
              </div>

              {/* Billing & Shipping */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-[#161619] border border-zinc-800 rounded-xl space-y-1.5">
                  <div className="font-bold text-zinc-100 text-xs flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-blue-400" /> Billing Address
                  </div>
                  <div className="text-zinc-300">
                    <div>{account.billingStreet || 'No street documented'}</div>
                    <div>
                      {account.billingCity} {account.billingState} {account.billingPostalCode}
                    </div>
                    <div>{account.billingCountry}</div>
                  </div>
                </div>

                <div className="p-4 bg-[#161619] border border-zinc-800 rounded-xl space-y-1.5">
                  <div className="font-bold text-zinc-100 text-xs flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-indigo-400" /> Shipping Address
                  </div>
                  <div className="text-zinc-300">
                    <div>{account.shippingStreet || account.billingStreet || 'Same as billing'}</div>
                    <div>
                      {account.shippingCity || account.billingCity}{' '}
                      {account.shippingState || account.billingState}{' '}
                      {account.shippingPostalCode || account.billingPostalCode}
                    </div>
                    <div>{account.shippingCountry || account.billingCountry}</div>
                  </div>
                </div>
              </div>

              {/* Description & Audit Fields */}
              <div className="p-4 bg-[#161619] border border-zinc-800 rounded-xl space-y-2">
                <div className="font-bold text-zinc-100 text-xs">Description</div>
                <p className="text-zinc-400 leading-relaxed">
                  {account.description || 'No corporate description provided.'}
                </p>
                <div className="pt-3 border-t border-zinc-800 flex items-center justify-between text-[10px] text-zinc-500">
                  <span>Created By: {account.createdBy} ({new Date(account.createdAt).toLocaleDateString()})</span>
                  <span>Modified: {new Date(account.updatedAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Related Contacts */}
          {activeTab === 'contacts' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-zinc-400 uppercase">
                  People at {account.name}
                </h4>
                <button
                  onClick={() => {
                    setEditingContact({
                      id: '',
                      salutation: 'Mr.',
                      firstName: '',
                      lastName: '',
                      accountId: account.id,
                      accountName: account.name,
                      jobTitle: '',
                      email: '',
                      phone: '',
                      preferredContactMethod: 'Email',
                      ownerId: account.ownerId,
                      ownerName: account.ownerName,
                      source: 'Direct',
                      createdAt: '',
                      updatedAt: '',
                    });
                    setIsContactModalOpen(true);
                  }}
                  className="px-2.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <Plus className="w-3 h-3" /> Add Contact
                </button>
              </div>

              {relatedContacts.length === 0 ? (
                <div className="p-6 text-center text-zinc-500 border border-dashed border-zinc-800 rounded-xl">
                  No contacts linked to this account yet.
                </div>
              ) : (
                <div className="space-y-2">
                  {relatedContacts.map((cnt) => (
                    <div
                      key={cnt.id}
                      onClick={() => setSelectedContactIdFor360(cnt.id)}
                      className="p-3 bg-[#161619] hover:bg-[#1C1C20] border border-zinc-800 rounded-xl flex items-center justify-between transition-colors cursor-pointer group"
                    >
                      <div className="flex items-center gap-3">
                        {cnt.profileImage ? (
                          <img
                            src={cnt.profileImage}
                            alt={cnt.firstName}
                            className="w-9 h-9 rounded-full object-cover border border-zinc-700"
                          />
                        ) : (
                          <div className="w-9 h-9 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 font-bold flex items-center justify-center">
                            {cnt.firstName[0]}
                            {cnt.lastName[0]}
                          </div>
                        )}
                        <div>
                          <div className="font-bold text-zinc-100 group-hover:text-blue-400 transition-colors">
                            {cnt.salutation} {cnt.firstName} {cnt.lastName}
                          </div>
                          <div className="text-[11px] text-zinc-400">{cnt.jobTitle}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-zinc-300 font-medium">{cnt.email}</div>
                        <div className="text-[11px] text-zinc-500">{cnt.phone || cnt.mobile}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Tab 3: Related Opportunities */}
          {activeTab === 'opportunities' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-zinc-400 uppercase">
                  Deals Linked to {account.name}
                </h4>
                <button
                  onClick={() => {
                    setEditingOpportunity({
                      id: '',
                      name: `${account.name} - Deal`,
                      accountId: account.id,
                      accountName: account.name,
                      ownerId: account.ownerId,
                      ownerName: account.ownerName,
                      amount: 100000,
                      probability: 20,
                      expectedRevenue: 20000,
                      stage: 'Qualification',
                      status: 'Open',
                      expectedCloseDate: new Date().toISOString().split('T')[0],
                      leadSource: 'Direct',
                      createdAt: '',
                      updatedAt: '',
                    });
                    setIsOpportunityModalOpen(true);
                  }}
                  className="px-2.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <Plus className="w-3 h-3" /> Add Opportunity
                </button>
              </div>

              {relatedOpps.length === 0 ? (
                <div className="p-6 text-center text-zinc-500 border border-dashed border-zinc-800 rounded-xl">
                  No opportunities currently associated with this company.
                </div>
              ) : (
                <div className="space-y-2">
                  {relatedOpps.map((opp) => (
                    <div
                      key={opp.id}
                      onClick={() => setSelectedOpportunityForDetail(opp)}
                      className="p-3.5 bg-[#161619] hover:bg-[#1C1C20] border border-zinc-800 rounded-xl flex items-center justify-between transition-colors cursor-pointer group"
                    >
                      <div>
                        <div className="font-bold text-zinc-100 group-hover:text-blue-400 transition-colors">
                          {opp.name}
                        </div>
                        <div className="text-[11px] text-zinc-400 mt-0.5">
                          Stage: <span className="font-semibold text-zinc-200">{opp.stage}</span> • Close: {opp.expectedCloseDate}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold text-zinc-100">
                          ${opp.amount.toLocaleString()}
                        </div>
                        <span
                          className={`inline-block text-[10px] font-bold px-2 py-0.2 rounded-full border ${
                            opp.status === 'Won'
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                              : opp.status === 'Lost'
                              ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                              : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                          }`}
                        >
                          {opp.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Tab 4: Documents & Files */}
          {activeTab === 'files' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-zinc-400 uppercase">
                  Account Documents & Contracts
                </h4>
                <label className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 rounded-lg font-semibold flex items-center gap-1.5 cursor-pointer transition-colors">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload File</span>
                  <input type="file" onChange={handleFileUpload} className="hidden" />
                </label>
              </div>

              {relatedFiles.length === 0 ? (
                <div className="p-8 text-center text-zinc-500 border border-dashed border-zinc-800 rounded-xl">
                  No documents uploaded for this account yet. Click Upload File above.
                </div>
              ) : (
                <div className="space-y-2">
                  {relatedFiles.map((f) => (
                    <div
                      key={f.id}
                      className="p-3 bg-[#161619] border border-zinc-800 rounded-xl flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-semibold text-zinc-100">{f.name}</div>
                          <div className="text-[10px] text-zinc-500">
                            {f.category} • {(f.size / 1000000).toFixed(2)} MB • by {f.uploadedBy}
                          </div>
                        </div>
                      </div>
                      <span className="text-[11px] font-semibold text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded">
                        {f.category}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Tab 5: Activities & History */}
          {activeTab === 'history' && (
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-zinc-400 uppercase">
                Account Audit Trail & Activity Log
              </h4>
              {relatedActivities.length === 0 ? (
                <div className="p-6 text-center text-zinc-500 border border-dashed border-zinc-800 rounded-xl">
                  No activities logged specifically for this account yet.
                </div>
              ) : (
                <div className="space-y-2.5">
                  {relatedActivities.map((act) => (
                    <div
                      key={act.id}
                      className="p-3 bg-[#161619] border border-zinc-800 rounded-xl flex items-start gap-2.5"
                    >
                      <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                      <div>
                        <div className="font-bold text-zinc-100">{act.title}</div>
                        <div className="text-zinc-400 mt-0.5">{act.description}</div>
                        <div className="text-[10px] text-zinc-500 mt-1">
                          {new Date(act.timestamp).toLocaleString()} • {act.userName}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
