import React, { useState } from 'react';
import { 
  Building2, 
  Copy, 
  Check, 
  Sparkles, 
  RefreshCw, 
  ShieldCheck, 
  ArrowRight, 
  FileText, 
  AlertCircle,
  QrCode,
  CreditCard
} from 'lucide-react';
import { CORPORATE_BANK_ACCOUNTS } from '../data/portalData';
import { generatePaymentReference } from '../utils/referenceGenerator';

interface BankingSectionProps {
  onShowToast: (type: 'success' | 'info' | 'error', title: string, message?: string) => void;
  currentReference: string;
  setCurrentReference: (ref: string) => void;
  onProceedToWhatsApp: (ref: string, bankName: string) => void;
}

export const BankingSection: React.FC<BankingSectionProps> = ({
  onShowToast,
  currentReference,
  setCurrentReference,
  onProceedToWhatsApp,
}) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(label);
    onShowToast('success', 'Copied to Clipboard!', `${label} (${text}) ready to paste.`);
    setTimeout(() => {
      setCopiedKey(null);
    }, 2500);
  };

  const regenerateRef = () => {
    const newRef = generatePaymentReference(2026);
    setCurrentReference(newRef);
    onShowToast('info', 'New Reference Generated', `Unique Payment Reference: ${newRef}`);
  };

  const copyFullInvoiceDetails = (bank: typeof CORPORATE_BANK_ACCOUNTS[0]) => {
    const fullText = `KAYLIX CORPORATE SETTLEMENT DETAILS
Bank: ${bank.bankName}
Account Name: ${bank.accountName}
Account Number: ${bank.accountNumber}
Sort Code: ${bank.sortCode}
Branch: ${bank.branch}
Payment Ref: ${currentReference}
Narration Instruction: Please state "${currentReference}" in transfer remarks.`;
    navigator.clipboard.writeText(fullText);
    onShowToast('success', 'Full Bank Details Copied!', 'Complete payment invoice information copied to clipboard.');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Dynamic Payment Reference Generator Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 border border-amber-500/40 p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute -top-12 -right-12 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                Dynamic Reference Generator
              </span>
              <span className="text-xs text-slate-400">KYX-2026 Protocol</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              Official Corporate Settlement Portal
            </h2>
            <p className="text-slate-300 text-sm max-w-2xl">
              All terminal licenses, hardware bundles, and subscription renewals must be remitted directly to our Zenith Bank PLC or Moniepoint Microfinance Bank accounts using your unique reference code below.
            </p>
          </div>

          {/* Reference Display & Actions Card */}
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-amber-500/50 shadow-inner flex flex-col sm:flex-row items-center gap-4 shrink-0">
            <div className="text-center sm:text-left">
              <div className="text-[11px] font-mono text-amber-400/90 uppercase tracking-widest font-semibold">
                Your Payment Reference Code
              </div>
              <div className="text-2xl sm:text-3xl font-mono font-black text-white tracking-wider selection:bg-amber-500 selection:text-black">
                {currentReference}
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">
                Include in your bank app’s <span className="text-amber-300">Remark / Narration</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => copyToClipboard(currentReference, 'Payment Reference')}
                className="px-3.5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-amber-950/40 transition-all active:scale-95"
                title="Copy reference code"
              >
                {copiedKey === 'Payment Reference' ? (
                  <>
                    <Check className="w-4 h-4 stroke-[3]" /> Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" /> Copy Ref
                  </>
                )}
              </button>

              <button
                onClick={regenerateRef}
                className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
                title="Generate new reference code"
                aria-label="Generate new reference code"
              >
                <RefreshCw className="w-4 h-4 text-amber-400" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Corporate Bank Accounts Display */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Building2 className="w-5 h-5 text-amber-400" />
              Verified Corporate Banking Accounts (Zenith & Moniepoint)
            </h3>
            <p className="text-xs text-slate-400">
              Click any copy button for 1-click clipboard transfer into your banking application.
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-xs text-emerald-400 bg-emerald-950/40 px-3 py-1.5 rounded-lg border border-emerald-500/30">
            <ShieldCheck className="w-4 h-4" /> CBN Licensed & NIBSS Instant Settlement
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {CORPORATE_BANK_ACCOUNTS.map((bank) => {
            const isZenith = bank.id === 'zenith-bank';

            return (
              <div
                key={bank.id}
                className={`relative rounded-3xl bg-slate-900 border ${
                  isZenith ? 'border-red-500/40 shadow-red-950/20' : 'border-blue-500/40 shadow-blue-950/20'
                } p-6 sm:p-7 shadow-2xl flex flex-col justify-between overflow-hidden group`}
              >
                {/* Accent Background Glow */}
                <div
                  className={`absolute -top-16 -right-16 w-48 h-48 rounded-full blur-3xl opacity-20 pointer-events-none ${
                    isZenith ? 'bg-red-600' : 'bg-blue-600'
                  }`}
                />

                <div>
                  {/* Bank Header Badge */}
                  <div className="flex items-center justify-between gap-4 mb-5">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${bank.logoColor} flex items-center justify-center text-white font-black text-xl shadow-lg ring-2 ring-white/10`}
                      >
                        {isZenith ? 'Z' : 'M'}
                      </div>
                      <div>
                        <h4 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
                          {bank.bankName}
                        </h4>
                        <span className="text-[11px] text-slate-400 font-medium">{bank.type}</span>
                      </div>
                    </div>

                    <span className="px-2.5 py-1 rounded-lg text-[10px] font-mono font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                      SWIFT: {bank.swiftCode}
                    </span>
                  </div>

                  {/* Account Name */}
                  <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 mb-4 flex items-center justify-between gap-2">
                    <div className="text-xs overflow-hidden">
                      <div className="text-[10px] uppercase tracking-wider text-slate-400 font-medium">Beneficiary Account Name</div>
                      <div className="font-bold text-slate-100 truncate text-xs sm:text-sm font-mono mt-0.5">
                        {bank.accountName}
                      </div>
                    </div>
                    <button
                      onClick={() => copyToClipboard(bank.accountName, `${bank.bankName} Account Name`)}
                      className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                      title="Copy Account Name"
                    >
                      {copiedKey === `${bank.bankName} Account Name` ? (
                        <Check className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>

                  {/* 1-Click Clipboard Copy: Account Number */}
                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 mb-4 flex items-center justify-between gap-4">
                    <div>
                      <div className="text-[11px] uppercase tracking-widest text-amber-400 font-semibold">
                        Account Number (NUBAN)
                      </div>
                      <div className="text-2xl sm:text-3xl font-mono font-black text-white tracking-widest selection:bg-amber-400 selection:text-slate-950 mt-0.5">
                        {bank.accountNumber}
                      </div>
                    </div>

                    <button
                      onClick={() => copyToClipboard(bank.accountNumber, `${bank.bankName} Account Number`)}
                      className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-orange-950/30 transition-all active:scale-95"
                    >
                      {copiedKey === `${bank.bankName} Account Number` ? (
                        <>
                          <Check className="w-4 h-4 stroke-[3]" /> Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" /> Copy Number
                        </>
                      )}
                    </button>
                  </div>

                  {/* 1-Click Clipboard Copy: Sort Code & Branch */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4 text-xs">
                    <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
                      <div>
                        <div className="text-[10px] text-slate-400 uppercase font-medium">Bank Sort Code</div>
                        <div className="text-sm font-mono font-bold text-slate-200 mt-0.5">{bank.sortCode}</div>
                      </div>
                      <button
                        onClick={() => copyToClipboard(bank.sortCode, `${bank.bankName} Sort Code`)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white"
                        title="Copy Sort Code"
                      >
                        {copiedKey === `${bank.bankName} Sort Code` ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                      <div className="text-[10px] text-slate-400 uppercase font-medium">Corporate Branch</div>
                      <div className="text-xs font-semibold text-slate-300 truncate mt-0.5" title={bank.branch}>
                        {bank.branch}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center gap-2.5">
                  <button
                    onClick={() => copyFullInvoiceDetails(bank)}
                    className="w-full sm:w-auto px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <FileText className="w-3.5 h-3.5 text-amber-400" />
                    Copy Full Bank Invoice
                  </button>

                  <button
                    onClick={() => onProceedToWhatsApp(currentReference, bank.bankName)}
                    className="w-full flex-1 py-2 px-3 rounded-xl text-xs font-bold text-emerald-300 hover:text-emerald-200 bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-500/30 flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <span>Send Slip via WhatsApp</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Banking Instructions & Payment Verification Notice */}
      <div className="rounded-2xl bg-amber-500/10 border border-amber-500/30 p-5 text-xs text-amber-200/90 space-y-3">
        <div className="flex items-center gap-2 font-bold text-amber-300 text-sm">
          <AlertCircle className="w-4 h-4 text-amber-400" />
          Critical Settlement & Narration Protocol
        </div>
        <p className="leading-relaxed">
          When initiating bank transfers from internet banking, USSD, or commercial mobile apps, ensure that your Payment Reference (e.g. <span className="font-mono font-bold text-white bg-amber-950/60 px-1.5 py-0.5 rounded border border-amber-500/40">{currentReference}</span>) is specified in the transfer remarks/narration. This allows our automated reconciliation system to activate your license master key within 5 minutes.
        </p>
        <div className="text-[11px] text-amber-300/70 font-mono">
          Accepted Transfer Methods: NIP Direct Transfer • NACS • Zenith Eazypay • Moniepoint NIP Switch • Mobile Apps
        </div>
      </div>
    </div>
  );
};
