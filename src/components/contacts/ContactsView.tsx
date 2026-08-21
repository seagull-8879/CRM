import React, { useState } from 'react';
import {
  Users,
  Plus,
  Search,
  Building2,
  Mail,
  Phone,
  Smartphone,
  Sparkles,
  ExternalLink,
  Edit2,
  Trash2,
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
    <div id="crm-contacts-view" className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-zinc-100 tracking-tight">Client Contacts</h1>
            <span className="text-xs font-bold text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2.5 py-0.5 rounded-full">
              {contacts.length} Total Stakeholders
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Enterprise decision-makers, technical leads, and relationship champions
          </p>
        </div>

        <button
          id="create-new-contact-btn"
          onClick={() => {
            setEditingContact(null);
            setIsContactModalOpen(true);
          }}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-sm shadow-blue-600/20 transition-all active:scale-[0.98] cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>New Contact</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-[#161619] p-4 border border-zinc-800 rounded-2xl shadow-xs flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search contacts by name, title, company, email..."
            className="w-full pl-9 pr-3 py-2 bg-[#121215] border border-zinc-800 rounded-lg text-xs text-zinc-100 placeholder:text-zinc-500 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>

        <select
          value={accountFilter}
          onChange={(e) => setAccountFilter(e.target.value)}
          className="px-3 py-2 bg-[#121215] border border-zinc-800 rounded-lg text-xs text-zinc-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
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
          className="px-3 py-2 bg-[#121215] border border-zinc-800 rounded-lg text-xs text-zinc-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
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
          <div className="col-span-full py-12 text-center text-zinc-500 bg-[#161619] border border-dashed border-zinc-800 rounded-2xl">
            No contacts found matching your criteria.
          </div>
        ) : (
          filteredContacts.map((cnt) => (
            <div
              key={cnt.id}
              onClick={() => setSelectedContactIdFor360(cnt.id)}
              className="p-5 bg-[#161619] hover:bg-[#1C1C20] border border-zinc-800 hover:border-zinc-700 rounded-2xl shadow-2xs hover:shadow-xs transition-all cursor-pointer flex flex-col justify-between group"
            >
              <div>
                {/* Top Section with Avatar & Title */}
                <div className="flex items-start gap-3.5">
                  {cnt.profileImage ? (
                    <img
                      src={cnt.profileImage}
                      alt={cnt.firstName}
                      className="w-12 h-12 rounded-xl object-cover border border-zinc-700 shrink-0"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 font-bold flex items-center justify-center text-sm shrink-0">
                      {cnt.firstName[0]}
                      {cnt.lastName[0]}
                    </div>
                  )}

                  <div className="min-w-0 flex-1">
                    <h3 className="font-bold text-zinc-100 group-hover:text-blue-400 transition-colors text-sm truncate">
                      {cnt.salutation} {cnt.firstName} {cnt.lastName}
                    </h3>
                    <div className="text-xs font-medium text-zinc-400 truncate mt-0.5">
                      {cnt.jobTitle}
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedAccountIdFor360(cnt.accountId);
                      }}
                      className="text-[11px] text-blue-400 hover:underline flex items-center gap-1 font-medium mt-1 truncate"
                    >
                      <Building2 className="w-3 h-3 shrink-0" />
                      <span className="truncate">{cnt.accountName}</span>
                    </button>
                  </div>
                </div>

                {/* Contact Coordinates */}
                <div className="mt-4 space-y-1.5 text-xs text-zinc-400">
                  <div className="flex items-center gap-2 truncate">
                    <Mail className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                    <span className="truncate text-zinc-300">{cnt.email}</span>
                  </div>
                  {cnt.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                      <span className="text-zinc-300">{cnt.phone}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="mt-5 pt-3 border-t border-zinc-800/80 flex items-center justify-between">
                <span className="text-[10px] font-semibold text-zinc-500 uppercase">
                  Via {cnt.preferredContactMethod}
                </span>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={(e) => handleDraftEmail(cnt, e)}
                    className="px-2.5 py-1 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 rounded-lg text-[11px] font-semibold flex items-center gap-1 transition-colors cursor-pointer border border-indigo-500/20"
                  >
                    <Sparkles className="w-3 h-3 text-indigo-400" />
                    <span>AI Email</span>
                  </button>
                  {cnt.phone && (
                    <a
                      href={`tel:${cnt.phone}`}
                      onClick={(e) => e.stopPropagation()}
                      className="p-1 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 rounded-md transition-colors"
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
