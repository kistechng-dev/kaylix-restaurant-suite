import React, { useState } from 'react';
import { 
  X, 
  Send, 
  User, 
  Phone, 
  Mail, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight, 
  MessageSquare,
  KeyRound,
  Copy,
  Check,
  AlertCircle
} from 'lucide-react';
import { SoftwareEdition, RegistrationRecord } from '../types';
import { synthesizeMasterKey, generateKaylixLicenseCode } from '../utils/cryptoKey';

interface RegistrationModalProps {
  edition: SoftwareEdition | {
    id: string;
    name: string;
    fileSize: string;
    fileName: string;
    priceTag: string;
    batchScript: string;
  } | null;
  onClose: () => void;
  onSubmit: (record: RegistrationRecord) => void;
}

export const RegistrationModal: React.FC<RegistrationModalProps> = ({
  edition,
  onClose,
  onSubmit,
}) => {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!edition) return null;

  const isTrial = edition.id === 'trial' || edition.name.toLowerCase().includes('trial');
  const targetPhone = '+2348 06039 5329';
  const targetPhoneRaw = '2348060395329';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName.trim() || !phone.trim() || !email.trim()) {
      setErrorMsg('Please complete all fields (Full Names, Phone Number, and Email).');
      return;
    }

    if (!email.includes('@') || !email.includes('.')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    setErrorMsg('');
    setIsSubmitting(true);

    // Generate license code in Structure Breakdown (4-5-5-2-4): xxxx-xxxxx-xxxxx-xx-xxxx
    let vCode = 'STND';
    const edName = (edition.name || '').toLowerCase();
    if (isTrial || edName.includes('trial')) vCode = 'TRAL';
    else if (edName.includes('basic')) vCode = 'BASC';
    else if (edName.includes('enterprise') || edName.includes('master')) vCode = 'ENTR';
    else if (edName.includes('standard')) vCode = 'STND';

    const pCode = isTrial ? '7D' : '1Y';

    const generatedLicenseCode = generateKaylixLicenseCode({
      edition: vCode,
      duration: pCode,
    });

    const generatedTrialCode = isTrial ? generatedLicenseCode : undefined;

    const newRecord: RegistrationRecord = {
      id: `REG-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`,
      fullName: fullName.trim(),
      phone: phone.trim(),
      email: email.trim(),
      selectedEditionId: edition.id,
      selectedEditionName: edition.name,
      selectedPrice: edition.priceTag || (isTrial ? 'Free Trial' : 'Standard'),
      timestamp: new Date().toLocaleString(),
      telegramRecipient: targetPhone,
      whatsappRecipient: targetPhone,
      trialLicenseCode: generatedTrialCode,
      dispatchStatus: 'DISPATCHED',
    };

    // 1. Sync to backend admin database
    try {
      fetch('/api/records', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: newRecord.id,
          type: 'REGISTRATION',
          fullName: newRecord.fullName,
          phone: newRecord.phone,
          email: newRecord.email,
          version: newRecord.selectedEditionName,
          versionCode: vCode,
          periodCode: pCode,
          amount: newRecord.selectedPrice,
          bankDetails: {
            bankName: isTrial ? 'N/A (Free Trial)' : 'Zenith Bank PLC',
            accountNumber: isTrial ? 'N/A' : '101 6978 239',
            accountName: isTrial ? 'Kaylix Evaluation' : 'Kaylix Technology',
            paymentReference: `KYX-2026-${Math.floor(1000 + Math.random() * 9000)}`,
            transferDate: new Date().toISOString(),
          },
          licenseCode: generatedLicenseCode,
          timestamp: new Date().toISOString(),
          status: isTrial ? 'DISPATCHED' : 'PENDING',
          notes: isTrial ? '7-Day free trial registration.' : 'New commercial version sign-up.',
        }),
      }).catch(() => {});
    } catch {
      // offline fallback
    }

    // 2. Save record in browser local storage
    try {
      const existing = localStorage.getItem('kaylix_canteenpro_registrations');
      const list = existing ? JSON.parse(existing) : [];
      list.unshift(newRecord);
      localStorage.setItem('kaylix_canteenpro_registrations', JSON.stringify(list));
    } catch {
      // storage quota fallback
    }

    // 2. Prepare WhatsApp and Telegram message copy
    const dispatchMessage = `*KAYLIX CANTEENPRO - NEW SOFTWARE REGISTRATION*
━━━━━━━━━━━━━━━━━━━━━━━━━━
📦 *Software Edition:* ${newRecord.selectedEditionName}
👤 *Full Names:* ${newRecord.fullName}
📞 *Phone Number:* ${newRecord.phone}
✉️ *Email Address:* ${newRecord.email}
💰 *Plan / Price:* ${newRecord.selectedPrice}
${isTrial && generatedTrialCode ? `🔑 *7-Day Trial License Code:* ${generatedTrialCode}\n` : ''}📅 *Timestamp:* ${newRecord.timestamp}
🎯 *Dispatch Destination:* WhatsApp & Telegram (${targetPhone})
━━━━━━━━━━━━━━━━━━━━━━━━━━
_Automated Registration Submission via Kaylix Eatery Management Portal._`;

    const encodedMsg = encodeURIComponent(dispatchMessage);

    // 3. WhatsApp Copy Transmission (to +2348 06039 5329)
    const whatsAppUrl = `https://wa.me/${targetPhoneRaw}?text=${encodedMsg}`;

    // 4. Telegram Copy Transmission (to +2348 06039 5329)
    const telegramShareUrl = `https://t.me/share/url?url=${encodeURIComponent('https://kaylixtech.ng')}&text=${encodedMsg}`;

    try {
      // Open WhatsApp transmission
      window.open(whatsAppUrl, '_blank', 'noopener,noreferrer');
    } catch {
      // popup blocker fallback
    }

    try {
      // Open Telegram transmission
      setTimeout(() => {
        window.open(telegramShareUrl, '_blank', 'noopener,noreferrer');
      }, 300);
    } catch {
      // ignore
    }

    setTimeout(() => {
      setIsSubmitting(false);
      onSubmit(newRecord);
    }, 450);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-lg bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-800 bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-slate-950 font-bold shadow-lg shadow-amber-950/40">
              <User className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-black text-white tracking-tight">Software Registration</h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {isTrial ? 'Free Trial' : 'Commercial'}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {isTrial 
                  ? 'Register to receive your 7-day trial license code and access the download.'
                  : 'Register your details before proceeding to corporate settlement.'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Selected Edition Summary Box */}
        <div className="px-6 pt-5">
          <div className="p-3.5 rounded-2xl bg-slate-950 border border-amber-500/30 flex items-center justify-between gap-3">
            <div className="overflow-hidden">
              <div className="text-[10px] uppercase font-mono font-bold text-amber-400">Selected Package</div>
              <div className="text-sm font-bold text-white truncate">{edition.name}</div>
              <div className="text-[11px] text-slate-400">File: {edition.fileName} ({edition.fileSize})</div>
            </div>
            <div className="text-right shrink-0">
              <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-slate-900 text-amber-300 border border-slate-800">
                {edition.priceTag}
              </span>
            </div>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-950/70 border border-rose-500/50 text-rose-200 text-xs">
              {errorMsg}
            </div>
          )}

          {/* Full Names */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-amber-400" />
              Full Names *
            </label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g. Alabi Kayode Felix"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
            />
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-emerald-400" />
              Phone Number *
            </label>
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="e.g. +234 806 039 5329"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
            />
          </div>

          {/* Email Address */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-blue-400" />
              Email Address *
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. kayode@eatery.com"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
            />
          </div>

          {/* Dual Transmission Notice: Telegram & WhatsApp copy transmission */}
          <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300 space-y-2">
            <div className="flex items-center gap-2 font-bold text-emerald-400">
              <Send className="w-4 h-4 text-emerald-400" />
              WhatsApp & Telegram Copy Transmission
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              A copy of your registration details will be transmitted simultaneously via <span className="text-emerald-300 font-semibold">WhatsApp</span> and <span className="text-sky-300 font-semibold">Telegram</span> to <span className="font-mono text-white font-bold">{targetPhone}</span>.
            </p>
          </div>

          {/* Required User Notice: Check your whatsapp/telegram/email for your license code */}
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-200 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <span className="font-medium leading-relaxed">
              <span className="font-bold underline">Note:</span> check your whatsapp/telepram/email for your license code
            </span>
          </div>

          {/* Modal Actions */}
          <div className="pt-2 flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="w-1/3 py-3 rounded-xl text-xs font-semibold text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>

            {/* Submit Button changed to 'Submit' as requested */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-2/3 py-3 px-4 rounded-xl font-black text-sm bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 flex items-center justify-center gap-2 shadow-lg shadow-orange-950/40 transition-all active:scale-98"
            >
              {isSubmitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <span>Submit</span>
                  <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
