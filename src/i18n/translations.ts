import { AppLanguage } from '../types';
import { TranslationDictionary } from './types';
import { en } from './locales/en';
import { es } from './locales/es';
import { fr } from './locales/fr';
import { de } from './locales/de';
import { ja } from './locales/ja';
import { zh } from './locales/zh';

export type { TranslationDictionary } from './types';

export const TRANSLATIONS: Record<AppLanguage, TranslationDictionary> = {
  en,
  es,
  fr,
  de,
  ja,
  zh,
};

export const LANGUAGE_OPTIONS: { code: AppLanguage; label: string; nativeName: string; flag: string }[] = [
  { code: 'en', label: 'English', nativeName: 'English (US)', flag: '🇺🇸' },
  { code: 'es', label: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
  { code: 'fr', label: 'French', nativeName: 'Français', flag: '🇫🇷' },
  { code: 'de', label: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
  { code: 'ja', label: 'Japanese', nativeName: '日本語', flag: '🇯🇵' },
  { code: 'zh', label: 'Chinese', nativeName: '简体中文', flag: '🇨🇳' },
];

export const CURRENCY_OPTIONS = [
  { code: 'USD', symbol: '$', label: 'USD ($) - US Dollar' },
  { code: 'EUR', symbol: '€', label: 'EUR (€) - Euro' },
  { code: 'GBP', symbol: '£', label: 'GBP (£) - British Pound' },
  { code: 'JPY', symbol: '¥', label: 'JPY (¥) - Japanese Yen' },
  { code: 'CAD', symbol: 'CA$', label: 'CAD (CA$) - Canadian Dollar' },
];
