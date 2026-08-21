import React, { useState } from 'react';
import {
  Plus,
  Search,
  Building2,
  Mail,
  Phone,
  Sparkles,
  CreditCard,
  Camera,
} from 'lucide-react';
import { useCrm } from '../../context/CrmContext';

export const ContactsView: React.FC = () => {
  const {
    contacts,
    accounts,
    setIsContactModalOpen,
    setEditingContact,
    setSelectedContactIdFor360,
    setSelectedAccountIdFor360,
    setIsEmailComposerOpen,
    setEmailComposerData,
    openOcrScanner,
  } = useCrm();

  const [searchQuery, setSearchQuery] = useState('');
  const [accountFilter, setAccountFilter] = useState('ALL');
  const [channelFilter, setChannelFilter] = useState('ALL');

  const filteredContacts = contacts.filter((cnt) => {
    const matchesSearch =
      `${cnt.firstName} ${cnt.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cnt.jobTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cnt.accountName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cnt.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesAccount = accountFilter === 'ALL' || cnt.accountId === accountFilter;
    const matchesChannel = channelFilter === 'ALL' || cnt.preferredContactMethod === channelFilter;

    return matchesSearch && matchesAccount && matchesChannel;
  });

  const handleDraftEmail = (cnt: typeof contacts[0], e: React.MouseEvent) => {
    e.stopPropagation();
    setEmailComposerData({
      toEmail: cnt.email,
      recipientName: `${cnt.salutation} ${cnt.firstName} ${cnt.lastName}`,
      recipientTitle: cnt.jobTitle,
      accountName: cnt.accountName,
      contactId: cnt.id,
      initialSubject: `Follow-up regarding ${cnt.accountName}`,
      initialBody: `Dear ${cnt.firstName},\n\nHope this note finds you well.\n\nBest regards,`,
    });
    setIsEmailComposerOpen(true);
  };

  return (
    <div id="crm-contacts-view" className="p-3.5 sm:p-6 space-y-5 sm:space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-[#111625] p-4 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800/80 shadow-xs transition-colors">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">Client Contacts</h1>
            <span className="text-xs font-bold text-purple-600 dark:text-purple-400 bg-purple-500/10 border border-purple-500/20 px-2.5 py-0.5 rounded-full">
              {contacts.length} Total Stakeholders
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Enterprise decision-makers, technical leads, and relationship champions
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            id="scan-card-ocr-btn"
            onClick={() => openOcrScanner()}
            className="flex-1 sm:flex-none px-3.5 sm:px-4 py-2.5 bg-purple-500/10 hover:bg-purple-500/20 text-purple-700 dark:text-purple-300 border border-purple-500/30 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all active:scale-[0.98] cursor-pointer shadow-xs"
            title="Scan physical or digital business card with Gemini Vision OCR"
          >
            <CreditCard className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <span>Scan Card (OCR)</span>
          </button>

          <button
            id="create-new-contact-btn"
            onClick={() => {
              setEditingContact(null);
              setIsContactModalOpen(true);
            }}
            className="flex-1 sm:flex-none px-3.5 sm:px-4 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 shadow-sm shadow-purple-900/20 transition-all active:scale-[0.98] cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>New Contact</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white dark:bg-[#111625] p-3.5 sm:p-4 border border-slate-200 dark:border-slate-800/80 rounded-2xl shadow-xs flex flex-wrap items-center gap-2.5 sm:gap-3 transition-colors">
        <div className="relative flex-1 min-w-[200px] w-full sm:w-auto">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search contacts by name, title, company, email..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-[#0E121E] border border-slate-200 dark:border-slate-800 rounded-lg text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
          />
        </div>

        <select
          value={accountFilter}
          onChange={(e) => setAccountFilter(e.target.value)}
          className="px-3 py-2 bg-slate-50 dark:bg-[#0E121E] border border-slate-200 dark:border-slate-800 rounded-lg text-xs text-slate-700 dark:text-slate-300 focus:outline-hidden focus:ring-2 focus:ring-purple-500/20"
        >
          <option value="ALL">All Companies</option>
          {accounts.map((acc) => (
            <option key={acc.id} value={acc.id}>
              {acc.name}
            </option>
          ))}
        </select>

        <select
          value={channelFilter}
          onChange={(e) => setChannelFilter(e.target.value)}
          className="px-3 py-2 bg-slate-50 dark:bg-[#0E121E] border border-slate-200 dark:border-slate-800 rounded-lg text-xs text-slate-700 dark:text-slate-300 focus:outline-hidden focus:ring-2 focus:ring-purple-500/20"
        >
          <option value="ALL">All Contact Methods</option>
          <option value="Email">Email</option>
          <option value="Phone">Phone</option>
          <option value="Mobile">Mobile</option>
          <option value="WhatsApp">WhatsApp</option>
        </select>
      </div>

      {/* Contact Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredContacts.length === 0 ? (
          <div className="col-span-full py-16 text-center text-slate-400 bg-white dark:bg-[#111625] border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl space-y-3">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center mx-auto">
              <CreditCard className="w-6 h-6" />
            </div>
            <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">No contacts found</div>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Scan a physical business card with multimodal OCR or manually add a contact record.
            </p>
            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                onClick={() => openOcrScanner()}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-sm"
              >
                <Camera className="w-3.5 h-3.5" />
                <span>Scan Visiting Card (OCR)</span>
              </button>
            </div>
          </div>
        ) : (
          filteredContacts.map((cnt) => (
            <div
              key={cnt.id}
              onClick={() => setSelectedContactIdFor360(cnt.id)}
              className="p-5 bg-white dark:bg-[#111625] hover:bg-slate-50/80 dark:hover:bg-[#182035] border border-slate-200 dark:border-slate-800/80 hover:border-purple-500/40 rounded-2xl shadow-2xs hover:shadow-xs transition-all cursor-pointer flex flex-col justify-between group"
            >
              <div>
                {/* Top Section with Avatar & Title */}
                <div className="flex items-start gap-3.5">
                  {cnt.profileImage ? (
                    <img
                      src={cnt.profileImage}
                      alt={cnt.firstName}
                      className="w-12 h-12 rounded-xl object-cover border border-slate-300 dark:border-slate-700 shrink-0"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 font-bold flex items-center justify-center text-sm shrink-0">
                      {cnt.firstName[0]}
                      {cnt.lastName[0]}
                    </div>
                  )}

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1">
                      <h3 className="font-bold text-slate-900 dark:text-slate-100 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors text-sm truncate">
                        {cnt.salutation} {cnt.firstName} {cnt.lastName}
                      </h3>
                      {cnt.source === 'Visiting Card OCR' && (
                        <span
                          title="Extracted from Business Card OCR"
                          className="shrink-0 text-[10px] font-bold text-purple-600 dark:text-purple-400 bg-purple-500/10 border border-purple-500/20 px-1.5 py-0.5 rounded flex items-center gap-0.5"
                        >
                          <CreditCard className="w-2.5 h-2.5" />
                          <span>OCR</span>
                        </span>
                      )}
                    </div>

                    <div className="text-xs font-medium text-slate-500 dark:text-slate-400 truncate mt-0.5">
                      {cnt.jobTitle}
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedAccountIdFor360(cnt.accountId);
                      }}
                      className="text-[11px] text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1 font-medium mt-1 truncate"
                    >
                      <Building2 className="w-3 h-3 shrink-0" />
                      <span className="truncate">{cnt.accountName}</span>
                    </button>
                  </div>
                </div>

                {/* Contact Coordinates */}
                <div className="mt-4 space-y-1.5 text-xs text-slate-500 dark:text-slate-400">
                  <div className="flex items-center gap-2 truncate">
                    <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate text-slate-700 dark:text-slate-300">{cnt.email}</span>
                  </div>
                  {cnt.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="text-slate-700 dark:text-slate-300">{cnt.phone}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="mt-5 pt-3 border-t border-slate-200 dark:border-slate-800/80 flex items-center justify-between">
                <span className="text-[10px] font-semibold text-slate-400 uppercase">
                  Via {cnt.preferredContactMethod}
                </span>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openOcrScanner(cnt.id);
                    }}
                    className="p-1 text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors"
                    title="Update Contact from Visiting Card (OCR)"
                  >
                    <CreditCard className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={(e) => handleDraftEmail(cnt, e)}
                    className="px-2.5 py-1 bg-purple-500/10 hover:bg-purple-500/20 text-purple-700 dark:text-purple-300 rounded-lg text-[11px] font-semibold flex items-center gap-1 transition-colors cursor-pointer border border-purple-500/20"
                  >
                    <Sparkles className="w-3 h-3 text-purple-600 dark:text-purple-400" />
                    <span>AI Email</span>
                  </button>
                  {cnt.phone && (
                    <a
                      href={`tel:${cnt.phone}`}
                      onClick={(e) => e.stopPropagation()}
                      className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors"
                      title="Call Contact"
                    >
                      <Phone className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

