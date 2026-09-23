import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import { AppSettings, ThemeMode, AppLanguage, AppCurrency } from '../types';
import { DEFAULT_SETTINGS, loadStoredSettings, saveStoredSettings, applyThemeToDocument, isDarkActive } from '../data/settingsData';
import { TRANSLATIONS, TranslationDictionary } from '../i18n/translations';

interface SettingsContextValue {
  settings: AppSettings;
  theme: ThemeMode;
  language: AppLanguage;
  currency: AppCurrency;
  t: TranslationDictionary;
  isDark: boolean;
  setTheme: (theme: ThemeMode) => void;
  setLanguage: (lang: AppLanguage) => void;
  setCurrency: (currency: AppCurrency) => void;
  updateSettings: (newSettings: Partial<AppSettings>) => void;
  resetSettings: () => void;
  formatPrice: (amountInUSD: number) => string;
}

const SettingsContext = createContext<SettingsContextValue | undefined>(undefined);

const CURRENCY_RATES: Record<AppCurrency, { symbol: string; rate: number; prefix: boolean }> = {
  USD: { symbol: '$', rate: 1.0, prefix: true },
  EUR: { symbol: '€', rate: 0.92, prefix: true },
  GBP: { symbol: '£', rate: 0.79, prefix: true },
  JPY: { symbol: '¥', rate: 155.0, prefix: true },
  CAD: { symbol: 'CA$', rate: 1.36, prefix: true },
};

export const SettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<AppSettings>(() => loadStoredSettings());

  // Keep dark mode class in sync whenever theme setting changes
  useEffect(() => {
    applyThemeToDocument(settings.theme);

    // If system mode, listen to OS color scheme changes
    if (settings.theme === 'system' && typeof window !== 'undefined' && window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const listener = () => applyThemeToDocument('system');
      mediaQuery.addEventListener('change', listener);
      return () => mediaQuery.removeEventListener('change', listener);
    }
  }, [settings.theme]);

  // Persist to localStorage whenever settings state updates
  useEffect(() => {
    saveStoredSettings(settings);
  }, [settings]);

  const isDark = useMemo(() => isDarkActive(settings.theme), [settings.theme]);

  const t = useMemo(() => {
    return TRANSLATIONS[settings.language] || TRANSLATIONS.en;
  }, [settings.language]);

  const setTheme = (theme: ThemeMode) => {
    setSettings((prev) => ({ ...prev, theme }));
  };

  const setLanguage = (language: AppLanguage) => {
    setSettings((prev) => ({ ...prev, language }));
  };

  const setCurrency = (currency: AppCurrency) => {
    setSettings((prev) => ({ ...prev, currency }));
  };

  const updateSettings = (partial: Partial<AppSettings>) => {
    setSettings((prev) => ({ ...prev, ...partial }));
  };

  const resetSettings = () => {
    setSettings(DEFAULT_SETTINGS);
  };

  const formatPrice = (amountInUSD: number): string => {
    const config = CURRENCY_RATES[settings.currency] || CURRENCY_RATES.USD;
    const converted = amountInUSD * config.rate;
    
    // For Japanese Yen, round to nearest integer without cents
    const formattedNumber = settings.currency === 'JPY'
      ? Math.round(converted).toLocaleString()
      : Math.round(converted).toLocaleString();

    return `${config.symbol}${formattedNumber}`;
  };

  const value = useMemo(
    () => ({
      settings,
      theme: settings.theme,
      language: settings.language,
      currency: settings.currency,
      t,
      isDark,
      setTheme,
      setLanguage,
      setCurrency,
      updateSettings,
      resetSettings,
      formatPrice,
    }),
    [settings, t, isDark]
  );

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
};

export function useSettings(): SettingsContextValue {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
