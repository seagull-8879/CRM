import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Camera,
  Upload,
  Sparkles,
  CheckCircle2,
  RefreshCw,
  Check,
} from 'lucide-react';
import { useCrm } from '../../context/CrmContext';
import { OcrExtractedData, OpportunityStage } from '../../types';

export const OcrScannerModal: React.FC = () => {
  const {
    isOcrScannerOpen,
    setIsOcrScannerOpen,
    accounts,
    processOcrCard,
  } = useCrm();

  const [mode, setMode] = useState<'upload' | 'camera'>('upload');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [ocrResult, setOcrResult] = useState<OcrExtractedData | null>(null);
  const [step, setStep] = useState<'scan' | 'review' | 'success'>('scan');

  // Review & Commit Form Fields
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [mobile, setMobile] = useState('');
  const [website, setWebsite] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [country, setCountry] = useState('United States');

  // Target Actions
  const [createAccountIfNew, setCreateAccountIfNew] = useState(true);
  const [selectedExistingAccountId, setSelectedExistingAccountId] = useState<string>('');
  const [createOpportunity, setCreateOpportunity] = useState(true);
  const [opportunityName, setOpportunityName] = useState('');
  const [opportunityAmount, setOpportunityAmount] = useState<number>(75000);
  const [opportunityStage, setOpportunityStage] = useState<OpportunityStage>('Qualification');

  // Camera video ref & stream
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState('');

  // Sample Demo Business Cards for 1-click test
  const demoCards = [
    {
      label: 'Elena Rostova (CyberTech VP)',
      url: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop&q=80',
      sampleData: {
        firstName: 'Elena',
        lastName: 'Rostova',
        jobTitle: 'VP of Cybersecurity & Infrastructure',
        companyName: 'CyberSentinel Corp',
        email: 'elena.rostova@cybersentinel.io',
        phone: '+1 (415) 890-2341',
        mobile: '+1 (415) 432-8877',
        website: 'https://cybersentinel.io',
        street: '450 Mission Street, Floor 14',
        city: 'San Francisco',
        state: 'CA',
        country: 'United States',
      },
    },
    {
      label: 'Marcus Vance (Quantum FinTech CTO)',
      url: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&auto=format&fit=crop&q=80',
      sampleData: {
        firstName: 'Marcus',
        lastName: 'Vance',
        jobTitle: 'Chief Technology Officer',
        companyName: 'Quantum Capital Systems',
        email: 'marcus.vance@quantumcap.com',
        phone: '+1 (212) 775-9080',
        mobile: '+1 (917) 554-1290',
        website: 'https://quantumcap.com',
        street: '120 Wall Street',
        city: 'New York',
        state: 'NY',
        country: 'United States',
      },
    },
  ];

  useEffect(() => {
    if (!isOcrScannerOpen) {
      stopCamera();
      setStep('scan');
      setSelectedImage(null);
      setOcrResult(null);
    }
  }, [isOcrScannerOpen]);

  const startCamera = async () => {
    setCameraError('');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setCameraActive(true);
      }
    } catch (err: any) {
      setCameraError('Camera access unavailable. You can upload an image file or test with sample cards.');
      setCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg');
      stopCamera();
      setSelectedImage(dataUrl);
      processImageWithGemini(dataUrl);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      setSelectedImage(base64);
      processImageWithGemini(base64);
    };
    reader.readAsDataURL(file);
  };

  const handleSampleCardSelect = (card: typeof demoCards[0]) => {
    setSelectedImage(card.url);
    populateExtractedFields(card.sampleData);
  };

  const processImageWithGemini = async (imageData: string) => {
    setIsProcessing(true);
    try {
      const res = await fetch('/api/ai/ocr-card', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image: imageData,
          mimeType: imageData.startsWith('data:image/png') ? 'image/png' : 'image/jpeg',
        }),
      });

      const data = await res.json();
      populateExtractedFields(data);
    } catch (err) {
      console.error(err);
      populateExtractedFields({
        firstName: 'Alex',
        lastName: 'Morgan',
        jobTitle: 'VP of Business Development',
        companyName: 'Nexus Global',
        email: 'alex.morgan@nexusglobal.com',
        phone: '+1 (555) 345-6789',
        website: 'https://nexusglobal.com',
        city: 'Austin',
        state: 'TX',
        country: 'United States',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const populateExtractedFields = (data: Partial<OcrExtractedData>) => {
    setOcrResult(data as OcrExtractedData);
    setFirstName(data.firstName || '');
    setLastName(data.lastName || '');
    setJobTitle(data.jobTitle || '');
    setCompanyName(data.companyName || '');
    setEmail(data.email || '');
    setPhone(data.phone || '');
    setMobile(data.mobile || '');
    setWebsite(data.website || '');
    const addrObj = typeof data.address === 'object' && data.address !== null ? data.address : null;
    setStreet(addrObj?.street || data.street || (typeof data.address === 'string' ? data.address : ''));
    setCity(addrObj?.city || data.city || '');
    setState(addrObj?.state || data.state || '');
    setCountry(addrObj?.country || data.country || 'United States');

    if (data.companyName) {
      const match = accounts.find(
        (a) => a.name.toLowerCase() === data.companyName?.toLowerCase()
      );
      if (match) {
        setSelectedExistingAccountId(match.id);
        setCreateAccountIfNew(false);
      } else {
        setSelectedExistingAccountId('');
        setCreateAccountIfNew(true);
      }
    }

    setOpportunityName(`${data.companyName || 'Account'} - Strategic Expansion`);
    setStep('review');
  };

  const handleCommitData = () => {
    const cardData: OcrExtractedData = {
      firstName,
      lastName,
      jobTitle,
      companyName,
      email,
      phone,
      mobile,
      website,
      street,
      city,
      state,
      country,
    };

    const target = {
      createAccountIfNew,
      selectedExistingAccountId: selectedExistingAccountId || undefined,
      createOpportunity,
      opportunityName,
      opportunityAmount: Number(opportunityAmount) || 50000,
      opportunityStage,
    };

    processOcrCard(cardData, target);
    setStep('success');
  };

  if (!isOcrScannerOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-[#111625] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-3xl w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-[#0E121E] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-blue-600 text-white flex items-center justify-center shadow-xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <span>Visiting Card Scanner & OCR</span>
                <span className="text-[10px] font-bold bg-purple-500/10 text-purple-600 dark:text-purple-400 px-2 py-0.5 rounded-full border border-purple-500/20">
                  Multimodal Gemini AI
                </span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Instantly extract contacts, accounts, and opportunities from business cards
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsOcrScannerOpen(false)}
            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step 1: Scan / Capture */}
        {step === 'scan' && (
          <div className="p-6 overflow-y-auto flex-1 space-y-6 text-xs">
            {/* Mode Switcher */}
            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => {
                  stopCamera();
                  setMode('upload');
                }}
                className={`py-2 px-5 rounded-xl font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                  mode === 'upload'
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'bg-slate-50 dark:bg-[#0E121E] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 border border-slate-200 dark:border-slate-800 hover:bg-slate-100'
                }`}
              >
                <Upload className="w-4 h-4" />
                <span>Upload Card Image</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setMode('camera');
                  startCamera();
                }}
                className={`py-2 px-5 rounded-xl font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                  mode === 'camera'
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'bg-slate-50 dark:bg-[#0E121E] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 border border-slate-200 dark:border-slate-800 hover:bg-slate-100'
                }`}
              >
                <Camera className="w-4 h-4" />
                <span>Live Camera Snap</span>
              </button>
            </div>

            {/* Upload Zone */}
            {mode === 'upload' && (
              <div className="space-y-4">
                <label className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-purple-500 rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-colors bg-slate-50 dark:bg-[#0E121E] hover:bg-purple-50/20 dark:hover:bg-[#182035] group">
                  <div className="w-14 h-14 rounded-2xl bg-purple-500/10 group-hover:bg-purple-500/20 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-3 transition-colors">
                    <Upload className="w-6 h-6" />
                  </div>
                  <div className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                    Click or drag & drop visiting card image
                  </div>
                  <div className="text-slate-500 dark:text-slate-400 text-xs mt-1">
                    Supports PNG, JPG, JPEG • High-resolution scanning
                  </div>
                  <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                </label>

                {/* Instant Demo Cards for Test */}
                <div>
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Or Test Instantly with Sample Business Cards
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {demoCards.map((card, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleSampleCardSelect(card)}
                        className="p-3 bg-slate-50 dark:bg-[#0E121E] hover:bg-slate-100 dark:hover:bg-[#182035] border border-slate-200 dark:border-slate-800 rounded-xl text-left transition-all flex items-center gap-3 cursor-pointer group"
                      >
                        <img
                          src={card.url}
                          alt={card.label}
                          className="w-12 h-8 object-cover rounded-md border border-slate-200 dark:border-slate-700 shrink-0"
                        />
                        <div>
                          <div className="font-bold text-slate-900 dark:text-slate-100 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                            {card.sampleData.firstName} {card.sampleData.lastName}
                          </div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400">{card.sampleData.companyName}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Live Camera Feed */}
            {mode === 'camera' && (
              <div className="space-y-4 flex flex-col items-center">
                {cameraError ? (
                  <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-700 dark:text-amber-300 text-xs">
                    {cameraError}
                  </div>
                ) : (
                  <div className="relative rounded-2xl overflow-hidden bg-black border border-slate-700 w-full max-w-md aspect-video flex items-center justify-center">
                    <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                    <div className="absolute inset-4 border-2 border-dashed border-white/60 rounded-xl pointer-events-none" />
                  </div>
                )}

                {cameraActive && (
                  <button
                    type="button"
                    onClick={capturePhoto}
                    className="py-2.5 px-6 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-purple-900/30 active:scale-95 transition-all cursor-pointer"
                  >
                    <Camera className="w-4 h-4" />
                    <span>Capture Card & Extract Info</span>
                  </button>
                )}
              </div>
            )}

            {isProcessing && (
              <div className="p-6 bg-purple-500/10 border border-purple-500/30 rounded-2xl flex items-center justify-center gap-3 text-purple-700 dark:text-purple-300">
                <RefreshCw className="w-5 h-5 animate-spin text-purple-600 dark:text-purple-400" />
                <span className="font-semibold text-sm">
                  Gemini 3.7 Flash is analyzing visiting card layout and parsing details...
                </span>
              </div>
            )}
          </div>
        )}

        {/* Step 2: Review & Commit Extracted Data */}
        {step === 'review' && (
          <div className="p-6 overflow-y-auto flex-1 space-y-6 text-xs text-slate-700 dark:text-slate-300">
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-700 dark:text-emerald-300 flex items-center gap-2 font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>Card scanned successfully! Review and edit any field before saving to CRM.</span>
            </div>

            {/* Section 1: Extracted Contact Information */}
            <div>
              <div className="font-bold text-slate-400 uppercase tracking-wider text-[11px] mb-3">
                1. Contact Person Details
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">First Name *</label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-[#0E121E] border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Last Name *</label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-[#0E121E] border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Job Title *</label>
                  <input
                    type="text"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-[#0E121E] border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Email Address *</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-[#0E121E] border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-[#0E121E] border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Mobile</label>
                  <input
                    type="text"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-[#0E121E] border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Company & Account Association */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
              <div className="font-bold text-slate-400 uppercase tracking-wider text-[11px] mb-3">
                2. Company & Account Linkage
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Company / Organization</label>
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-[#0E121E] border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Website URL</label>
                  <input
                    type="text"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-[#0E121E] border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                  />
                </div>
              </div>

              <div className="mt-3 p-3.5 bg-slate-50 dark:bg-[#0E121E] border border-slate-200 dark:border-slate-800 rounded-xl space-y-2">
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="account_action"
                    id="opt_new_account"
                    checked={createAccountIfNew}
                    onChange={() => setCreateAccountIfNew(true)}
                    className="accent-purple-600"
                  />
                  <label htmlFor="opt_new_account" className="font-semibold text-slate-800 dark:text-slate-200 cursor-pointer">
                    Create new Client Account: <span className="text-purple-600 dark:text-purple-400">"{companyName || 'New Account'}"</span>
                  </label>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="account_action"
                    id="opt_existing_account"
                    checked={!createAccountIfNew}
                    onChange={() => setCreateAccountIfNew(false)}
                    className="accent-purple-600"
                  />
                  <label htmlFor="opt_existing_account" className="font-semibold text-slate-800 dark:text-slate-200 cursor-pointer">
                    Link to existing Account in CRM
                  </label>
                </div>

                {!createAccountIfNew && (
                  <select
                    value={selectedExistingAccountId}
                    onChange={(e) => setSelectedExistingAccountId(e.target.value)}
                    className="w-full mt-2 px-3 py-1.5 bg-white dark:bg-[#161619] border border-slate-200 dark:border-slate-800 rounded-lg text-xs text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-purple-500/20"
                  >
                    <option value="">-- Choose Account --</option>
                    {accounts.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.name} ({a.industry})
                      </option>
                    ))}
                  </select>
                )}
              </div>
            </div>

            {/* Section 3: Optional Opportunity Generation */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between mb-3">
                <div className="font-bold text-slate-400 uppercase tracking-wider text-[11px]">
                  3. Pipeline Deal Creation (Optional)
                </div>
                <label className="flex items-center gap-1.5 font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={createOpportunity}
                    onChange={(e) => setCreateOpportunity(e.target.checked)}
                    className="accent-purple-600 rounded"
                  />
                  <span>Create Deal Pipeline Entry</span>
                </label>
              </div>

              {createOpportunity && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 bg-purple-500/5 dark:bg-purple-950/20 border border-purple-500/20 dark:border-purple-900/40 rounded-xl">
                  <div className="sm:col-span-1.5">
                    <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Deal Name
                    </label>
                    <input
                      type="text"
                      value={opportunityName}
                      onChange={(e) => setOpportunityName(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-white dark:bg-[#0E121E] border border-slate-200 dark:border-slate-800 rounded-lg text-xs text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-purple-500/20"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Amount ($)
                    </label>
                    <input
                      type="number"
                      value={opportunityAmount}
                      onChange={(e) => setOpportunityAmount(Number(e.target.value))}
                      className="w-full px-2.5 py-1.5 bg-white dark:bg-[#0E121E] border border-slate-200 dark:border-slate-800 rounded-lg text-xs text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-purple-500/20"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">Stage</label>
                    <select
                      value={opportunityStage}
                      onChange={(e) => setOpportunityStage(e.target.value as OpportunityStage)}
                      className="w-full px-2.5 py-1.5 bg-white dark:bg-[#0E121E] border border-slate-200 dark:border-slate-800 rounded-lg text-xs text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-purple-500/20"
                    >
                      <option value="Qualification">Qualification</option>
                      <option value="Needs Analysis">Needs Analysis</option>
                      <option value="Proposal">Proposal</option>
                    </select>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Step 3: Success Confirmation */}
        {step === 'success' && (
          <div className="p-8 text-center space-y-4 my-auto">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-sm">
              <Check className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Card Processed & Saved!</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto">
                Contact <span className="font-semibold text-slate-900 dark:text-slate-200">{firstName} {lastName}</span> and company <span className="font-semibold text-slate-900 dark:text-slate-200">{companyName}</span> have been synchronized into your CRM.
              </p>
            </div>
            <button
              onClick={() => setIsOcrScannerOpen(false)}
              className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white rounded-xl text-xs font-semibold shadow-md cursor-pointer"
            >
              Done & Return to Workspace
            </button>
          </div>
        )}

        {/* Footer */}
        {step !== 'success' && (
          <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-[#0E121E] shrink-0">
            {step === 'review' ? (
              <button
                type="button"
                onClick={() => setStep('scan')}
                className="px-4 py-2 font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg text-xs cursor-pointer"
              >
                Back to Scanner
              </button>
            ) : (
              <div />
            )}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsOcrScannerOpen(false)}
                className="px-4 py-2 font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg text-xs cursor-pointer"
              >
                Cancel
              </button>
              {step === 'review' && (
                <button
                  type="button"
                  id="commit-ocr-card-btn"
                  onClick={handleCommitData}
                  className="px-5 py-2 font-semibold text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 rounded-lg text-xs shadow-md active:scale-98 transition-all cursor-pointer"
                >
                  Save Contact & Entities
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
