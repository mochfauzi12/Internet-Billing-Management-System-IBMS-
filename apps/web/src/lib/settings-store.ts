export interface IspSettings {
  companyName: string;
  legalName: string;
  companyAddress: string;
  companyPhone: string;
  companyEmail: string;
  logoType: 'wifi' | 'globe' | 'zap' | 'tower' | 'custom';
  customLogoUrl?: string;
  bcaAccount: string;
  bcaName: string;
  mandiriAccount: string;
  mandiriName: string;
  waApiKey: string;
}

export const DEFAULT_ISP_SETTINGS: IspSettings = {
  companyName: 'NetISP',
  legalName: 'PT NetISP Network Indonesia',
  companyAddress: 'Jl. Teknologi No. 100, Bandung, Jawa Barat',
  companyPhone: '0812-0000-9999',
  companyEmail: 'cs@netisp.id',
  logoType: 'wifi',
  customLogoUrl: '',
  bcaAccount: '123-456-7890',
  bcaName: 'PT NetISP Network Indonesia',
  mandiriAccount: '098-765-4321',
  mandiriName: 'PT NetISP Network Indonesia',
  waApiKey: '',
};

const SETTINGS_KEY = 'netisp_app_settings_v1';

export function getIspSettings(): IspSettings {
  if (typeof window === 'undefined') return DEFAULT_ISP_SETTINGS;
  try {
    const saved = localStorage.getItem(SETTINGS_KEY);
    if (!saved) return DEFAULT_ISP_SETTINGS;
    return { ...DEFAULT_ISP_SETTINGS, ...JSON.parse(saved) };
  } catch (err) {
    return DEFAULT_ISP_SETTINGS;
  }
}

export function saveIspSettings(settings: IspSettings): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (err) {
    console.error('Failed to save ISP settings to localStorage', err);
  }
}
