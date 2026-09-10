import React, { useState } from 'react';
import { DOG_RAISING_TIPS, DAILY_PUPPY_ROUTINE, RaisingTip } from '../data/dogCareAndActivities';

interface TopDogRaisingTipsTickerProps {
  onShowToast?: (msg: string) => void;
}

export const TopDogRaisingTipsTicker: React.FC<TopDogRaisingTipsTickerProps> = ({ onShowToast }) => {
  const [selectedTip, setSelectedTip] = useState<RaisingTip | null>(null);
  const [isHandbookOpen, setIsHandbookOpen] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'first-48-hours' | 'potty-crate' | 'socialization' | 'nutrition' | 'manners'>('all');
  const [savedTips, setSavedTips] = useState<string[]>([]);
  const [modalView, setModalView] = useState<'tips' | 'routine'>('tips');

  const tipsToDisplay = activeTab === 'all'
    ? DOG_RAISING_TIPS
    : DOG_RAISING_TIPS.filter((t) => t.category === activeTab);

  // Duplicate for seamless infinite sliding track to the left
  const slidingTrackTips = [...tipsToDisplay, ...tipsToDisplay];

  const handleCardClick = (tip: RaisingTip) => {
    setSelectedTip(tip);
    setIsHandbookOpen(true);
    setModalView('tips');
  };

  const handleToggleBookmark = (id: string, title: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (savedTips.includes(id)) {
      setSavedTips(savedTips.filter((t) => t !== id));
      if (onShowToast) onShowToast(`Removed "${title}" from saved checklist.`);
    } else {
      setSavedTips([...savedTips, id]);
      if (onShowToast) onShowToast(`Saved "${title}" to your puppy care checklist!`);
    }
  };

  return (
    <div className="w-full bg-gradient-to-r from-[#111c2d] via-[#1b2b44] to-[#111c2d] text-white border-b border-[#2b3c58] relative overflow-hidden shadow-md">
      {/* Subtle top indicator bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-3 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <span className="flex h-2.5 w-2.5 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#82f5c1] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#82f5c1]"></span>
          </span>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-amber-400 text-lg">lightbulb</span>
            <h2 className="font-bold text-xs sm:text-sm tracking-wide text-white flex items-center gap-2">
              <span>Tips on How to Raise Dogs</span>
              <span className="hidden sm:inline text-[11px] font-normal text-[#93a6c8]">
                • Expert Behavioral & Wellness Guidelines
              </span>
            </h2>
          </div>
        </div>

        {/* Action Controls on Header */}
        <div className="flex items-center gap-2">
          {/* Pause / Resume button */}
          <button
            onClick={() => setIsPaused(!isPaused)}
            className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-[#cbd7ef] hover:text-white text-[11px] font-semibold transition-colors flex items-center gap-1 cursor-pointer"
            title={isPaused ? 'Resume sliding left' : 'Pause sliding'}
          >
            <span className="material-symbols-outlined text-xs">
              {isPaused ? 'play_arrow' : 'pause'}
            </span>
            <span>{isPaused ? 'Slide' : 'Pause'}</span>
          </button>

          {/* Routine Timetable quick button */}
          <button
            onClick={() => {
              setModalView('routine');
              setIsHandbookOpen(true);
            }}
            className="px-2.5 py-1 rounded-lg bg-[#8d4b00] hover:bg-[#b15f00] text-white text-[11px] font-bold transition-colors flex items-center gap-1 cursor-pointer shadow-xs"
          >
            <span className="material-symbols-outlined text-xs">schedule</span>
            <span className="hidden xs:inline">24h Schedule</span>
          </button>

          {/* Open full masterclass handbook */}
          <button
            onClick={() => {
              setModalView('tips');
              setIsHandbookOpen(true);
            }}
            className="px-3 py-1 rounded-lg bg-white text-[#111c2d] hover:bg-[#e7eeff] text-[11px] font-bold transition-colors flex items-center gap-1 cursor-pointer shadow-xs"
          >
            <span>Full Handbook ({DOG_RAISING_TIPS.length})</span>
            <span className="material-symbols-outlined text-xs">arrow_forward</span>
          </button>
        </div>
      </div>

      {/* The Rectangle Sliding to the Left Container */}
      <div className="relative w-full overflow-hidden py-3 bg-[#0d1624]">
        {/* Left & Right subtle edge fade gradient */}
        <div className="absolute top-0 bottom-0 left-0 w-8 sm:w-16 bg-gradient-to-r from-[#0d1624] to-transparent z-10 pointer-events-none"></div>
        <div className="absolute top-0 bottom-0 right-0 w-8 sm:w-16 bg-gradient-to-l from-[#0d1624] to-transparent z-10 pointer-events-none"></div>

        {/* Animated Sliding Track moving to the left */}
        <div
          className={`animate-slide-left flex items-center gap-4 px-4 ${
            isPaused ? '[animation-play-state:paused]' : ''
          }`}
        >
          {slidingTrackTips.map((tip, idx) => {
            const isBookmarked = savedTips.includes(tip.id);

            return (
              <div
                key={`${tip.id}-${idx}`}
                onClick={() => handleCardClick(tip)}
                className="w-80 sm:w-96 shrink-0 bg-[#162338] hover:bg-[#1f2f4a] border border-[#2b3e5e] hover:border-amber-400/60 rounded-2xl p-3.5 transition-all duration-300 cursor-pointer shadow-sm hover:shadow-lg group flex flex-col justify-between"
              >
                <div>
                  {/* Category Pill & Age */}
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300 bg-amber-950/60 border border-amber-500/30 px-2 py-0.5 rounded-md flex items-center gap-1">
                      <span className="material-symbols-outlined text-xs">
                        {tip.categoryIcon === 'home'
                          ? 'home'
                          : tip.categoryIcon === 'pets'
                          ? 'pets'
                          : tip.categoryIcon === 'psychology'
                          ? 'psychology'
                          : tip.categoryIcon === 'restaurant'
                          ? 'restaurant'
                          : 'handshake'}
                      </span>
                      <span>{tip.categoryLabel}</span>
                    </span>
                    <span className="text-[10px] text-[#93a6c8]">
                      {tip.recommendedAge}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="font-bold text-xs sm:text-sm text-white group-hover:text-amber-300 transition-colors line-clamp-1">
                    {tip.title}
                  </h3>

                  {/* Golden Rule Callout */}
                  <p className="text-[11px] text-amber-200/90 font-medium italic mt-1 line-clamp-1 bg-black/25 px-2 py-1 rounded-lg border border-white/5">
                    &ldquo;{tip.ruleOfThumb}&rdquo;
                  </p>

                  {/* Snippet */}
                  <p className="text-[11px] text-[#cbd7ef] mt-1.5 line-clamp-2 leading-snug">
                    {tip.explanation}
                  </p>
                </div>

                {/* Bottom Bar: Action prompt + Bookmark */}
                <div className="flex items-center justify-between pt-2.5 mt-2 border-t border-white/10 text-[10px]">
                  <span className="text-amber-400 font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    <span>Read Pro Breeder Tip</span>
                    <span className="material-symbols-outlined text-xs">arrow_forward</span>
                  </span>

                  <button
                    onClick={(e) => handleToggleBookmark(tip.id, tip.title, e)}
                    className={`p-1 rounded transition-colors cursor-pointer ${
                      isBookmarked
                        ? 'text-amber-400'
                        : 'text-gray-400 hover:text-white'
                    }`}
                    title={isBookmarked ? 'Saved to Checklist' : 'Bookmark Tip'}
                  >
                    <span className="material-symbols-outlined text-sm">
                      {isBookmarked ? 'bookmark' : 'bookmark_border'}
                    </span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Full Modal View when user clicks any sliding tip or the header buttons */}
      {isHandbookOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-white text-[#111c2d] rounded-3xl max-w-3xl w-full max-h-[88vh] flex flex-col shadow-2xl border border-[#dee8ff] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-5 sm:p-6 bg-[#111c2d] text-white flex items-center justify-between border-b border-[#22314a]">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-[#82f5c1] uppercase tracking-wider bg-[#006c4a]/40 border border-[#006c4a] px-2.5 py-0.5 rounded-full">
                    Veterinary & Breeder Handbook
                  </span>
                  <span className="text-xs text-[#93a6c8]">
                    {savedTips.length} saved
                  </span>
                </div>
                <h3 className="font-['Epilogue'] font-bold text-xl text-white mt-1.5">
                  Tips on How to Raise Dogs: Complete Guide
                </h3>
                <p className="text-xs text-[#93a6c8] mt-0.5">
                  Evidence-based developmental milestones and practical routines for your new canine companion.
                </p>
              </div>

              <button
                onClick={() => setIsHandbookOpen(false)}
                className="p-2 text-[#cbd7ef] hover:text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-2xl">close</span>
              </button>
            </div>

            {/* Modal Tab Switcher */}
            <div className="p-3 bg-[#f0f3ff] border-b border-[#dee8ff] flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setModalView('tips')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    modalView === 'tips'
                      ? 'bg-[#8d4b00] text-white shadow-xs'
                      : 'bg-white text-[#554336] hover:bg-[#dee8ff]'
                  }`}
                >
                  <span className="material-symbols-outlined text-sm">lightbulb</span>
                  <span>All Raising Tips ({DOG_RAISING_TIPS.length})</span>
                </button>
                <button
                  onClick={() => setModalView('routine')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    modalView === 'routine'
                      ? 'bg-[#8d4b00] text-white shadow-xs'
                      : 'bg-white text-[#554336] hover:bg-[#dee8ff]'
                  }`}
                >
                  <span className="material-symbols-outlined text-sm">schedule</span>
                  <span>24-Hour Puppy Schedule</span>
                </button>
              </div>

              {selectedTip && modalView === 'tips' && (
                <button
                  onClick={() => setSelectedTip(null)}
                  className="text-xs text-[#8d4b00] font-bold hover:underline cursor-pointer"
                >
                  View All Topics
                </button>
              )}
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1">
              {/* Single Tip Expanded Focus (if clicked directly from the sliding track) */}
              {selectedTip && modalView === 'tips' ? (
                <div className="bg-[#f9f9ff] border-2 border-[#8d4b00] p-5 sm:p-6 rounded-2xl space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase text-[#8d4b00] bg-[#ffdcc3] px-2.5 py-1 rounded-full">
                      {selectedTip.categoryLabel} • {selectedTip.recommendedAge}
                    </span>
                    <button
                      onClick={() => handleToggleBookmark(selectedTip.id, selectedTip.title)}
                      className={`px-3 py-1 rounded-xl text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer ${
                        savedTips.includes(selectedTip.id)
                          ? 'bg-amber-100 text-[#8d4b00]'
                          : 'bg-white border border-[#dee8ff] text-[#554336]'
                      }`}
                    >
                      <span className="material-symbols-outlined text-sm">
                        {savedTips.includes(selectedTip.id) ? 'bookmark' : 'bookmark_border'}
                      </span>
                      <span>{savedTips.includes(selectedTip.id) ? 'Saved' : 'Save to Checklist'}</span>
                    </button>
                  </div>

                  <h4 className="font-['Epilogue'] font-bold text-xl text-[#111c2d]">
                    {selectedTip.title}
                  </h4>

                  <div className="bg-[#fff6ee] border-l-4 border-[#8d4b00] p-3 rounded-r-xl text-xs sm:text-sm font-bold text-[#8d4b00]">
                    &ldquo;{selectedTip.ruleOfThumb}&rdquo;
                  </div>

                  <p className="text-xs sm:text-sm text-[#554336] leading-relaxed">
                    {selectedTip.explanation}
                  </p>

                  <div className="space-y-2 pt-2">
                    <strong className="text-xs font-bold text-[#111c2d] block">
                      Action Checklist:
                    </strong>
                    {selectedTip.actionSteps.map((step, sIdx) => (
                      <div key={sIdx} className="flex items-start gap-2 text-xs text-[#554336]">
                        <span className="material-symbols-outlined text-sm text-[#006c4a] shrink-0 mt-0.5">
                          check_circle
                        </span>
                        <span>{step}</span>
                      </div>
                    ))}
                  </div>

                  <div className="bg-[#eef3ff] border border-[#cbd7ef] p-3.5 rounded-xl text-xs text-[#1b2b44] flex items-start gap-2.5">
                    <span className="material-symbols-outlined text-base text-[#8d4b00] shrink-0 mt-0.5">
                      auto_awesome
                    </span>
                    <div>
                      <strong className="text-[#111c2d]">Pro Breeder Secret: </strong>
                      <span>{selectedTip.proBreederSecret}</span>
                    </div>
                  </div>
                </div>
              ) : modalView === 'tips' ? (
                /* Complete List of All Tips */
                <div className="space-y-6">
                  {['first-48-hours', 'potty-crate', 'socialization', 'nutrition', 'manners'].map((catKey) => {
                    const catTips = DOG_RAISING_TIPS.filter((t) => t.category === catKey);
                    const catLabel = catTips[0]?.categoryLabel || catKey;

                    return (
                      <div key={catKey} className="space-y-3">
                        <div className="flex items-center gap-2 border-b border-[#dee8ff] pb-2">
                          <span className="material-symbols-outlined text-[#8d4b00] text-lg">
                            {catTips[0]?.categoryIcon === 'home'
                              ? 'home'
                              : catTips[0]?.categoryIcon === 'pets'
                              ? 'pets'
                              : catTips[0]?.categoryIcon === 'psychology'
                              ? 'psychology'
                              : catTips[0]?.categoryIcon === 'restaurant'
                              ? 'restaurant'
                              : 'handshake'}
                          </span>
                          <h4 className="font-bold text-sm text-[#111c2d]">{catLabel}</h4>
                          <span className="text-xs text-[#887364]">({catTips.length} rules)</span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                          {catTips.map((tip) => (
                            <div
                              key={tip.id}
                              className="bg-[#f9f9ff] border border-[#dee8ff] p-4 rounded-2xl space-y-2.5 flex flex-col justify-between hover:border-[#8d4b00] transition-colors cursor-pointer"
                              onClick={() => setSelectedTip(tip)}
                            >
                              <div>
                                <div className="flex items-center justify-between">
                                  <span className="text-[10px] font-bold uppercase text-[#8d4b00]">
                                    {tip.recommendedAge}
                                  </span>
                                  <button
                                    onClick={(e) => handleToggleBookmark(tip.id, tip.title, e)}
                                    className={`p-1 rounded ${
                                      savedTips.includes(tip.id) ? 'text-[#8d4b00]' : 'text-gray-400'
                                    }`}
                                  >
                                    <span className="material-symbols-outlined text-base">
                                      {savedTips.includes(tip.id) ? 'bookmark' : 'bookmark_border'}
                                    </span>
                                  </button>
                                </div>
                                <h5 className="font-bold text-xs sm:text-sm text-[#111c2d] mt-1">
                                  {tip.title}
                                </h5>
                                <p className="text-[11px] text-[#8d4b00] font-semibold italic mt-1 bg-[#fffaf5] p-2 rounded-lg border border-[#ffe1cc]">
                                  &ldquo;{tip.ruleOfThumb}&rdquo;
                                </p>
                              </div>

                              <div className="pt-2 border-t border-[#dee8ff] text-[11px] text-[#8d4b00] font-bold flex items-center gap-1">
                                <span>View Checklist & Breeder Secret</span>
                                <span className="material-symbols-outlined text-xs">arrow_forward</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                /* 24-Hour Routine Schedule */
                <div className="space-y-3">
                  <div className="bg-[#fff9f4] border border-[#ffdcc3] p-4 rounded-2xl">
                    <h4 className="font-bold text-sm text-[#8d4b00] flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-base">schedule</span>
                      <span>The Gold-Standard 24-Hour Daily Puppy Routine</span>
                    </h4>
                    <p className="text-xs text-[#554336] mt-1">
                      Puppies thrive on strict predictive routines. Following this schedule cuts house-training time in half!
                    </p>
                  </div>

                  <div className="space-y-2">
                    {DAILY_PUPPY_ROUTINE.map((item, idx) => (
                      <div
                        key={idx}
                        className="bg-[#f9f9ff] hover:bg-[#f0f3ff] border border-[#dee8ff] p-3 rounded-xl text-xs flex items-start gap-3.5 transition-colors"
                      >
                        <span className="font-bold text-[#8d4b00] shrink-0 w-20 text-[11px] bg-white px-2 py-1 rounded-md border border-[#dee8ff]">
                          {item.time}
                        </span>
                        <div className="flex-1 min-w-0">
                          <strong className="text-[#111c2d] block text-xs">{item.activity}</strong>
                          <span className="text-[#554336] text-[11px] block mt-0.5 leading-relaxed">
                            {item.notes}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-[#f0f3ff] border-t border-[#dee8ff] flex items-center justify-between">
              <span className="text-xs text-[#554336]">
                {savedTips.length} tips bookmarked for your companion.
              </span>
              <button
                onClick={() => setIsHandbookOpen(false)}
                className="px-5 py-2 bg-[#8d4b00] hover:bg-[#b15f00] text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                Close Handbook
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
