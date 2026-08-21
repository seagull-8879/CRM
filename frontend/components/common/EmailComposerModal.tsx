import React, { useState, useEffect } from 'react';
import { X, Mail, Sparkles, Send, Copy, Check } from 'lucide-react';
import { useCrm } from '../../context/CrmContext';

export const EmailComposerModal: React.FC = () => {
  const {
    isEmailComposerOpen,
    setIsEmailComposerOpen,
    emailComposerData,
    addActivity,
  } = useCrm();

  const [toEmail, setToEmail] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [recipientTitle, setRecipientTitle] = useState('');
  const [accountName, setAccountName] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [purpose, setPurpose] = useState('Executive Follow-Up');
  const [keyPoints, setKeyPoints] = useState('');
  const [tone, setTone] = useState<'Executive' | 'Consultative' | 'Direct' | 'Urgent'>('Executive');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [sendSuccess, setSendSuccess] = useState(false);

  useEffect(() => {
    if (emailComposerData) {
      setToEmail(emailComposerData.toEmail || '');
      setRecipientName(emailComposerData.recipientName || '');
      setRecipientTitle(emailComposerData.recipientTitle || '');
      setAccountName(emailComposerData.accountName || '');
      setSubject(emailComposerData.initialSubject || `Follow-up regarding partnership with ${emailComposerData.accountName || 'our team'}`);
      setBody(emailComposerData.initialBody || '');
      setKeyPoints('');
    }
  }, [emailComposerData, isEmailComposerOpen]);

  if (!isEmailComposerOpen) return null;

  const handleGenerateAiEmail = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch('/api/ai/draft-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipientName,
          recipientTitle,
          accountName,
          purpose,
          keyPoints: keyPoints || 'Discuss recent meeting highlights, next steps on enterprise proposal, and establish review timeline.',
          tone,
        }),
      });

      const data = await res.json();
      if (data.subject) setSubject(data.subject);
      if (data.body) setBody(data.body);
    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    setSendSuccess(true);

    addActivity({
      type: 'Email',
      title: `Sent Email: ${subject}`,
      description: `Subject: ${subject}\nTo: ${recipientName} <${toEmail}>\n\n${body.substring(0, 200)}...`,
      relatedToType: emailComposerData?.opportunityId ? 'Opportunity' : 'Contact',
      relatedToId: emailComposerData?.opportunityId || emailComposerData?.contactId || 'unknown',
      relatedToName: recipientName || accountName,
    });

    setTimeout(() => {
      setSendSuccess(false);
      setIsEmailComposerOpen(false);
    }, 1200);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(`Subject: ${subject}\n\n${body}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-[#111625] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-3xl w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-[#0E121E] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-blue-600 text-white flex items-center justify-center shadow-xs">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <span>AI Smart Email Composer</span>
                <span className="text-[10px] font-semibold bg-purple-500/10 text-purple-600 dark:text-purple-400 px-2 py-0.5 rounded-full border border-purple-500/20 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-purple-600 dark:text-purple-400" /> Gemini Powered
                </span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Draft context-aware sales communications and executive follow-ups
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsEmailComposerOpen(false)}
            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4 text-xs">
          {/* AI Drafting Prompt Bar */}
          <div className="p-4 bg-purple-50/50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-900/40 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="font-bold text-purple-700 dark:text-purple-300 text-xs flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" /> AI Assistant Generator
              </div>
              <button
                id="generate-ai-email-button"
                type="button"
                onClick={handleGenerateAiEmail}
                disabled={isGenerating}
                className="px-3 py-1.5 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white rounded-lg font-semibold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer disabled:opacity-50"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isGenerating ? 'Drafting Email...' : 'Generate with Gemini'}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Email Purpose / Topic
                </label>
                <select
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-white dark:bg-[#0E121E] border border-slate-200 dark:border-slate-800 rounded-lg text-xs text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-purple-500/20"
                >
                  <option value="Executive Follow-Up">Executive Follow-Up</option>
                  <option value="Meeting Recap & Action Items">Meeting Recap & Action Items</option>
                  <option value="Proposal & Pricing Walkthrough">Proposal & Pricing Walkthrough</option>
                  <option value="Contract Finalization">Contract Finalization</option>
                  <option value="Visiting Card Re-engagement">Visiting Card Re-engagement</option>
                  <option value="Check-in & Relationship Nurture">Check-in & Relationship Nurture</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Communication Tone
                </label>
                <select
                  value={tone}
                  onChange={(e) => setTone(e.target.value as any)}
                  className="w-full px-2.5 py-1.5 bg-white dark:bg-[#0E121E] border border-slate-200 dark:border-slate-800 rounded-lg text-xs text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-purple-500/20"
                >
                  <option value="Executive">Executive & Strategic</option>
                  <option value="Consultative">Consultative & Solution-focused</option>
                  <option value="Direct">Direct & Concise</option>
                  <option value="Urgent">Action-Oriented & Prompt</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Specific Key Points to Include (Optional)
              </label>
              <input
                type="text"
                value={keyPoints}
                onChange={(e) => setKeyPoints(e.target.value)}
                placeholder="e.g. Highlight 30% latency reduction in pilot, offer demo on Thursday 2pm"
                className="w-full px-3 py-1.5 bg-white dark:bg-[#0E121E] border border-slate-200 dark:border-slate-800 rounded-lg text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-purple-500/20"
              />
            </div>
          </div>

          {/* Email Recipient & Subject Header */}
          <div className="space-y-2.5 pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">To (Email Address)</label>
                <input
                  type="email"
                  required
                  value={toEmail}
                  onChange={(e) => setToEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-[#0E121E] border border-slate-200 dark:border-slate-800 rounded-lg text-xs text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-purple-500/20"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Recipient Name</label>
                <input
                  type="text"
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-[#0E121E] border border-slate-200 dark:border-slate-800 rounded-lg text-xs text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-purple-500/20"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Subject Line</label>
              <input
                type="text"
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-[#0E121E] border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-semibold text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-purple-500/20"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Email Body</label>
              <textarea
                rows={9}
                required
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Write your email or use 'Generate with Gemini' above to create an automated draft..."
                className="w-full p-3 bg-slate-50 dark:bg-[#0E121E] border border-slate-200 dark:border-slate-800 rounded-lg text-xs text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-purple-500/20 leading-relaxed font-mono placeholder:text-slate-400"
              />
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-[#0E121E] shrink-0">
          <button
            type="button"
            onClick={handleCopy}
            className="px-3 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg font-semibold flex items-center gap-1.5 border border-slate-200 dark:border-slate-800 text-xs cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
            <span>{copied ? 'Copied to Clipboard' : 'Copy Text'}</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsEmailComposerOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSend}
              id="send-logged-email-btn"
              className="px-5 py-2 text-xs font-semibold text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 rounded-lg shadow-sm flex items-center gap-1.5 transition-all active:scale-[0.98] cursor-pointer"
            >
              {sendSuccess ? <Check className="w-4 h-4 text-white" /> : <Send className="w-4 h-4 text-white" />}
              <span>{sendSuccess ? 'Email Logged & Sent!' : 'Send & Log to CRM'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
