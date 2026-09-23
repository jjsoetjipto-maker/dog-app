import React, { useState } from 'react';
import { useSettings } from '../context/SettingsContext';
import { LANGUAGE_OPTIONS, CURRENCY_OPTIONS } from '../i18n/translations';
import { ThemeMode, AppLanguage, AppCurrency } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShowToast?: (msg: string) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  onShowToast,
}) => {
  const {
    settings,
    theme,
    language,
    currency,
    t,
    isDark,
    setTheme,
    setLanguage,
    setCurrency,
    updateSettings,
    resetSettings,
  } = useSettings();

  const [activeTab, setActiveTab] = useState<'appearance' | 'language' | 'preferences'>('appearance');

  if (!isOpen) return null;

  const handleSelectTheme = (newTheme: ThemeMode) => {
    setTheme(newTheme);
    onShowToast?.(`Theme changed to ${newTheme === 'dark' ? 'Dark Mode' : newTheme === 'light' ? 'Light Mode' : 'System Default'}`);
  };

  const handleSelectLanguage = (newLang: AppLanguage) => {
    setLanguage(newLang);
    const langObj = LANGUAGE_OPTIONS.find((l) => l.code === newLang);
    onShowToast?.(`Language switched to ${langObj?.nativeName || newLang.toUpperCase()}`);
  };

  const handleReset = () => {
    resetSettings();
    onShowToast?.('Settings reset to default values.');
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-white dark:bg-[#131b2e] rounded-3xl shadow-2xl border border-[#dee8ff] dark:border-[#263554] overflow-hidden flex flex-col max-h-[90vh] text-[#111c2d] dark:text-[#f1f5f9] transition-colors"
        onClick={(e) => e.stopPropagation()}
        id="settings-modal"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#e7eeff] dark:border-[#22304d] bg-[#f9f9ff] dark:bg-[#0f172a]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#ffdcc3] dark:bg-[#8d4b00]/30 text-[#8d4b00] dark:text-[#ffdcc3] flex items-center justify-center shadow-xs">
              <span className="material-symbols-outlined text-2xl">settings</span>
            </div>
            <div>
              <h2 className="text-lg font-['Epilogue'] font-bold text-[#111c2d] dark:text-white">
                {t.settingsModalTitle}
              </h2>
              <p className="text-xs text-[#554336] dark:text-[#94a3b8]">
                {t.settingsModalSubtitle}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full flex items-center justify-center text-[#887364] dark:text-[#94a3b8] hover:bg-[#dee8ff] dark:hover:bg-[#1e293b] hover:text-[#111c2d] dark:hover:text-white transition-colors cursor-pointer"
            title="Close"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="flex border-b border-[#e7eeff] dark:border-[#22304d] bg-[#f0f3ff] dark:bg-[#101827] px-6">
          <button
            type="button"
            onClick={() => setActiveTab('appearance')}
            className={`py-3 px-4 text-xs font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
              activeTab === 'appearance'
                ? 'border-[#8d4b00] dark:border-[#ffdcc3] text-[#8d4b00] dark:text-[#ffdcc3]'
                : 'border-transparent text-[#554336] dark:text-[#94a3b8] hover:text-[#111c2d] dark:hover:text-[#e2e8f0]'
            }`}
          >
            <span className="material-symbols-outlined text-base">
              {isDark ? 'dark_mode' : 'palette'}
            </span>
            <span>{t.tabAppearance}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('language')}
            className={`py-3 px-4 text-xs font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
              activeTab === 'language'
                ? 'border-[#8d4b00] dark:border-[#ffdcc3] text-[#8d4b00] dark:text-[#ffdcc3]'
                : 'border-transparent text-[#554336] dark:text-[#94a3b8] hover:text-[#111c2d] dark:hover:text-[#e2e8f0]'
            }`}
          >
            <span className="material-symbols-outlined text-base">translate</span>
            <span>{t.tabLanguageRegion}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('preferences')}
            className={`py-3 px-4 text-xs font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
              activeTab === 'preferences'
                ? 'border-[#8d4b00] dark:border-[#ffdcc3] text-[#8d4b00] dark:text-[#ffdcc3]'
                : 'border-transparent text-[#554336] dark:text-[#94a3b8] hover:text-[#111c2d] dark:hover:text-[#e2e8f0]'
            }`}
          >
            <span className="material-symbols-outlined text-base">tune</span>
            <span>{t.tabPreferences}</span>
          </button>
        </div>

        {/* Modal Tab Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          
          {/* TAB 1: APPEARANCE / THEME */}
          {activeTab === 'appearance' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#554336] dark:text-[#94a3b8] mb-3">
                  {t.themeModeLabel}
                </label>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Light Mode Tile */}
                  <button
                    type="button"
                    onClick={() => handleSelectTheme('light')}
                    className={`p-4 rounded-2xl border-2 text-left transition-all cursor-pointer relative group flex flex-col justify-between h-36 ${
                      theme === 'light'
                        ? 'border-[#8d4b00] bg-[#fffaf5] dark:bg-[#1a253c] ring-2 ring-[#ffdcc3]'
                        : 'border-[#dee8ff] dark:border-[#263554] bg-white dark:bg-[#182238] hover:border-[#dbc2b0]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
                        <span className="material-symbols-outlined text-xl">light_mode</span>
                      </div>
                      {theme === 'light' && (
                        <span className="w-5 h-5 rounded-full bg-[#8d4b00] text-white flex items-center justify-center">
                          <span className="material-symbols-outlined text-xs">check</span>
                        </span>
                      )}
                    </div>
                    <div>
                      <p className="font-bold text-sm text-[#111c2d] dark:text-white">
                        {t.themeLight}
                      </p>
                      <p className="text-[11px] text-[#554336] dark:text-[#94a3b8] line-clamp-2 mt-0.5">
                        {t.themeLightDesc}
                      </p>
                    </div>
                  </button>

                  {/* Dark Mode Tile */}
                  <button
                    type="button"
                    onClick={() => handleSelectTheme('dark')}
                    className={`p-4 rounded-2xl border-2 text-left transition-all cursor-pointer relative group flex flex-col justify-between h-36 ${
                      theme === 'dark'
                        ? 'border-[#ffdcc3] dark:border-[#ffdcc3] bg-[#1a243b] ring-2 ring-[#ffdcc3]/50'
                        : 'border-[#dee8ff] dark:border-[#263554] bg-white dark:bg-[#182238] hover:border-[#dbc2b0]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="w-8 h-8 rounded-xl bg-indigo-950 text-indigo-300 border border-indigo-800/60 flex items-center justify-center">
                        <span className="material-symbols-outlined text-xl">dark_mode</span>
                      </div>
                      {theme === 'dark' && (
                        <span className="w-5 h-5 rounded-full bg-[#ffdcc3] text-[#8d4b00] flex items-center justify-center font-bold">
                          <span className="material-symbols-outlined text-xs">check</span>
                        </span>
                      )}
                    </div>
                    <div>
                      <p className="font-bold text-sm text-[#111c2d] dark:text-white">
                        {t.themeDark}
                      </p>
                      <p className="text-[11px] text-[#554336] dark:text-[#94a3b8] line-clamp-2 mt-0.5">
                        {t.themeDarkDesc}
                      </p>
                    </div>
                  </button>

                  {/* System Mode Tile */}
                  <button
                    type="button"
                    onClick={() => handleSelectTheme('system')}
                    className={`p-4 rounded-2xl border-2 text-left transition-all cursor-pointer relative group flex flex-col justify-between h-36 ${
                      theme === 'system'
                        ? 'border-[#8d4b00] dark:border-[#ffdcc3] bg-[#fffaf5] dark:bg-[#1a253c] ring-2 ring-[#ffdcc3]'
                        : 'border-[#dee8ff] dark:border-[#263554] bg-white dark:bg-[#182238] hover:border-[#dbc2b0]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="w-8 h-8 rounded-xl bg-[#e7eeff] dark:bg-[#25324e] text-[#554336] dark:text-[#cbd5e1] flex items-center justify-center">
                        <span className="material-symbols-outlined text-xl">devices</span>
                      </div>
                      {theme === 'system' && (
                        <span className="w-5 h-5 rounded-full bg-[#8d4b00] dark:bg-[#ffdcc3] text-white dark:text-[#8d4b00] flex items-center justify-center">
                          <span className="material-symbols-outlined text-xs">check</span>
                        </span>
                      )}
                    </div>
                    <div>
                      <p className="font-bold text-sm text-[#111c2d] dark:text-white">
                        {t.themeSystem}
                      </p>
                      <p className="text-[11px] text-[#554336] dark:text-[#94a3b8] line-clamp-2 mt-0.5">
                        {t.themeSystemDesc}
                      </p>
                    </div>
                  </button>
                </div>
              </div>

              {/* Quick Toggle Bar */}
              <div className="p-4 rounded-2xl bg-[#f0f3ff] dark:bg-[#0f172a] border border-[#dee8ff] dark:border-[#22304d] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-2xl text-[#8d4b00] dark:text-[#ffdcc3]">
                    {isDark ? 'nightlight' : 'wb_sunny'}
                  </span>
                  <div>
                    <p className="text-xs font-bold text-[#111c2d] dark:text-white">
                      Current Mode: {isDark ? 'Dark Theme (Active)' : 'Light Theme (Active)'}
                    </p>
                    <p className="text-[11px] text-[#554336] dark:text-[#94a3b8]">
                      Click to quickly invert display brightness
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleSelectTheme(isDark ? 'light' : 'dark')}
                  className="px-4 py-2 bg-white dark:bg-[#1e293b] hover:bg-[#ffdcc3]/40 dark:hover:bg-[#293852] border border-[#dee8ff] dark:border-[#334155] rounded-xl text-xs font-bold text-[#111c2d] dark:text-[#ffdcc3] flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                >
                  <span className="material-symbols-outlined text-sm">
                    {isDark ? 'light_mode' : 'dark_mode'}
                  </span>
                  <span>Switch to {isDark ? 'Light' : 'Dark'}</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: LANGUAGE & REGION */}
          {activeTab === 'language' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              
              {/* Language Selection Grid */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#554336] dark:text-[#94a3b8] mb-3">
                  {t.languageSelectLabel}
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {LANGUAGE_OPTIONS.map((langOption) => {
                    const isSelected = language === langOption.code;
                    return (
                      <button
                        key={langOption.code}
                        type="button"
                        onClick={() => handleSelectLanguage(langOption.code)}
                        className={`p-3 rounded-2xl border-2 flex items-center justify-between text-left transition-all cursor-pointer ${
                          isSelected
                            ? 'border-[#8d4b00] dark:border-[#ffdcc3] bg-[#fffaf5] dark:bg-[#1a253c] shadow-xs'
                            : 'border-[#dee8ff] dark:border-[#263554] bg-white dark:bg-[#182238] hover:border-[#dbc2b0]'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{langOption.flag}</span>
                          <div>
                            <p className="text-xs font-bold text-[#111c2d] dark:text-white">
                              {langOption.nativeName}
                            </p>
                            <p className="text-[10px] text-[#554336] dark:text-[#94a3b8]">
                              {langOption.label} ({langOption.code.toUpperCase()})
                            </p>
                          </div>
                        </div>

                        {isSelected && (
                          <span className="w-5 h-5 rounded-full bg-[#8d4b00] dark:bg-[#ffdcc3] text-white dark:text-[#8d4b00] flex items-center justify-center">
                            <span className="material-symbols-outlined text-xs">check</span>
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Currency Selector */}
              <div className="border-t border-[#e7eeff] dark:border-[#22304d] pt-5">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#554336] dark:text-[#94a3b8] mb-2">
                  {t.currencySelectLabel}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {CURRENCY_OPTIONS.map((c) => {
                    const isSelected = currency === c.code;
                    return (
                      <button
                        key={c.code}
                        type="button"
                        onClick={() => {
                          setCurrency(c.code as AppCurrency);
                          onShowToast?.(`Currency set to ${c.code}`);
                        }}
                        className={`p-2.5 rounded-xl border text-left flex items-center justify-between text-xs transition-colors cursor-pointer ${
                          isSelected
                            ? 'border-[#8d4b00] dark:border-[#ffdcc3] bg-[#fffaf5] dark:bg-[#1a253c] font-bold text-[#8d4b00] dark:text-[#ffdcc3]'
                            : 'border-[#dee8ff] dark:border-[#263554] bg-white dark:bg-[#182238] text-[#111c2d] dark:text-white hover:border-[#dbc2b0]'
                        }`}
                      >
                        <span>{c.label}</span>
                        {isSelected && <span className="material-symbols-outlined text-sm">check</span>}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Distance Units */}
              <div className="border-t border-[#e7eeff] dark:border-[#22304d] pt-5">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#554336] dark:text-[#94a3b8] mb-2">
                  {t.distanceUnitsLabel}
                </label>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => updateSettings({ distanceUnit: 'miles' })}
                    className={`px-4 py-2 rounded-xl border text-xs font-bold flex items-center gap-2 cursor-pointer transition-colors ${
                      settings.distanceUnit === 'miles'
                        ? 'border-[#8d4b00] dark:border-[#ffdcc3] bg-[#8d4b00] dark:bg-[#ffdcc3] text-white dark:text-[#8d4b00]'
                        : 'border-[#dee8ff] dark:border-[#263554] bg-white dark:bg-[#182238] text-[#554336] dark:text-[#94a3b8]'
                    }`}
                  >
                    <span>{t.unitMiles}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => updateSettings({ distanceUnit: 'km' })}
                    className={`px-4 py-2 rounded-xl border text-xs font-bold flex items-center gap-2 cursor-pointer transition-colors ${
                      settings.distanceUnit === 'km'
                        ? 'border-[#8d4b00] dark:border-[#ffdcc3] bg-[#8d4b00] dark:bg-[#ffdcc3] text-white dark:text-[#8d4b00]'
                        : 'border-[#dee8ff] dark:border-[#263554] bg-white dark:bg-[#182238] text-[#554336] dark:text-[#94a3b8]'
                    }`}
                  >
                    <span>{t.unitKilometers}</span>
                  </button>
                </div>
              </div>

            </div>
          )}

          {/* TAB 3: PREFERENCES & SAFETY */}
          {activeTab === 'preferences' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              
              {/* Escrow Safety Alerts */}
              <div className="p-4 rounded-2xl bg-[#f9f9ff] dark:bg-[#0f172a] border border-[#dee8ff] dark:border-[#22304d] flex items-center justify-between gap-4">
                <div>
                  <h4 className="text-xs font-bold text-[#111c2d] dark:text-white flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-base text-[#006c4a] dark:text-[#82f5c1]">
                      verified_user
                    </span>
                    <span>{t.escrowSafetyAlerts}</span>
                  </h4>
                  <p className="text-[11px] text-[#554336] dark:text-[#94a3b8] mt-0.5">
                    {t.escrowSafetyAlertsDesc}
                  </p>
                </div>

                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.escrowAlerts}
                    onChange={(e) => updateSettings({ escrowAlerts: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#006c4a]"></div>
                </label>
              </div>

              {/* Sound Effects */}
              <div className="p-4 rounded-2xl bg-[#f9f9ff] dark:bg-[#0f172a] border border-[#dee8ff] dark:border-[#22304d] flex items-center justify-between gap-4">
                <div>
                  <h4 className="text-xs font-bold text-[#111c2d] dark:text-white flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-base text-[#8d4b00] dark:text-[#ffdcc3]">
                      volume_up
                    </span>
                    <span>{t.soundEffects}</span>
                  </h4>
                  <p className="text-[11px] text-[#554336] dark:text-[#94a3b8] mt-0.5">
                    {t.soundEffectsDesc}
                  </p>
                </div>

                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.soundEffects}
                    onChange={(e) => updateSettings({ soundEffects: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#8d4b00]"></div>
                </label>
              </div>

            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-[#e7eeff] dark:border-[#22304d] bg-[#f9f9ff] dark:bg-[#0f172a] flex items-center justify-between">
          <button
            type="button"
            onClick={handleReset}
            className="text-xs font-bold text-[#887364] dark:text-[#94a3b8] hover:text-[#ba1a1a] dark:hover:text-red-400 flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <span className="material-symbols-outlined text-base">restart_alt</span>
            <span>{t.resetDefaultsBtn}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              onShowToast?.(t.settingsSavedToast);
              onClose();
            }}
            className="bg-[#8d4b00] hover:bg-[#b15f00] text-white px-5 py-2.5 rounded-full text-xs font-bold transition-all shadow-xs flex items-center gap-2 cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm">check</span>
            <span>{t.saveSettingsBtn}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
