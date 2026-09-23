import { AppSettings, ThemeMode } from '../types';

export const DEFAULT_SETTINGS: AppSettings = {
  theme: 'light',
  language: 'en',
  currency: 'USD',
  distanceUnit: 'miles',
  escrowAlerts: true,
  soundEffects: true,
};

const SETTINGS_STORAGE_KEY = 'pawpalace_user_settings_v1';

export function loadStoredSettings(): AppSettings {
  try {
    const saved = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        ...DEFAULT_SETTINGS,
        ...parsed,
      };
    }
  } catch (err) {
    console.warn('Failed to load settings from localStorage:', err);
  }
  return DEFAULT_SETTINGS;
}

export function saveStoredSettings(settings: AppSettings): void {
  try {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
  } catch (err) {
    console.warn('Failed to save settings to localStorage:', err);
  }
}

/**
 * Resolves whether the active theme is dark based on mode
 */
export function isDarkActive(theme: ThemeMode): boolean {
  if (theme === 'dark') return true;
  if (theme === 'light') return false;
  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }
  return false;
}

/**
 * Applies the .dark class to <html> and <body> and sets color-scheme
 */
export function applyThemeToDocument(theme: ThemeMode): void {
  if (typeof document === 'undefined') return;
  
  const isDark = isDarkActive(theme);
  const root = document.documentElement;
  const body = document.body;

  if (isDark) {
    root.classList.add('dark');
    body.classList.add('dark');
    root.style.colorScheme = 'dark';
  } else {
    root.classList.remove('dark');
    body.classList.remove('dark');
    root.style.colorScheme = 'light';
  }
}
