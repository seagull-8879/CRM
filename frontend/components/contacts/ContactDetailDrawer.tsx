import React, { useState } from 'react';
import {
  X,
  User as UserIcon,
  Building2,
  Mail,
  Phone,
  TrendingUp,
  Clock,
  Edit2,
  Sparkles,
} from 'lucide-react';
import { useCrm } from '../../context/CrmContext';

export const ContactDetailDrawer: React.FC = () => {
  const {
    selectedContactIdFor360,
    setSelectedContactIdFor360,
    contacts,
    accounts,
    opportunities,
    activities,
    setEditingContact,
    setIsContactModalOpen,
    setSelectedAccountIdFor360,
    setSelectedOpportunityForDetail,
    setIsEmailComposerOpen,
    setEmailComposerData,
  } = useCrm();

  const [activeTab, setActiveTab] = useState<'profile' | 'opportunities' | 'activities'>('profile');

  if (!selectedContactIdFor360) return null;

  const contact = contacts.find((c) => c.id === selectedContactIdFor360);
  if (!contact) return null;

  const relatedOpps = opportunities.filter(
    (o) => o.accountId === contact.accountId || o.primaryContactId === contact.id
  );
  const relatedActivities = activities.filter(
    (a) => a.relatedToType === 'Contact' && a.relatedToId === contact.id
  );

  const openAiEmailComposer = () => {
    setEmailComposerData({
      toEmail: contact.email,
      recipientName: `${contact.salutation} ${contact.firstName} ${contact.lastName}`,
      recipientTitle: contact.jobTitle,
      accountName: contact.accountName,
      contactId: contact.id,
      initialSubject: `Follow-up: Discussion regarding ${contact.accountName} roadmap`,
      initialBody: `Dear ${contact.firstName},\n\nI wanted to thank you for your time during our recent conversation regarding ${contact.accountName}'s strategic priorities.\n\nBest regards,\nJanaki Pawar`,
    });
    setIsEmailComposerOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-[#111625] w-full max-w-2xl h-full shadow-2xl flex flex-col border-l border-slate-200 dark:border-slate-800 animate-in slide-in-from-right duration-200">
        {/* Drawer Header */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0E121E] shrink-0">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              {contact.profileImage ? (
                <img
                  src={contact.profileImage}
                  alt={contact.firstName}
                  className="w-14 h-14 rounded-2xl object-cover border-2 border-slate-300 dark:border-slate-700 shadow-md"
                />
              ) : (
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-600 to-blue-600 text-white flex items-center justify-center font-bold text-xl shadow-xs">
                  {contact.firstName[0]}
                  {contact.lastName[0]}
                </div>
              )}

              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                    {contact.salutation} {contact.firstName} {contact.lastName}
                  </h2>
                </div>
                <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5">{contact.jobTitle}</div>
                <button
                  onClick={() => {
                    setSelectedAccountIdFor360(contact.accountId);
                    setSelectedContactIdFor360(null);
                  }}
                  className="text-xs text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1 font-medium mt-1"
                >
                  <Building2 className="w-3.5 h-3.5" />
                  {contact.accountName}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setEditingContact(contact);
                  setIsContactModalOpen(true);
                }}
                className="p-2 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg text-xs font-medium flex items-center gap-1 border border-slate-200 dark:border-slate-800 cursor-pointer"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Edit</span>
              </button>
              <button
                onClick={() => setSelectedContactIdFor360(null)}
                className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Quick Action Toolbar */}
          <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-200 dark:border-slate-800">
            <button
              onClick={openAiEmailComposer}
              className="flex-1 py-2 px-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 shadow-xs transition-all cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-200" />
              <span>Draft AI Email</span>
            </button>
            {contact.phone && (
              <a
                href={`tel:${contact.phone}`}
                className="py-2 px-3 bg-slate-100 dark:bg-[#121215] hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all border border-slate-200 dark:border-slate-800"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call</span>
              </a>
            )}
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2 shrink-0 bg-slate-50 dark:bg-[#0E121E]">
          {[
            { id: 'profile', label: 'Contact Profile', icon: UserIcon },
            { id: 'opportunities', label: `Deals (${relatedOpps.length})`, icon: TrendingUp },
            { id: 'activities', label: `Activity History (${relatedActivities.length})`, icon: Clock },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-3 px-3 text-xs font-semibold border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
                  isActive
                    ? 'border-purple-600 text-purple-600 dark:text-purple-400'
                    : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 text-xs space-y-5 text-slate-700 dark:text-slate-300">
          {activeTab === 'profile' && (
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 dark:bg-[#0E121E] border border-slate-200 dark:border-slate-800 rounded-xl space-y-3">
                <div className="font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider text-xs">
                  Contact Information
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <div className="text-slate-400 text-[11px]">Email Address</div>
                    <a
                      href={`mailto:${contact.email}`}
                      className="font-semibold text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1"
                    >
                      <Mail className="w-3 h-3" /> {contact.email}
                    </a>
                  </div>
                  <div>
                    <div className="text-slate-400 text-[11px]">Office Phone</div>
                    <div className="font-semibold text-slate-800 dark:text-slate-200">{contact.phone || 'None'}</div>
                  </div>
                  <div>
                    <div className="text-slate-400 text-[11px]">Mobile Phone</div>
                    <div className="font-semibold text-slate-800 dark:text-slate-200">{contact.mobile || 'None'}</div>
                  </div>
                  <div>
                    <div className="text-slate-400 text-[11px]">Preferred Channel</div>
                    <div className="font-semibold text-slate-800 dark:text-slate-200">
                      {contact.preferredContactMethod}
                    </div>
                  </div>
                  <div>
                    <div className="text-slate-400 text-[11px]">Department</div>
                    <div className="font-semibold text-slate-800 dark:text-slate-200">
                      {contact.department || 'General'}
                    </div>
                  </div>
                  <div>
                    <div className="text-slate-400 text-[11px]">Lead Source</div>
                    <div className="font-semibold text-slate-800 dark:text-slate-200">{contact.source || 'Direct'}</div>
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div className="p-4 bg-slate-50 dark:bg-[#0E121E] border border-slate-200 dark:border-slate-800 rounded-xl space-y-2">
                <div className="font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider text-xs">
                  Notes & Context
                </div>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  {contact.notes || 'No custom notes logged for this contact.'}
                </p>
              </div>
            </div>
          )}

          {activeTab === 'opportunities' && (
            <div className="space-y-3">
              <div className="font-bold text-slate-400 uppercase text-xs">Associated Deals</div>
              {relatedOpps.length === 0 ? (
                <div className="p-6 text-center text-slate-400 border border-dashed border-slate-300 dark:border-slate-800 rounded-xl">
                  No active opportunities tied to this contact.
                </div>
              ) : (
                <div className="space-y-2">
                  {relatedOpps.map((opp) => (
                    <div
                      key={opp.id}
                      onClick={() => setSelectedOpportunityForDetail(opp)}
                      className="p-3.5 bg-slate-50 dark:bg-[#0E121E] hover:bg-slate-100 dark:hover:bg-[#182035] border border-slate-200 dark:border-slate-800 rounded-xl flex items-center justify-between transition-colors cursor-pointer group"
                    >
                      <div>
                        <div className="font-bold text-slate-900 dark:text-slate-100 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                          {opp.name}
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                          Stage: {opp.stage} • Close: {opp.expectedCloseDate}
                        </div>
                      </div>
                      <div className="text-right font-bold text-slate-900 dark:text-slate-100">
                        ${opp.amount.toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'activities' && (
            <div className="space-y-3">
              <div className="font-bold text-slate-400 uppercase text-xs">
                Touchpoints & Interaction History
              </div>
              {relatedActivities.length === 0 ? (
                <div className="p-6 text-center text-slate-400 border border-dashed border-slate-300 dark:border-slate-800 rounded-xl">
                  No interaction history recorded with this contact.
                </div>
              ) : (
                <div className="space-y-2.5">
                  {relatedActivities.map((act) => (
                    <div
                      key={act.id}
                      className="p-3 bg-slate-50 dark:bg-[#0E121E] border border-slate-200 dark:border-slate-800 rounded-xl flex items-start gap-2.5"
                    >
                      <div className="w-2 h-2 rounded-full bg-purple-600 mt-1.5 shrink-0" />
                      <div>
                        <div className="font-bold text-slate-900 dark:text-slate-100">{act.title}</div>
                        <div className="text-slate-600 dark:text-slate-400 mt-0.5">{act.description}</div>
                        <div className="text-[10px] text-slate-400 mt-1">
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
