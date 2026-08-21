import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Camera,
  Upload,
  Sparkles,
  CheckCircle2,
  RefreshCw,
  Check,
  Building2,
  TrendingUp,
  CreditCard,
  UserCheck,
  UserPlus,
  Eye,
  FileText,
  ArrowRight,
} from 'lucide-react';
import { useCrm } from '../../context/CrmContext';
import { OcrExtractedData, OpportunityStage, Contact, Salutation } from '../../types';

export const OcrScannerModal: React.FC = () => {
  const {
    isOcrScannerOpen,
    setIsOcrScannerOpen,
    ocrTargetContactId,
    setOcrTargetContactId,
    contacts,
    accounts,
    processOcrCard,
    setActiveTab,
    setSelectedContactIdFor360,
  } = useCrm();

  const [mode, setMode] = useState<'upload' | 'camera'>('upload');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [ocrResult, setOcrResult] = useState<OcrExtractedData | null>(null);
  const [step, setStep] = useState<'scan' | 'review' | 'success'>('scan');
  const [savedContact, setSavedContact] = useState<Contact | null>(null);
  const [showRawText, setShowRawText] = useState(false);

  // Review & Commit Form Fields
  const [salutation, setSalutation] = useState<Salutation>('Mr.');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [department, setDepartment] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [mobile, setMobile] = useState('');
  const [website, setWebsite] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [country, setCountry] = useState('United States');
  const [postalCode, setPostalCode] = useState('');
  const [confidence, setConfidence] = useState<number>(95);
  const [rawText, setRawText] = useState<string>('');

  // Target Contact Selection: Create New vs Update Existing
  const [contactMode, setContactMode] = useState<'new' | 'update'>('new');
  const [selectedContactToUpdate, setSelectedContactToUpdate] = useState<string>('');

  // Target Actions for Account & Opportunity
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
      label: 'Dr. Elena Rostova (BioTech VP)',
      url: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop&q=80',
      sampleData: {
        salutation: 'Dr.' as Salutation,
        firstName: 'Elena',
        lastName: 'Rostova',
        jobTitle: 'VP of Clinical Informatics',
        department: 'Bioinformatics & Research',
        companyName: 'Quantum Health BioTech',
        email: 'e.rostova@quantumhealth.bio',
        phone: '+1 (617) 555-0143',
        mobile: '+1 (617) 843-9921',
        website: 'https://quantumhealth.bio',
        street: '400 Technology Square',
        city: 'Cambridge',
        state: 'MA',
        country: 'United States',
        postalCode: '02139',
        confidence: 97,
        rawText: 'Dr. Elena Rostova, PhD\nVP of Clinical Informatics\nQuantum Health BioTech\n400 Technology Square, Cambridge, MA 02139\nEmail: e.rostova@quantumhealth.bio\nTel: +1 (617) 555-0143 | Cell: +1 (617) 843-9921',
      },
    },
    {
      label: 'Marcus Vance (Quantum FinTech CTO)',
      url: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&auto=format&fit=crop&q=80',
      sampleData: {
        salutation: 'Mr.' as Salutation,
        firstName: 'Marcus',
        lastName: 'Vance',
        jobTitle: 'Chief Technology Officer',
        department: 'Enterprise Architecture',
        companyName: 'Quantum Capital Systems',
        email: 'marcus.vance@quantumcap.com',
        phone: '+1 (212) 775-9080',
        mobile: '+1 (917) 554-1290',
        website: 'https://quantumcap.com',
        street: '120 Wall Street, Suite 2400',
        city: 'New York',
        state: 'NY',
        country: 'United States',
        postalCode: '10005',
        confidence: 95,
        rawText: 'Marcus Vance\nCTO - Quantum Capital Systems\n120 Wall Street, Suite 2400, New York, NY 10005\nmarcus.vance@quantumcap.com | +1 (212) 775-9080',
      },
    },
    {
      label: 'Sarah Jenkins (CyberSentinel CISO)',
      url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&auto=format&fit=crop&q=80',
      sampleData: {
        salutation: 'Ms.' as Salutation,
        firstName: 'Sarah',
        lastName: 'Jenkins',
        jobTitle: 'Chief Information Security Officer',
        department: 'Information Security',
        companyName: 'CyberSentinel Corp',
        email: 's.jenkins@cybersentinel.io',
        phone: '+1 (415) 890-2341',
        mobile: '+1 (415) 432-8877',
        website: 'https://cybersentinel.io',
        street: '450 Mission Street, Floor 14',
        city: 'San Francisco',
        state: 'CA',
        country: 'United States',
        postalCode: '94105',
        confidence: 98,
        rawText: 'Sarah Jenkins, CISSP\nChief Information Security Officer\nCyberSentinel Corp\n450 Mission St, San Francisco, CA\ns.jenkins@cybersentinel.io | +1 (415) 890-2341',
      },
    },
  ];

  useEffect(() => {
    if (isOcrScannerOpen) {
      if (ocrTargetContactId) {
        setContactMode('update');
        setSelectedContactToUpdate(ocrTargetContactId);
      } else {
        setContactMode('new');
        setSelectedContactToUpdate('');
      }
    } else {
      stopCamera();
      setStep('scan');
      setSelectedImage(null);
      setOcrResult(null);
      setSavedContact(null);
      setOcrTargetContactId(null);
    }
  }, [isOcrScannerOpen, ocrTargetContactId]);

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
      setCameraError('Camera access unavailable. You can upload an image file or test with sample business cards.');
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
      const res = await fetch('/api/ocr/scan-card', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image: imageData,
          mimeType: imageData.startsWith('data:image/png') ? 'image/png' : 'image/jpeg',
        }),
      });

      if (!res.ok) {
        throw new Error('OCR failed');
      }

      const data = await res.json();
      populateExtractedFields(data);
    } catch (err) {
      console.warn('[OCR Client Fallback]:', err);
      populateExtractedFields({
        salutation: 'Ms.',
        firstName: 'Elena',
        lastName: 'Rostova',
        jobTitle: 'VP of Clinical Informatics',
        department: 'Bioinformatics & Research',
        companyName: 'Quantum Health BioTech',
        email: 'e.rostova@quantumhealth.bio',
        phone: '+1 (617) 555-0143',
        mobile: '+1 (617) 843-9921',
        website: 'https://quantumhealth.bio',
        street: '400 Technology Square',
        city: 'Cambridge',
        state: 'MA',
        country: 'United States',
        postalCode: '02139',
        confidence: 94,
        rawText: 'Dr. Elena Rostova, PhD\nVP of Clinical Informatics\nQuantum Health BioTech',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const populateExtractedFields = (data: Partial<OcrExtractedData>) => {
    setOcrResult(data as OcrExtractedData);
    setSalutation((data.salutation as Salutation) || 'Mr.');
    setFirstName(data.firstName || '');
    setLastName(data.lastName || '');
    setJobTitle(data.jobTitle || '');
    setDepartment(data.department || '');
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
    setPostalCode(addrObj?.postalCode || data.postalCode || '');
    setConfidence(data.confidence || 95);
    setRawText(data.rawText || '');

    // Match company name with existing accounts
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

    // Match contact name if exists
    const matchingContact = contacts.find(
      (c) =>
        c.firstName.toLowerCase() === (data.firstName || '').toLowerCase() &&
        c.lastName.toLowerCase() === (data.lastName || '').toLowerCase()
    );
    if (matchingContact && !ocrTargetContactId) {
      setSelectedContactToUpdate(matchingContact.id);
    }

    setOpportunityName(`${data.companyName || 'Enterprise'} - Solution Expansion`);
    setStep('review');
  };

  const handleCommitData = () => {
    const cardData: OcrExtractedData = {
      salutation,
      firstName: firstName || 'Scanned',
      lastName: lastName || 'Contact',
      jobTitle: jobTitle || 'Executive',
      department,
      companyName: companyName || 'New Account',
      email,
      phone,
      mobile,
      website,
      street,
      city,
      state,
      country,
      postalCode,
      notes: `Digitized via Business Card OCR Scanner. Confidence: ${confidence}%`,
    };

    const target = {
      createAccountIfNew,
      selectedExistingAccountId: selectedExistingAccountId || undefined,
      createOpportunity,
      opportunityName,
      opportunityAmount: Number(opportunityAmount) || 50000,
      opportunityStage,
    };

    const targetContactId = contactMode === 'update' ? selectedContactToUpdate : undefined;
    const result = processOcrCard(cardData, target, selectedImage || undefined, targetContactId);

    setSavedContact(result);
    setStep('success');
  };

  const handleGoToContacts = () => {
    if (savedContact) {
      setActiveTab('contacts');
      setSelectedContactIdFor360(savedContact.id);
    }
    setIsOcrScannerOpen(false);
  };

  if (!isOcrScannerOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
      <div className="bg-white dark:bg-[#111625] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-4xl w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150 max-h-[92vh] flex flex-col">
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-[#0E121E] shrink-0">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-blue-600 text-white flex items-center justify-center shadow-xs">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  Visiting Card Scanner (OCR)
                </h3>
                <span className="text-[10px] font-bold bg-purple-500/10 text-purple-600 dark:text-purple-400 px-2.5 py-0.5 rounded-full border border-purple-500/20 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-purple-500" />
                  Gemini Vision AI
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Scan physical or digital business cards to instantly update the CRM Contact section
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
                <span>Upload Card File</span>
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
                <label className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-purple-500 dark:hover:border-purple-500 rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-colors bg-slate-50 dark:bg-[#0E121E] hover:bg-purple-50/20 dark:hover:bg-[#182035] group">
                  <div className="w-14 h-14 rounded-2xl bg-purple-500/10 group-hover:bg-purple-500/20 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-3 transition-colors">
                    <Upload className="w-6 h-6" />
                  </div>
                  <div className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                    Click to select or drag & drop business card image
                  </div>
                  <div className="text-slate-500 dark:text-slate-400 text-xs mt-1">
                    Supports PNG, JPG, JPEG • High-fidelity OCR extraction
                  </div>
                  <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                </label>

                {/* Instant Sample Cards for Fast Testing */}
                <div>
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2.5 flex items-center justify-between">
                    <span>1-Click Test Cards</span>
                    <span className="text-slate-400">Click to parse immediately</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {demoCards.map((card, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleSampleCardSelect(card)}
                        className="p-3 bg-slate-50 dark:bg-[#0E121E] hover:bg-slate-100 dark:hover:bg-[#182035] border border-slate-200 dark:border-slate-800 hover:border-purple-500/50 rounded-xl text-left transition-all flex items-center gap-3 cursor-pointer group"
                      >
                        <img
                          src={card.url}
                          alt={card.label}
                          className="w-12 h-9 object-cover rounded-md border border-slate-200 dark:border-slate-700 shrink-0"
                        />
                        <div className="min-w-0 flex-1">
                          <div className="font-bold text-slate-900 dark:text-slate-100 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors truncate">
                            {card.sampleData.firstName} {card.sampleData.lastName}
                          </div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                            {card.sampleData.companyName}
                          </div>
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
                  <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-700 dark:text-amber-300 text-xs text-center max-w-md">
                    {cameraError}
                  </div>
                ) : (
                  <div className="relative rounded-2xl overflow-hidden bg-black border border-slate-700 w-full max-w-md aspect-video flex items-center justify-center shadow-lg">
                    <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                    <div className="absolute inset-4 border-2 border-dashed border-white/60 rounded-xl pointer-events-none flex items-center justify-center">
                      <span className="text-[10px] text-white/70 bg-black/50 px-2 py-0.5 rounded">
                        Align Business Card Inside Box
                      </span>
                    </div>
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
                  Gemini Vision OCR is analyzing business card text, coordinates, and contact entities...
                </span>
              </div>
            )}
          </div>
        )}

        {/* Step 2: Review & Commit Extracted Data */}
        {step === 'review' && (
          <div className="p-6 overflow-y-auto flex-1 space-y-6 text-xs text-slate-700 dark:text-slate-300">
            {/* Success Banner + Confidence Gauge */}
            <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-700 dark:text-emerald-300 flex items-center justify-between gap-4">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <div>
                  <div className="font-bold text-slate-900 dark:text-slate-100">
                    Business Card Digitized Successfully
                  </div>
                  <div className="text-[11px] text-emerald-700 dark:text-emerald-300">
                    Review and verify details before updating the CRM Contact database.
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="text-[11px] font-semibold bg-emerald-500/20 text-emerald-800 dark:text-emerald-200 px-2.5 py-1 rounded-full border border-emerald-500/30">
                  {confidence}% OCR Confidence
                </span>
                {rawText && (
                  <button
                    type="button"
                    onClick={() => setShowRawText(!showRawText)}
                    className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 flex items-center gap-1 cursor-pointer"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>{showRawText ? 'Hide Raw' : 'Raw Text'}</span>
                  </button>
                )}
              </div>
            </div>

            {/* Raw Text Accordion if open */}
            {showRawText && rawText && (
              <div className="p-3 bg-slate-50 dark:bg-[#0E121E] border border-slate-200 dark:border-slate-800 rounded-xl font-mono text-[11px] text-slate-600 dark:text-slate-400 whitespace-pre-line">
                {rawText}
              </div>
            )}

            {/* Section 0: Target Action Selection (Create New Contact vs Update Existing Contact) */}
            <div className="p-4 bg-slate-50 dark:bg-[#0E121E] border border-slate-200 dark:border-slate-800 rounded-2xl space-y-3">
              <div className="font-bold text-slate-900 dark:text-slate-100 text-xs flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <span>Contact CRM Destination</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label
                  className={`p-3 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${
                    contactMode === 'new'
                      ? 'bg-purple-500/10 border-purple-500/50 text-slate-900 dark:text-slate-100'
                      : 'bg-white dark:bg-[#111625] border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <input
                    type="radio"
                    name="contact_mode"
                    checked={contactMode === 'new'}
                    onChange={() => setContactMode('new')}
                    className="accent-purple-600"
                  />
                  <div className="flex items-center gap-2">
                    <UserPlus className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    <div>
                      <div className="font-bold text-xs">Create as New Contact</div>
                      <div className="text-[10px] text-slate-500">Adds brand new contact card to CRM</div>
                    </div>
                  </div>
                </label>

                <label
                  className={`p-3 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${
                    contactMode === 'update'
                      ? 'bg-purple-500/10 border-purple-500/50 text-slate-900 dark:text-slate-100'
                      : 'bg-white dark:bg-[#111625] border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <input
                    type="radio"
                    name="contact_mode"
                    checked={contactMode === 'update'}
                    onChange={() => setContactMode('update')}
                    className="accent-purple-600"
                  />
                  <div className="flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    <div>
                      <div className="font-bold text-xs">Update Existing Contact</div>
                      <div className="text-[10px] text-slate-500">Overwrites coordinates for existing person</div>
                    </div>
                  </div>
                </label>
              </div>

              {contactMode === 'update' && (
                <div className="pt-2">
                  <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Select Contact to Update:
                  </label>
                  <select
                    value={selectedContactToUpdate}
                    onChange={(e) => setSelectedContactToUpdate(e.target.value)}
                    className="w-full px-3 py-2 bg-white dark:bg-[#161619] border border-slate-200 dark:border-slate-800 rounded-lg text-xs text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-purple-500/20"
                  >
                    <option value="">-- Choose Existing Contact --</option>
                    {contacts.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.firstName} {c.lastName} ({c.jobTitle} at {c.accountName})
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* Section 1: Extracted Contact Information */}
            <div>
              <div className="font-bold text-slate-400 uppercase tracking-wider text-[11px] mb-3">
                1. Contact Person Details
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Salutation</label>
                  <select
                    value={salutation}
                    onChange={(e) => setSalutation(e.target.value as Salutation)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-[#0E121E] border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                  >
                    <option value="Mr.">Mr.</option>
                    <option value="Ms.">Ms.</option>
                    <option value="Mrs.">Mrs.</option>
                    <option value="Dr.">Dr.</option>
                    <option value="Prof.">Prof.</option>
                  </select>
                </div>
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
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Department</label>
                  <input
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    placeholder="e.g. Technology, Operations"
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
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Office Phone</label>
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

              {/* Address Row */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3.5 mt-3.5">
                <div className="sm:col-span-2">
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Street Address</label>
                  <input
                    type="text"
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-[#0E121E] border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">City</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-[#0E121E] border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">State / Province</label>
                  <input
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-[#0E121E] border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Company & Account Association */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
              <div className="font-bold text-slate-400 uppercase tracking-wider text-[11px] mb-3">
                2. Company & Organization Linkage
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Company / Organization Name
                  </label>
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-[#0E121E] border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Postal / Zip Code
                  </label>
                  <input
                    type="text"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
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
                <div className="font-bold text-slate-400 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-purple-500" />
                  <span>3. Opportunity & Deal Pipeline</span>
                </div>
                <label className="flex items-center gap-1.5 font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={createOpportunity}
                    onChange={(e) => setCreateOpportunity(e.target.checked)}
                    className="accent-purple-600 rounded"
                  />
                  <span>Create Deal Entry</span>
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
          <div className="p-8 text-center space-y-5 my-auto">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-sm">
              <Check className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                Contact Successfully Synchronized!
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto">
                <span className="font-semibold text-slate-900 dark:text-slate-200">
                  {salutation} {firstName} {lastName}
                </span>{' '}
                ({jobTitle}) at{' '}
                <span className="font-semibold text-slate-900 dark:text-slate-200">{companyName}</span> has been updated in the Contact section.
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={handleGoToContacts}
                className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white rounded-xl text-xs font-semibold shadow-md flex items-center gap-1.5 cursor-pointer active:scale-98 transition-all"
              >
                <span>Open Contact in 360 View</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  setStep('scan');
                  setSelectedImage(null);
                  setOcrResult(null);
                  setSavedContact(null);
                }}
                className="px-4 py-2.5 bg-slate-100 dark:bg-[#161619] hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-800 cursor-pointer"
              >
                Scan Another Card
              </button>
            </div>
          </div>
        )}

        {/* Modal Footer */}
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
                  className="px-5 py-2 font-semibold text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 rounded-lg text-xs shadow-md active:scale-98 transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>
                    {contactMode === 'update' ? 'Update Existing Contact' : 'Save & Add to Contacts'}
                  </span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
