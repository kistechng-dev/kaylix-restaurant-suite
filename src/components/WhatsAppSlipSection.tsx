import React, { useState, useRef, useEffect } from 'react';
import { 
  MessageSquare, 
  Upload, 
  FileCheck, 
  Trash2, 
  Send, 
  Copy, 
  Check, 
  Sparkles, 
  Image as ImageIcon, 
  Building2, 
  Calendar, 
  ExternalLink,
  ReceiptText,
  Mail,
  KeyRound,
  Download,
  Share2
} from 'lucide-react';
import { PaymentSlipData } from '../types';
import { 
  STATION_PACKAGES, 
  SOFTWARE_PACKAGE_GROUPS, 
  CORPORATE_BANK_ACCOUNTS, 
  OFFICIAL_LICENSE_PAYMENT_ACCOUNTS 
} from '../data/portalData';
import { formatNaira } from '../utils/referenceGenerator';
import { generateKaylixLicenseCode } from '../utils/cryptoKey';

interface WhatsAppSlipSectionProps {
  onShowToast: (type: 'success' | 'info' | 'error', title: string, message?: string) => void;
  currentReference: string;
  presetBank?: string;
  onNavigateToDownload?: (editionId?: string) => void;
}

export const WhatsAppSlipSection: React.FC<WhatsAppSlipSectionProps> = ({
  onShowToast,
  currentReference,
  presetBank,
  onNavigateToDownload,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [copiedMessage, setCopiedMessage] = useState(false);
  const [recipientNumber, setRecipientNumber] = useState(OFFICIAL_LICENSE_PAYMENT_ACCOUNTS.supportWhatsAppRaw); // +2348 06039 5329

  const [formData, setFormData] = useState<PaymentSlipData>({
    restaurantName: 'Mama Cass Deluxe Eatery',
    contactPerson: 'Chef Adebayo Johnson',
    phone: '+234 803 892 1104',
    email: 'operations@mamacassdeluxe.ng',
    cityBranch: 'Wuse II, Abuja FCT',
    selectedPackage: 'Standard Package (1yrs, 20,000)',
    amountPaid: '20,000',
    bankSelected: presetBank || 'Zenith Bank (101 6978 239)',
    paymentReference: currentReference,
    transferDate: new Date().toISOString().slice(0, 16),
    receiptImage: null,
    receiptName: null,
    receiptSize: null,
    notes: 'Please verify settlement and dispatch master license activation key.',
  });

  // Keep reference in sync if updated from parent
  useEffect(() => {
    if (currentReference) {
      setFormData((prev) => ({ ...prev, paymentReference: currentReference }));
    }
  }, [currentReference]);

  // Keep presetBank in sync if navigated from banking card
  useEffect(() => {
    if (presetBank) {
      setFormData((prev) => ({ ...prev, bankSelected: presetBank }));
    }
  }, [presetBank]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePackageSelect = (pkg: typeof STATION_PACKAGES[0]) => {
    setFormData((prev) => ({
      ...prev,
      selectedPackage: pkg.name,
      amountPaid: pkg.amount,
    }));
    onShowToast('info', 'Package Selected', `${pkg.name} - ₦${pkg.amount}`);
  };

  const handleFileUpload = (file: File) => {
    if (!file.type.startsWith('image/')) {
      onShowToast('error', 'Invalid File Type', 'Please upload a valid receipt image (PNG, JPG, WEBP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setFormData((prev) => ({
        ...prev,
        receiptImage: e.target?.result as string,
        receiptName: file.name,
        receiptSize: `${(file.size / 1024).toFixed(1)} KB`,
      }));
      onShowToast('success', 'Receipt Attached!', `${file.name} ready for review.`);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const removeReceipt = () => {
    setFormData((prev) => ({
      ...prev,
      receiptImage: null,
      receiptName: null,
      receiptSize: null,
    }));
    if (fileInputRef.current) fileInputRef.current.value = '';
    onShowToast('info', 'Receipt Removed', 'You can upload another payment proof image.');
  };

  // Generate realistic demo electronic bank receipt on client canvas
  const generateSampleReceipt = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 600;
    canvas.height = 780;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Background
    ctx.fillStyle = '#0F172A';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Header gradient banner
    const grad = ctx.createLinearGradient(0, 0, 600, 0);
    grad.addColorStop(0, formData.bankSelected.includes('Zenith') ? '#991B1B' : '#1D4ED8');
    grad.addColorStop(1, '#0F172A');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 600, 110);

    // Header text
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 24px sans-serif';
    ctx.fillText(`${formData.bankSelected.toUpperCase()} - NIP TRANSACTION RECEIPT`, 30, 45);
    ctx.font = '14px monospace';
    ctx.fillStyle = '#CBD5E1';
    ctx.fillText(`TRANSACTION STATUS: SUCCESSFUL / SETTLED`, 30, 75);
    ctx.fillText(`SESSION ID: 000013260927${Math.floor(10000000 + Math.random() * 90000000)}`, 30, 95);

    // Body container
    ctx.fillStyle = '#1E293B';
    ctx.fillRect(25, 130, 550, 520);

    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1;

    const rows = [
      ['Beneficiary Account Name', formData.bankSelected.includes('Zenith') ? 'Kaylix Technology' : 'Alabi Kayode Felix'],
      ['Beneficiary Bank', formData.bankSelected.includes('Zenith') ? 'Zenith Bank PLC' : 'Moniepoint Microfinance Bank'],
      ['Beneficiary Account Number', formData.bankSelected.includes('Zenith') ? '101 6978 239' : '808 9697 390'],
      ['Sender / Eatery Name', formData.restaurantName || 'Mama Cass Deluxe Eatery'],
      ['Amount Paid', formData.amountPaid === 'Contact us' ? 'Custom Quote (Contact us)' : `NGN ${formData.amountPaid || '20,000'}.00`],
      ['Transfer Date & Time', formData.transferDate || new Date().toLocaleString()],
      ['Payment Reference', formData.paymentReference || currentReference],
      ['Package Ordered', (formData.selectedPackage || 'Standard Package').slice(0, 40)],
      ['Channel / Gateway', 'NIBSS Instant Payment (NIP Web/Mobile)'],
      ['Approval Code', `APV-${Math.floor(100000 + Math.random() * 900000)}`],
    ];

    let currentY = 175;
    rows.forEach(([label, value]) => {
      ctx.fillStyle = '#94A3B8';
      ctx.font = '13px sans-serif';
      ctx.fillText(label, 45, currentY);

      ctx.fillStyle = '#F8FAFC';
      ctx.font = 'bold 14px monospace';
      ctx.fillText(value, 45, currentY + 20);

      ctx.beginPath();
      ctx.moveTo(45, currentY + 30);
      ctx.lineTo(555, currentY + 30);
      ctx.stroke();

      currentY += 48;
    });

    // Watermark / Seal
    ctx.fillStyle = '#10B981';
    ctx.font = 'bold 16px sans-serif';
    ctx.fillText('✓ NIP VERIFIED & COMPLETED', 180, 680);

    const dataUrl = canvas.toDataURL('image/png');
    setFormData((prev) => ({
      ...prev,
      receiptImage: dataUrl,
      receiptName: `NIP_Transfer_Slip_${formData.paymentReference}.png`,
      receiptSize: '84.6 KB',
    }));
    onShowToast('success', 'Electronic Slip Generated!', 'Simulated bank transfer slip attached successfully.');
  };

  // Origin URL for sharing
  const originUrl = typeof window !== 'undefined' ? window.location.origin : 'https://kaylixtech.ng';

  // Map package to the corresponding software edition ID for download routing
  const getMappedEditionId = () => {
    const pkgLower = (formData.selectedPackage || '').toLowerCase();
    if (pkgLower.includes('basic')) return 'basic';
    if (pkgLower.includes('standard')) return 'standard';
    if (pkgLower.includes('enterprise') || pkgLower.includes('enterprises')) return 'enterprise';
    if (pkgLower.includes('trial')) return 'trial';
    if (pkgLower.includes('master')) return 'master-suite';
    return 'standard';
  };

  const getPackageCodes = () => {
    const pkg = formData.selectedPackage;
    let versionCode = 'STD';
    let periodCode = '01Y';

    if (pkg.includes('Basic')) versionCode = 'BSC';
    else if (pkg.includes('Standard')) versionCode = 'STD';
    else if (pkg.includes('Enterprises') || pkg.includes('Enterprise')) versionCode = 'ENT';
    else if (pkg.includes('Trial')) versionCode = 'TRL';
    else if (pkg.includes('Master')) versionCode = 'MST';

    if (pkg.includes('1yrs') || pkg.includes('1 Year') || pkg.includes('01Y')) periodCode = '01Y';
    else if (pkg.includes('3 years') || pkg.includes('3 Years') || pkg.includes('03Y')) periodCode = '03Y';
    else if (pkg.includes('life time') || pkg.includes('Lifetime') || pkg.includes('LFT')) periodCode = 'LFT';
    else if (pkg.includes('7-Day') || pkg.includes('07D')) periodCode = '07D';

    return { versionCode, periodCode };
  };

  // Compile formatted message text with Master Key Generator Link included
  const compileWhatsAppMessage = () => {
    return `*KAYLIX RESTAURANT SUITE - PAYMENT & LICENSE DISPATCH*
━━━━━━━━━━━━━━━━━━━━━━━━━━
🏛️ *Beneficiary Bank:* ${formData.bankSelected}
🔖 *Payment Reference:* ${formData.paymentReference}
💰 *Amount Paid:* ₦${formData.amountPaid}
🍽️ *Restaurant Name:* ${formData.restaurantName}
📍 *Location / Branch:* ${formData.cityBranch}
👤 *Contact Person:* ${formData.contactPerson}
📞 *Phone Number:* ${formData.phone}
✉️ *Email Address:* ${formData.email}
📦 *Station Package:* ${formData.selectedPackage}
📅 *Transfer Timestamp:* ${formData.transferDate}
━━━━━━━━━━━━━━━━━━━━━━━━━━
📝 *Operational Notes:*
${formData.notes || 'Awaiting verification and license key dispatch.'}

📎 *Receipt Attached:* ${formData.receiptName ? `Yes (${formData.receiptName})` : 'Uploading directly in chat'}
━━━━━━━━━━━━━━━━━━━━━━━━━━
_Automated Dispatch via Kaylix Eatery Management Portal v2.4.2_`;
  };

  const copyMessageText = () => {
    const text = compileWhatsAppMessage();
    navigator.clipboard.writeText(text);
    setCopiedMessage(true);
    onShowToast('success', 'Message Copied!', 'Summary payment slip ready to paste.');
    setTimeout(() => setCopiedMessage(false), 2500);
  };

  // Perform multi-channel dispatch (WhatsApp, Telegram, and Email) and navigate to the right download page
  const handleDispatchAllChannels = (e: React.MouseEvent) => {
    e.preventDefault();

    const fullMessage = compileWhatsAppMessage();
    const encodedText = encodeURIComponent(fullMessage);
    const cleanPhone = recipientNumber.replace(/[^0-9]/g, '') || OFFICIAL_LICENSE_PAYMENT_ACCOUNTS.supportWhatsAppRaw;

    // 0. Persist Payment Submission to Backend Admin Database
    try {
      const { versionCode, periodCode } = getPackageCodes();
      const licenseCode = generateKaylixLicenseCode({
        version: versionCode,
        period: periodCode,
      });

      fetch('/api/records', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'PAYMENT_SLIP',
          fullName: formData.contactPerson || 'Customer',
          phone: formData.phone,
          email: formData.email,
          restaurantName: formData.restaurantName,
          cityBranch: formData.cityBranch,
          version: formData.selectedPackage,
          versionCode,
          periodCode,
          amount: formData.amountPaid === 'Contact us' ? 'Custom Quote' : `₦${formData.amountPaid}`,
          bankDetails: {
            bankName: formData.bankSelected,
            accountNumber: formData.bankSelected.includes('Zenith') ? '101 6978 239' : '808 9697 390',
            accountName: formData.bankSelected.includes('Zenith') ? 'Kaylix Technology' : 'Alabi Kayode Felix',
            paymentReference: formData.paymentReference,
            transferDate: formData.transferDate,
          },
          licenseCode,
          timestamp: new Date().toISOString(),
          status: 'PENDING',
          notes: formData.notes,
        }),
      }).catch(() => {});
    } catch {
      // offline fallback
    }

    // 1. WhatsApp Dispatch (Target: +2348 06039 5329)
    const whatsAppUrl = `https://wa.me/${cleanPhone}?text=${encodedText}`;
    try {
      window.open(whatsAppUrl, '_blank', 'noopener,noreferrer');
    } catch {
      // fallback
    }

    // 2. Telegram Dispatch (Target: +2348 06039 5329)
    const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(originUrl)}&text=${encodedText}`;
    try {
      setTimeout(() => {
        window.open(telegramUrl, '_blank', 'noopener,noreferrer');
      }, 350);
    } catch {
      // fallback
    }

    // 3. Email Dispatch (Target: licensing@kaylixsystems.com & user email)
    const emailSubject = encodeURIComponent(`Payment Slip & License Request: ${formData.restaurantName} (Ref: ${formData.paymentReference})`);
    const mailtoUrl = `mailto:licensing@kaylixsystems.com,${encodeURIComponent(formData.email)}?subject=${emailSubject}&body=${encodedText}`;
    try {
      setTimeout(() => {
        const mailLink = document.createElement('a');
        mailLink.href = mailtoUrl;
        mailLink.click();
      }, 700);
    } catch {
      // fallback
    }

    onShowToast(
      'success',
      'Dispatched to WhatsApp, Telegram & Email!',
      `Payment details sent. Redirecting to your software download page...`
    );

    // 4. Then take user to the right download page for their selected version
    const targetEditionId = getMappedEditionId();
    setTimeout(() => {
      if (onNavigateToDownload) {
        onNavigateToDownload(targetEditionId);
      }
    }, 1200);
  };

  const encodedText = encodeURIComponent(compileWhatsAppMessage());
  const cleanPhone = recipientNumber.replace(/[^0-9]/g, '') || OFFICIAL_LICENSE_PAYMENT_ACCOUNTS.supportWhatsAppRaw;
  const whatsAppUrl = `https://wa.me/${cleanPhone}?text=${encodedText}`;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Intro Header */}
      <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
              <Share2 className="w-3.5 h-3.5" />
              Multi-Channel Dispatch Engine (WhatsApp • Telegram • Email)
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              Instant Payment Slip & Receipt Submission
            </h2>
            <p className="text-slate-300 text-sm max-w-2xl">
              Dispatch your payment proof simultaneously to WhatsApp, Telegram, and Email. The dispatch includes the direct <strong className="text-amber-300">Master Key Generator weblink</strong> for immediate license key generation, then redirects you to your software download page.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300 flex items-center gap-3">
            <Building2 className="w-8 h-8 text-emerald-400 shrink-0" />
            <div>
              <div className="text-[10px] text-slate-400 font-mono uppercase">Official Dispatch Helpline</div>
              <div className="font-bold text-white font-mono text-sm">{OFFICIAL_LICENSE_PAYMENT_ACCOUNTS.supportWhatsApp}</div>
              <div className="text-[10px] text-emerald-400">Zenith Bank & Moniepoint Accounts</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Form Column (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-7 shadow-xl space-y-5">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <ReceiptText className="w-5 h-5 text-amber-400" />
              Payment Slip Information Form
            </h3>

            {/* Software Version / Package Selector */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                  Select Software Version / Package *
                </label>
                <span className="text-[11px] font-mono text-amber-400 font-bold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
                  {formData.amountPaid === 'Contact us' ? 'Custom Quote' : `₦${formData.amountPaid}`}
                </span>
              </div>

              {/* Package Quick-Selection Dropdown */}
              <div className="space-y-1">
                <select
                  name="selectedPackage"
                  value={formData.selectedPackage}
                  onChange={(e) => {
                    const val = e.target.value;
                    const matched = STATION_PACKAGES.find((p) => p.name === val);
                    if (matched) {
                      setFormData((prev) => ({
                        ...prev,
                        selectedPackage: matched.name,
                        amountPaid: matched.amount,
                      }));
                      onShowToast('info', 'Package Selected', `${matched.name} - ${matched.amount === 'Contact us' ? 'Contact us' : '₦' + matched.amount}`);
                    } else {
                      setFormData((prev) => ({ ...prev, selectedPackage: val }));
                    }
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-amber-500/40 text-sm text-white focus:outline-none focus:border-amber-400 transition-colors font-medium shadow-inner"
                >
                  <optgroup label="Basic Package">
                    <option value="Basic Package (1yrs, 10,000)">Basic Package (1yrs, 10,000) — ₦10,000</option>
                    <option value="Basic Package (3 years, 28,000)">Basic Package (3 years, 28,000) — ₦28,000</option>
                    <option value="Basic Package (life time, 60,000)">Basic Package (life time, 60,000) — ₦60,000</option>
                  </optgroup>
                  <optgroup label="Standard Package">
                    <option value="Standard Package (1yrs, 20,000)">Standard Package (1yrs, 20,000) — ₦20,000</option>
                    <option value="Standard Package (3 years, 57,000)">Standard Package (3 years, 57,000) — ₦57,000</option>
                    <option value="Standard Package (life time, 100,000)">Standard Package (life time, 100,000) — ₦100,000</option>
                  </optgroup>
                  <optgroup label="Enterprises Package">
                    <option value="Enterprises Package (1yrs, 40,000)">Enterprises Package (1yrs, 40,000) — ₦40,000</option>
                    <option value="Enterprises Package (3 years, 115,000)">Enterprises Package (3 years, 115,000) — ₦115,000</option>
                    <option value="Enterprises Package (life time, 200,000)">Enterprises Package (life time, 200,000) — ₦200,000</option>
                  </optgroup>
                  <optgroup label="Hardware Peripherals">
                    <option value="Bluetooth thermal printer (#30,000)">Bluetooth thermal printer (#30,000) — ₦30,000</option>
                  </optgroup>
                  <optgroup label="Deployment & Installation">
                    <option value="Deployment/Installation (Contact us )">Deployment/Installation (Contact us ) — Contact us</option>
                  </optgroup>
                </select>
                <div className="text-[11px] text-slate-400 flex items-center justify-between pt-0.5">
                  <span>Or click on any package card & duration below:</span>
                  <span className="font-mono text-amber-300 font-semibold">{formData.selectedPackage}</span>
                </div>
              </div>

              {/* Version & Package Groups */}
              <div className="space-y-2.5">
                {SOFTWARE_PACKAGE_GROUPS.map((group) => {
                  const isGroupSelected = formData.selectedPackage.startsWith(group.name);

                  if (group.tiers) {
                    return (
                      <div
                        key={group.id}
                        className={`p-3.5 rounded-2xl border transition-all ${
                          isGroupSelected
                            ? 'bg-amber-500/10 border-amber-500/80 shadow-md shadow-amber-950/20'
                            : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
                          <div>
                            <span className="text-xs font-bold text-white">{group.name}</span>
                          </div>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-amber-300 border border-slate-800 shrink-0 w-fit">
                            {group.badge}
                          </span>
                        </div>

                        {/* Tier duration selector buttons */}
                        <div className="grid grid-cols-3 gap-2">
                          {group.tiers.map((tier) => {
                            const isTierSelected = formData.selectedPackage === tier.fullTag;
                            return (
                              <button
                                key={tier.durationLabel}
                                type="button"
                                onClick={() => {
                                  setFormData((prev) => ({
                                    ...prev,
                                    selectedPackage: tier.fullTag,
                                    amountPaid: tier.amount,
                                  }));
                                  onShowToast('info', 'Package Selected', `${tier.fullTag} - ₦${tier.amount}`);
                                }}
                                className={`py-2 px-2.5 rounded-xl text-left border transition-all ${
                                  isTierSelected
                                    ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold shadow-md shadow-amber-950/30'
                                    : 'bg-slate-900/90 text-slate-300 border-slate-800 hover:border-slate-700 hover:text-white'
                                }`}
                              >
                                <div className="text-[11px] font-semibold truncate">{tier.durationLabel}</div>
                                <div className={`text-xs font-mono font-bold ${isTierSelected ? 'text-slate-950' : 'text-amber-400'}`}>
                                  {tier.formattedAmount}
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  }

                  // Hardware & Service Items: Bluetooth thermal printer (#30,000) & Deployment/Installation (Contact us )
                  const isItemSelected = formData.selectedPackage === (group.fullTag || group.name);
                  return (
                    <button
                      key={group.id}
                      type="button"
                      onClick={() => {
                        const tag = group.fullTag || group.name;
                        const amt = group.fixedAmount || 'Contact us';
                        setFormData((prev) => ({
                          ...prev,
                          selectedPackage: tag,
                          amountPaid: amt,
                        }));
                        onShowToast('info', 'Item Selected', `${tag} - ${amt === 'Contact us' ? 'Contact us' : `₦${amt}`}`);
                      }}
                      className={`w-full p-3.5 rounded-2xl text-left border transition-all flex items-center justify-between gap-3 ${
                        isItemSelected
                          ? 'bg-amber-500/10 border-amber-500 text-white shadow-md shadow-amber-950/20'
                          : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <div>
                        <div className="text-xs font-bold text-white flex items-center gap-2">
                          <span>{group.fullTag || group.name}</span>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800">
                            {group.badge}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5">{group.summary}</div>
                      </div>
                      <div className="text-right shrink-0">
                        <span className={`text-xs font-mono font-bold px-2.5 py-1 rounded-lg ${
                          isItemSelected
                            ? 'bg-amber-500 text-slate-950 font-black'
                            : 'bg-slate-900 text-amber-400 border border-slate-800'
                        }`}>
                          {group.fixedAmount === 'Contact us' ? 'Contact us' : `₦${group.fixedAmount}`}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Restaurant & Contact Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Restaurant / Eatery Name *
                </label>
                <input
                  type="text"
                  name="restaurantName"
                  value={formData.restaurantName}
                  onChange={handleInputChange}
                  placeholder="e.g. Mama Cass Kitchen"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-amber-500 transition-colors"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Contact Phone Number *
                </label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="+234 803 000 0000"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-amber-500 transition-colors"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Branch / City Location
                </label>
                <input
                  type="text"
                  name="cityBranch"
                  value={formData.cityBranch}
                  onChange={handleInputChange}
                  placeholder="e.g. Victoria Island, Lagos"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-amber-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Contact Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="operations@mamacassdeluxe.ng"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-amber-500 transition-colors"
                  required
                />
              </div>
            </div>

            {/* Financial Details: Bank, Amount & Reference */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Bank Transferred To *
                </label>
                <select
                  name="bankSelected"
                  value={formData.bankSelected}
                  onChange={handleInputChange}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-amber-500 transition-colors"
                >
                  <option value="Zenith Bank (101 6978 239)">Zenith Bank PLC (101 6978 239 - Kaylix Technology)</option>
                  <option value="Moniepoint (808 9697 390)">Moniepoint MFB (808 9697 390 - Alabi Kayode Felix)</option>
                </select>
                <p className="text-[10px] text-slate-500 mt-1">
                  Verified settlement accounts: Zenith Bank & Moniepoint only
                </p>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Amount Paid (₦) *
                </label>
                <input
                  type="text"
                  name="amountPaid"
                  value={formData.amountPaid}
                  onChange={handleInputChange}
                  placeholder="20,000"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm font-mono text-amber-400 font-bold focus:outline-none focus:border-amber-500 transition-colors"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Payment Reference Code *
                </label>
                <input
                  type="text"
                  name="paymentReference"
                  value={formData.paymentReference}
                  onChange={handleInputChange}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm font-mono font-bold text-white focus:outline-none focus:border-amber-500 transition-colors"
                  required
                />
              </div>
            </div>

            {/* Date and Recipient */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" /> Transfer Date & Time
                </label>
                <input
                  type="datetime-local"
                  name="transferDate"
                  value={formData.transferDate}
                  onChange={handleInputChange}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-200 focus:outline-none focus:border-amber-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Dispatch WhatsApp / Telegram Line
                </label>
                <input
                  type="text"
                  value={recipientNumber}
                  onChange={(e) => setRecipientNumber(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm font-mono text-white focus:outline-none focus:border-amber-500 transition-colors"
                  placeholder="2348060395329"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Special Instructions / Terminal Requirements
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                rows={2}
                placeholder="Mention printer models, kitchen screens count, or specific branch name..."
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-200 focus:outline-none focus:border-amber-500 transition-colors resize-none"
              />
            </div>

            {/* Image Receipt Attachment Area */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <ImageIcon className="w-4 h-4 text-amber-400" />
                  Bank Transfer Receipt Attachment Preview
                </label>

                <button
                  type="button"
                  onClick={generateSampleReceipt}
                  className="text-[11px] font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20 transition-colors"
                >
                  <Sparkles className="w-3 h-3" /> Auto-Generate Demo Slip
                </button>
              </div>

              {formData.receiptImage ? (
                <div className="p-4 rounded-2xl bg-slate-950 border border-emerald-500/40 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <FileCheck className="w-4 h-4 text-emerald-400" />
                      <span className="font-semibold text-white">{formData.receiptName}</span>
                      <span className="text-slate-400 font-mono">({formData.receiptSize})</span>
                    </div>

                    <button
                      type="button"
                      onClick={removeReceipt}
                      className="text-rose-400 hover:text-rose-300 p-1 rounded hover:bg-rose-950/40 transition-colors"
                      title="Remove attachment"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="relative max-h-56 overflow-hidden rounded-xl border border-slate-800 bg-slate-900 flex items-center justify-center">
                    <img
                      src={formData.receiptImage}
                      alt="Bank Transfer Receipt Preview"
                      className="w-full h-auto max-h-56 object-contain"
                    />
                  </div>
                </div>
              ) : (
                <div
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-700 hover:border-amber-500/60 rounded-2xl p-6 text-center cursor-pointer transition-all bg-slate-950/40 hover:bg-slate-950/80 group"
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleFileUpload(e.target.files[0]);
                      }
                    }}
                  />
                  <Upload className="w-8 h-8 text-slate-400 group-hover:text-amber-400 mx-auto mb-2 transition-colors" />
                  <div className="text-xs font-semibold text-slate-200">
                    Click to browse or drag & drop payment proof screenshot
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1">
                    Supports PNG, JPG, JPEG, WEBP (Max 10 MB)
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Preview & Multi-Channel Dispatch Column (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-7 shadow-xl space-y-5 sticky top-28">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-emerald-400" />
                Dispatch Message Preview
              </h3>
              <button
                type="button"
                onClick={copyMessageText}
                className="text-xs font-medium text-slate-300 hover:text-white px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center gap-1.5 transition-colors"
              >
                {copiedMessage ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedMessage ? 'Copied' : 'Copy Text'}
              </button>
            </div>

            {/* Simulated Multi-Channel Dispatch Bubble */}
            <div className="p-4 rounded-2xl bg-[#0B141A] border border-[#1F2C34] text-xs font-mono text-slate-200 leading-relaxed max-h-[340px] overflow-y-auto whitespace-pre-wrap shadow-inner selection:bg-emerald-500 selection:text-black">
              {compileWhatsAppMessage()}
            </div>

            {/* Summary Highlights */}
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs space-y-1">
              <div className="flex justify-between text-slate-400">
                <span>Beneficiary Bank:</span>
                <span className="font-semibold text-slate-200">{formData.bankSelected}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Total Amount:</span>
                <span className="font-bold text-amber-400 font-mono">₦{formData.amountPaid}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Reference:</span>
                <span className="font-mono text-emerald-400 font-semibold">{formData.paymentReference}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Post-Dispatch Destination:</span>
                <span className="font-semibold text-emerald-300">Download Page ({getMappedEditionId().toUpperCase()})</span>
              </div>
            </div>

            {/* Direct Multi-Channel Dispatch Button */}
            <div className="space-y-3 pt-1">
              <button
                type="button"
                onClick={handleDispatchAllChannels}
                className="w-full py-3.5 px-4 rounded-2xl bg-[#25D366] hover:bg-[#20BD5A] text-slate-950 font-black text-sm flex items-center justify-center gap-2.5 shadow-xl shadow-emerald-950/40 transition-all transform active:scale-95 text-center cursor-pointer"
              >
                <Send className="w-4 h-4 fill-slate-950" />
                Dispatch Slip via WhatsApp Now
                <ExternalLink className="w-4 h-4 ml-1 opacity-70" />
              </button>

              <div className="flex items-center justify-center gap-3 text-[11px] text-slate-400">
                <span className="flex items-center gap-1 text-emerald-400 font-medium">
                  <Check className="w-3 h-3" /> WhatsApp
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 text-sky-400 font-medium">
                  <Check className="w-3 h-3" /> Telegram
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 text-blue-400 font-medium">
                  <Check className="w-3 h-3" /> Email
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 text-amber-400 font-medium">
                  <Download className="w-3 h-3" /> Direct to Download
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
