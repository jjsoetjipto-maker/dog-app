import React, { useState } from 'react';
import { DOG_RAISING_TIPS, DAILY_PUPPY_ROUTINE, RaisingTip } from '../data/dogCareAndActivities';

interface DogRaisingTipsCardProps {
  onShowToast?: (msg: string) => void;
}

export const DogRaisingTipsCard: React.FC<DogRaisingTipsCardProps> = ({ onShowToast }) => {
  const [activeCategory, setActiveCategory] = useState<RaisingTip['category']>('first-48-hours');
  const [activeTipIndex, setActiveTipIndex] = useState(0);
  const [viewMode, setViewMode] = useState<'tips' | 'routine'>('tips');
  const [savedTips, setSavedTips] = useState<string[]>([]);
  const [isFullHandbookOpen, setIsFullHandbookOpen] = useState(false);

  const filteredTips = DOG_RAISING_TIPS.filter((t) => t.category === activeCategory);
  const currentTip = filteredTips[activeTipIndex] || filteredTips[0];

  const handleCategoryChange = (cat: RaisingTip['category']) => {
    setActiveCategory(cat);
    setActiveTipIndex(0);
    setViewMode('tips');
  };

  const handleNextTip = () => {
    if (activeTipIndex < filteredTips.length - 1) {
      setActiveTipIndex(activeTipIndex + 1);
    } else {
      setActiveTipIndex(0);
    }
  };

  const handlePrevTip = () => {
    if (activeTipIndex > 0) {
      setActiveTipIndex(activeTipIndex - 1);
    } else {
      setActiveTipIndex(filteredTips.length - 1);
    }
  };

  const handleToggleBookmark = (id: string, title: string) => {
    if (savedTips.includes(id)) {
      setSavedTips(savedTips.filter((t) => t !== id));
      if (onShowToast) onShowToast(`Removed "${title}" from saved guide tips.`);
    } else {
      setSavedTips([...savedTips, id]);
      if (onShowToast) onShowToast(`Saved "${title}" to your puppy care checklist!`);
    }
  };

  const categories: { id: RaisingTip['category']; label: string; icon: string }[] = [
    { id: 'first-48-hours', label: 'First 48h', icon: 'home' },
    { id: 'potty-crate', label: 'Potty & Crate', icon: 'pets' },
    { id: 'socialization', label: 'Socialization', icon: 'psychology' },
    { id: 'nutrition', label: 'Nutrition', icon: 'restaurant' },
    { id: 'manners', label: 'Manners', icon: 'handshake' }
  ];

  return (
    <div className="relative rounded-3xl bg-white border border-[#dee8ff] shadow-2xl overflow-hidden flex flex-col justify-between h-full">
      {/* Top Banner & Header */}
      <div className="bg-gradient-to-r from-[#111c2d] via-[#1b2b44] to-[#111c2d] p-5 text-white relative">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[10px] font-bold uppercase tracking-wider bg-[#8d4b00] text-[#ffdcc3] px-2.5 py-0.5 rounded-full flex items-center gap-1">
            <span className="material-symbols-outlined text-xs">verified</span>
            <span>Vet & Breeder Certified</span>
          </span>
          <span className="text-[11px] text-[#cbd7ef] flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Active Care Guide</span>
          </span>
        </div>

        <div className="mt-2.5">
          <h3 className="font-['Epilogue'] font-bold text-xl text-white flex items-center gap-2">
            <span>Tips on How to Raise Dogs</span>
          </h3>
          <p className="text-xs text-[#93a6c8] mt-1 leading-relaxed">
            Essential behavioral, potty, and developmental practices to raise a happy, confident canine companion.
          </p>
        </div>

        {/* View Switcher Pills */}
        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-white/10">
          <button
            onClick={() => setViewMode('tips')}
            className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              viewMode === 'tips'
                ? 'bg-white text-[#111c2d] shadow-sm'
                : 'text-[#cbd7ef] hover:text-white hover:bg-white/10'
            }`}
          >
            <span className="material-symbols-outlined text-sm">lightbulb</span>
            <span>Core Expert Tips</span>
          </button>

          <button
            onClick={() => setViewMode('routine')}
            className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              viewMode === 'routine'
                ? 'bg-white text-[#111c2d] shadow-sm'
                : 'text-[#cbd7ef] hover:text-white hover:bg-white/10'
            }`}
          >
            <span className="material-symbols-outlined text-sm">schedule</span>
            <span>Daily Routine Timetable</span>
          </button>
        </div>
      </div>

      {/* Main Content Body */}
      {viewMode === 'tips' && (
        <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
          {/* Category Tabs */}
          <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategoryChange(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeCategory === cat.id
                    ? 'bg-[#8d4b00] text-white shadow-xs'
                    : 'bg-[#f0f3ff] text-[#554336] hover:bg-[#dee8ff]'
                }`}
              >
                <span className="material-symbols-outlined text-sm">{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            ))}
          </div>

          {/* Current Tip Content Card */}
          {currentTip && (
            <div className="bg-[#f9f9ff] rounded-2xl p-4 border border-[#e7eeff] space-y-3 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#8d4b00]">
                      {currentTip.categoryLabel} • {currentTip.recommendedAge}
                    </span>
                    <h4 className="font-bold text-base text-[#111c2d] mt-0.5">
                      {currentTip.title}
                    </h4>
                  </div>
                  <button
                    onClick={() => handleToggleBookmark(currentTip.id, currentTip.title)}
                    className={`p-1.5 rounded-xl transition-colors cursor-pointer ${
                      savedTips.includes(currentTip.id)
                        ? 'bg-amber-100 text-[#8d4b00]'
                        : 'text-[#887364] hover:bg-white hover:text-[#111c2d]'
                    }`}
                    title={savedTips.includes(currentTip.id) ? 'Bookmarked' : 'Save tip'}
                  >
                    <span className="material-symbols-outlined text-lg">
                      {savedTips.includes(currentTip.id) ? 'bookmark' : 'bookmark_border'}
                    </span>
                  </button>
                </div>

                {/* Golden Rule Callout */}
                <div className="bg-[#fff6ee] border-l-3 border-[#8d4b00] p-2.5 rounded-r-xl my-2 text-xs font-semibold text-[#8d4b00]">
                  &ldquo;{currentTip.ruleOfThumb}&rdquo;
                </div>

                <p className="text-xs text-[#554336] leading-relaxed">
                  {currentTip.explanation}
                </p>

                {/* Action steps */}
                <div className="mt-3 space-y-1.5">
                  <span className="text-[11px] font-bold text-[#111c2d] block">
                    Action Checklist:
                  </span>
                  {currentTip.actionSteps.map((step, sIdx) => (
                    <div key={sIdx} className="flex items-start gap-2 text-xs text-[#554336]">
                      <span className="material-symbols-outlined text-sm text-[#006c4a] shrink-0 mt-0.5">
                        check_circle
                      </span>
                      <span>{step}</span>
                    </div>
                  ))}
                </div>

                {/* Pro Breeder Tip Secret */}
                <div className="mt-3 bg-[#eef3ff] border border-[#cbd7ef] p-2.5 rounded-xl text-xs text-[#1b2b44] flex items-start gap-2">
                  <span className="material-symbols-outlined text-sm text-[#8d4b00] shrink-0 mt-0.5">
                    auto_awesome
                  </span>
                  <p>
                    <strong className="text-[#111c2d]">Pro Breeder Advice: </strong>
                    {currentTip.proBreederSecret}
                  </p>
                </div>
              </div>

              {/* Navigation controls */}
              <div className="flex items-center justify-between pt-3 border-t border-[#dee8ff] text-xs">
                <span className="text-[11px] text-[#887364] font-semibold">
                  Tip {activeTipIndex + 1} of {filteredTips.length} in this topic
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={handlePrevTip}
                    className="p-1.5 rounded-xl bg-white hover:bg-[#dee8ff] border border-[#dee8ff] text-[#111c2d] transition-colors cursor-pointer"
                    title="Previous tip"
                  >
                    <span className="material-symbols-outlined text-sm">arrow_back</span>
                  </button>
                  <button
                    onClick={handleNextTip}
                    className="p-1.5 rounded-xl bg-[#8d4b00] hover:bg-[#b15f00] text-white transition-colors cursor-pointer flex items-center gap-1 px-2.5"
                    title="Next tip"
                  >
                    <span className="text-xs font-bold">Next Tip</span>
                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Routine Timetable Mode */}
      {viewMode === 'routine' && (
        <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-bold text-sm text-[#111c2d]">
                Ideal 24-Hour Puppy Schedule
              </h4>
              <p className="text-[11px] text-[#554336]">
                Puppies need 18-20 hours of restorative sleep; consistency builds bladder control.
              </p>
            </div>
            <span className="text-[10px] font-bold bg-[#006c4a]/10 text-[#006c4a] px-2 py-0.5 rounded-full">
              Vet Backed
            </span>
          </div>

          <div className="overflow-y-auto max-h-72 space-y-2 pr-1 scrollbar-thin">
            {DAILY_PUPPY_ROUTINE.map((item, idx) => (
              <div
                key={idx}
                className="bg-[#f9f9ff] hover:bg-[#f0f3ff] border border-[#dee8ff] p-2.5 rounded-xl text-xs flex items-start gap-3 transition-colors"
              >
                <span className="font-bold text-[#8d4b00] shrink-0 w-16 text-[11px]">
                  {item.time}
                </span>
                <div className="flex-1 min-w-0">
                  <strong className="text-[#111c2d] block text-xs">{item.activity}</strong>
                  <span className="text-[#554336] text-[11px] leading-tight block mt-0.5">
                    {item.notes}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bottom Action Footer */}
      <div className="p-4 bg-[#f0f3ff] border-t border-[#dee8ff] flex items-center justify-between gap-3">
        <div className="text-[11px] text-[#554336] flex items-center gap-1.5">
          <span className="material-symbols-outlined text-base text-[#006c4a]">menu_book</span>
          <span>{DOG_RAISING_TIPS.length} Expert Raising Guides Available</span>
        </div>

        <button
          onClick={() => setIsFullHandbookOpen(true)}
          className="px-3.5 py-2 bg-[#111c2d] hover:bg-[#1f2f48] text-white rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 shadow-sm"
        >
          <span>Open Full Guide</span>
          <span className="material-symbols-outlined text-sm">open_in_new</span>
        </button>
      </div>

      {/* Full Handbook Modal */}
      {isFullHandbookOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[85vh] flex flex-col shadow-2xl border border-[#dee8ff] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-6 bg-[#111c2d] text-white flex items-center justify-between border-b border-[#22314a]">
              <div>
                <span className="text-[10px] font-bold text-[#82f5c1] uppercase tracking-wider bg-[#006c4a]/40 border border-[#006c4a] px-2.5 py-0.5 rounded-full">
                  Complete Canine Development Handbook
                </span>
                <h3 className="font-['Epilogue'] font-bold text-xl text-white mt-1.5">
                  Tips on How to Raise Dogs: Complete Masterclass
                </h3>
                <p className="text-xs text-[#93a6c8] mt-0.5">
                  Curated by licensed veterinarians, positive-reinforcement trainers, and AKC preservation breeders.
                </p>
              </div>
              <button
                onClick={() => setIsFullHandbookOpen(false)}
                className="p-2 text-[#cbd7ef] hover:text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6">
              {categories.map((category) => {
                const tipsInCat = DOG_RAISING_TIPS.filter((t) => t.category === category.id);
                return (
                  <div key={category.id} className="space-y-3">
                    <div className="flex items-center gap-2 border-b border-[#dee8ff] pb-2">
                      <span className="material-symbols-outlined text-lg text-[#8d4b00]">
                        {category.icon}
                      </span>
                      <h4 className="font-bold text-base text-[#111c2d]">{category.label}</h4>
                      <span className="text-xs text-[#887364]">({tipsInCat.length} guidelines)</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {tipsInCat.map((tip) => (
                        <div
                          key={tip.id}
                          className="bg-[#f9f9ff] border border-[#e7eeff] p-4 rounded-2xl space-y-2.5 flex flex-col justify-between"
                        >
                          <div>
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-bold uppercase text-[#8d4b00]">
                                {tip.recommendedAge}
                              </span>
                              <button
                                onClick={() => handleToggleBookmark(tip.id, tip.title)}
                                className={`text-xs p-1 rounded ${
                                  savedTips.includes(tip.id) ? 'text-[#8d4b00]' : 'text-gray-400'
                                }`}
                              >
                                <span className="material-symbols-outlined text-base">
                                  {savedTips.includes(tip.id) ? 'bookmark' : 'bookmark_border'}
                                </span>
                              </button>
                            </div>
                            <h5 className="font-bold text-sm text-[#111c2d] mt-1">{tip.title}</h5>
                            <p className="text-xs text-[#8d4b00] font-semibold italic mt-1 bg-[#fffaf5] p-2 rounded-lg border border-[#ffe1cc]">
                              &ldquo;{tip.ruleOfThumb}&rdquo;
                            </p>
                            <p className="text-xs text-[#554336] mt-2 leading-relaxed">
                              {tip.explanation}
                            </p>
                          </div>

                          <div className="pt-2 border-t border-[#dee8ff] text-[11px] text-[#1b2b44] bg-[#eef3ff] p-2 rounded-xl">
                            <strong>Breeder Secret:</strong> {tip.proBreederSecret}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-[#f0f3ff] border-t border-[#dee8ff] flex items-center justify-between">
              <span className="text-xs text-[#554336]">
                {savedTips.length} tips bookmarked for your puppy journey.
              </span>
              <button
                onClick={() => setIsFullHandbookOpen(false)}
                className="px-5 py-2 bg-[#8d4b00] hover:bg-[#b15f00] text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                Done Reading
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
