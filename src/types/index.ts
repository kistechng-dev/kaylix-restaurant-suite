export interface AdminRecord {
  id: string;
  type: 'REGISTRATION' | 'PAYMENT_SLIP';
  fullName: string;
  phone: string;
  email: string;
  restaurantName?: string;
  cityBranch?: string;
  version: string;
  versionCode: 'TRL' | 'BSC' | 'STD' | 'ENT' | 'MST' | 'BASC' | 'STND' | 'ENTR' | 'TRAL' | string;
  periodCode: '07D' | '30D' | '01Y' | '03Y' | 'LFT' | '1Y' | '3Y' | 'LF' | '7D' | string;
  amount: string;
  bankDetails: {
    bankName: string;
    accountNumber: string;
    accountName: string;
    paymentReference: string;
    transferDate?: string;
  };
  licenseCode: string;
  timestamp: string;
  status: 'PENDING' | 'VERIFIED' | 'DISPATCHED';
  notes?: string;
}

export interface RegistrationRecord {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  selectedEditionId: string;
  selectedEditionName: string;
  selectedPrice: string;
  timestamp: string;
  telegramRecipient: string;
  whatsappRecipient?: string;
  trialLicenseCode?: string;
  dispatchStatus: 'DISPATCHED' | 'PENDING';
}

export interface SoftwareEdition {
  id: string;
  name: string;
  badge: string;
  badgeSub?: string;
  category: 'Trial' | 'Basic' | 'Standard' | 'Enterprise';
  priceTag: string;
  description: string;
  hostNote: string;
  fileSize: string;
  fileName: string;
  batchScript: string;
  releaseDate: string;
  features: string[];
  pricing: {
    yr1: string;
    yr3: string;
    lifetime: string;
    isFree?: boolean;
  };
  theme: {
    border: string;
    glow: string;
    btnBg: string;
    badgeBg: string;
    accentText: string;
    colorGradient: string;
  };
}

export interface StationApp {
  id: string;
  name: string;
  tagline: string;
  version: string;
  buildNumber: string;
  category: 'Counter' | 'Kitchen' | 'Service' | 'Backoffice';
  fileSize: string;
  fileName: string;
  releaseDate: string;
  iconName: string;
  accentColor: string;
  platforms: {
    primary: string;
    secondary?: string;
  };
  highlights: string[];
  systemRequirements: {
    os: string;
    processor: string;
    ram: string;
    storage: string;
    peripherals: string;
    network: string;
  };
}

export interface BankAccount {
  id: string;
  bankName: string;
  accountName: string;
  accountNumber: string;
  sortCode: string;
  branch: string;
  swiftCode: string;
  type: string;
  logoColor: string;
  accentBorder: string;
  ussdCode: string;
}

export interface PaymentSlipData {
  restaurantName: string;
  contactPerson: string;
  phone: string;
  email: string;
  cityBranch: string;
  selectedPackage: string;
  amountPaid: string;
  bankSelected: string;
  paymentReference: string;
  transferDate: string;
  receiptImage: string | null;
  receiptName: string | null;
  receiptSize: string | null;
  notes: string;
}

export type StationTypeCode = 'POS-MAIN' | 'KDS-DISP' | 'WTR-MOB' | 'MGR-EXEC';
export type LicenseDurationCode = '30D' | '1Y' | '3Y' | 'LFT';
export type RegionCode = 'ABUJ' | 'LAGS' | 'PHRC' | 'IBAD' | 'ENUG' | 'KANO' | 'GBL';

export interface LicenseKeyDetails {
  key: string;
  stationType?: StationTypeCode | string;
  stationName: string;
  editionCode?: string;
  durationCode?: string;
  duration: LicenseDurationCode | string;
  durationLabel: string;
  workstationEntropy?: string;
  verificationHash?: string;
  region?: RegionCode | string;
  regionName?: string;
  terminalLimit: number | string;
  generatedAt: string;
  expiresAt: string;
  checksum: string;
  hardwareLockId?: string;
}

export interface KeyValidationResult {
  isValid: boolean;
  status: 'VERIFIED' | 'EXPIRED' | 'CHECKSUM_FAILED' | 'INVALID_SYNTAX';
  message: string;
  details?: {
    stationType: string;
    duration: string;
    region: string;
    terminalLimit: string;
    issuedYear: string;
    checksumMatch: boolean;
  };
}

export interface DownloadTask {
  appId: string;
  appName: string;
  fileName: string;
  fileSize: string;
  progress: number;
  speed: string;
  status: 'downloading' | 'completed' | 'paused' | 'error';
}
