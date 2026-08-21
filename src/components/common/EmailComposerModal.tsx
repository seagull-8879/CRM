import React, { useState, useEffect } from 'react';
import { X, Mail, Sparkles, Send, Copy, Check, User, Building2 } from 'lucide-react';
import { useCrm } from '../../context/CrmContext';

export const EmailComposerModal: React.FC = () => {
  const {
    isEmailComposerOpen,
    setIsEmailComposerOpen,
    emailComposerData,
    setEmailComposerData,
    addActivity,
    currentUser,
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

    // Log this email to CRM activities
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
      <div className="bg-[#161619] rounded-2xl border border-zinc-800 shadow-2xl max-w-3xl w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-zinc-800 flex items-center justify-between bg-[#121215] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-zinc-100 flex items-center gap-2">
                <span>AI Smart Email Composer</span>
                <span className="text-[10px] font-semibold bg-indigo-500/10 text-indigo-400 px-2 py-0.5 rounded-full border border-indigo-500/20 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-indigo-400" /> Gemini Powered
                </span>
              </h3>
              <p className="text-xs text-zinc-400">
                Draft context-aware sales communications and executive follow-ups
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsEmailComposerOpen(false)}
            className="p-1.5 text-zinc-400 hover:text-zinc-200 rounded-lg hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4 text-xs">
          {/* AI Drafting Prompt Bar */}
          <div className="p-4 bg-indigo-950/20 border border-indigo-900/40 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="font-bold text-indigo-300 text-xs flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" /> AI Assistant Generator
              </div>
              <button
                id="generate-ai-email-button"
                type="button"
                onClick={handleGenerateAiEmail}
                disabled={isGenerating}
                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-semibold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer disabled:opacity-50"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isGenerating ? 'Drafting Email...' : 'Generate with Gemini'}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-zinc-300 mb-1">
                  Email Purpose / Topic
                </label>
                <select
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-[#121215] border border-zinc-800 rounded-lg text-xs text-zinc-100 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
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
                <label className="block text-[11px] font-semibold text-zinc-300 mb-1">
                  Communication Tone
                </label>
                <select
                  value={tone}
                  onChange={(e) => setTone(e.target.value as any)}
                  className="w-full px-2.5 py-1.5 bg-[#121215] border border-zinc-800 rounded-lg text-xs text-zinc-100 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
                >
                  <option value="Executive">Executive & Strategic</option>
                  <option value="Consultative">Consultative & Solution-focused</option>
                  <option value="Direct">Direct & Concise</option>
                  <option value="Urgent">Action-Oriented & Prompt</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-zinc-300 mb-1">
                Specific Key Points to Include (Optional)
              </label>
              <input
                type="text"
                value={keyPoints}
                onChange={(e) => setKeyPoints(e.target.value)}
                placeholder="e.g. Highlight 30% latency reduction in pilot, offer demo on Thursday 2pm"
                className="w-full px-3 py-1.5 bg-[#121215] border border-zinc-800 rounded-lg text-xs text-zinc-100 placeholder:text-zinc-500 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
          </div>

          {/* Email Recipient & Subject Header */}
          <div className="space-y-2.5 pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-zinc-300 mb-1">To (Email Address)</label>
                <input
                  type="email"
                  required
                  value={toEmail}
                  onChange={(e) => setToEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-[#121215] border border-zinc-800 rounded-lg text-xs text-zinc-100 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div>
                <label className="block font-semibold text-zinc-300 mb-1">Recipient Name</label>
                <input
                  type="text"
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  className="w-full px-3 py-2 bg-[#121215] border border-zinc-800 rounded-lg text-xs text-zinc-100 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-zinc-300 mb-1">Subject Line</label>
              <input
                type="text"
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-3 py-2 bg-[#121215] border border-zinc-800 rounded-lg text-xs font-semibold text-zinc-100 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div>
              <label className="block font-semibold text-zinc-300 mb-1">Email Body</label>
              <textarea
                rows={9}
                required
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Write your email or use 'Generate with Gemini' above to create an automated draft..."
                className="w-full p-3 bg-[#121215] border border-zinc-800 rounded-lg text-xs text-zinc-100 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 leading-relaxed font-mono placeholder:text-zinc-600"
              />
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-zinc-800 flex items-center justify-between bg-[#121215] shrink-0">
          <button
            type="button"
            onClick={handleCopy}
            className="px-3 py-2 text-zinc-300 hover:bg-zinc-800 rounded-lg font-semibold flex items-center gap-1.5 border border-zinc-800 text-xs cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-zinc-500" />}
            <span>{copied ? 'Copied to Clipboard' : 'Copy Text'}</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsEmailComposerOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 rounded-lg transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSend}
              id="send-logged-email-btn"
              className="px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg shadow-sm shadow-blue-600/20 flex items-center gap-1.5 transition-all active:scale-[0.98] cursor-pointer"
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
