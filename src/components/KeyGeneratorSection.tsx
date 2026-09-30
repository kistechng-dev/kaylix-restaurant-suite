import React, { useState } from 'react';
import { 
  KeyRound, 
  Copy, 
  Check, 
  ShieldCheck, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  Cpu, 
  RefreshCw,
  Terminal,
  History,
  Download,
  Info,
  Server,
  Hash
} from 'lucide-react';
import { LicenseKeyDetails, KeyValidationResult } from '../types';
import { 
  synthesizeMasterKey, 
  validateLicenseKey, 
  generateKaylixLicenseCode,
  deriveWorkstationEntropy,
  computeVerificationHash,
  computeSecurityChecksum,
  EDITION_MAP, 
  DURATION_MAP,
  EditionIdentifier,
  DurationIdentifier,
  normalizeEditionCode,
  normalizeDurationCode
} from '../utils/cryptoKey';

interface KeyGeneratorSectionProps {
  onShowToast: (type: 'success' | 'info' | 'error', title: string, message?: string) => void;
  presetVersion?: string;
}

export const KeyGeneratorSection: React.FC<KeyGeneratorSectionProps> = ({ onShowToast, presetVersion }) => {
  // Structure Breakdown (4-5-5-2-4)
  // xxxx  (4 chars): Edition (BASC, STND, ENTR, TRAL)
  // xxxxx (5 chars): Workstation Entropy Seed
  // xxxxx (5 chars): Verification Hash
  // xx    (2 chars): Duration (1Y, 3Y, LF, 7D)
  // xxxx  (4 chars): Security Checksum

  const [editionCode, setEditionCode] = useState<EditionIdentifier>(() => normalizeEditionCode(presetVersion || 'STND'));
  const [durationCode, setDurationCode] = useState<DurationIdentifier>('1Y');
  const [workstationSeed, setWorkstationSeed] = useState<string>('KYLX-WS-01');
  const [workstationEntropy, setWorkstationEntropy] = useState<string>(() => deriveWorkstationEntropy('KYLX-WS-01'));

  // Generated Key Details
  const [generatedKeyDetails, setGeneratedKeyDetails] = useState<LicenseKeyDetails>(() => {
    return synthesizeMasterKey({
      versionCode: normalizeEditionCode(presetVersion || 'STND'),
      periodCode: '1Y',
      workstationSeed: 'KYLX-WS-01',
    });
  });

  const [copiedKey, setCopiedKey] = useState(false);
  const [keyHistory, setKeyHistory] = useState<LicenseKeyDetails[]>([generatedKeyDetails]);

  // Validator State
  const [validatorInput, setValidatorInput] = useState<string>(generatedKeyDetails.key);
  const [validationResult, setValidationResult] = useState<KeyValidationResult>(() => {
    return validateLicenseKey(generatedKeyDetails.key);
  });

  // Calculate live verification hash & security checksum for current setup
  const currentVerifyHash = computeVerificationHash(editionCode, workstationEntropy, durationCode);
  const currentChecksum = computeSecurityChecksum(editionCode, workstationEntropy, currentVerifyHash, durationCode);

  // Handle re-rolling entropy
  const handleRerollEntropy = () => {
    const randomSeed = `WS-${Math.floor(1000 + Math.random() * 9000)}`;
    setWorkstationSeed(randomSeed);
    const newEntropy = deriveWorkstationEntropy(randomSeed);
    setWorkstationEntropy(newEntropy);
  };

  // Handle Workstation Seed input change
  const handleSeedChange = (seedVal: string) => {
    setWorkstationSeed(seedVal);
    const newEntropy = deriveWorkstationEntropy(seedVal);
    setWorkstationEntropy(newEntropy);
  };

  // Synthesize Key
  const handleGenerateKey = () => {
    const newKey = generateKaylixLicenseCode({
      edition: editionCode,
      duration: durationCode,
      customEntropy: workstationEntropy,
    });

    const newDetails = synthesizeMasterKey({
      versionCode: editionCode,
      periodCode: durationCode,
      customEntropy: workstationEntropy,
    });
    newDetails.key = newKey;

    setGeneratedKeyDetails(newDetails);
    setKeyHistory((prev) => [newDetails, ...prev.filter(k => k.key !== newKey).slice(0, 9)]);
    setValidatorInput(newKey);
    setValidationResult(validateLicenseKey(newKey));

    onShowToast(
      'success',
      'Master Key Synthesized!',
      `${newKey} (${EDITION_MAP[editionCode]?.name})`
    );
  };

  const copyKeyToClipboard = (keyStr: string) => {
    navigator.clipboard.writeText(keyStr);
    setCopiedKey(true);
    onShowToast('success', 'Key Copied to Clipboard!', keyStr);
    setTimeout(() => setCopiedKey(false), 2500);
  };

  const handleValidateChange = (val: string) => {
    setValidatorInput(val);
    setValidationResult(validateLicenseKey(val));
  };

  const exportKeyCertificate = (item: LicenseKeyDetails) => {
    const parts = item.key.split('-');
    const certText = `=================================================================
KAYLIX ENTERPRISE RESTAURANT SYSTEMS - OFFICIAL LICENSE KEY
=================================================================
LICENSE CODE:         ${item.key}
STANDARD STRUCTURE:   4-5-5-2-4 (xxxx-xxxxx-xxxxx-xx-xxxx)
-----------------------------------------------------------------
1. EDITION (xxxx):    ${parts[0] || 'STND'} - ${item.stationName}
2. ENTROPY (xxxxx):   ${parts[1] || 'W8E7C'} (Derived from Workstation Seed)
3. VERIFICATION (xxxxx): ${parts[2] || '49C83'} (Verification Hash Chunk)
4. DURATION (xx):     ${parts[3] || '1Y'} - ${item.durationLabel}
5. CHECKSUM (xxxx):   ${parts[4] || '7C49'} (Cryptographic Security Signature)
-----------------------------------------------------------------
WORKSTATION SEED:     ${workstationSeed}
HARDWARE LOCK ID:     ${item.hardwareLockId || 'HW-STND-SECURE'}
ISSUED TIMESTAMP:     ${item.generatedAt}
EXPIRATION TIMESTAMP: ${item.expiresAt}
TERMINAL QUOTA:       ${item.terminalLimit}
=================================================================
ACTIVATION INSTRUCTIONS:
1. Launch your installed Kaylix Eatery Suite station software.
2. Navigate to Station Settings -> License & Node Activation.
3. Enter or paste the 24-character master key:
   "${item.key}"
4. The cryptographic engine will verify the 4-5-5-2-4 checksum offline.
5. Station terminal will immediately unlock with full enterprise access.

Technical Support Hotline: +234 806 039 5329 | WhatsApp / Telegram
=================================================================`;

    const blob = new Blob([certText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Kaylix_License_${item.key}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    onShowToast('info', 'License Certificate Saved', 'Certificate downloaded successfully.');
  };

  // Anatomy segments of currently generated key (4-5-5-2-4)
  const keyParts = generatedKeyDetails.key.split('-');
  const partEdition = keyParts[0] || 'STND';
  const partEntropy = keyParts[1] || 'W8E7C';
  const partHash = keyParts[2] || '49C83';
  const partDuration = keyParts[3] || '1Y';
  const partChecksum = keyParts[4] || '7C49';

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-semibold">
              <KeyRound className="w-3.5 h-3.5" />
              Cryptographic License Synthesis Engine
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              Master Key Generator & Validator
            </h2>
            <p className="text-slate-300 text-sm max-w-2xl leading-relaxed">
              Synthesize offline master activation keys matching the <strong className="text-amber-300">Structure Breakdown (4-5-5-2-4)</strong>:
              <code className="text-amber-400 font-mono font-bold bg-slate-950 px-2 py-0.5 rounded border border-slate-800 ml-1">
                xxxx-xxxxx-xxxxx-xx-xxxx
              </code>
            </p>
          </div>

          <div className="flex items-center gap-3 bg-slate-950/80 p-4 rounded-2xl border border-slate-800 text-xs">
            <Cpu className="w-7 h-7 text-purple-400 shrink-0" />
            <div>
              <div className="text-[10px] text-slate-400 font-mono uppercase font-bold tracking-wider">
                Specification Structure (4-5-5-2-4)
              </div>
              <div className="font-bold text-amber-300 font-mono text-sm tracking-wider mt-0.5">
                xxxx-xxxxx-xxxxx-xx-xxxx
              </div>
              <div className="text-[10px] text-slate-400 mt-1">
                Edition (4) • Entropy (5) • Hash (5) • Duration (2) • Checksum (4)
              </div>
            </div>
          </div>
        </div>

        {/* Structure Breakdown Info Strip */}
        <div className="mt-6 pt-5 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
          <div className="p-2.5 rounded-xl bg-slate-950/60 border border-amber-500/30">
            <span className="font-mono text-amber-400 font-bold block text-[11px]">xxxx (4 chars)</span>
            <span className="text-slate-300 font-medium">Edition Identifier</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">BASC, STND, ENTR, TRAL</span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-950/60 border border-emerald-500/30">
            <span className="font-mono text-emerald-400 font-bold block text-[11px]">xxxxx (5 chars)</span>
            <span className="text-slate-300 font-medium">Workstation Entropy</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">Workstation seed chunk</span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-950/60 border border-cyan-500/30">
            <span className="font-mono text-cyan-400 font-bold block text-[11px]">xxxxx (5 chars)</span>
            <span className="text-slate-300 font-medium">Verification Hash</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">Cryptographic integrity</span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-950/60 border border-sky-500/30">
            <span className="font-mono text-sky-400 font-bold block text-[11px]">xx (2 chars)</span>
            <span className="text-slate-300 font-medium">License Duration</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">1Y, 3Y, LF, 7D</span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-950/60 border border-purple-500/30 col-span-2 sm:col-span-1">
            <span className="font-mono text-purple-400 font-bold block text-[11px]">xxxx (4 chars)</span>
            <span className="text-slate-300 font-medium">Security Checksum</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">Signature block</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Generator Configuration (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-7 shadow-xl space-y-6">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              Key Parameters Setup (Structure 4-5-5-2-4)
            </h3>

            {/* 1. Edition Identifier (xxxx - 4 chars) */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                  1. Edition Identifier (xxxx - 4 characters)
                </label>
                <span className="text-[11px] font-mono text-amber-400 font-bold">
                  Active Code: {editionCode}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {[
                  {
                    code: 'BASC' as const,
                    name: 'Basic version',
                    subtitle: 'Standalone Desktop',
                    badge: 'Single-User',
                    price: '₦10,000 / yr',
                  },
                  {
                    code: 'STND' as const,
                    name: 'Standard version',
                    subtitle: 'Wi-Fi + Remote Director',
                    badge: 'Multi-Terminal',
                    price: '₦20,000 / yr',
                  },
                  {
                    code: 'ENTR' as const,
                    name: 'Enterprise version',
                    subtitle: 'Central Cloud HQ & Commissary',
                    badge: 'Multi-Store HQ',
                    price: '₦40,000 / yr',
                  },
                  {
                    code: 'TRAL' as const,
                    name: '7-Day Trial Evaluation',
                    subtitle: '7-Day Trial Evaluation',
                    badge: '168 Hours',
                    price: 'Free Trial',
                  },
                ].map((item) => {
                  const isSelected = editionCode === item.code;
                  return (
                    <button
                      key={item.code}
                      type="button"
                      onClick={() => setEditionCode(item.code)}
                      className={`p-3.5 rounded-2xl text-left border transition-all ${
                        isSelected
                          ? 'bg-gradient-to-br from-amber-500/20 to-orange-500/20 border-amber-500 text-white shadow-lg shadow-amber-950/30 ring-1 ring-amber-400/40'
                          : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs font-bold">
                        <span>{item.name}</span>
                        <span className="font-mono text-xs px-2 py-0.5 rounded bg-slate-800 text-amber-400 font-black">
                          {item.code}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 mt-1">{item.subtitle}</div>
                      <div className="flex items-center justify-between mt-1 text-[10px] text-slate-500">
                        <span>{item.badge}</span>
                        <span className="text-slate-300 font-mono font-medium">{item.price}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. License Duration Identifier (xx - 2 chars) */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                  2. License Duration Identifier (xx - 2 characters)
                </label>
                <span className="text-[11px] font-mono text-sky-400 font-bold">
                  Duration Code: {durationCode} ({DURATION_MAP[durationCode]?.label})
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {[
                  {
                    code: '1Y' as const,
                    label: '1 Year License',
                    days: '365 Days',
                    desc: 'Annual Commercial',
                  },
                  {
                    code: '3Y' as const,
                    label: '3 Years License',
                    days: '1,095 Days',
                    desc: 'Multi-Year Long Term',
                  },
                  {
                    code: 'LF' as const,
                    label: 'Lifetime Perpetual',
                    days: 'Perpetual',
                    desc: 'Never Expires',
                  },
                  {
                    code: '7D' as const,
                    label: '7-Day Trial',
                    days: '168 Hours',
                    desc: 'Evaluation Test',
                  },
                ].map((item) => {
                  const isSelected = durationCode === item.code;
                  return (
                    <button
                      key={item.code}
                      type="button"
                      onClick={() => setDurationCode(item.code)}
                      className={`p-3 rounded-2xl text-center border transition-all ${
                        isSelected
                          ? 'bg-sky-500/20 border-sky-500 text-sky-300 shadow-md shadow-sky-950/20 font-bold ring-1 ring-sky-400/40'
                          : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <div className="text-xs font-bold">{item.label}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{item.days}</div>
                      <div className="mt-1 font-mono text-[11px] px-1.5 py-0.5 rounded bg-slate-900 text-sky-400 font-black inline-block">
                        xx = {item.code}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3 & 4. Cryptographic Entropy (5 chars) & Verification Hash (5 chars) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <Server className="w-3.5 h-3.5 text-emerald-400" />
                    3. Entropy (xxxxx - 5 chars)
                  </div>
                  <button
                    type="button"
                    onClick={handleRerollEntropy}
                    className="text-[10px] text-slate-400 hover:text-white flex items-center gap-1 bg-slate-900 px-2 py-0.5 rounded border border-slate-800 transition-colors"
                  >
                    <RefreshCw className="w-3 h-3" /> Re-roll Seed
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={workstationSeed}
                    onChange={(e) => handleSeedChange(e.target.value)}
                    placeholder="Workstation seed (e.g. POS-MAIN-01)"
                    className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-200 font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[10px] text-slate-500">Derived Chunk:</span>
                  <span className="font-mono text-sm font-black text-emerald-400 tracking-wider bg-slate-900/80 px-2 py-0.5 rounded border border-emerald-500/30">
                    {workstationEntropy}
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Hash className="w-3.5 h-3.5 text-cyan-400" />
                  4. Verification Hash (xxxxx - 5 chars)
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400">Cryptographic Hash:</span>
                  <span className="font-mono text-sm font-black text-cyan-400 tracking-wider bg-slate-900/80 px-2 py-0.5 rounded border border-cyan-500/30">
                    {currentVerifyHash}
                  </span>
                </div>
                <div className="text-[10px] text-slate-500 leading-tight">
                  Deterministically derived from edition + workstation seed + duration
                </div>
              </div>
            </div>

            {/* 5. Cryptographic Signature & Security Checksum (xxxx - 4 chars) */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  5. Signature & Checksum (xxxx - 4 characters)
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">
                  Immutable anti-tamper security checksum
                </div>
              </div>
              <div className="font-mono text-sm font-black text-purple-400 tracking-wider bg-slate-900/80 px-3 py-1 rounded-xl border border-purple-500/30">
                {currentChecksum}
              </div>
            </div>

            {/* Generate Action Button */}
            <button
              type="button"
              onClick={handleGenerateKey}
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-xl shadow-orange-950/40 transition-all active:scale-98 cursor-pointer"
            >
              <KeyRound className="w-5 h-5 fill-slate-950" />
              Generate License Code (4-5-5-2-4 Format)
            </button>
          </div>
        </div>

        {/* Right Column: Key Display, Breakdown & Validator (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Key Display Card */}
          <div className="rounded-3xl bg-slate-900 border border-amber-500/40 p-6 sm:p-7 shadow-2xl space-y-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold uppercase text-amber-400 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-400" />
                Synthesized Master Key
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Structure (4-5-5-2-4) Valid
              </span>
            </div>

            {/* Big Key Display */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-3">
              <div className="text-lg sm:text-xl font-mono font-black text-white tracking-wider selection:bg-amber-400 selection:text-slate-950 break-all">
                {generatedKeyDetails.key}
              </div>

              {/* Anatomy Breakdown (4-5-5-2-4) */}
              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-center flex-wrap gap-1 text-[11px] font-mono">
                <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold" title="xxxx: Edition Identifier">
                  {partEdition}
                </span>
                <span className="text-slate-600 font-bold">-</span>
                <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold" title="xxxxx: Cryptographic Entropy Chunk">
                  {partEntropy}
                </span>
                <span className="text-slate-600 font-bold">-</span>
                <span className="px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-bold" title="xxxxx: Verification Hash Chunk">
                  {partHash}
                </span>
                <span className="text-slate-600 font-bold">-</span>
                <span className="px-1.5 py-0.5 rounded bg-sky-500/20 text-sky-300 font-bold" title="xx: License Duration Identifier">
                  {partDuration}
                </span>
                <span className="text-slate-600 font-bold">-</span>
                <span className="px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 font-bold" title="xxxx: Cryptographic Signature Checksum">
                  {partChecksum}
                </span>
              </div>

              <div className="text-[10px] text-slate-400 font-mono">
                Length: 4 - 5 - 5 - 2 - 4 (Total 24 characters)
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => copyKeyToClipboard(generatedKeyDetails.key)}
                className="w-1/2 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-amber-950/40 transition-transform active:scale-95 cursor-pointer"
              >
                {copiedKey ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copiedKey ? 'Copied' : 'Copy Key'}</span>
              </button>

              <button
                type="button"
                onClick={() => exportKeyCertificate(generatedKeyDetails)}
                className="w-1/2 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs flex items-center justify-center gap-1.5 border border-slate-700 transition-colors cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Save Certificate</span>
              </button>
            </div>

            {/* Metadata Summary */}
            <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs space-y-1.5">
              <div className="flex justify-between text-slate-400">
                <span>Edition:</span>
                <span className="font-bold text-white">{EDITION_MAP[editionCode]?.name} ({partEdition})</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Duration:</span>
                <span className="font-bold text-sky-300">{DURATION_MAP[durationCode]?.label} ({partDuration})</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Expires:</span>
                <span className="font-mono text-slate-300">{new Date(generatedKeyDetails.expiresAt).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Standard:</span>
                <span className="font-mono text-emerald-400 font-semibold">Structure (4-5-5-2-4)</span>
              </div>
            </div>
          </div>

          {/* Key Validator Card */}
          <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-7 shadow-xl space-y-4">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Cryptographic License Key Validator
            </h4>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">
                Paste 4-5-5-2-4 key to test and verify authenticity
              </label>
              <input
                type="text"
                value={validatorInput}
                onChange={(e) => handleValidateChange(e.target.value)}
                placeholder="e.g. STND-W8E7C-49C83-1Y-7C49"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs sm:text-sm text-white focus:outline-none focus:border-amber-500 transition-colors uppercase"
              />
            </div>

            <div className={`p-3.5 rounded-2xl border text-xs ${
              validationResult.isValid
                ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                : 'bg-rose-950/40 border-rose-500/40 text-rose-300'
            }`}>
              <div className="flex items-center gap-2 font-bold mb-1">
                {validationResult.isValid ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                )}
                <span>{validationResult.status}: {validationResult.message}</span>
              </div>

              {validationResult.details && (
                <div className="mt-2 pt-2 border-t border-emerald-500/20 grid grid-cols-2 gap-2 text-[11px]">
                  <div>Edition: <span className="text-white font-medium">{validationResult.details.stationType}</span></div>
                  <div>Term: <span className="text-white font-medium">{validationResult.details.duration}</span></div>
                  <div>Nodes: <span className="text-white font-medium">{validationResult.details.terminalLimit}</span></div>
                  <div>Security: <span className="text-emerald-400 font-bold">100% Cryptographically Valid</span></div>
                </div>
              )}
            </div>
          </div>

          {/* Key Generation History */}
          {keyHistory.length > 1 && (
            <div className="rounded-3xl bg-slate-900 border border-slate-800 p-5 shadow-xl space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-slate-300">
                <span className="flex items-center gap-1.5">
                  <History className="w-3.5 h-3.5 text-amber-400" />
                  Recent Keys (4-5-5-2-4)
                </span>
                <span className="text-[10px] text-slate-500">{keyHistory.length} generated</span>
              </div>

              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {keyHistory.map((item, idx) => (
                  <div
                    key={`${item.key}-${idx}`}
                    className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between text-xs gap-2"
                  >
                    <div className="font-mono text-[11px] text-slate-300 truncate">
                      {item.key}
                    </div>
                    <button
                      type="button"
                      onClick={() => copyKeyToClipboard(item.key)}
                      className="text-[10px] text-amber-400 hover:text-amber-300 px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 shrink-0"
                    >
                      Copy
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
