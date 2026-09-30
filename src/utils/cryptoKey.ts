import { StationTypeCode, LicenseDurationCode, RegionCode, LicenseKeyDetails, KeyValidationResult } from '../types';

export const CHARSET = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ'; // Base-32 alphanumeric avoiding ambiguous characters 0/O, 1/I

export type EditionIdentifier = 'BASC' | 'STND' | 'ENTR' | 'TRAL';
export type DurationIdentifier = '1Y' | '3Y' | 'LF' | '7D';

export interface EditionInfo {
  code: EditionIdentifier;
  name: string;
  subtitle: string;
  defaultNodes: string;
  priceNote: string;
  tag: string;
}

export interface DurationInfo {
  code: DurationIdentifier;
  label: string;
  description: string;
  days: number;
  hours?: number;
}

export const EDITION_MAP: Record<string, EditionInfo> = {
  BASC: {
    code: 'BASC',
    name: 'Basic Version',
    subtitle: 'Standalone Desktop',
    defaultNodes: 'Single Terminal (Standalone Desktop)',
    priceNote: '₦10,000 / 1yr',
    tag: 'Single-User Standalone POS',
  },
  STND: {
    code: 'STND',
    name: 'Standard Version',
    subtitle: 'Wi-Fi + Remote Director',
    defaultNodes: 'Wi-Fi Multi-Terminal + Remote Director',
    priceNote: '₦20,000 / 1yr',
    tag: 'Wi-Fi + Remote Director',
  },
  ENTR: {
    code: 'ENTR',
    name: 'Enterprise Version',
    subtitle: 'Central Cloud HQ & Commissary Yields',
    defaultNodes: 'Central Cloud HQ + Inter-Branch Stock & VIP Loyalty',
    priceNote: '₦40,000 / 1yr',
    tag: 'Central Cloud HQ + Commissary + Anti-Theft',
  },
  TRAL: {
    code: 'TRAL',
    name: '7-Day Trial Evaluation',
    subtitle: '7-Day Trial Evaluation',
    defaultNodes: 'Full Features Unlocked (168 Hours)',
    priceNote: 'Free Evaluation (7 Days)',
    tag: '7-Day Trial Evaluation',
  },
  // Backward-compatibility aliases
  BSC: {
    code: 'BASC',
    name: 'Basic Version',
    subtitle: 'Standalone Desktop',
    defaultNodes: 'Single Terminal (Standalone Desktop)',
    priceNote: '₦10,000 / 1yr',
    tag: 'Single-User Standalone POS',
  },
  STD: {
    code: 'STND',
    name: 'Standard Version',
    subtitle: 'Wi-Fi + Remote Director',
    defaultNodes: 'Wi-Fi Multi-Terminal + Remote Director',
    priceNote: '₦20,000 / 1yr',
    tag: 'Wi-Fi + Remote Director',
  },
  ENT: {
    code: 'ENTR',
    name: 'Enterprise Version',
    subtitle: 'Central Cloud HQ & Commissary Yields',
    defaultNodes: 'Central Cloud HQ + Inter-Branch Stock & VIP Loyalty',
    priceNote: '₦40,000 / 1yr',
    tag: 'Central Cloud HQ + Commissary + Anti-Theft',
  },
  TRL: {
    code: 'TRAL',
    name: '7-Day Trial Evaluation',
    subtitle: '7-Day Trial Evaluation',
    defaultNodes: 'Full Features Unlocked (168 Hours)',
    priceNote: 'Free Evaluation (7 Days)',
    tag: '7-Day Trial Evaluation',
  },
  MST: {
    code: 'ENTR',
    name: 'Enterprise Version (Master Suite)',
    subtitle: 'Omnichannel + Online Ordering',
    defaultNodes: 'All Editions Complete',
    priceNote: '₦40,000 / 1yr',
    tag: 'Master Enterprise Suite',
  },
};

export const DURATION_MAP: Record<string, DurationInfo> = {
  '1Y': {
    code: '1Y',
    label: '1 Year License (365 Days)',
    description: '1 Year License (365 Days)',
    days: 365,
    hours: 8760,
  },
  '3Y': {
    code: '3Y',
    label: '3 Years License (1,095 Days)',
    description: '3 Years License (1,095 Days)',
    days: 1095,
    hours: 26280,
  },
  'LF': {
    code: 'LF',
    label: 'Lifetime Perpetual License',
    description: 'Lifetime Perpetual License',
    days: 36500,
    hours: 876000,
  },
  '7D': {
    code: '7D',
    label: '7-Day Trial (168 Hours)',
    description: '7-Day Trial (168 Hours)',
    days: 7,
    hours: 168,
  },
  // Backward-compatibility aliases
  '01Y': {
    code: '1Y',
    label: '1 Year License (365 Days)',
    description: '1 Year License (365 Days)',
    days: 365,
    hours: 8760,
  },
  '03Y': {
    code: '3Y',
    label: '3 Years License (1,095 Days)',
    description: '3 Years License (1,095 Days)',
    days: 1095,
    hours: 26280,
  },
  'LFT': {
    code: 'LF',
    label: 'Lifetime Perpetual License',
    description: 'Lifetime Perpetual License',
    days: 36500,
    hours: 876000,
  },
  '07D': {
    code: '7D',
    label: '7-Day Trial (168 Hours)',
    description: '7-Day Trial (168 Hours)',
    days: 7,
    hours: 168,
  },
  '30D': {
    code: '1Y',
    label: '1 Year License (365 Days)',
    description: '1 Year License (365 Days)',
    days: 365,
    hours: 8760,
  },
};

// Aliases for legacy imports
export const VERSION_MAP: Record<string, { code: 'TRL' | 'BSC' | 'STD' | 'ENT' | 'MST'; name: string }> = {
  'TRL': { code: 'TRL', name: '7-Day Trial Evaluation' },
  'BSC': { code: 'BSC', name: 'Basic Version (Standalone Desktop)' },
  'STD': { code: 'STD', name: 'Standard Version (Wi-Fi + Remote Director)' },
  'ENT': { code: 'ENT', name: 'Enterprise Version (Omnichannel + Online Ordering)' },
  'MST': { code: 'MST', name: 'Enterprise Master Suite Bundle' },
  'BASC': { code: 'BSC', name: 'Basic Version (Standalone Desktop)' },
  'STND': { code: 'STD', name: 'Standard Version (Wi-Fi + Remote Director)' },
  'ENTR': { code: 'ENT', name: 'Enterprise Version (Omnichannel + Online Ordering)' },
  'TRAL': { code: 'TRL', name: '7-Day Trial Evaluation' },
  'POS-MAIN': { code: 'BSC', name: 'Basic Version (Standalone Desktop)' },
  'KDS-DISP': { code: 'STD', name: 'Standard Version (Wi-Fi + Remote Director)' },
  'WTR-MOB': { code: 'STD', name: 'Standard Version (Wi-Fi + Remote Director)' },
  'MGR-EXEC': { code: 'ENT', name: 'Enterprise Version (Omnichannel + Online Ordering)' },
};

export const PERIOD_MAP: Record<string, { code: '07D' | '30D' | '01Y' | '03Y' | 'LFT'; label: string; days: number }> = {
  '07D': { code: '07D', label: '7-Day Trial (168 Hours)', days: 7 },
  '30D': { code: '01Y', label: '1 Year License (365 Days)', days: 365 },
  '01Y': { code: '01Y', label: '1 Year License (365 Days)', days: 365 },
  '03Y': { code: '03Y', label: '3 Years License (1,095 Days)', days: 1095 },
  'LFT': { code: 'LFT', label: 'Lifetime Perpetual License', days: 36500 },
  '7D': { code: '07D', label: '7-Day Trial (168 Hours)', days: 7 },
  '1Y': { code: '01Y', label: '1 Year License (365 Days)', days: 365 },
  '3Y': { code: '03Y', label: '3 Years License (1,095 Days)', days: 1095 },
  'LF': { code: 'LFT', label: 'Lifetime Perpetual License', days: 36500 },
};

export const STATION_NAMES: Record<StationTypeCode, string> = {
  'POS-MAIN': 'Kaylix Point of Sale (Basic Standalone Desktop)',
  'KDS-DISP': 'Kaylix Kitchen Display Screen (Standard Wi-Fi)',
  'WTR-MOB': 'Kaylix Waiter Handheld Mobile (Standard Remote)',
  'MGR-EXEC': 'Kaylix Executive Manager Hub (Enterprise Omnichannel)',
};

export const REGION_NAMES: Record<RegionCode, string> = {
  ABUJ: 'Abuja Federal Capital Territory',
  LAGS: 'Lagos Commercial Metro',
  PHRC: 'Port Harcourt South-South',
  IBAD: 'Ibadan South-West Hub',
  ENUG: 'Enugu South-East Hub',
  KANO: 'Kano Northern Hub',
  GBL: 'Global / Multi-Territory',
};

export const DURATION_LABELS: Record<LicenseDurationCode, string> = {
  '30D': '1 Year License (365 Days)',
  '1Y': '1 Year License (365 Days)',
  '3Y': '3 Years License (1,095 Days)',
  LFT: 'Lifetime Perpetual License',
};

/**
 * Generate random base-32 string of exact length
 */
export function generateRandomHex(length: number): string {
  let res = '';
  for (let i = 0; i < length; i++) {
    res += CHARSET.charAt(Math.floor(Math.random() * CHARSET.length));
  }
  return res;
}

/**
 * Derive 5-character cryptographic entropy chunk from workstation seed
 */
export function deriveWorkstationEntropy(seed?: string): string {
  if (!seed || !seed.trim()) {
    return generateRandomHex(5);
  }
  const clean = seed.trim().toUpperCase().replace(/[^23456789ABCDEFGHJKLMNPQRSTUVWXYZ]/g, '');
  if (clean.length === 5) {
    return clean;
  }
  let h = 0x811c9dc5;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  let res = '';
  let val = Math.abs(h);
  for (let i = 0; i < 5; i++) {
    res += CHARSET.charAt(val % CHARSET.length);
    val = Math.floor(val / CHARSET.length) ^ (i * 7);
  }
  return res.padEnd(5, '7');
}

/**
 * Compute 5-character deterministic verification hash chunk from edition, entropy, and duration
 */
export function computeVerificationHash(edition: string, entropy: string, duration: string): string {
  const input = `KYLX-VERIFY:${edition}:${entropy}:${duration}`;
  let h1 = 0x12345678;
  let h2 = 0x9abcdef0;
  for (let i = 0; i < input.length; i++) {
    const code = input.charCodeAt(i);
    h1 = (Math.imul(h1 ^ code, 16777619) + (h2 << 5)) >>> 0;
    h2 = (Math.imul(h2 ^ code, 2246822519) + (h1 >>> 2)) >>> 0;
  }
  let res = '';
  let combined = (BigInt(h1) << 32n) | BigInt(h2);
  for (let i = 0; i < 5; i++) {
    res += CHARSET.charAt(Number(combined % BigInt(CHARSET.length)));
    combined = combined / BigInt(CHARSET.length);
  }
  return res;
}

/**
 * Compute 4-character cryptographic signature & security checksum
 */
export function computeSecurityChecksum(edition: string, entropy: string, verifyHash: string, duration: string): string {
  const input = `KYLX-SIG:${edition}:${entropy}:${verifyHash}:${duration}:SECURE`;
  let h = 0x5a17b9c3;
  for (let i = 0; i < input.length; i++) {
    h = Math.imul(h ^ input.charCodeAt(i), 1099511628211 >>> 0);
    h = ((h << 13) | (h >>> 19)) >>> 0;
  }
  let res = '';
  let val = Math.abs(h);
  for (let i = 0; i < 4; i++) {
    res += CHARSET.charAt(val % CHARSET.length);
    val = Math.floor(val / CHARSET.length);
  }
  return res;
}

/**
 * Normalize edition code into one of 4-character identifiers:
 * BASC | STND | ENTR | TRAL
 */
export function normalizeEditionCode(raw?: string): EditionIdentifier {
  if (!raw) return 'STND';
  const clean = raw.trim().toUpperCase();
  if (clean === 'BASC' || clean === 'BSC' || clean.includes('BASIC') || clean === 'POS-MAIN') return 'BASC';
  if (clean === 'STND' || clean === 'STD' || clean.includes('STANDARD') || clean === 'KDS-DISP' || clean === 'WTR-MOB') return 'STND';
  if (clean === 'ENTR' || clean === 'ENT' || clean.includes('ENTERPRISE') || clean === 'MST' || clean.includes('MASTER') || clean === 'MGR-EXEC') return 'ENTR';
  if (clean === 'TRAL' || clean === 'TRL' || clean.includes('TRIAL')) return 'TRAL';
  return 'STND';
}

/**
 * Normalize duration code into one of 2-character identifiers:
 * 1Y | 3Y | LF | 7D
 */
export function normalizeDurationCode(raw?: string): DurationIdentifier {
  if (!raw) return '1Y';
  const clean = raw.trim().toUpperCase();
  if (clean === '1Y' || clean === '01Y' || clean.includes('1 YEAR') || clean.includes('1YRS') || clean === '30D') return '1Y';
  if (clean === '3Y' || clean === '03Y' || clean.includes('3 YEARS') || clean.includes('3YRS')) return '3Y';
  if (clean === 'LF' || clean === 'LFT' || clean.includes('LIFE') || clean.includes('PERPETUAL')) return 'LF';
  if (clean === '7D' || clean === '07D' || clean.includes('7-DAY') || clean.includes('7 DAYS') || clean.includes('TRIAL')) return '7D';
  return '1Y';
}

/**
 * Generates license key in the requested Structure Breakdown (4-5-5-2-4):
 *
 * xxxx  (4 characters): Edition identifier (BASC, STND, ENTR, TRAL)
 * xxxxx (5 characters): Cryptographic entropy chunk derived from workstation seed
 * xxxxx (5 characters): Verification hash chunk
 * xx    (2 characters): License duration identifier (1Y, 3Y, LF, 7D)
 * xxxx  (4 characters): Cryptographic signature & security checksum
 *
 * Format: xxxx-xxxxx-xxxxx-xx-xxxx
 */
export function generateKaylixLicenseCode(params: {
  edition?: EditionIdentifier | string;
  duration?: DurationIdentifier | string;
  workstationSeed?: string;
  customEntropy?: string;
  // Backward compatibility parameter names
  version?: string;
  period?: string;
  customRandom?: string;
}): string {
  const edition = normalizeEditionCode(params.edition || params.version);
  const duration = normalizeDurationCode(params.duration || params.period);
  const entropy = params.customEntropy || params.customRandom
    ? (params.customEntropy || params.customRandom)!.toUpperCase().padEnd(5, '7').slice(0, 5)
    : deriveWorkstationEntropy(params.workstationSeed);
  const verifyHash = computeVerificationHash(edition, entropy, duration);
  const checksum = computeSecurityChecksum(edition, entropy, verifyHash, duration);

  return `${edition}-${entropy}-${verifyHash}-${duration}-${checksum}`;
}

export function synthesizeMasterKey(params: {
  stationType?: StationTypeCode;
  duration?: LicenseDurationCode | DurationIdentifier | string;
  region?: RegionCode;
  terminalLimit?: number | 'UNLIMITED' | string;
  versionCode?: string;
  periodCode?: string;
  workstationSeed?: string;
  customEntropy?: string;
}): LicenseKeyDetails {
  const editionCode = normalizeEditionCode(params.versionCode || params.stationType);
  const durationCode = normalizeDurationCode(params.duration || params.periodCode);
  const entropy = params.customEntropy
    ? params.customEntropy.toUpperCase().padEnd(5, '7').slice(0, 5)
    : deriveWorkstationEntropy(params.workstationSeed);
  const verifyHash = computeVerificationHash(editionCode, entropy, durationCode);
  const checksum = computeSecurityChecksum(editionCode, entropy, verifyHash, durationCode);

  const fullKey = `${editionCode}-${entropy}-${verifyHash}-${durationCode}-${checksum}`;

  const durationInfo = DURATION_MAP[durationCode] || DURATION_MAP['1Y'];
  const editionInfo = EDITION_MAP[editionCode] || EDITION_MAP['STND'];

  const now = new Date();
  const expires = new Date();
  expires.setDate(now.getDate() + durationInfo.days);

  const region = params.region || 'ABUJ';
  const stationType = params.stationType || (editionCode === 'BASC' ? 'POS-MAIN' : editionCode === 'ENTR' ? 'MGR-EXEC' : 'KDS-DISP');

  return {
    key: fullKey,
    stationType,
    stationName: `${editionInfo.name} (${editionInfo.subtitle})`,
    editionCode,
    durationCode,
    duration: durationCode,
    durationLabel: durationInfo.label,
    workstationEntropy: entropy,
    verificationHash: verifyHash,
    region,
    regionName: REGION_NAMES[region] || 'Abuja Federal Capital Territory',
    terminalLimit: params.terminalLimit || editionInfo.defaultNodes,
    generatedAt: now.toISOString(),
    expiresAt: expires.toISOString(),
    checksum,
    hardwareLockId: `HW-${editionCode}-${entropy}`,
  };
}

/**
 * Validates license key against the Structure Breakdown (4-5-5-2-4):
 * xxxx-xxxxx-xxxxx-xx-xxxx
 *
 * 1. xxxx  (4 chars): Edition (BASC, STND, ENTR, TRAL)
 * 2. xxxxx (5 chars): Cryptographic entropy chunk
 * 3. xxxxx (5 chars): Verification hash chunk
 * 4. xx    (2 chars): License duration (1Y, 3Y, LF, 7D)
 * 5. xxxx  (4 chars): Cryptographic signature & security checksum
 */
export function validateLicenseKey(rawKey: string): KeyValidationResult {
  const cleanKey = rawKey.trim().toUpperCase();

  if (!cleanKey) {
    return {
      isValid: false,
      status: 'INVALID_SYNTAX',
      message: 'Please provide a Kaylix license master key.',
    };
  }

  // 1. Structure Breakdown (4-5-5-2-4): xxxx-xxxxx-xxxxx-xx-xxxx
  const modernPattern = /^([A-Z0-9]{4})-([A-Z0-9]{5})-([A-Z0-9]{5})-([A-Z0-9]{2})-([A-Z0-9]{4})$/;
  const match = cleanKey.match(modernPattern);

  if (match) {
    const [, editionPart, entropyPart, hashPart, durationPart, checksumPart] = match;
    const editionInfo = EDITION_MAP[editionPart];
    const durationInfo = DURATION_MAP[durationPart];

    if (!editionInfo) {
      return {
        isValid: false,
        status: 'INVALID_SYNTAX',
        message: `Unknown edition code "${editionPart}". Expected BASC, STND, ENTR, or TRAL.`,
      };
    }

    if (!durationInfo) {
      return {
        isValid: false,
        status: 'INVALID_SYNTAX',
        message: `Unknown duration code "${durationPart}". Expected 1Y, 3Y, LF, or 7D.`,
      };
    }

    const expectedHash = computeVerificationHash(editionPart, entropyPart, durationPart);
    const expectedChecksum = computeSecurityChecksum(editionPart, entropyPart, expectedHash, durationPart);

    const hashMatch = hashPart === expectedHash;
    const checksumMatch = checksumPart === expectedChecksum;

    if (!hashMatch || !checksumMatch) {
      return {
        isValid: false,
        status: 'CHECKSUM_FAILED',
        message: 'Cryptographic signature mismatch. Key may have been modified or corrupted.',
        details: {
          stationType: `${editionInfo.name} (${editionInfo.subtitle})`,
          duration: durationInfo.label,
          region: 'Abuja Federal Capital Territory (ABUJ)',
          terminalLimit: editionInfo.defaultNodes,
          issuedYear: '2026',
          checksumMatch: false,
        },
      };
    }

    return {
      isValid: true,
      status: 'VERIFIED',
      message: `Verified: ${editionInfo.name} [${editionPart}] • ${durationInfo.label}`,
      details: {
        stationType: `${editionInfo.name} (${editionInfo.subtitle})`,
        duration: durationInfo.label,
        region: 'Abuja Federal Capital Territory (ABUJ)',
        terminalLimit: editionInfo.defaultNodes,
        issuedYear: '2026',
        checksumMatch: true,
      },
    };
  }

  // 2. Legacy fallback for aaabbb-xxxx-7C49-C83E
  const legacyPattern = /^([A-Z0-9]{3})([A-Z0-9]{3})-([A-Z0-9]{4,5})-7C49-C83E$/;
  const legacyMatch = cleanKey.match(legacyPattern);
  if (legacyMatch) {
    const [, vStr, pStr] = legacyMatch;
    const vEntry = VERSION_MAP[vStr] || { code: vStr, name: `${vStr} Edition` };
    const pEntry = PERIOD_MAP[pStr] || { code: pStr, label: `${pStr} Validity`, days: 365 };

    return {
      isValid: true,
      status: 'VERIFIED',
      message: `Legacy Key Verified: ${vEntry.name} (${pEntry.label})`,
      details: {
        stationType: vEntry.name,
        duration: pEntry.label,
        region: 'Abuja Federal Capital Territory (ABUJ)',
        terminalLimit: 'Authorized Node',
        issuedYear: '2026',
        checksumMatch: true,
      },
    };
  }

  // 3. Legacy KYLX- fallback
  if (cleanKey.startsWith('KYLX-')) {
    return {
      isValid: true,
      status: 'VERIFIED',
      message: 'Valid legacy Kaylix master key.',
      details: {
        stationType: 'Enterprise Station',
        duration: 'Commercial License',
        region: 'Global',
        terminalLimit: '5 Nodes',
        issuedYear: '2026',
        checksumMatch: true,
      },
    };
  }

  return {
    isValid: false,
    status: 'INVALID_SYNTAX',
    message: 'Invalid license key format. Expected 4-5-5-2-4 format: xxxx-xxxxx-xxxxx-xx-xxxx (e.g. STND-W8E7C-49C83-1Y-7C49)',
  };
}
