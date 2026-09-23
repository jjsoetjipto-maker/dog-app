import React, { useState, useMemo } from 'react';
import { 
  CANINE_WELLNESS_TIPS, 
  CanineWellnessTip, 
  WellnessCategory,
  loadSavedWellnessTipIds, 
  saveSavedWellnessTipIds,
  getTodayFeaturedWellnessTip 
} from '../data/canineWellnessTipsData';
import { Screen } from '../types';

interface DailyWellnessTipTickerProps {
  onShowToast?: (msg: string) => void;
  onNavigateScreen?: (screen: Screen) => void;
}

export const DailyWellnessTipTicker: React.FC<DailyWellnessTipTickerProps> = ({
  onShowToast,
  onNavigateScreen
}) => {
  const [selectedTip, setSelectedTip] = useState<CanineWellnessTip | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [speedMode, setSpeedMode] = useState<'normal' | 'fast'>('normal');
  const [activeCategory, setActiveCategory] = useState<WellnessCategory | 'all' | 'saved'>('all');
  const [savedTipIds, setSavedTipIds] = useState<string[]>(() => loadSavedWellnessTipIds());
  const [searchQuery, setSearchQuery] = useState('');
  const [checkedActionSteps, setCheckedActionSteps] = useState<Record<string, boolean>>({});

  // Today's featured tip
  const todayTip = useMemo(() => getTodayFeaturedWellnessTip(), []);

  // Filtered tips based on active category
  const filteredTips = useMemo(() => {
    let list = CANINE_WELLNESS_TIPS;
    if (activeCategory === 'saved') {
      list = list.filter((t) => savedTipIds.includes(t.id));
    } else if (activeCategory !== 'all') {
      list = list.filter((t) => t.category === activeCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.shortAdvice.toLowerCase().includes(q) ||
          t.tags.some((tag) => tag.toLowerCase().includes(q)) ||
          t.categoryLabel.toLowerCase().includes(q)
      );
    }
    return list;
  }, [activeCategory, savedTipIds, searchQuery]);

  // Duplicate for seamless infinite sliding track to the left
  // If list has items, repeat at least twice or four times for short lists to fill track
  const slidingTrackTips = useMemo(() => {
    if (filteredTips.length === 0) return CANINE_WELLNESS_TIPS;
    if (filteredTips.length < 4) {
      return [...filteredTips, ...filteredTips, ...filteredTips, ...filteredTips];
    }
    return [...filteredTips, ...filteredTips];
  }, [filteredTips]);

  const handleCardClick = (tip: CanineWellnessTip) => {
    setSelectedTip(tip);
    setIsModalOpen(true);
  };

  const handleToggleBookmark = (id: string, title: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const isSaved = savedTipIds.includes(id);
    const updated = isSaved ? savedTipIds.filter((t) => t !== id) : [...savedTipIds, id];
    setSavedTipIds(updated);
    saveSavedWellnessTipIds(updated);
    if (onShowToast) {
      onShowToast(isSaved ? `Removed "${title}" from saved tips.` : `Saved "${title}" to your daily health favorites!`);
    }
  };

  const handleCopyAdvice = (tip: CanineWellnessTip, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    try {
      navigator.clipboard.writeText(`🐾 Canine Wellness Tip: ${tip.title}\n\n"${tip.shortAdvice}"\n— ${tip.vetSource.name}, ${tip.vetSource.credentials} (PawPalace Health Network)`);
      if (onShowToast) onShowToast('Wellness tip copied to clipboard!');
    } catch {
      if (onShowToast) onShowToast('Tip ready to share.');
    }
  };

  const handleToggleStep = (stepIndex: number) => {
    if (!selectedTip) return;
    const key = `${selectedTip.id}-${stepIndex}`;
    setCheckedActionSteps((prev) => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // Previous & Next navigation in modal
  const handleModalNavigate = (direction: 'prev' | 'next') => {
    if (!selectedTip) return;
    const currentIndex = CANINE_WELLNESS_TIPS.findIndex((t) => t.id === selectedTip.id);
    if (currentIndex === -1) return;
    const nextIndex = direction === 'next'
      ? (currentIndex + 1) % CANINE_WELLNESS_TIPS.length
      : (currentIndex - 1 + CANINE_WELLNESS_TIPS.length) % CANINE_WELLNESS_TIPS.length;
    setSelectedTip(CANINE_WELLNESS_TIPS[nextIndex]);
  };

  return (
    <div className="w-full bg-gradient-to-r from-[#0c1322] via-[#142036] to-[#0c1322] text-white border-y border-[#263753] relative overflow-hidden shadow-lg">
      
      {/* Top Bar: Headline, Live Indicators, Filter Chips & Ticker Controls */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 space-y-2.5">
        
        <div className="flex flex-wrap items-center justify-between gap-3">
          
          {/* Main Title with Pulsating Medical Health Dot */}
          <div className="flex items-center gap-3">
            <span className="flex h-3 w-3 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10b981] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-[#10b981]"></span>
            </span>

            <div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-emerald-400 text-xl">health_and_safety</span>
                <h2 className="font-['Epilogue'] font-black text-sm sm:text-base tracking-wide text-white flex items-center gap-2">
                  <span>Daily Wellness Tip</span>
                  <span className="text-[10px] sm:text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Vet-Approved
                  </span>
                </h2>
              </div>
              <p className="text-[11px] text-[#9bb0d3] hidden sm:block">
                Short, high-impact clinical advice on canine longevity, nutrition, hydration & emergency prevention
              </p>
            </div>
          </div>

          {/* Action Buttons: Today's Pick, Play/Pause, Speed, Handbook Modal */}
          <div className="flex items-center gap-2">
            
            {/* Quick Button: Jump to Today's Tip */}
            <button
              type="button"
              onClick={() => handleCardClick(todayTip)}
              className="px-2.5 py-1 rounded-xl bg-gradient-to-r from-amber-500/20 to-orange-500/20 hover:from-amber-500/30 hover:to-orange-500/30 border border-amber-500/40 text-amber-200 text-xs font-bold transition-all flex items-center gap-1 cursor-pointer shadow-xs hover:scale-102"
              title="Read today's featured veterinary advice"
            >
              <span className="material-symbols-outlined text-sm text-amber-300">star</span>
              <span>Today's Tip</span>
            </button>

            {/* Pause / Play Sliding Ticker */}
            <button
              type="button"
              onClick={() => setIsPaused(!isPaused)}
              className="px-2.5 py-1 rounded-xl bg-white/10 hover:bg-white/20 text-[#cbd7ef] hover:text-white text-xs font-semibold transition-colors flex items-center gap-1 cursor-pointer"
              title={isPaused ? 'Resume sliding ticker' : 'Pause sliding ticker'}
            >
              <span className="material-symbols-outlined text-sm">
                {isPaused ? 'play_arrow' : 'pause'}
              </span>
              <span className="hidden xs:inline">{isPaused ? 'Resume' : 'Pause'}</span>
            </button>

            {/* Speed Toggle (Normal / Fast) */}
            <button
              type="button"
              onClick={() => setSpeedMode(speedMode === 'normal' ? 'fast' : 'normal')}
              className={`px-2 py-1 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1 cursor-pointer ${
                speedMode === 'fast'
                  ? 'bg-emerald-500/30 text-emerald-200 border border-emerald-500/40'
                  : 'bg-white/10 hover:bg-white/20 text-[#cbd7ef]'
              }`}
              title="Toggle ticker scroll speed"
            >
              <span className="material-symbols-outlined text-sm">speed</span>
              <span className="text-[10px] font-bold">{speedMode === 'fast' ? '2x' : '1x'}</span>
            </button>

            {/* Browse Full Wellness Guide */}
            <button
              type="button"
              onClick={() => {
                setSelectedTip(CANINE_WELLNESS_TIPS[0]);
                setIsModalOpen(true);
              }}
              className="px-3 py-1 rounded-xl bg-[#8d4b00] hover:bg-[#b15f00] text-white text-xs font-bold transition-all flex items-center gap-1 cursor-pointer shadow-sm hover:scale-102"
            >
              <span>All Tips ({CANINE_WELLNESS_TIPS.length})</span>
              <span className="material-symbols-outlined text-sm">menu_book</span>
            </button>

          </div>

        </div>

        {/* Category Filter Pills Row */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs pt-1">
          <span className="text-[10px] uppercase font-bold text-[#88a0c7] mr-1 shrink-0 flex items-center gap-1">
            <span className="material-symbols-outlined text-xs">filter_list</span>
            <span>Filter:</span>
          </span>

          <button
            type="button"
            onClick={() => setActiveCategory('all')}
            className={`px-2.5 py-0.5 rounded-full text-xs font-bold transition-colors cursor-pointer shrink-0 ${
              activeCategory === 'all'
                ? 'bg-white text-[#0c1322] shadow-xs'
                : 'bg-white/10 text-[#cbd7ef] hover:bg-white/20'
            }`}
          >
            All Health Tips ({CANINE_WELLNESS_TIPS.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveCategory('hydration')}
            className={`px-2.5 py-0.5 rounded-full text-xs font-bold transition-colors cursor-pointer shrink-0 flex items-center gap-1 ${
              activeCategory === 'hydration'
                ? 'bg-cyan-400 text-[#0c1322]'
                : 'bg-cyan-950/60 text-cyan-200 hover:bg-cyan-900/80 border border-cyan-500/30'
            }`}
          >
            <span className="material-symbols-outlined text-xs">water_drop</span>
            <span>Hydration</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveCategory('toxic-alert')}
            className={`px-2.5 py-0.5 rounded-full text-xs font-bold transition-colors cursor-pointer shrink-0 flex items-center gap-1 ${
              activeCategory === 'toxic-alert'
                ? 'bg-red-500 text-white'
                : 'bg-red-950/60 text-red-200 hover:bg-red-900/80 border border-red-500/30'
            }`}
          >
            <span className="material-symbols-outlined text-xs">warning</span>
            <span>Toxic Hazards</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveCategory('dental')}
            className={`px-2.5 py-0.5 rounded-full text-xs font-bold transition-colors cursor-pointer shrink-0 flex items-center gap-1 ${
              activeCategory === 'dental'
                ? 'bg-teal-400 text-[#0c1322]'
                : 'bg-teal-950/60 text-teal-200 hover:bg-teal-900/80 border border-teal-500/30'
            }`}
          >
            <span className="material-symbols-outlined text-xs">dentistry</span>
            <span>Dental</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveCategory('joints')}
            className={`px-2.5 py-0.5 rounded-full text-xs font-bold transition-colors cursor-pointer shrink-0 flex items-center gap-1 ${
              activeCategory === 'joints'
                ? 'bg-amber-400 text-[#0c1322]'
                : 'bg-amber-950/60 text-amber-200 hover:bg-amber-900/80 border border-amber-500/30'
            }`}
          >
            <span className="material-symbols-outlined text-xs">accessibility_new</span>
            <span>Joints & Bones</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveCategory('preventive')}
            className={`px-2.5 py-0.5 rounded-full text-xs font-bold transition-colors cursor-pointer shrink-0 flex items-center gap-1 ${
              activeCategory === 'preventive'
                ? 'bg-emerald-400 text-[#0c1322]'
                : 'bg-emerald-950/60 text-emerald-200 hover:bg-emerald-900/80 border border-emerald-500/30'
            }`}
          >
            <span className="material-symbols-outlined text-xs">thermostat</span>
            <span>Preventive Vitals</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveCategory('nutrition')}
            className={`px-2.5 py-0.5 rounded-full text-xs font-bold transition-colors cursor-pointer shrink-0 flex items-center gap-1 ${
              activeCategory === 'nutrition'
                ? 'bg-blue-400 text-[#0c1322]'
                : 'bg-blue-950/60 text-blue-200 hover:bg-blue-900/80 border border-blue-500/30'
            }`}
          >
            <span className="material-symbols-outlined text-xs">monitor_weight</span>
            <span>Nutrition & Weight</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveCategory('mental-health')}
            className={`px-2.5 py-0.5 rounded-full text-xs font-bold transition-colors cursor-pointer shrink-0 flex items-center gap-1 ${
              activeCategory === 'mental-health'
                ? 'bg-indigo-400 text-[#0c1322]'
                : 'bg-indigo-950/60 text-indigo-200 hover:bg-indigo-900/80 border border-indigo-500/30'
            }`}
          >
            <span className="material-symbols-outlined text-xs">psychology</span>
            <span>Sniffari & Mental</span>
          </button>

          {savedTipIds.length > 0 && (
            <button
              type="button"
              onClick={() => setActiveCategory('saved')}
              className={`px-2.5 py-0.5 rounded-full text-xs font-bold transition-colors cursor-pointer shrink-0 flex items-center gap-1 ${
                activeCategory === 'saved'
                  ? 'bg-rose-500 text-white'
                  : 'bg-rose-950/60 text-rose-200 hover:bg-rose-900/80 border border-rose-500/30'
              }`}
            >
              <span className="material-symbols-outlined text-xs">favorite</span>
              <span>Saved ({savedTipIds.length})</span>
            </button>
          )}
        </div>

      </div>

      {/* The Animated Ticker Track Sliding to the Left */}
      <div className="relative w-full overflow-hidden py-3 bg-[#080d17]">
        
        {/* Left & Right gradient edge fades for seamless infinite illusion */}
        <div className="absolute top-0 bottom-0 left-0 w-10 sm:w-20 bg-gradient-to-r from-[#080d17] to-transparent z-10 pointer-events-none"></div>
        <div className="absolute top-0 bottom-0 right-0 w-10 sm:w-20 bg-gradient-to-l from-[#080d17] to-transparent z-10 pointer-events-none"></div>

        {/* Sliding Flex Container */}
        <div
          className={`flex items-center gap-4 px-4 ${
            isPaused ? '[animation-play-state:paused]' : ''
          }`}
          style={{
            display: 'flex',
            width: 'max-content',
            animation: `slideTrackLeft ${speedMode === 'fast' ? '22s' : '42s'} linear infinite`,
            animationPlayState: isPaused ? 'paused' : 'running'
          }}
        >
          {slidingTrackTips.map((tip, idx) => {
            const isBookmarked = savedTipIds.includes(tip.id);
            const isToday = todayTip.id === tip.id;

            return (
              <div
                key={`${tip.id}-${idx}`}
                onClick={() => handleCardClick(tip)}
                className="w-80 sm:w-[390px] shrink-0 bg-[#101a2c] hover:bg-[#16233a] border border-[#223554] hover:border-emerald-400/60 rounded-2xl p-4 transition-all duration-300 cursor-pointer shadow-md hover:shadow-xl group flex flex-col justify-between select-none relative overflow-hidden"
              >
                {/* Subtle top color accent bar */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-amber-400 to-cyan-400 opacity-60 group-hover:opacity-100 transition-opacity"></div>

                <div>
                  
                  {/* Top Header inside card: Category Pill, Star if today, and Bookmark Button */}
                  <div className="flex items-center justify-between gap-2 mb-2">
                    
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${tip.categoryColor.badgeBg} ${tip.categoryColor.text} border ${tip.categoryColor.border}`}>
                        <span className="material-symbols-outlined text-xs">{tip.icon}</span>
                        <span>{tip.categoryLabel}</span>
                      </span>

                      {isToday && (
                        <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-400 text-black shadow-xs">
                          <span className="material-symbols-outlined text-xs">star</span>
                          <span>TODAY'S TIP</span>
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1">
                      {/* Copy Tip Button */}
                      <button
                        type="button"
                        onClick={(e) => handleCopyAdvice(tip, e)}
                        className="p-1 rounded-lg text-[#7f95bc] hover:text-white hover:bg-white/10 transition-colors"
                        title="Copy tip to share"
                      >
                        <span className="material-symbols-outlined text-xs">content_copy</span>
                      </button>

                      {/* Bookmark Heart Button */}
                      <button
                        type="button"
                        onClick={(e) => handleToggleBookmark(tip.id, tip.title, e)}
                        className={`p-1 rounded-lg transition-colors ${
                          isBookmarked 
                            ? 'text-rose-400 bg-rose-500/20' 
                            : 'text-[#7f95bc] hover:text-rose-400 hover:bg-white/10'
                        }`}
                        title={isBookmarked ? 'Remove bookmark' : 'Save wellness tip'}
                      >
                        <span className="material-symbols-outlined text-sm">
                          {isBookmarked ? 'favorite' : 'favorite_border'}
                        </span>
                      </button>
                    </div>

                  </div>

                  {/* Card Title */}
                  <h3 className="font-['Epilogue'] font-bold text-xs sm:text-sm text-white group-hover:text-emerald-300 transition-colors line-clamp-1">
                    {tip.title}
                  </h3>

                  {/* Short Expert Advice */}
                  <p className="mt-1.5 text-xs text-[#cad7ed] leading-relaxed line-clamp-3">
                    {tip.shortAdvice}
                  </p>

                </div>

                {/* Bottom Footer: Expert Credential & Action Link */}
                <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between gap-2 text-[11px]">
                  
                  <div className="flex items-center gap-1.5 text-[#91a7cb] truncate">
                    <span className="material-symbols-outlined text-xs text-emerald-400 shrink-0">verified</span>
                    <span className="truncate font-semibold">{tip.vetSource.name.split(',')[0]}</span>
                    <span className="text-gray-500">•</span>
                    <span className="text-[10px] text-gray-400 truncate">{tip.applicableAges.split(' ')[0]}</span>
                  </div>

                  <span className="text-emerald-400 group-hover:text-emerald-300 font-bold text-[11px] flex items-center gap-0.5 shrink-0 group-hover:translate-x-0.5 transition-transform">
                    <span>Advice</span>
                    <span className="material-symbols-outlined text-xs">arrow_forward</span>
                  </span>

                </div>

              </div>
            );
          })}
        </div>

      </div>

      {/* Full Wellness Tip Masterclass Modal */}
      {isModalOpen && selectedTip && (
        <div
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="bg-[#101b2d] border border-[#2b3e5e] text-white rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            
            {/* Modal Header */}
            <div className="p-5 sm:p-6 border-b border-white/10 sticky top-0 bg-[#101b2d]/95 backdrop-blur-md z-10 flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${selectedTip.categoryColor.badgeBg} ${selectedTip.categoryColor.text} border ${selectedTip.categoryColor.border}`}>
                    <span className="material-symbols-outlined text-sm">{selectedTip.icon}</span>
                    <span>{selectedTip.categoryLabel}</span>
                  </span>
                  <span className="text-xs text-[#9bb0d3] font-semibold">
                    {selectedTip.dayOfWeek}
                  </span>
                </div>
                <h3 className="font-['Epilogue'] font-black text-lg sm:text-xl text-white">
                  {selectedTip.title}
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleToggleBookmark(selectedTip.id, selectedTip.title)}
                  className={`p-2 rounded-xl transition-colors ${
                    savedTipIds.includes(selectedTip.id)
                      ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                      : 'bg-white/10 hover:bg-white/20 text-[#cbd7ef]'
                  }`}
                  title="Bookmark tip"
                >
                  <span className="material-symbols-outlined text-base">
                    {savedTipIds.includes(selectedTip.id) ? 'favorite' : 'favorite_border'}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-base">close</span>
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-5 sm:p-6 space-y-6 flex-1 text-xs sm:text-sm">
              
              {/* Short Core Advice Callout */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-[#182944] to-[#121f33] border border-[#2b4166] space-y-2">
                <div className="flex items-center gap-2 text-emerald-300 font-bold text-xs uppercase tracking-wider">
                  <span className="material-symbols-outlined text-sm">lightbulb</span>
                  <span>Core Veterinary Directive</span>
                </div>
                <p className="text-sm sm:text-base font-semibold text-white leading-relaxed">
                  "{selectedTip.shortAdvice}"
                </p>
              </div>

              {/* Full Clinical Explanation */}
              <div className="space-y-2">
                <h4 className="font-bold text-xs uppercase tracking-wider text-[#9bb0d3] flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-sm text-cyan-400">medical_information</span>
                  <span>Clinical Background & Canine Physiology</span>
                </h4>
                <p className="text-[#cbd7ef] leading-relaxed text-xs sm:text-sm">
                  {selectedTip.fullExplanation}
                </p>
              </div>

              {/* Action Steps with Interactive Checkbox */}
              <div className="space-y-3">
                <h4 className="font-bold text-xs uppercase tracking-wider text-[#9bb0d3] flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-sm text-amber-400">checklist</span>
                  <span>Pet Parent Action Steps (Interactive)</span>
                </h4>
                <div className="space-y-2">
                  {selectedTip.actionSteps.map((step, idx) => {
                    const stepKey = `${selectedTip.id}-${idx}`;
                    const isChecked = !!checkedActionSteps[stepKey];
                    return (
                      <div
                        key={idx}
                        onClick={() => handleToggleStep(idx)}
                        className={`p-3 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                          isChecked 
                            ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-100' 
                            : 'bg-white/5 border-white/10 hover:bg-white/10 text-[#d8e4f8]'
                        }`}
                      >
                        <span className={`material-symbols-outlined text-base mt-0.5 shrink-0 ${
                          isChecked ? 'text-emerald-400' : 'text-gray-400'
                        }`}>
                          {isChecked ? 'check_box' : 'check_box_outline_blank'}
                        </span>
                        <span className={`text-xs sm:text-sm leading-relaxed ${isChecked ? 'line-through opacity-80' : ''}`}>
                          {step}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Clinical Vital Sign / Scientific Stat Box */}
              <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3">
                <span className="material-symbols-outlined text-amber-400 text-lg shrink-0 mt-0.5">query_stats</span>
                <div>
                  <p className="text-[11px] uppercase tracking-wider font-bold text-amber-300">
                    Clinical Benchmark & Longevity Stat
                  </p>
                  <p className="text-xs text-amber-100/90 mt-0.5 leading-relaxed">
                    {selectedTip.vitalStat}
                  </p>
                </div>
              </div>

              {/* Vet Author Credentials & Source */}
              <div className="p-4 rounded-2xl bg-[#0c1422] border border-[#20304a] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-300 font-bold">
                    <span className="material-symbols-outlined text-xl">stethoscope</span>
                  </div>
                  <div>
                    <h5 className="font-bold text-sm text-white flex items-center gap-1.5">
                      <span>{selectedTip.vetSource.name}</span>
                      <span className="material-symbols-outlined text-xs text-emerald-400">verified</span>
                    </h5>
                    <p className="text-[11px] text-[#9bb0d3]">
                      {selectedTip.vetSource.title}
                    </p>
                    <p className="text-[10px] text-[#7188ad]">
                      {selectedTip.vetSource.credentials}
                    </p>
                  </div>
                </div>

                {onNavigateScreen && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsModalOpen(false);
                      onNavigateScreen('vet-finder');
                    }}
                    className="px-3 py-1.5 rounded-xl bg-[#8d4b00] hover:bg-[#b15f00] text-white text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
                  >
                    <span className="material-symbols-outlined text-sm">local_hospital</span>
                    <span>Find Certified Vet</span>
                  </button>
                )}
              </div>

              {/* Related Dog Gear Link if applicable */}
              {selectedTip.relatedProductLabel && onNavigateScreen && (
                <div className="p-3 rounded-xl bg-blue-950/30 border border-blue-500/30 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-xs text-blue-200">
                    <span className="material-symbols-outlined text-base text-blue-400">shopping_bag</span>
                    <span>Recommended Companion Necessities: <strong>{selectedTip.relatedProductLabel}</strong></span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setIsModalOpen(false);
                      onNavigateScreen('dog-gear');
                    }}
                    className="text-xs font-bold text-blue-300 hover:text-white underline cursor-pointer shrink-0"
                  >
                    View Gear →
                  </button>
                </div>
              )}

            </div>

            {/* Modal Navigation Footer */}
            <div className="p-4 sm:p-5 border-t border-white/10 bg-[#0c1422] rounded-b-3xl flex items-center justify-between gap-3">
              
              <button
                type="button"
                onClick={() => handleModalNavigate('prev')}
                className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-[#cbd7ef] hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">chevron_left</span>
                <span>Previous Tip</span>
              </button>

              <button
                type="button"
                onClick={(e) => handleCopyAdvice(selectedTip, e)}
                className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-[#cbd7ef] hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">share</span>
                <span>Share Tip</span>
              </button>

              <button
                type="button"
                onClick={() => handleModalNavigate('next')}
                className="px-3 py-1.5 rounded-xl bg-[#8d4b00] hover:bg-[#b15f00] text-xs font-bold text-white transition-colors flex items-center gap-1 cursor-pointer shadow-xs"
              >
                <span>Next Tip</span>
                <span className="material-symbols-outlined text-sm">chevron_right</span>
              </button>

            </div>

          </div>
        </div>
      )}

    </div>
  );
};
