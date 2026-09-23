import React, { useState } from 'react';
import { PawPrint } from 'lucide-react';
import { Screen, Dog, UserProfile } from '../types';
import { useSettings } from '../context/SettingsContext';
import { LANGUAGE_OPTIONS } from '../i18n/translations';
import { requestCurrentGPSLocation } from '../services/locationService';

interface HeaderProps {
  currentScreen: Screen;
  setCurrentScreen: (screen: Screen) => void;
  selectedDog: Dog;
  user: UserProfile;
  onOpenLogin: () => void;
  onOpenEditProfile: () => void;
  onLogout: () => void;
  cartCount: number;
  onOpenCart: () => void;
  wishlistCount: number;
  onOpenWishlist: () => void;
  onOpenPostListing: () => void;
  onOpenSettings: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  zipCode: string;
  setZipCode: (zip: string) => void;
  searchCategory: string;
  setSearchCategory: (cat: string) => void;
  onTriggerSearch: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentScreen,
  setCurrentScreen,
  selectedDog,
  user,
  onOpenLogin,
  onOpenEditProfile,
  onLogout,
  cartCount,
  onOpenCart,
  wishlistCount,
  onOpenWishlist,
  onOpenPostListing,
  onOpenSettings,
  searchQuery,
  setSearchQuery,
  zipCode,
  setZipCode,
  searchCategory,
  setSearchCategory,
  onTriggerSearch
}) => {
  const { theme, isDark, setTheme, language, setLanguage, t } = useSettings();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [isLocating, setIsLocating] = useState(false);

  const handleAskLocationAccess = async () => {
    setIsLocating(true);
    try {
      const coords = await requestCurrentGPSLocation();
      setIsLocating(false);
      let detectedZip = '78701';
      if (coords.lat > 32.5) detectedZip = '75201'; // Dallas
      else if (coords.lng > -96.2) detectedZip = '77002'; // Houston
      else if (coords.lat < 29.6) detectedZip = '78205'; // San Antonio
      setZipCode(detectedZip);
    } catch (err) {
      setIsLocating(false);
      console.warn('Location request error in header:', err);
    }
  };

  const currentLangObj = LANGUAGE_OPTIONS.find((l) => l.code === language) || LANGUAGE_OPTIONS[0];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onTriggerSearch();
  };

  return (
    <header className="sticky top-0 z-40 bg-[#ffffff] border-b border-[#e7eeff] shadow-[0_2px_12px_rgba(17,28,45,0.04)]">
      {/* Top Banner Notice */}
      <div className="bg-[#111c2d] text-white text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 overflow-hidden">
            <span className="material-symbols-outlined text-[15px] text-[#ffdcc3] shrink-0">verified_user</span>
            <span className="font-medium tracking-wide truncate text-[11px] sm:text-xs">
              {t.topNotice}
            </span>
          </div>

          <div className="flex items-center gap-3 text-white/90 text-[11px] shrink-0">
            {/* Quick Language Selector Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-[#ffdcc3] px-2 py-0.5 rounded-full transition-colors cursor-pointer border border-white/15"
                title={t.changeLanguageTooltip}
                id="header-lang-picker-btn"
              >
                <span>{currentLangObj.flag}</span>
                <span className="font-bold text-[10px] uppercase tracking-wide">{currentLangObj.code}</span>
                <span className="material-symbols-outlined text-[12px]">expand_more</span>
              </button>

              {langDropdownOpen && (
                <div
                  className="absolute right-0 mt-1.5 w-44 bg-white dark:bg-[#131b2e] text-[#111c2d] dark:text-white rounded-2xl shadow-2xl border border-[#dee8ff] dark:border-[#263554] p-1.5 z-50 animate-in fade-in"
                  onClick={() => setLangDropdownOpen(false)}
                >
                  <p className="px-2 py-1 text-[10px] font-bold text-[#887364] dark:text-[#94a3b8] uppercase tracking-wider">
                    {t.languageSelectLabel}
                  </p>
                  {LANGUAGE_OPTIONS.map((lo) => (
                    <button
                      key={lo.code}
                      type="button"
                      onClick={() => setLanguage(lo.code)}
                      className={`w-full text-left px-2.5 py-1.5 rounded-xl text-xs flex items-center justify-between hover:bg-[#f0f3ff] dark:hover:bg-[#1e293b] cursor-pointer transition-colors ${
                        language === lo.code
                          ? 'font-bold text-[#8d4b00] dark:text-[#ffdcc3] bg-[#fffaf5] dark:bg-[#1a253c]'
                          : ''
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span>{lo.flag}</span>
                        <span>{lo.nativeName}</span>
                      </span>
                      {language === lo.code && (
                        <span className="material-symbols-outlined text-xs">check</span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Theme Toggle (Light / Dark) */}
            <button
              type="button"
              onClick={() => setTheme(isDark ? 'light' : 'dark')}
              className="flex items-center gap-1 bg-white/10 hover:bg-white/20 text-[#ffdcc3] px-2 py-0.5 rounded-full transition-colors cursor-pointer border border-white/15"
              title={t.toggleThemeTooltip}
              id="header-quick-theme-btn"
            >
              <span className="material-symbols-outlined text-[13px]">
                {isDark ? 'light_mode' : 'dark_mode'}
              </span>
              <span className="hidden md:inline text-[10px] font-bold">{isDark ? 'Light' : 'Dark'}</span>
            </button>

            {/* Settings Modal Button */}
            <button
              type="button"
              onClick={onOpenSettings}
              className="flex items-center gap-1 bg-white/10 hover:bg-white/20 text-[#ffdcc3] px-2 py-0.5 rounded-full transition-colors cursor-pointer border border-white/15"
              title={t.openSettingsTooltip}
              id="header-quick-settings-btn"
            >
              <span className="material-symbols-outlined text-[13px]">settings</span>
              <span className="hidden lg:inline text-[10px] font-bold">{t.settings}</span>
            </button>

            <span className="hidden md:inline opacity-40">•</span>

            <button 
              onClick={() => setCurrentScreen('health-safety')}
              className="hidden md:inline hover:text-[#ffdcc3] transition-colors cursor-pointer"
            >
              {t.ethicalStandard}
            </button>
            <span className="hidden md:inline opacity-40">•</span>
            <button 
              onClick={() => setCurrentScreen('verified-breeders')}
              className="hidden md:inline hover:text-[#ffdcc3] transition-colors cursor-pointer"
            >
              {t.breederDirectory}
            </button>
            <span className="hidden md:inline opacity-40">•</span>
            <button 
              id="header-owner-portal-btn"
              onClick={() => setCurrentScreen('owner-portal')}
              className="inline-flex items-center gap-1 text-[#ffdcc3] hover:text-white bg-[#8d4b00]/70 hover:bg-[#8d4b00] px-2.5 py-0.5 rounded-full font-bold text-[11px] transition-colors cursor-pointer border border-[#ffcfad]/50 shadow-xs"
              title="Platform Owner Console for Approving Pictures and Names"
            >
              <span className="material-symbols-outlined text-[13px]">shield_person</span>
              <span>{t.ownerPortal}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex items-center justify-between gap-4">
          
          {/* Brand Logo */}
          <button 
            id="brand-logo-btn"
            onClick={() => setCurrentScreen('home')}
            className="flex items-center gap-3 group text-left cursor-pointer focus:outline-none"
          >
            <div className="w-10 h-10 rounded-2xl bg-[#ffdcc3] border border-[#ffcfad] shadow-xs group-hover:scale-105 group-hover:bg-[#ffcfad] transition-all flex items-center justify-center text-[#8d4b00]">
              <PawPrint className="w-6 h-6 text-[#8d4b00] fill-[#8d4b00]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-['Epilogue'] font-bold text-xl sm:text-2xl text-[#111c2d] tracking-tight">
                  Paw<span className="text-[#8d4b00]">Palace</span>
                </span>
                <span className="bg-[#ffdcc3] text-[#8d4b00] text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider">
                  Verified
                </span>
              </div>
              <p className="text-[11px] text-[#554336] font-medium hidden sm:block">
                Ethical Dogs, Puppies & Canine Necessities
              </p>
            </div>
          </button>

          {/* Search Bar - Center */}
          <form 
            id="header-search-form"
            onSubmit={handleSearchSubmit} 
            className="hidden lg:flex items-center flex-1 max-w-2xl bg-[#f0f3ff] rounded-full p-1 border border-[#dee8ff] hover:border-[#dbc2b0] focus-within:border-[#8d4b00] focus-within:ring-2 focus-within:ring-[#ffdcc3] transition-all"
          >
            {/* Category select */}
            <div className="relative border-r border-[#dee8ff] pr-1">
              <select
                id="header-category-select"
                value={searchCategory}
                onChange={(e) => setSearchCategory(e.target.value)}
                className="appearance-none bg-transparent pl-3 pr-7 py-2 text-xs font-semibold text-[#111c2d] cursor-pointer focus:outline-none"
              >
                <option value="all">{t.allCatalog}</option>
                <option value="dogs">{t.dogsPuppies}</option>
                <option value="gear">{t.petGear}</option>
                <option value="vets">{t.navVetFinder || 'Vet Finder'}</option>
                <option value="grooming">{t.navGrooming || 'Dog Grooming'}</option>
                <option value="rescues">{t.rescueShelters}</option>
              </select>
              <span className="material-symbols-outlined absolute right-2 top-2.5 text-base text-[#887364] pointer-events-none">
                expand_more
              </span>
            </div>

            {/* Keyword Input */}
            <div className="relative flex-1 flex items-center pl-3">
              <span className="material-symbols-outlined text-lg text-[#887364] mr-2">
                search
              </span>
              <input
                id="header-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t.searchPlaceholder}
                className="w-full bg-transparent text-xs text-[#111c2d] placeholder-[#887364] focus:outline-none"
              />
            </div>

            {/* Zip code input */}
            <div className="flex items-center border-l border-[#dee8ff] px-2.5 py-1">
              <button
                type="button"
                onClick={handleAskLocationAccess}
                title="Ask access for location (GPS)"
                className="p-1 hover:bg-[#ffdcc3] text-[#8d4b00] rounded-full transition-colors cursor-pointer mr-1 flex items-center justify-center shrink-0"
              >
                <span className={`material-symbols-outlined text-base ${isLocating ? 'animate-spin' : ''}`}>
                  {isLocating ? 'sync' : 'near_me'}
                </span>
              </button>
              <input
                id="header-zip-input"
                type="text"
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value)}
                placeholder={t.zipPlaceholder}
                className="w-20 bg-transparent text-xs text-[#111c2d] placeholder-[#887364] focus:outline-none"
              />
            </div>

            {/* Search Submit button */}
            <button
              id="header-search-submit-btn"
              type="submit"
              className="bg-[#8d4b00] hover:bg-[#b15f00] text-white px-4 py-2 rounded-full text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <span>{t.exploreBtn}</span>
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
          </form>

          {/* Right Action Icons & Profile */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Post Listing / Become Breeder Button */}
            <button
              id="header-post-listing-btn"
              onClick={onOpenPostListing}
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-[#8d4b00] bg-[#ffdcc3] hover:bg-[#ffb77d] px-3.5 py-2 rounded-full transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm">add_circle</span>
              <span>{t.postListing}</span>
            </button>

            {/* Wishlist Button */}
            <button
              id="header-wishlist-btn"
              onClick={onOpenWishlist}
              className="relative p-2 text-[#554336] hover:text-[#8d4b00] hover:bg-[#f0f3ff] rounded-full transition-colors cursor-pointer"
              title={t.savedFavorites}
            >
              <span className="material-symbols-outlined text-xl">favorite</span>
              {wishlistCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-[#8d4b00] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Cart Button */}
            <button
              id="header-cart-btn"
              onClick={onOpenCart}
              className="relative p-2 text-[#554336] hover:text-[#8d4b00] hover:bg-[#f0f3ff] rounded-full transition-colors cursor-pointer"
              title={t.shoppingBag}
            >
              <span className="material-symbols-outlined text-xl">shopping_bag</span>
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-[#006c4a] text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Theme Toggle Button in Navbar */}
            <button
              id="navbar-theme-toggle-btn"
              type="button"
              onClick={() => setTheme(isDark ? 'light' : 'dark')}
              className="p-2 text-[#554336] hover:text-[#8d4b00] hover:bg-[#f0f3ff] rounded-full transition-colors cursor-pointer"
              title={t.toggleThemeTooltip}
            >
              <span className="material-symbols-outlined text-xl">
                {isDark ? 'light_mode' : 'dark_mode'}
              </span>
            </button>

            {/* Settings Modal Button in Navbar */}
            <button
              id="navbar-settings-modal-btn"
              type="button"
              onClick={onOpenSettings}
              className="p-2 text-[#554336] hover:text-[#8d4b00] hover:bg-[#f0f3ff] rounded-full transition-colors cursor-pointer"
              title={t.openSettingsTooltip}
            >
              <span className="material-symbols-outlined text-xl">settings</span>
            </button>

            {/* User Profile Avatar with dropdown or Login button */}
            {user.isLoggedIn ? (
              <div className="relative">
                <button
                  id="header-user-menu-btn"
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 p-1 pr-2.5 rounded-full hover:bg-[#f0f3ff] transition-all cursor-pointer border border-[#dee8ff]"
                  title="Account Menu"
                >
                  <img
                    src={user.avatarUrl}
                    alt={user.name}
                    className="w-8 h-8 rounded-full object-cover border border-[#ffdcc3]"
                    referrerPolicy="no-referrer"
                  />
                  <span className="hidden xl:inline text-xs font-bold text-[#111c2d] max-w-[110px] truncate">
                    {user.name.split(' ')[0]}
                  </span>
                  <span className="material-symbols-outlined text-xs text-[#887364]">
                    expand_more
                  </span>
                </button>

                {profileOpen && (
                  <div 
                    id="profile-dropdown-menu"
                    className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-[#e7eeff] p-2 text-xs z-50 animate-in fade-in slide-in-from-top-2"
                  >
                    <div className="p-3 border-b border-[#f0f3ff] flex items-center gap-3">
                      <div 
                        className="relative group cursor-pointer"
                        onClick={() => { onOpenEditProfile(); setProfileOpen(false); }}
                        title="Click to choose a photo from your device"
                      >
                        <img
                          src={user.avatarUrl}
                          alt={user.name}
                          className="w-11 h-11 rounded-full object-cover border-2 border-[#ffdcc3] shadow-xs"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                          <span className="material-symbols-outlined text-xs">photo_camera</span>
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-[#111c2d] truncate">{user.name}</p>
                        <p className="text-[11px] text-[#887364] truncate">{user.location} • {user.role}</p>
                        <button
                          type="button"
                          onClick={() => { onOpenEditProfile(); setProfileOpen(false); }}
                          className="text-[10px] font-bold text-[#8d4b00] hover:underline flex items-center gap-0.5 mt-0.5 cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-xs">photo_library</span>
                          <span>Upload from your photos</span>
                        </button>
                      </div>
                    </div>

                    <div className="py-1.5 space-y-0.5">
                      <button 
                        id="edit-profile-menu-btn"
                        onClick={() => { onOpenEditProfile(); setProfileOpen(false); }}
                        className="w-full text-left px-3 py-2 bg-[#ffdcc3]/30 hover:bg-[#ffdcc3]/60 rounded-xl text-[#8d4b00] font-bold flex items-center gap-2 cursor-pointer transition-colors"
                      >
                        <span className="material-symbols-outlined text-base">photo_camera</span>
                        <span>Change Photo & Profile Details</span>
                      </button>
                      <button 
                        onClick={() => { setCurrentScreen('find-dogs'); setProfileOpen(false); }}
                        className="w-full text-left px-3 py-2 hover:bg-[#f0f3ff] rounded-xl text-[#554336] flex items-center gap-2 cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-base">pets</span>
                        <span>My Inquiries & Applications</span>
                      </button>
                      <button 
                        onClick={() => { onOpenCart(); setProfileOpen(false); }}
                        className="w-full text-left px-3 py-2 hover:bg-[#f0f3ff] rounded-xl text-[#554336] flex items-center gap-2 cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-base">local_shipping</span>
                        <span>Orders & Escrow Status</span>
                      </button>
                      <button 
                        onClick={() => { setCurrentScreen('health-safety'); setProfileOpen(false); }}
                        className="w-full text-left px-3 py-2 hover:bg-[#f0f3ff] rounded-xl text-[#554336] flex items-center gap-2 cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-base">verified_user</span>
                        <span>DNA & Health Vault</span>
                      </button>
                      <button 
                        onClick={() => { setCurrentScreen('vet-finder'); setProfileOpen(false); }}
                        className="w-full text-left px-3 py-2 hover:bg-rose-50 text-rose-800 rounded-xl flex items-center gap-2 cursor-pointer font-semibold"
                      >
                        <span className="material-symbols-outlined text-base text-rose-600">local_hospital</span>
                        <span>Find Certified Vets & 24/7 ER</span>
                      </button>
                      <button 
                        onClick={() => { setCurrentScreen('grooming-finder'); setProfileOpen(false); }}
                        className="w-full text-left px-3 py-2 hover:bg-emerald-50 text-emerald-800 rounded-xl flex items-center gap-2 cursor-pointer font-semibold"
                      >
                        <span className="material-symbols-outlined text-base text-emerald-600">content_cut</span>
                        <span>Find Dog Grooming & Spas</span>
                      </button>

                      {/* Settings & Appearance */}
                      <button 
                        id="profile-dropdown-settings-btn"
                        onClick={() => { onOpenSettings(); setProfileOpen(false); }}
                        className="w-full text-left px-3 py-2 hover:bg-[#f0f3ff] rounded-xl text-[#554336] flex items-center gap-2 cursor-pointer font-medium"
                      >
                        <span className="material-symbols-outlined text-base text-[#8d4b00]">settings</span>
                        <span>{t.settings} & {t.tabAppearance}</span>
                      </button>

                      <div className="border-t border-[#f0f3ff] my-1"></div>

                      <button 
                        id="dropdown-owner-portal-btn"
                        onClick={() => { setCurrentScreen('owner-portal'); setProfileOpen(false); }}
                        className="w-full text-left px-3 py-2 bg-[#ffdcc3]/30 hover:bg-[#ffdcc3]/70 rounded-xl text-[#8d4b00] flex items-center gap-2 cursor-pointer font-bold"
                      >
                        <span className="material-symbols-outlined text-base text-[#8d4b00]">shield_person</span>
                        <span>{t.ownerPortal}</span>
                      </button>
                    </div>

                    <div className="border-t border-[#f0f3ff] pt-1">
                      <button 
                        id="header-logout-btn"
                        onClick={() => { onLogout(); setProfileOpen(false); }}
                        className="w-full text-left px-3 py-2 text-[#a33900] hover:bg-[#ffdad6]/40 rounded-xl flex items-center gap-2 cursor-pointer font-medium"
                      >
                        <span className="material-symbols-outlined text-base">logout</span>
                        <span>{t.signOut}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                id="header-login-btn"
                onClick={onOpenLogin}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-[#8d4b00] hover:bg-[#b15f00] text-white rounded-full text-xs font-bold transition-all shadow-xs cursor-pointer whitespace-nowrap"
              >
                <span className="material-symbols-outlined text-base">person</span>
                <span>{t.logInSignUp}</span>
              </button>
            )}

            {/* Mobile Hamburger */}
            <button
              id="header-mobile-toggle-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-[#554336] hover:bg-[#f0f3ff] rounded-lg cursor-pointer"
            >
              <span className="material-symbols-outlined text-2xl">
                {mobileMenuOpen ? 'close' : 'menu'}
              </span>
            </button>
          </div>

        </div>

        {/* Mobile Search input */}
        <div className="mt-3 lg:hidden">
          <form onSubmit={handleSearchSubmit} className="flex items-center bg-[#f0f3ff] rounded-xl p-1 border border-[#dee8ff]">
            <span className="material-symbols-outlined text-lg text-[#887364] ml-2">search</span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search dogs, gear, breeders..."
              className="w-full px-2 py-1.5 text-xs bg-transparent focus:outline-none"
            />
            <button
              type="button"
              onClick={handleAskLocationAccess}
              title="Ask access for location (GPS)"
              className="p-1.5 text-[#8d4b00] hover:bg-[#ffdcc3] rounded-lg cursor-pointer mr-1 flex items-center justify-center shrink-0"
            >
              <span className={`material-symbols-outlined text-base ${isLocating ? 'animate-spin' : ''}`}>
                {isLocating ? 'sync' : 'near_me'}
              </span>
            </button>
            <button
              type="submit"
              className="bg-[#8d4b00] text-white px-3 py-1.5 rounded-lg text-xs font-bold"
            >
              Find
            </button>
          </form>
        </div>
      </div>

      {/* Sub-Navigation Bar */}
      <nav className="bg-[#f0f3ff]/80 border-t border-[#e7eeff] px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between overflow-x-auto no-scrollbar py-2">
          <div className="flex items-center gap-1 sm:gap-2">
            
            <button
              id="nav-tab-home"
              onClick={() => setCurrentScreen('home')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                currentScreen === 'home'
                  ? 'bg-[#8d4b00] text-white shadow-sm'
                  : 'text-[#554336] hover:bg-[#dee8ff]/70'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">home</span>
              <span>{t.navHome}</span>
            </button>

            <button
              id="nav-tab-find-dogs"
              onClick={() => setCurrentScreen('find-dogs')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                currentScreen === 'find-dogs'
                  ? 'bg-[#8d4b00] text-white shadow-sm'
                  : 'text-[#554336] hover:bg-[#dee8ff]/70'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">pets</span>
              <span>{t.navFindDogs}</span>
              <span className="bg-[#ffdcc3] text-[#8d4b00] text-[10px] px-1 rounded-full font-bold">
                10
              </span>
            </button>

            <button
              id="nav-tab-recommended"
              onClick={() => setCurrentScreen('recommended-dogs')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                currentScreen === 'recommended-dogs'
                  ? 'bg-[#8d4b00] text-white shadow-sm'
                  : 'text-[#554336] hover:bg-[#dee8ff]/70'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">auto_awesome</span>
              <span>{t.navRecommended}</span>
              <span className="bg-[#ffdcc3] text-[#8d4b00] text-[10px] px-1 rounded-full font-bold">
                Match
              </span>
            </button>

            <button
              id="nav-tab-gear"
              onClick={() => setCurrentScreen('dog-gear')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                currentScreen === 'dog-gear'
                  ? 'bg-[#8d4b00] text-white shadow-sm'
                  : 'text-[#554336] hover:bg-[#dee8ff]/70'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">health_and_safety</span>
              <span>{t.navDogGear}</span>
              <span className="bg-[#82f5c1] text-[#006c4a] text-[10px] px-1 rounded-full font-bold">
                Vet Vetted
              </span>
            </button>

            <button
              id="nav-tab-vet-finder"
              onClick={() => setCurrentScreen('vet-finder')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                currentScreen === 'vet-finder'
                  ? 'bg-[#8d4b00] text-white shadow-sm'
                  : 'text-[#554336] hover:bg-[#dee8ff]/70'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">local_hospital</span>
              <span>{t.navVetFinder || 'Vet Finder'}</span>
              <span className="bg-rose-100 text-rose-700 text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                24/7 ER
              </span>
            </button>

            <button
              id="nav-tab-grooming"
              onClick={() => setCurrentScreen('grooming-finder')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                currentScreen === 'grooming-finder'
                  ? 'bg-[#8d4b00] text-white shadow-sm'
                  : 'text-[#554336] hover:bg-[#dee8ff]/70'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">content_cut</span>
              <span>{t.navGrooming || 'Grooming'}</span>
              <span className="bg-amber-100 text-[#8d4b00] text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                Spas & Mobile
              </span>
            </button>

            <button
              id="nav-tab-breeders"
              onClick={() => setCurrentScreen('verified-breeders')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                currentScreen === 'verified-breeders'
                  ? 'bg-[#8d4b00] text-white shadow-sm'
                  : 'text-[#554336] hover:bg-[#dee8ff]/70'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">verified</span>
              <span>{t.navVerifiedBreeders}</span>
            </button>

            <button
              id="nav-tab-health-safety"
              onClick={() => setCurrentScreen('health-safety')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                currentScreen === 'health-safety'
                  ? 'bg-[#8d4b00] text-white shadow-sm'
                  : 'text-[#554336] hover:bg-[#dee8ff]/70'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">shield_with_heart</span>
              <span>{t.navPledge}</span>
            </button>
          </div>

          <div className="hidden md:flex items-center gap-3 text-xs text-[#554336]">
            <span className="flex items-center gap-1 text-[#006c4a] font-semibold">
              <span className="w-2 h-2 rounded-full bg-[#006c4a] inline-block animate-ping"></span>
              {t.escrowActive}
            </span>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-[#dee8ff] py-3 space-y-1">
            <button
              onClick={() => { setCurrentScreen('home'); setMobileMenuOpen(false); }}
              className="w-full text-left px-3 py-2 text-xs font-bold text-[#111c2d] hover:bg-[#e7eeff] rounded-lg"
            >
              {t.navHome}
            </button>
            <button
              onClick={() => { setCurrentScreen('find-dogs'); setMobileMenuOpen(false); }}
              className="w-full text-left px-3 py-2 text-xs font-bold text-[#111c2d] hover:bg-[#e7eeff] rounded-lg"
            >
              {t.navFindDogs}
            </button>
            <button
              onClick={() => { setCurrentScreen('recommended-dogs'); setMobileMenuOpen(false); }}
              className="w-full text-left px-3 py-2 text-xs font-bold text-[#8d4b00] bg-[#ffdcc3]/30 hover:bg-[#ffdcc3]/60 rounded-lg flex items-center justify-between"
            >
              <span className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-sm">auto_awesome</span>
                <span>{t.navRecommended}</span>
              </span>
              <span className="text-[10px] bg-[#8d4b00] text-white px-2 py-0.5 rounded-full font-bold">Match</span>
            </button>
            <button
              onClick={() => { setCurrentScreen('dog-gear'); setMobileMenuOpen(false); }}
              className="w-full text-left px-3 py-2 text-xs font-bold text-[#111c2d] hover:bg-[#e7eeff] rounded-lg"
            >
              {t.navDogGear}
            </button>
            <button
              onClick={() => { setCurrentScreen('vet-finder'); setMobileMenuOpen(false); }}
              className="w-full text-left px-3 py-2 text-xs font-bold text-rose-800 bg-rose-50 hover:bg-rose-100 rounded-lg flex items-center justify-between"
            >
              <span className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-sm text-rose-600">local_hospital</span>
                <span>{t.navVetFinder || 'Vet Finder'}</span>
              </span>
              <span className="text-[10px] bg-rose-200 text-rose-800 px-1.5 py-0.5 rounded-full font-bold">24/7 ER</span>
            </button>
            <button
              onClick={() => { setCurrentScreen('grooming-finder'); setMobileMenuOpen(false); }}
              className="w-full text-left px-3 py-2 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-lg flex items-center justify-between"
            >
              <span className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-sm text-emerald-600">content_cut</span>
                <span>{t.navGrooming || 'Dog Grooming'}</span>
              </span>
              <span className="text-[10px] bg-emerald-200 text-emerald-800 px-1.5 py-0.5 rounded-full font-bold">Spas & Vans</span>
            </button>
            <button
              onClick={() => { setCurrentScreen('verified-breeders'); setMobileMenuOpen(false); }}
              className="w-full text-left px-3 py-2 text-xs font-bold text-[#111c2d] hover:bg-[#e7eeff] rounded-lg"
            >
              {t.navVerifiedBreeders}
            </button>
            <button
              onClick={() => { setCurrentScreen('health-safety'); setMobileMenuOpen(false); }}
              className="w-full text-left px-3 py-2 text-xs font-bold text-[#111c2d] hover:bg-[#e7eeff] rounded-lg"
            >
              {t.navPledge}
            </button>
            <button
              id="mobile-owner-portal-btn"
              onClick={() => { setCurrentScreen('owner-portal'); setMobileMenuOpen(false); }}
              className="w-full text-left px-3 py-2 text-xs font-bold text-[#8d4b00] bg-[#ffdcc3]/40 hover:bg-[#ffdcc3]/70 rounded-lg flex items-center justify-between"
            >
              <span className="flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">shield_person</span>
                <span>{t.ownerPortal}</span>
              </span>
              <span className="text-[10px] uppercase font-bold bg-[#8d4b00] text-white px-1.5 py-0.5 rounded">Owner</span>
            </button>

            {/* Mobile Settings button */}
            <button
              id="mobile-settings-btn"
              onClick={() => { onOpenSettings(); setMobileMenuOpen(false); }}
              className="w-full text-left px-3 py-2 text-xs font-bold text-[#111c2d] bg-[#f0f3ff] hover:bg-[#dee8ff] rounded-lg flex items-center justify-between cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <span className="material-symbols-outlined text-sm text-[#8d4b00]">settings</span>
                <span>{t.settings} & {t.tabAppearance}</span>
              </span>
              <span className="text-[10px] text-[#887364] flex items-center gap-1">
                <span>{currentLangObj.flag}</span>
                <span>{isDark ? '🌙 Dark' : '☀️ Light'}</span>
              </span>
            </button>

            {/* User status in mobile menu */}
            <div className="pt-2 border-t border-[#dee8ff]">
              {user.isLoggedIn ? (
                <div className="bg-[#f0f3ff] p-3 rounded-2xl space-y-2">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={user.avatarUrl}
                      alt={user.name}
                      className="w-9 h-9 rounded-full object-cover border border-[#ffdcc3]"
                      referrerPolicy="no-referrer"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-[#111c2d] truncate">{user.name}</p>
                      <p className="text-[10px] text-[#887364] truncate">{user.location}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => { onOpenEditProfile(); setMobileMenuOpen(false); }}
                    className="w-full text-center py-2 bg-white hover:bg-[#ffdcc3]/30 text-[#8d4b00] rounded-xl text-xs font-bold border border-[#ffdcc3] flex items-center justify-center gap-1.5"
                  >
                    <span className="material-symbols-outlined text-sm">photo_camera</span>
                    <span>Change Photo & Profile</span>
                  </button>
                  <button
                    onClick={() => { onLogout(); setMobileMenuOpen(false); }}
                    className="w-full text-center py-1.5 text-[#a33900] text-xs font-semibold hover:underline"
                  >
                    {t.signOut}
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => { onOpenLogin(); setMobileMenuOpen(false); }}
                  className="w-full bg-[#8d4b00] text-white py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-sm">person</span>
                  <span>{t.logInSignUp}</span>
                </button>
              )}
            </div>

            <div className="pt-1">
              <button
                onClick={() => { onOpenPostListing(); setMobileMenuOpen(false); }}
                className="w-full bg-[#111c2d] text-white py-2 rounded-xl text-xs font-bold"
              >
                + {t.postListing}
              </button>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};
