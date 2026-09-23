import React, { useState, useMemo } from 'react';
import { Dog, GearProduct, Screen } from '../types';
import { DogIndividualPriceChart } from './DogIndividualPriceChart';
import { DogRaisingTipsCard } from './DogRaisingTipsCard';
import { TopDogRaisingTipsTicker } from './TopDogRaisingTipsTicker';
import { DailyWellnessTipTicker } from './DailyWellnessTipTicker';
import { RejectedListingsModal } from './RejectedListingsModal';
import { useSettings } from '../context/SettingsContext';

interface HomeScreenProps {
  dogs: Dog[];
  allDogs?: Dog[];
  gear: GearProduct[];
  onSelectDog: (dog: Dog) => void;
  onOpenChat: (dog: Dog) => void;
  onAddToCart: (product: GearProduct) => void;
  onToggleDogFavorite: (id: string) => void;
  onToggleGearFavorite: (id: string) => void;
  favoritedDogIds: string[];
  favoritedGearIds: string[];
  setCurrentScreen: (screen: Screen) => void;
  onShowToast?: (msg: string) => void;
  onRejectDog?: (id: string) => void;
  onRestoreDog?: (id: string) => void;
  onRestoreAllDogs?: () => void;
  rejectedDogIds?: string[];
}

export type HeroThemeColor = 'warm-honey' | 'forest-sage' | 'ocean-breeze' | 'berry-rose' | 'midnight-gold';

export interface HeroColorThemeConfig {
  id: HeroThemeColor;
  label: string;
  dotColor: string;
  containerBg: string;
  borderColor: string;
  shadowClass: string;
  badgeBg: string;
  badgeBorder: string;
  badgeText: string;
  accentText: string;
  tabActiveBg: string;
  buttonBg: string;
  buttonHoverBg: string;
  priceText: string;
}

export const HERO_COLOR_THEMES: Record<HeroThemeColor, HeroColorThemeConfig> = {
  'warm-honey': {
    id: 'warm-honey',
    label: 'Warm Honey & Amber',
    dotColor: 'bg-[#ea580c]',
    containerBg: 'bg-gradient-to-br from-[#fff7ed] via-[#fffbf7] to-[#ffedd5]/60 dark:from-[#1b2333] dark:via-[#141b29] dark:to-[#0f1724]',
    borderColor: 'border-[#fed7aa] dark:border-[#384c72]',
    shadowClass: 'shadow-[0_16px_50px_rgba(234,88,12,0.10)] dark:shadow-[0_16px_50px_rgba(0,0,0,0.45)]',
    badgeBg: 'bg-[#ffedd5] dark:bg-[#7c2d12]/30',
    badgeBorder: 'border-[#fed7aa] dark:border-[#9a3412]/50',
    badgeText: 'text-[#9a3412] dark:text-[#fed7aa]',
    accentText: 'text-[#c2410c] dark:text-[#fb923c]',
    tabActiveBg: 'bg-[#c2410c] text-white',
    buttonBg: 'bg-[#c2410c]',
    buttonHoverBg: 'hover:bg-[#9a3412]',
    priceText: 'text-[#9a3412] dark:text-[#fed7aa]'
  },
  'forest-sage': {
    id: 'forest-sage',
    label: 'Forest Pine & Sage',
    dotColor: 'bg-[#15803d]',
    containerBg: 'bg-gradient-to-br from-[#f0fdf4] via-[#f8fafc] to-[#dcfce7]/50 dark:from-[#0d2218] dark:via-[#091710] dark:to-[#050f0b]',
    borderColor: 'border-[#bbf7d0] dark:border-[#164e2f]',
    shadowClass: 'shadow-[0_16px_50px_rgba(22,163,74,0.10)] dark:shadow-[0_16px_50px_rgba(0,0,0,0.45)]',
    badgeBg: 'bg-[#dcfce7] dark:bg-[#064e3b]/30',
    badgeBorder: 'border-[#bbf7d0] dark:border-[#047857]/50',
    badgeText: 'text-[#166534] dark:text-[#86efac]',
    accentText: 'text-[#15803d] dark:text-[#4ade80]',
    tabActiveBg: 'bg-[#15803d] text-white',
    buttonBg: 'bg-[#15803d]',
    buttonHoverBg: 'hover:bg-[#166534]',
    priceText: 'text-[#166534] dark:text-[#86efac]'
  },
  'ocean-breeze': {
    id: 'ocean-breeze',
    label: 'Pacific Blue & Navy',
    dotColor: 'bg-[#1d4ed8]',
    containerBg: 'bg-gradient-to-br from-[#eff6ff] via-[#f8fafc] to-[#dbeafe]/50 dark:from-[#0f1f38] dark:via-[#0c1626] dark:to-[#080d17]',
    borderColor: 'border-[#bfdbfe] dark:border-[#1e3a66]',
    shadowClass: 'shadow-[0_16px_50px_rgba(29,78,216,0.10)] dark:shadow-[0_16px_50px_rgba(0,0,0,0.45)]',
    badgeBg: 'bg-[#dbeafe] dark:bg-[#1e3a8a]/30',
    badgeBorder: 'border-[#bfdbfe] dark:border-[#1d4ed8]/50',
    badgeText: 'text-[#1e40af] dark:text-[#93c5fd]',
    accentText: 'text-[#1d4ed8] dark:text-[#60a5fa]',
    tabActiveBg: 'bg-[#1d4ed8] text-white',
    buttonBg: 'bg-[#1d4ed8]',
    buttonHoverBg: 'hover:bg-[#1e40af]',
    priceText: 'text-[#1e40af] dark:text-[#93c5fd]'
  },
  'berry-rose': {
    id: 'berry-rose',
    label: 'Blush Rose & Berry',
    dotColor: 'bg-[#e11d48]',
    containerBg: 'bg-gradient-to-br from-[#fff1f2] via-[#fffbfb] to-[#ffe4e6]/50 dark:from-[#29101b] dark:via-[#1c0a12] dark:to-[#12060b]',
    borderColor: 'border-[#fecdd3] dark:border-[#4c1628]',
    shadowClass: 'shadow-[0_16px_50px_rgba(225,29,72,0.10)] dark:shadow-[0_16px_50px_rgba(0,0,0,0.45)]',
    badgeBg: 'bg-[#ffe4e6] dark:bg-[#831843]/30',
    badgeBorder: 'border-[#fecdd3] dark:border-[#9f1239]/50',
    badgeText: 'text-[#9f1239] dark:text-[#fda4af]',
    accentText: 'text-[#be123c] dark:text-[#fb7185]',
    tabActiveBg: 'bg-[#be123c] text-white',
    buttonBg: 'bg-[#be123c]',
    buttonHoverBg: 'hover:bg-[#9f1239]',
    priceText: 'text-[#9f1239] dark:text-[#fda4af]'
  },
  'midnight-gold': {
    id: 'midnight-gold',
    label: 'Midnight Velvet & Gold',
    dotColor: 'bg-[#eab308]',
    containerBg: 'bg-gradient-to-br from-[#18181b] via-[#232326] to-[#0f0f12] text-white dark:from-[#111317] dark:via-[#181a20] dark:to-[#0d0e11]',
    borderColor: 'border-[#eab308]/40 dark:border-[#eab308]/30',
    shadowClass: 'shadow-[0_16px_50px_rgba(234,179,8,0.14)]',
    badgeBg: 'bg-[#eab308]/20',
    badgeBorder: 'border-[#eab308]/40',
    badgeText: 'text-[#fef08a]',
    accentText: 'text-[#facc15]',
    tabActiveBg: 'bg-[#eab308] text-[#18181b] font-black',
    buttonBg: 'bg-[#eab308] text-[#18181b]',
    buttonHoverBg: 'hover:bg-[#ca8a04]',
    priceText: 'text-[#facc15]'
  }
};

export const HomeScreen: React.FC<HomeScreenProps> = ({
  dogs,
  allDogs = [],
  gear,
  onSelectDog,
  onOpenChat,
  onAddToCart,
  onToggleDogFavorite,
  onToggleGearFavorite,
  favoritedDogIds,
  favoritedGearIds,
  setCurrentScreen,
  onShowToast,
  onRejectDog,
  onRestoreDog,
  onRestoreAllDogs,
  rejectedDogIds = []
}) => {
  const { t, formatPrice } = useSettings();
  const [heroTab, setHeroTab] = useState<'dogs' | 'gear'>('dogs');
  const [selectedBreed, setSelectedBreed] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('any');
  const [selectedAge, setSelectedAge] = useState('all');
  const [isRejectedModalOpen, setIsRejectedModalOpen] = useState(false);
  const [activeTickerBanner, setActiveTickerBanner] = useState<'wellness' | 'raising'>('wellness');
  const [heroColorTheme, setHeroColorTheme] = useState<HeroThemeColor>(() => {
    const saved = localStorage.getItem('pawpalace_hero_color');
    if (saved && saved in HERO_COLOR_THEMES) {
      return saved as HeroThemeColor;
    }
    return 'warm-honey';
  });

  const handleHeroColorChange = (theme: HeroThemeColor) => {
    setHeroColorTheme(theme);
    localStorage.setItem('pawpalace_hero_color', theme);
    if (onShowToast) {
      onShowToast(`Hero palette set to ${HERO_COLOR_THEMES[theme].label}`);
    }
  };

  const currentHeroColor = HERO_COLOR_THEMES[heroColorTheme];

  // Deterministic daily Dog of the Day algorithm:
  // Strictly selects from approved, non-rejected companions using today's calendar date seed!
  // Any dog rejected by the user is NEVER shown as Dog of the Day.
  const dogOfTheDay = useMemo(() => {
    const eligibleDogs = dogs.filter((d) => {
      const isRejected =
        d.approvalStatus === 'rejected' ||
        d.photoApprovalStatus === 'rejected' ||
        d.nameApprovalStatus === 'rejected' ||
        rejectedDogIds.includes(d.id);
      return !isRejected;
    });

    if (eligibleDogs.length === 0) return null;

    // Daily deterministic seed using Year, Month, Date
    const today = new Date();
    const dateSeed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
    const index = dateSeed % eligibleDogs.length;
    return eligibleDogs[index] || eligibleDogs[0];
  }, [dogs, rejectedDogIds]);

  // List of all currently rejected dogs (for the review/restore modal)
  const rejectedDogsList = useMemo(() => {
    const combined = allDogs.length > 0 ? allDogs : dogs;
    return combined.filter(
      (d) =>
        rejectedDogIds.includes(d.id) ||
        d.approvalStatus === 'rejected' ||
        d.photoApprovalStatus === 'rejected' ||
        d.nameApprovalStatus === 'rejected'
    );
  }, [allDogs, dogs, rejectedDogIds]);

  // Filter out any rejected dogs from featured list
  const featuredDogs = useMemo(() => {
    return dogs
      .filter((d) => {
        const isRejected =
          d.approvalStatus === 'rejected' ||
          d.photoApprovalStatus === 'rejected' ||
          d.nameApprovalStatus === 'rejected' ||
          rejectedDogIds.includes(d.id);
        return !isRejected;
      })
      .slice(0, 4);
  }, [dogs, rejectedDogIds]);

  const featuredGear = gear.slice(0, 4);

  // Formatted date string for today's spotlight
  const todayFormatted = useMemo(() => {
    return new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }, []);

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (heroTab === 'dogs') {
      setCurrentScreen('find-dogs');
    } else {
      setCurrentScreen('dog-gear');
    }
  };

  return (
    <div className="space-y-16 pb-16">
      
      {/* Dynamic Banner Section: Daily Wellness Tip & Puppy Raising Guides */}
      <div className="w-full">
        {/* Banner Switcher Controls */}
        <div className="w-full bg-[#080d17] border-b border-[#1b2a40] px-4 py-1.5 flex items-center justify-between text-xs">
          <div className="max-w-7xl mx-auto w-full flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 bg-white/5 p-1 rounded-xl border border-white/10">
              <button
                type="button"
                onClick={() => setActiveTickerBanner('wellness')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeTickerBanner === 'wellness'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-[#9bb0d3] hover:text-white'
                }`}
              >
                <span className="material-symbols-outlined text-sm">health_and_safety</span>
                <span>Daily Wellness Tip</span>
                <span className="text-[10px] bg-emerald-400/20 text-emerald-300 px-1.5 py-0.2 rounded-full font-bold">Featured</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTickerBanner('raising')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeTickerBanner === 'raising'
                    ? 'bg-[#8d4b00] text-white shadow-xs'
                    : 'text-[#9bb0d3] hover:text-white'
                }`}
              >
                <span className="material-symbols-outlined text-sm">school</span>
                <span>Puppy Raising Handbook</span>
              </button>
            </div>

            <div className="hidden md:flex items-center gap-3 text-[11px] text-[#7890b5]">
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                <span>Peer-Reviewed by Board-Certified DVMs</span>
              </span>
              <span>•</span>
              <span className="text-[#a0b5d8]">10-Year Genetic Health Warranty Protected</span>
            </div>
          </div>
        </div>

        {/* Active Ticker Banner */}
        {activeTickerBanner === 'wellness' ? (
          <DailyWellnessTipTicker
            onShowToast={onShowToast}
            onNavigateScreen={setCurrentScreen}
          />
        ) : (
          <TopDogRaisingTipsTicker onShowToast={onShowToast} />
        )}
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#e7eeff]/60 via-[#f0f3ff]/40 to-transparent pt-12 pb-16 px-4 sm:px-6 lg:px-8 border-b border-[#dee8ff]">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#ffdcc3]/30 rounded-full blur-3xl pointer-events-none -z-10"></div>
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-[#82f5c1]/20 rounded-full blur-3xl pointer-events-none -z-10"></div>

        <div className="max-w-7xl mx-auto">
          <div 
            id="hero-showcase-container"
            className={`grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center rounded-3xl p-6 sm:p-8 lg:p-10 border-2 transition-all duration-300 relative ${currentHeroColor.containerBg} ${currentHeroColor.borderColor} ${currentHeroColor.shadowClass}`}
          >
            {/* Color Palette Switcher for Selected Hero Showcase Container */}
            <div className="lg:col-span-12 flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-black/5 dark:border-white/10 -mt-1">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-lg text-[#8d4b00] dark:text-[#ffdcc3]">palette</span>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#554336] dark:text-slate-300">
                  {t.heroShowcaseColor}
                </span>
                <span className="text-[11px] font-semibold text-[#111c2d] dark:text-white">
                  {currentHeroColor.label}
                </span>
              </div>

              <div className="flex items-center gap-1.5 bg-white/90 dark:bg-black/50 backdrop-blur-xs px-2 py-1 rounded-full border border-black/5 dark:border-white/10 shadow-xs">
                {(Object.keys(HERO_COLOR_THEMES) as HeroThemeColor[]).map((themeKey) => {
                  const opt = HERO_COLOR_THEMES[themeKey];
                  const isActive = heroColorTheme === themeKey;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => handleHeroColorChange(opt.id)}
                      className={`w-6 h-6 rounded-full flex items-center justify-center transition-all cursor-pointer ${opt.dotColor} ${
                        isActive
                          ? 'ring-2 ring-offset-2 ring-offset-white dark:ring-offset-slate-900 scale-110 shadow-sm'
                          : 'opacity-60 hover:opacity-100 hover:scale-105'
                      }`}
                      title={`Switch showcase color to ${opt.label}`}
                      aria-label={`Switch showcase color to ${opt.label}`}
                    >
                      {isActive && (
                        <span className="material-symbols-outlined text-[13px] text-white">check</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
            
            {/* Left Column: Headline & Search Widget */}
            <div className="lg:col-span-7 space-y-6">
              
              <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold border transition-colors ${currentHeroColor.badgeBg} ${currentHeroColor.badgeBorder} ${currentHeroColor.badgeText}`}>
                <span className="material-symbols-outlined text-[16px]">verified</span>
                <span>{t.heroNetworkBadge}</span>
              </div>

              <h1 className="font-['Epilogue'] font-bold text-4xl sm:text-5xl lg:text-6xl text-[#111c2d] dark:text-white leading-[1.1] tracking-tight">
                {t.heroTitle1} <span className={`transition-colors ${currentHeroColor.accentText}`}>{t.heroTitle2}</span> {t.heroTitle3}
              </h1>

              <p className="text-base sm:text-lg text-[#554336] dark:text-slate-300 leading-relaxed max-w-2xl">
                {t.heroDesc}
              </p>

              {/* Dual-Tab Search Widget */}
              <div className="bg-white/95 dark:bg-[#151f32]/95 backdrop-blur-xs rounded-3xl p-5 sm:p-6 shadow-xl border border-[#dee8ff] dark:border-[#2b3c58] max-w-2xl">
                {/* Tabs */}
                <div className="flex items-center gap-2 mb-4 border-b border-[#e7eeff] dark:border-white/10 pb-3">
                  <button
                    onClick={() => setHeroTab('dogs')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                      heroTab === 'dogs'
                        ? `${currentHeroColor.tabActiveBg} shadow-xs`
                        : 'text-[#554336] dark:text-slate-300 hover:bg-[#f0f3ff] dark:hover:bg-white/5'
                    }`}
                  >
                    <span className="material-symbols-outlined text-base">pets</span>
                    <span>{t.heroFindDogTab}</span>
                  </button>
                  <button
                    onClick={() => setHeroTab('gear')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                      heroTab === 'gear'
                        ? `${currentHeroColor.tabActiveBg} shadow-xs`
                        : 'text-[#554336] dark:text-slate-300 hover:bg-[#f0f3ff] dark:hover:bg-white/5'
                    }`}
                  >
                    <span className="material-symbols-outlined text-base">fitness_center</span>
                    <span>{t.heroShopGearTab}</span>
                  </button>
                </div>

                {/* Form Inputs */}
                <form onSubmit={handleHeroSearch} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {heroTab === 'dogs' ? (
                    <>
                      <div>
                        <label className="block text-[11px] font-bold text-[#887364] uppercase tracking-wider mb-1">
                          {t.heroBreedLabel}
                        </label>
                        <select
                          value={selectedBreed}
                          onChange={(e) => setSelectedBreed(e.target.value)}
                          className="w-full bg-[#f0f3ff] border border-[#dee8ff] rounded-xl px-3 py-2 text-xs font-semibold text-[#111c2d] focus:outline-none focus:border-[#8d4b00]"
                        >
                          <option value="all">{t.heroAllBreeds}</option>
                          <option value="golden">Golden Retriever</option>
                          <option value="corgi">Pembroke Welsh Corgi</option>
                          <option value="frenchie">French Bulldog</option>
                          <option value="aussie">Australian Shepherd</option>
                          <option value="doodle">Bernedoodle</option>
                          <option value="rescue">Shelter Rescues</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-[#887364] uppercase tracking-wider mb-1">
                          {t.heroRadiusLabel}
                        </label>
                        <select
                          value={selectedLocation}
                          onChange={(e) => setSelectedLocation(e.target.value)}
                          className="w-full bg-[#f0f3ff] border border-[#dee8ff] rounded-xl px-3 py-2 text-xs font-semibold text-[#111c2d] focus:outline-none focus:border-[#8d4b00]"
                        >
                          <option value="any">{t.heroNationwide}</option>
                          <option value="50">{t.heroWithin50}</option>
                          <option value="150">{t.heroWithin150}</option>
                          <option value="300">{t.heroWithin300}</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-[#887364] uppercase tracking-wider mb-1">
                          {t.heroLifeStageLabel}
                        </label>
                        <select
                          value={selectedAge}
                          onChange={(e) => setSelectedAge(e.target.value)}
                          className="w-full bg-[#f0f3ff] border border-[#dee8ff] rounded-xl px-3 py-2 text-xs font-semibold text-[#111c2d] focus:outline-none focus:border-[#8d4b00]"
                        >
                          <option value="all">{t.heroAllAges}</option>
                          <option value="puppy">{t.heroPuppyStage}</option>
                          <option value="young">{t.heroYoungStage}</option>
                          <option value="adult">{t.heroAdultStage}</option>
                        </select>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="sm:col-span-2">
                        <label className="block text-[11px] font-bold text-[#887364] uppercase tracking-wider mb-1">
                          {t.heroEquipLabel}
                        </label>
                        <select
                          className="w-full bg-[#f0f3ff] border border-[#dee8ff] rounded-xl px-3 py-2 text-xs font-semibold text-[#111c2d] focus:outline-none focus:border-[#8d4b00]"
                        >
                          <option value="all">{t.heroAllGear}</option>
                          <option value="beds">Orthopedic Memory Foam Beds</option>
                          <option value="harnesses">Tactical No-Pull Harnesses</option>
                          <option value="crates">IATA Airline Approved Crates</option>
                          <option value="collars">GPS Real-Time Collars</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-[#887364] uppercase tracking-wider mb-1">
                          Canine Weight
                        </label>
                        <select
                          className="w-full bg-[#f0f3ff] border border-[#dee8ff] rounded-xl px-3 py-2 text-xs font-semibold text-[#111c2d] focus:outline-none focus:border-[#8d4b00]"
                        >
                          <option value="all">All Sizes</option>
                          <option value="small">Small (under 25 lbs)</option>
                          <option value="medium">Medium (25-55 lbs)</option>
                          <option value="large">Large (55-85 lbs)</option>
                        </select>
                      </div>
                    </>
                  )}

                  <div className="sm:col-span-3 pt-2">
                    <button
                      type="submit"
                      className={`w-full text-white py-3 rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md hover:shadow-lg ${currentHeroColor.buttonBg} ${currentHeroColor.buttonHoverBg}`}
                    >
                      <span className="material-symbols-outlined text-base">search</span>
                      <span>
                        {heroTab === 'dogs' ? t.heroSearchBtn : t.gearTitle}
                      </span>
                    </button>
                  </div>
                </form>

                <div className="mt-3.5 text-center">
                  <button
                    id="hero-go-to-recommended-btn"
                    type="button"
                    onClick={() => setCurrentScreen('recommended-dogs')}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#8d4b00] dark:text-[#ffdcc3] hover:underline cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-sm">auto_awesome</span>
                    <span>Not sure which companion fits your lifestyle? Get personalized canine recommendations &rarr;</span>
                  </button>
                </div>
              </div>

            </div>

            {/* Right Column: Dog of the Day Showcase */}
            <div className="lg:col-span-5 relative">
              {dogOfTheDay ? (
                <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white aspect-[4/5] group bg-[#111c2d]">
                  <img
                    src={dogOfTheDay.image}
                    alt={dogOfTheDay.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/20"></div>

                  {/* Floating Certification Badge */}
                  <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md rounded-2xl p-2.5 sm:p-3 shadow-lg border border-[#e7eeff] max-w-[210px] sm:max-w-xs z-10">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#006c4a] animate-pulse"></span>
                      <span className="font-bold text-xs text-[#111c2d]">Daily Vetted Pick</span>
                    </div>
                    <p className="text-[11px] text-[#554336] mt-0.5">
                      100% Home Raised • OFA clearances verified.
                    </p>
                  </div>

                  {/* Top Right Badges & Rejection Action */}
                  <div className="absolute top-4 right-4 flex flex-col items-end gap-2 z-10">
                    {/* Official Dog of the Day Badge */}
                    <div className="bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 text-white text-[11px] font-black uppercase tracking-wider px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5 border border-amber-300/40">
                      <span className="material-symbols-outlined text-sm text-amber-200">award_star</span>
                      <span>{t.dogOfTheDayTitle}</span>
                    </div>

                    {/* Date Tag */}
                    <div className="bg-black/60 backdrop-blur-md text-amber-200 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-amber-400/20">
                      {todayFormatted}
                    </div>

                    {/* Reject / Hide Listing Button for Dog of the Day */}
                    {onRejectDog && (
                      <button
                        onClick={() => {
                          onRejectDog(dogOfTheDay.id);
                          onShowToast?.(`"${dogOfTheDay.name}" rejected. Swapping to next Dog of the Day.`);
                        }}
                        title={`Reject ${dogOfTheDay.name} (Never show this dog again)`}
                        className="mt-1 bg-black/60 hover:bg-red-600/90 text-white/90 hover:text-white px-2.5 py-1 rounded-xl text-[10px] font-bold backdrop-blur-md transition-all flex items-center gap-1 cursor-pointer border border-white/20 shadow-sm group/rejbtn"
                      >
                        <span className="material-symbols-outlined text-xs group-hover/rejbtn:rotate-12 transition-transform">
                          visibility_off
                        </span>
                        <span>{t.rejectHideBtn}</span>
                      </button>
                    )}
                  </div>

                  {/* Bottom Highlight Card for Dog of the Day */}
                  <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md rounded-2xl p-4 sm:p-5 shadow-xl border border-[#e7eeff] z-10">
                    <div className="flex flex-col gap-3">
                      <div>
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <h3 className="font-['Epilogue'] font-bold text-lg text-[#111c2d]">
                              {dogOfTheDay.name}
                            </h3>
                            <span className="bg-[#ffdcc3] text-[#8d4b00] text-[10px] font-bold px-2 py-0.5 rounded-full">
                              {dogOfTheDay.breed}
                            </span>
                            <span className="bg-[#82f5c1]/30 text-[#006c4a] text-[10px] font-bold px-1.5 py-0.5 rounded border border-[#82f5c1]">
                              {t.dogOfTheDayBadge}
                            </span>
                          </div>
                          <span className="font-['Epilogue'] font-bold text-base text-[#8d4b00]">
                            {formatPrice(dogOfTheDay.price)}
                          </span>
                        </div>
                        <p className="text-xs text-[#554336] mt-0.5">
                          {dogOfTheDay.breederName} • {dogOfTheDay.location} • {dogOfTheDay.ageText} • {dogOfTheDay.gender}
                        </p>
                        <p className="text-[11px] text-[#006c4a] font-medium mt-1.5 flex items-center gap-1">
                          <span className="material-symbols-outlined text-xs">verified</span>
                          <span>Chosen today for exceptional temperament & full orthopedic clearances.</span>
                        </p>
                      </div>

                      <div className="flex items-center gap-2 pt-1 border-t border-[#e7eeff] dark:border-white/10">
                        <button
                          onClick={() => {
                            onSelectDog(dogOfTheDay);
                            setCurrentScreen('dog-detail');
                          }}
                          className={`flex-1 text-white py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-xs ${currentHeroColor.buttonBg} ${currentHeroColor.buttonHoverBg}`}
                        >
                          <span>{t.viewProfileBtn} ({dogOfTheDay.name})</span>
                          <span className="material-symbols-outlined text-sm">arrow_forward</span>
                        </button>
                        <button
                          onClick={() => onOpenChat(dogOfTheDay)}
                          title="Ask Breeder a Question"
                          className="p-2.5 rounded-xl border border-[#dee8ff] hover:bg-[#f0f3ff] text-[#111c2d] transition-colors cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-base">chat</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                /* Empty state if user rejected all available listings */
                <div className="rounded-3xl p-8 bg-white border-2 border-dashed border-red-200 text-center space-y-4 aspect-[4/5] flex flex-col items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto">
                    <span className="material-symbols-outlined text-3xl">visibility_off</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-[#111c2d]">No Dog of the Day Available</h3>
                    <p className="text-xs text-[#554336] max-w-xs mx-auto mt-1">
                      All current dogs have been rejected or filtered. Restore rejected listings to view new daily companions.
                    </p>
                  </div>
                  {onRestoreAllDogs && (
                    <button
                      onClick={onRestoreAllDogs}
                      className="px-4 py-2 bg-[#8d4b00] hover:bg-[#b15f00] text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
                    >
                      Restore All Rejected Dogs
                    </button>
                  )}
                </div>
              )}
            </div>

          </div>
        </div>
      </section>

      {/* Verified Puppies & Dogs Section (Cards) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-[#8d4b00] uppercase tracking-wider mb-1">
              <span className="material-symbols-outlined text-base">pets</span>
              <span>Available Ethical Companions</span>
            </div>
            <h2 className="font-['Epilogue'] font-bold text-2xl sm:text-3xl text-[#111c2d]">
              Verified Puppies & Dogs Ready For Loving Homes
            </h2>
          </div>
          <div className="flex items-center gap-3">
            {rejectedDogIds && rejectedDogIds.length > 0 && (
              <button
                type="button"
                onClick={() => setIsRejectedModalOpen(true)}
                className="text-xs font-bold text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 px-3 py-1.5 rounded-full flex items-center gap-1.5 cursor-pointer transition-colors shadow-2xs"
                title="View listings you have rejected and hidden"
              >
                <span className="material-symbols-outlined text-sm">visibility_off</span>
                <span>{rejectedDogIds.length} Hidden / Rejected</span>
              </button>
            )}
            <button
              onClick={() => setCurrentScreen('find-dogs')}
              className="text-xs font-bold text-[#8d4b00] hover:text-[#b15f00] flex items-center gap-1 cursor-pointer"
            >
              <span>View All 240+ Verified Dogs</span>
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
          </div>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredDogs.map((dog) => {
            const isFavorited = favoritedDogIds.includes(dog.id);
            return (
              <div
                key={dog.id}
                className="bg-white rounded-3xl overflow-hidden border border-[#dee8ff] hover:border-[#dbc2b0] transition-all duration-300 shadow-xs hover:shadow-xl flex flex-col group"
              >
                {/* Image Container */}
                <div 
                  onClick={() => {
                    onSelectDog(dog);
                    setCurrentScreen('dog-detail');
                  }}
                  className="relative aspect-square overflow-hidden bg-[#f0f3ff] cursor-pointer"
                >
                  <img
                    src={dog.image}
                    alt={dog.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  
                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 flex flex-col gap-1 pointer-events-none">
                    <span className="bg-white/90 backdrop-blur-xs text-[#006c4a] text-[10px] font-bold px-2.5 py-1 rounded-full border border-[#82f5c1] flex items-center gap-1">
                      <span className="material-symbols-outlined text-xs">verified</span>
                      <span>{dog.verifiedStatus}</span>
                    </span>
                    {dog.isRescue && (
                      <span className="bg-[#a33900] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                        Accredited Rescue
                      </span>
                    )}
                  </div>

                  {/* Top Right Actions: Reject / Hide & Favorite */}
                  <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
                    {onRejectDog && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onRejectDog(dog.id);
                        }}
                        title={`Reject ${dog.name} (Hide listing from catalog)`}
                        className="w-8 h-8 rounded-full bg-white/90 hover:bg-red-50 text-[#887364] hover:text-red-600 backdrop-blur-xs flex items-center justify-center transition-colors cursor-pointer shadow-sm group/reject"
                      >
                        <span className="material-symbols-outlined text-base group-hover/reject:scale-110 transition-transform">
                          visibility_off
                        </span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleDogFavorite(dog.id);
                        onShowToast?.(isFavorited ? `Removed ${dog.name} from wishlist` : `Added ${dog.name} to wishlist!`);
                      }}
                      className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center text-[#887364] hover:text-[#ba1a1a] transition-colors cursor-pointer shadow-sm"
                      title={isFavorited ? 'Remove from wishlist' : 'Add to wishlist'}
                    >
                      <span className="material-symbols-outlined text-base">
                        {isFavorited ? 'favorite' : 'favorite_border'}
                      </span>
                    </button>
                  </div>

                  {/* Price Tag Overlay */}
                  <div className="absolute bottom-3 left-3 bg-[#111c2d]/85 backdrop-blur-xs text-white text-xs font-bold px-2.5 py-1 rounded-xl pointer-events-none">
                    {formatPrice(dog.price)}
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <div 
                      onClick={() => {
                        onSelectDog(dog);
                        setCurrentScreen('dog-detail');
                      }}
                      className="flex items-center justify-between gap-2 cursor-pointer"
                    >
                      <h3 className="font-bold text-base text-[#111c2d] group-hover:text-[#8d4b00] transition-colors">
                        {dog.name}
                      </h3>
                      <span className="text-[11px] font-medium text-[#887364]">
                        {dog.gender}
                      </span>
                    </div>

                    <p className="text-xs font-semibold text-[#554336] mt-0.5">
                      {dog.breed}
                    </p>

                    <div className="flex items-center gap-2 text-[11px] text-[#887364] mt-2">
                      <span className="flex items-center gap-0.5">
                        <span className="material-symbols-outlined text-sm">schedule</span>
                        <span>{dog.ageText}</span>
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-0.5">
                        <span className="material-symbols-outlined text-sm">location_on</span>
                        <span>{dog.location}</span>
                      </span>
                    </div>

                    {/* Individual Dog Price Line Chart */}
                    <DogIndividualPriceChart dog={dog} variant="card" />

                    {/* Breeder info */}
                    <div className="mt-3 pt-3 border-t border-[#f0f3ff] flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <div className="w-5 h-5 rounded-full bg-[#ffdcc3] text-[#8d4b00] text-[9px] font-bold flex items-center justify-center">
                          {dog.breederInitials}
                        </div>
                        <span className="text-[11px] text-[#554336] truncate max-w-[120px]">
                          {dog.breederName}
                        </span>
                      </div>
                      <div className="flex items-center gap-0.5 text-[11px] font-bold text-[#8d4b00]">
                        <span className="material-symbols-outlined text-xs text-[#b15f00]">star</span>
                        <span>{dog.breederRating}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <button
                      onClick={() => {
                        onSelectDog(dog);
                        setCurrentScreen('dog-detail');
                      }}
                      className="w-full bg-[#f0f3ff] hover:bg-[#dee8ff] text-[#111c2d] py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer text-center"
                    >
                      {t.viewProfileBtn}
                    </button>
                    <button
                      onClick={() => onOpenChat(dog)}
                      className="w-full bg-[#8d4b00] hover:bg-[#b15f00] text-white py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1"
                    >
                      <span className="material-symbols-outlined text-sm">chat</span>
                      <span>{t.cardInquireBtn}</span>
                    </button>
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 7-Point Breeder Verification Standard Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-[#111c2d] via-[#1a2536] to-[#263143] text-white p-8 sm:p-12 relative overflow-hidden shadow-xl">
          <div className="relative z-10 max-w-2xl space-y-4">
            <span className="inline-block bg-[#82f5c1] text-[#006c4a] text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              Compliance Standard
            </span>
            <h2 className="font-['Epilogue'] font-bold text-2xl sm:text-3xl text-white">
              The PawPalace 7-Point Ethical Breeder Verification Pledge
            </h2>
            <p className="text-xs sm:text-sm text-[#dee8ff]/80 leading-relaxed">
              Every provider on PawPalace signs a binding code of welfare: No cages or outdoor pens, mandatory early neurological stimulation (ENS), full parental DNA clear panels, lifetime rehoming policy, and in-person random unannounced veterinary visits.
            </p>
            <div className="pt-2 flex flex-wrap gap-4">
              <button
                onClick={() => setCurrentScreen('health-safety')}
                className="bg-[#ffdcc3] hover:bg-[#ffb77d] text-[#8d4b00] px-5 py-2.5 rounded-full text-xs font-bold transition-colors cursor-pointer"
              >
                Read Full 7-Point Pledge
              </button>
              <button
                onClick={() => setCurrentScreen('verified-breeders')}
                className="border border-white/30 hover:border-white text-white px-5 py-2.5 rounded-full text-xs font-bold transition-colors cursor-pointer"
              >
                View Audited Breeder Directory
              </button>
            </div>
          </div>

          <div className="absolute -right-8 -bottom-8 opacity-10 text-white pointer-events-none">
            <span className="material-symbols-outlined text-[260px]">shield_with_heart</span>
          </div>
        </div>
      </section>

      {/* Dog Raising & Behavioral Care Masterclass */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <div className="flex items-center gap-2 text-xs font-bold text-[#8d4b00] uppercase tracking-wider mb-1">
            <span className="material-symbols-outlined text-base">school</span>
            <span>Canine Parenting & Veterinary Guidelines</span>
          </div>
          <h2 className="font-['Epilogue'] font-bold text-2xl sm:text-3xl text-[#111c2d]">
            Tips on How to Raise Dogs: Interactive Care Hub
          </h2>
          <p className="text-xs sm:text-sm text-[#554336] mt-1">
            Explore stage-by-stage routines, biological clocks, and behavioral habits vetted by certified preservation breeders.
          </p>
        </div>

        <DogRaisingTipsCard onShowToast={onShowToast} />
      </section>

      {/* Featured Vet Finder Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-br from-[#0c1527] via-[#13223d] to-[#1c355e] text-white p-8 sm:p-12 relative overflow-hidden shadow-2xl border border-white/10">
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-bold">
                <span className="material-symbols-outlined text-sm">local_hospital</span>
                <span>Canine Clinical Directory & 24/7 ER</span>
              </div>

              <h2 className="font-['Epilogue'] font-bold text-2xl sm:text-3xl lg:text-4xl text-white tracking-tight">
                Find Certified Vets & 24/7 Emergency Care
              </h2>

              <p className="text-xs sm:text-sm text-[#cbdcf8] leading-relaxed max-w-xl">
                Looking for trusted veterinary care? Access our verified network of board-certified DVMs, AAHA-accredited animal hospitals, Fear Free pediatric clinics, and 24/7 critical trauma centers. Book wellness checkups or reach emergency triage instantly.
              </p>

              {/* Quick Vet Highlights */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-start gap-2.5">
                  <span className="material-symbols-outlined text-rose-400 text-xl shrink-0 mt-0.5">emergency</span>
                  <div>
                    <h4 className="font-bold text-xs text-white">24/7 ER Trauma</h4>
                    <p className="text-[11px] text-[#9db7e2] mt-0.5">Zero-wait critical triage</p>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-start gap-2.5">
                  <span className="material-symbols-outlined text-emerald-400 text-xl shrink-0 mt-0.5">verified</span>
                  <div>
                    <h4 className="font-bold text-xs text-white">AAHA Accredited</h4>
                    <p className="text-[11px] text-[#9db7e2] mt-0.5">Gold-standard care</p>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-start gap-2.5">
                  <span className="material-symbols-outlined text-cyan-300 text-xl shrink-0 mt-0.5">sentiment_satisfied</span>
                  <div>
                    <h4 className="font-bold text-xs text-white">Fear Free Certified</h4>
                    <p className="text-[11px] text-[#9db7e2] mt-0.5">Gentle puppy handling</p>
                  </div>
                </div>
              </div>

              <div className="pt-3 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => setCurrentScreen('vet-finder')}
                  className="bg-rose-600 hover:bg-rose-500 text-white px-6 py-3 rounded-full text-xs font-bold transition-all shadow-lg hover:shadow-rose-600/30 flex items-center gap-2 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-base">search</span>
                  <span>Open Vet Finder Directory</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setCurrentScreen('vet-finder');
                    onShowToast?.('Opening 24/7 Emergency Veterinary Centers...');
                  }}
                  className="bg-white/10 hover:bg-white/20 text-white px-5 py-3 rounded-full text-xs font-bold transition-colors border border-white/20 flex items-center gap-2 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-base text-rose-400">emergency</span>
                  <span>Emergency 24/7 Hospitals</span>
                </button>
              </div>
            </div>

            {/* Right Side Visual Box */}
            <div className="lg:col-span-5 bg-white/5 rounded-3xl p-5 border border-white/15 backdrop-blur-xs space-y-3.5">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span className="text-xs font-bold text-emerald-300">Live Veterinary Network Active</span>
                </div>
                <span className="text-[11px] text-[#9db7e2]">6 Certified Clinics</span>
              </div>

              <div className="space-y-2 text-xs">
                <div 
                  onClick={() => setCurrentScreen('vet-finder')}
                  className="p-2.5 rounded-xl bg-white/10 hover:bg-white/15 transition-colors cursor-pointer flex items-center justify-between"
                >
                  <div>
                    <p className="font-bold text-white text-xs">Austin Veterinary Emergency & Specialty</p>
                    <p className="text-[11px] text-rose-300">24/7 Emergency • 2.4 miles • Open Now</p>
                  </div>
                  <span className="material-symbols-outlined text-sm text-[#cbdcf8]">arrow_forward</span>
                </div>

                <div 
                  onClick={() => setCurrentScreen('vet-finder')}
                  className="p-2.5 rounded-xl bg-white/10 hover:bg-white/15 transition-colors cursor-pointer flex items-center justify-between"
                >
                  <div>
                    <p className="font-bold text-white text-xs">Dallas Animal Emergency & Referral Center</p>
                    <p className="text-[11px] text-rose-300">24/7 Emergency • 3.8 miles • Open Now</p>
                  </div>
                  <span className="material-symbols-outlined text-sm text-[#cbdcf8]">arrow_forward</span>
                </div>

                <div 
                  onClick={() => setCurrentScreen('vet-finder')}
                  className="p-2.5 rounded-xl bg-white/10 hover:bg-white/15 transition-colors cursor-pointer flex items-center justify-between"
                >
                  <div>
                    <p className="font-bold text-white text-xs">Houston Canine Wellness & Surgery</p>
                    <p className="text-[11px] text-emerald-300">AAHA Accredited • Fear Free • Routine & Urgent</p>
                  </div>
                  <span className="material-symbols-outlined text-sm text-[#cbdcf8]">arrow_forward</span>
                </div>
              </div>

              <div className="pt-1 text-center">
                <button
                  type="button"
                  onClick={() => setCurrentScreen('vet-finder')}
                  className="text-xs text-rose-300 hover:text-white font-bold underline cursor-pointer"
                >
                  View All Vets in Austin, Dallas, and Houston →
                </button>
              </div>
            </div>

          </div>

          <div className="absolute -right-12 -bottom-12 opacity-5 text-white pointer-events-none">
            <span className="material-symbols-outlined text-[320px]">local_hospital</span>
          </div>
        </div>
      </section>

      {/* Dog Grooming Salons & Mobile Vans Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-br from-[#1b3022] via-[#10271d] to-[#1c3328] text-white p-8 sm:p-12 relative overflow-hidden shadow-2xl border border-white/10">
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#82f5c1]/20 border border-[#82f5c1]/40 text-[#82f5c1] text-xs font-bold">
                <span className="material-symbols-outlined text-sm">content_cut</span>
                <span>Canine Grooming & Mobile Doorstep Spas</span>
              </div>

              <h2 className="font-['Epilogue'] font-bold text-2xl sm:text-3xl lg:text-4xl text-white tracking-tight">
                Find Dog Grooming Stores & Mobile Vans Around You
              </h2>

              <p className="text-xs sm:text-sm text-[#c6f3db] leading-relaxed max-w-xl">
                Locate top-rated dog grooming salons, curbside mobile vans that travel directly to your driveway, and Fear Free certified groomers. Enjoy real-time GPS distance calculation to discover the closest salons near you.
              </p>

              {/* Quick Grooming Highlights */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-start gap-2.5">
                  <span className="material-symbols-outlined text-[#82f5c1] text-xl shrink-0 mt-0.5">rv_hookup</span>
                  <div>
                    <h4 className="font-bold text-xs text-white">Mobile Doorstep</h4>
                    <p className="text-[11px] text-[#a1d8bc] mt-0.5">Quiet driveway vans</p>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-start gap-2.5">
                  <span className="material-symbols-outlined text-[#82f5c1] text-xl shrink-0 mt-0.5">spa</span>
                  <div>
                    <h4 className="font-bold text-xs text-white">Luxury Spas</h4>
                    <p className="text-[11px] text-[#a1d8bc] mt-0.5">Hydrotherapy & facials</p>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-start gap-2.5">
                  <span className="material-symbols-outlined text-[#82f5c1] text-xl shrink-0 mt-0.5">sentiment_satisfied</span>
                  <div>
                    <h4 className="font-bold text-xs text-white">Fear Free</h4>
                    <p className="text-[11px] text-[#a1d8bc] mt-0.5">Gentle & low-stress</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap gap-4">
                <button
                  type="button"
                  onClick={() => setCurrentScreen('grooming-finder')}
                  className="bg-[#82f5c1] hover:bg-[#6ee7b0] text-[#004d34] px-6 py-3 rounded-full text-xs font-bold transition-all shadow-lg flex items-center gap-2 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-base">near_me</span>
                  <span>Find Grooming Stores Near Me</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setCurrentScreen('grooming-finder');
                    onShowToast?.('Opening Grooming Salons & Mobile Vans...');
                  }}
                  className="bg-white/10 hover:bg-white/20 text-white px-5 py-3 rounded-full text-xs font-bold transition-colors border border-white/20 flex items-center gap-2 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-base">calendar_month</span>
                  <span>Book Grooming Appointment</span>
                </button>
              </div>
            </div>

            {/* Right Side Visual Box */}
            <div className="lg:col-span-5 bg-white/5 rounded-3xl p-5 border border-white/15 backdrop-blur-xs space-y-3.5">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#82f5c1] animate-pulse"></span>
                  <span className="text-xs font-bold text-[#82f5c1]">Nearby Certified Salons & Vans</span>
                </div>
                <span className="text-[11px] text-[#a1d8bc]">GPS Ready</span>
              </div>

              <div className="space-y-2 text-xs">
                <div 
                  onClick={() => setCurrentScreen('grooming-finder')}
                  className="p-2.5 rounded-xl bg-white/10 hover:bg-white/15 transition-colors cursor-pointer flex items-center justify-between"
                >
                  <div>
                    <p className="font-bold text-white text-xs">Barton Springs Canine Spa & Hydrotherapy</p>
                    <p className="text-[11px] text-[#82f5c1]">Luxury Spa • 4.96 ★ • Austin, TX</p>
                  </div>
                  <span className="material-symbols-outlined text-sm text-[#cbdcf8]">arrow_forward</span>
                </div>

                <div 
                  onClick={() => setCurrentScreen('grooming-finder')}
                  className="p-2.5 rounded-xl bg-white/10 hover:bg-white/15 transition-colors cursor-pointer flex items-center justify-between"
                >
                  <div>
                    <p className="font-bold text-white text-xs">Paws on the Run Mobile Luxury Grooming Van</p>
                    <p className="text-[11px] text-[#82f5c1]">Mobile Van • Curbside Doorstep • 4.98 ★</p>
                  </div>
                  <span className="material-symbols-outlined text-sm text-[#cbdcf8]">arrow_forward</span>
                </div>

                <div 
                  onClick={() => setCurrentScreen('grooming-finder')}
                  className="p-2.5 rounded-xl bg-white/10 hover:bg-white/15 transition-colors cursor-pointer flex items-center justify-between"
                >
                  <div>
                    <p className="font-bold text-white text-xs">Highland Park Canine Salon & Atelier</p>
                    <p className="text-[11px] text-[#82f5c1]">Master Groomers • Hand-Stripping • Dallas, TX</p>
                  </div>
                  <span className="material-symbols-outlined text-sm text-[#cbdcf8]">arrow_forward</span>
                </div>
              </div>

              <div className="pt-1 text-center">
                <button
                  type="button"
                  onClick={() => setCurrentScreen('grooming-finder')}
                  className="text-xs text-[#82f5c1] hover:text-white font-bold underline cursor-pointer"
                >
                  Explore Salons, Spas & Self-Wash Near You →
                </button>
              </div>
            </div>

          </div>

          <div className="absolute -right-12 -bottom-12 opacity-5 text-white pointer-events-none">
            <span className="material-symbols-outlined text-[320px]">content_cut</span>
          </div>
        </div>
      </section>

      {/* Essential Dog Necessities Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-[#006c4a] uppercase tracking-wider mb-1">
              <span className="material-symbols-outlined text-base">medical_services</span>
              <span>Canine Nutrition, Orthopedics & Safety</span>
            </div>
            <h2 className="font-['Epilogue'] font-bold text-2xl sm:text-3xl text-[#111c2d]">
              Essential Dog Necessities, Food & Starter Kits
            </h2>
          </div>
          <button
            onClick={() => setCurrentScreen('dog-gear')}
            className="text-xs font-bold text-[#8d4b00] hover:text-[#b15f00] flex items-center gap-1 cursor-pointer"
          >
            <span>Shop All Dog Necessities</span>
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </button>
        </div>

        {/* 4 Gear Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredGear.map((product) => {
            const isFavorited = favoritedGearIds.includes(product.id);
            return (
              <div
                key={product.id}
                className="bg-white rounded-3xl overflow-hidden border border-[#dee8ff] hover:border-[#dbc2b0] transition-all duration-300 shadow-xs hover:shadow-xl flex flex-col group"
              >
                <div className="relative aspect-square overflow-hidden bg-[#f0f3ff]">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  
                  {product.tag && (
                    <span className={`absolute top-3 left-3 text-[10px] font-bold px-2.5 py-1 rounded-full ${product.tagColor}`}>
                      {product.tag}
                    </span>
                  )}

                  <button
                    onClick={() => {
                      onToggleGearFavorite(product.id);
                      onShowToast?.(isFavorited ? 'Removed from wishlist' : `Saved ${product.name} to wishlist!`);
                    }}
                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center text-[#887364] hover:text-[#ba1a1a] transition-colors cursor-pointer shadow-sm"
                  >
                    <span className="material-symbols-outlined text-base">
                      {isFavorited ? 'favorite' : 'favorite_border'}
                    </span>
                  </button>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-[#006c4a] uppercase tracking-wider">
                      {product.subBadge}
                    </span>
                    <h3 className="font-bold text-xs text-[#111c2d] group-hover:text-[#8d4b00] transition-colors line-clamp-2 mt-0.5">
                      {product.name}
                    </h3>
                    <p className="text-[11px] text-[#887364] mt-1">{product.brand}</p>

                    <div className="flex items-center gap-1.5 text-xs text-[#8d4b00] mt-2 font-bold">
                      <span className="material-symbols-outlined text-xs text-[#b15f00]">star</span>
                      <span>{product.rating}</span>
                      <span className="text-[11px] text-[#887364] font-normal">({product.reviewsCount})</span>
                    </div>

                    <div className="flex items-baseline gap-2 mt-2">
                      <span className="font-bold text-sm text-[#111c2d]">
                        {formatPrice(product.price)}
                      </span>
                      {product.originalPrice && (
                        <span className="text-xs text-[#887364] line-through">
                          {formatPrice(product.originalPrice)}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="mt-4">
                    <button
                      onClick={() => {
                        onAddToCart(product);
                        onShowToast?.(`Added ${product.name} to your bag!`);
                      }}
                      className="w-full bg-[#111c2d] hover:bg-[#8d4b00] text-white py-2.5 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <span className="material-symbols-outlined text-sm">shopping_bag</span>
                      <span>{t.addToBagBtn}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4 Pillars of Ethical Care */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#006c4a] uppercase tracking-wider mb-2">
            <span className="material-symbols-outlined text-base">gavel</span>
            <span>A New Standard For Companion Placement</span>
          </div>
          <h2 className="font-['Epilogue'] font-bold text-2xl sm:text-3xl text-[#111c2d]">
            The 4 Pillars of the PawPalace Guarantee
          </h2>
          <p className="text-xs sm:text-sm text-[#554336] mt-2">
            We ban unlicensed puppy mills, broker networks, and untested pedigrees. Every transaction is held in safe escrow.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-3xl bg-white border border-[#dee8ff] hover:border-[#8d4b00] transition-all shadow-xs">
            <div className="w-12 h-12 rounded-2xl bg-[#ffdcc3] text-[#8d4b00] flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-2xl">verified_user</span>
            </div>
            <h3 className="font-bold text-sm text-[#111c2d] mb-1.5">Zero-Tolerance Mills</h3>
            <p className="text-xs text-[#554336] leading-relaxed">
              Every home breeder undergoes exhaustive background verification, property audits, and capacity limits.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-[#dee8ff] hover:border-[#006c4a] transition-all shadow-xs">
            <div className="w-12 h-12 rounded-2xl bg-[#82f5c1] text-[#006c4a] flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-2xl">biotech</span>
            </div>
            <h3 className="font-bold text-sm text-[#111c2d] mb-1.5">Compulsory DNA Screening</h3>
            <p className="text-xs text-[#554336] leading-relaxed">
              Parent bloodlines require verified OFA joint scoring and 250+ genetic disorder negative panels before listing.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-[#dee8ff] hover:border-[#a33900] transition-all shadow-xs">
            <div className="w-12 h-12 rounded-2xl bg-[#ffdbce] text-[#a33900] flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-2xl">security</span>
            </div>
            <h3 className="font-bold text-sm text-[#111c2d] mb-1.5">10-Year Genetic Warranty</h3>
            <p className="text-xs text-[#554336] leading-relaxed">
              Industry-leading legal coverage ensuring your companion is protected throughout their adult and senior years.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-[#dee8ff] hover:border-[#006c4a] transition-all shadow-xs">
            <div className="w-12 h-12 rounded-2xl bg-[#f0f3ff] text-[#006c4a] flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-2xl">lock</span>
            </div>
            <h3 className="font-bold text-sm text-[#111c2d] mb-1.5">Safe Escrow Holding</h3>
            <p className="text-xs text-[#554336] leading-relaxed">
              Deposits and adoption fees are held until you conduct an independent 72-hour veterinary checkup at home.
            </p>
          </div>
        </div>
      </section>

      {/* Advisory CTA Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#ffdcc3]/40 border border-[#dbc2b0] rounded-3xl p-8 sm:p-10 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#8d4b00] text-white flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-3xl">support_agent</span>
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg text-[#111c2d]">
                Need Guidance Finding the Right Companion?
              </h3>
              <p className="text-xs sm:text-sm text-[#554336] mt-0.5">
                Our licensed canine behaviorists and adoption concierge help match your living space, lifestyle, and allergies for free.
              </p>
            </div>
          </div>
          <button
            onClick={() => onShowToast?.('Canine Concierge requested! A specialist will connect via chat or phone.')}
            className="bg-[#8d4b00] hover:bg-[#b15f00] text-white px-6 py-3 rounded-full text-xs font-bold whitespace-nowrap cursor-pointer transition-colors shadow-sm"
          >
            Speak with a Canine Matchmaker
          </button>
        </div>
      </section>

      {/* Rejected Listings Review & Restore Modal */}
      <RejectedListingsModal
        isOpen={isRejectedModalOpen}
        onClose={() => setIsRejectedModalOpen(false)}
        rejectedDogs={rejectedDogsList}
        onRestoreDog={(id) => onRestoreDog?.(id)}
        onRestoreAll={onRestoreAllDogs}
      />

    </div>
  );
};
