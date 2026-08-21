import React, { useState, useEffect } from 'react';
import { X, User as UserIcon, Building2, AlertTriangle, Mail, Phone } from 'lucide-react';
import { useCrm } from '../../context/CrmContext';
import { SalutationType, PreferredContactMethod } from '../../types';

export const ContactModal: React.FC = () => {
  const {
    isContactModalOpen,
    setIsContactModalOpen,
    editingContact,
    setEditingContact,
    accounts,
    currentUser,
    addContact,
    updateContact,
    checkDuplicateContact,
  } = useCrm();

  const [salutation, setSalutation] = useState<SalutationType>('Mr.');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [accountId, setAccountId] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [department, setDepartment] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [mobile, setMobile] = useState('');
  const [preferredContactMethod, setPreferredContactMethod] = useState<PreferredContactMethod>('Email');
  const [leadSource, setLeadSource] = useState('Direct');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');
  const [dupWarning, setDupWarning] = useState<string | null>(null);

  useEffect(() => {
    if (editingContact) {
      setSalutation(editingContact.salutation);
      setFirstName(editingContact.firstName);
      setLastName(editingContact.lastName);
      setAccountId(editingContact.accountId);
      setJobTitle(editingContact.jobTitle);
      setDepartment(editingContact.department || '');
      setEmail(editingContact.email);
      setPhone(editingContact.phone || '');
      setMobile(editingContact.mobile || '');
      setPreferredContactMethod(editingContact.preferredContactMethod);
      setLeadSource(editingContact.source || 'Direct');
      setNotes(editingContact.notes || '');
    } else {
      setSalutation('Mr.');
      setFirstName('');
      setLastName('');
      setAccountId(accounts[0]?.id || '');
      setJobTitle('');
      setDepartment('');
      setEmail('');
      setPhone('');
      setMobile('');
      setPreferredContactMethod('Email');
      setLeadSource('Direct');
      setNotes('');
    }
    setError('');
    setDupWarning(null);
  }, [editingContact, isContactModalOpen, accounts]);

  if (!isContactModalOpen) return null;

  const handleEmailChange = (val: string) => {
    setEmail(val);
    if (val.trim() && val.includes('@')) {
      const dup = checkDuplicateContact(val, editingContact?.id);
      if (dup) {
        setDupWarning(`Duplicate Warning: A contact with email ${val} already exists (${dup.firstName} ${dup.lastName} at ${dup.accountName}).`);
      } else {
        setDupWarning(null);
      }
    } else {
      setDupWarning(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim()) {
      setError('First and Last Name are required');
      return;
    }
    if (!accountId) {
      setError('A valid Client Account must be linked (BR-01)');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setError('A valid email address is required');
      return;
    }

    const selectedAccount = accounts.find((a) => a.id === accountId);

    const payload = {
      salutation,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      accountId,
      accountName: selectedAccount?.name || 'Account',
      jobTitle: jobTitle.trim(),
      department: department.trim(),
      email: email.trim(),
      phone: phone.trim(),
      mobile: mobile.trim(),
      preferredContactMethod,
      ownerId: currentUser?.id || 'usr-1',
      ownerName: currentUser?.name || 'Janaki Pawar',
      source: leadSource,
      notes: notes.trim(),
    };

    if (editingContact) {
      updateContact(editingContact.id, payload);
    } else {
      addContact(payload);
    }

    setIsContactModalOpen(false);
    setEditingContact(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
      <div className="bg-[#161619] rounded-2xl border border-zinc-800 shadow-2xl max-w-2xl w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-zinc-800 flex items-center justify-between bg-[#121215] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
              <UserIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-zinc-100">
                {editingContact ? 'Edit Contact' : 'New Client Contact'}
              </h3>
              <p className="text-xs text-zinc-400">Record key stakeholder and decision-maker profiles</p>
            </div>
          </div>
          <button
            onClick={() => {
              setIsContactModalOpen(false);
              setEditingContact(null);
            }}
            className="p-1.5 text-zinc-400 hover:text-zinc-200 rounded-lg hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1 text-xs text-zinc-300">
          {error && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 font-medium">
              {error}
            </div>
          )}

          {dupWarning && (
            <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-400 font-medium flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
              <span>{dupWarning}</span>
            </div>
          )}

          {/* Account Selection (BR-01) */}
          <div>
            <label className="block font-semibold text-zinc-300 mb-1 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-zinc-500" /> Parent Account (Company) *
            </label>
            <select
              required
              value={accountId}
              onChange={(e) => setAccountId(e.target.value)}
              className="w-full px-3 py-2 bg-[#121215] border border-zinc-800 rounded-lg text-sm text-zinc-100 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            >
              <option value="">-- Select Parent Account --</option>
              {accounts.map((acc) => (
                <option key={acc.id} value={acc.id}>
                  {acc.name} ({acc.industry})
                </option>
              ))}
            </select>
          </div>

          {/* Name & Salutation */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div>
              <label className="block font-semibold text-zinc-300 mb-1">Salutation</label>
              <select
                value={salutation}
                onChange={(e) => setSalutation(e.target.value as SalutationType)}
                className="w-full px-3 py-2 bg-[#121215] border border-zinc-800 rounded-lg text-sm text-zinc-100 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              >
                <option value="Mr.">Mr.</option>
                <option value="Ms.">Ms.</option>
                <option value="Mrs.">Mrs.</option>
                <option value="Dr.">Dr.</option>
                <option value="Prof.">Prof.</option>
              </select>
            </div>

            <div className="sm:col-span-1.5">
              <label className="block font-semibold text-zinc-300 mb-1">First Name *</label>
              <input
                type="text"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="John"
                className="w-full px-3 py-2 bg-[#121215] border border-zinc-800 rounded-lg text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-semibold text-zinc-300 mb-1">Last Name *</label>
              <input
                type="text"
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Doe"
                className="w-full px-3 py-2 bg-[#121215] border border-zinc-800 rounded-lg text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Job Title & Department */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-zinc-300 mb-1">Job Title *</label>
              <input
                type="text"
                required
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                placeholder="e.g. Chief Technology Officer"
                className="w-full px-3 py-2 bg-[#121215] border border-zinc-800 rounded-lg text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-zinc-300 mb-1">Department</label>
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                placeholder="e.g. Information Security"
                className="w-full px-3 py-2 bg-[#121215] border border-zinc-800 rounded-lg text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Email & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-zinc-300 mb-1 flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-zinc-500" /> Corporate Email *
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => handleEmailChange(e.target.value)}
                placeholder="john.doe@company.com"
                className="w-full px-3 py-2 bg-[#121215] border border-zinc-800 rounded-lg text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-zinc-300 mb-1 flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-zinc-500" /> Direct Phone
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (555) 019-2834"
                className="w-full px-3 py-2 bg-[#121215] border border-zinc-800 rounded-lg text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Mobile & Preferred Contact Method */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-zinc-300 mb-1">Mobile Phone</label>
              <input
                type="text"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                placeholder="+1 (555) 987-6543"
                className="w-full px-3 py-2 bg-[#121215] border border-zinc-800 rounded-lg text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-zinc-300 mb-1">
                Preferred Communication Channel
              </label>
              <select
                value={preferredContactMethod}
                onChange={(e) =>
                  setPreferredContactMethod(e.target.value as PreferredContactMethod)
                }
                className="w-full px-3 py-2 bg-[#121215] border border-zinc-800 rounded-lg text-sm text-zinc-100 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              >
                <option value="Email">Email</option>
                <option value="Phone">Phone</option>
                <option value="Mobile">Mobile / SMS</option>
                <option value="WhatsApp">WhatsApp</option>
              </select>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block font-semibold text-zinc-300 mb-1">
              Contact Notes & Engagement Preferences
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Prefers morning meetings, focuses on cybersecurity ROI..."
              className="w-full px-3 py-2 bg-[#121215] border border-zinc-800 rounded-lg text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          {/* Footer */}
          <div className="pt-4 border-t border-zinc-800 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={() => {
                setIsContactModalOpen(false);
                setEditingContact(null);
              }}
              className="px-4 py-2 font-semibold text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 rounded-lg transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              id="save-contact-submit-btn"
              className="px-5 py-2 font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg shadow-sm shadow-blue-600/20 transition-all active:scale-[0.98] cursor-pointer"
            >
              {editingContact ? 'Save Contact Changes' : 'Create Contact'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
