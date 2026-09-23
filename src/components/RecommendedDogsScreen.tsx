import React, { useState, useMemo } from 'react';
import { Dog, Screen } from '../types';
import { useSettings } from '../context/SettingsContext';

interface RecommendedDogsScreenProps {
  dogs: Dog[];
  onSelectDog: (dog: Dog) => void;
  onOpenChat: (dog: Dog) => void;
  onToggleFavorite: (dogId: string) => void;
  favoritedDogIds: string[];
  setCurrentScreen: (screen: Screen) => void;
  onShowToast: (msg: string) => void;
  onRejectDog?: (id: string, reason?: string) => void;
}

type LivingSpace = 'any' | 'apartment' | 'house_yard' | 'acreage';
type ActivityLevel = 'any' | 'low' | 'moderate' | 'high';
type DogSize = 'any' | 'small' | 'medium' | 'large';
type LifeStagePref = 'any' | 'puppy' | 'young_adult' | 'rescue';

interface ScoredDog {
  dog: Dog;
  matchScore: number;
  spaceFitScore: number;
  energyFitScore: number;
  familyFitScore: number;
  trainingFitScore: number;
  matchReasons: string[];
  highlightBadge: string;
}

export const RecommendedDogsScreen: React.FC<RecommendedDogsScreenProps> = ({
  dogs,
  onSelectDog,
  onOpenChat,
  onToggleFavorite,
  favoritedDogIds,
  setCurrentScreen,
  onShowToast,
  onRejectDog,
}) => {
  const { t, formatPrice, isDark } = useSettings();

  // Lifestyle Preferences State
  const [livingSpace, setLivingSpace] = useState<LivingSpace>('any');
  const [activityLevel, setActivityLevel] = useState<ActivityLevel>('moderate');
  const [dogSize, setDogSize] = useState<DogSize>('any');
  const [lifeStage, setLifeStage] = useState<LifeStagePref>('any');
  const [hasChildren, setHasChildren] = useState<boolean>(true);
  const [hasOtherPets, setHasOtherPets] = useState<boolean>(false);
  const [needsHypoallergenic, setNeedsHypoallergenic] = useState<boolean>(false);
  const [isFirstTimeOwner, setIsFirstTimeOwner] = useState<boolean>(false);

  // Compare mode state
  const [comparingDogIds, setComparingDogIds] = useState<string[]>([]);
  const [isCompareOpen, setIsCompareOpen] = useState<boolean>(false);

  // Quick Preset Handlers
  const applyPreset = (preset: 'city' | 'family' | 'outdoor' | 'calm') => {
    if (preset === 'city') {
      setLivingSpace('apartment');
      setActivityLevel('low');
      setDogSize('small');
      setLifeStage('any');
      setHasChildren(false);
      setNeedsHypoallergenic(false);
      setIsFirstTimeOwner(true);
      onShowToast('Applied "City Apartment Dweller" match preset!');
    } else if (preset === 'family') {
      setLivingSpace('house_yard');
      setActivityLevel('moderate');
      setDogSize('any');
      setLifeStage('puppy');
      setHasChildren(true);
      setHasOtherPets(true);
      setNeedsHypoallergenic(false);
      setIsFirstTimeOwner(false);
      onShowToast('Applied "Active Family with Kids" match preset!');
    } else if (preset === 'outdoor') {
      setLivingSpace('house_yard');
      setActivityLevel('high');
      setDogSize('medium');
      setLifeStage('any');
      setHasChildren(false);
      setNeedsHypoallergenic(false);
      setIsFirstTimeOwner(false);
      onShowToast('Applied "Outdoor Trail & Hiking Partner" match preset!');
    } else if (preset === 'calm') {
      setLivingSpace('any');
      setActivityLevel('low');
      setDogSize('any');
      setLifeStage('any');
      setHasChildren(true);
      setNeedsHypoallergenic(false);
      setIsFirstTimeOwner(true);
      onShowToast('Applied "Gentle & Low-Maintenance" match preset!');
    }
  };

  const handleResetPreferences = () => {
    setLivingSpace('any');
    setActivityLevel('moderate');
    setDogSize('any');
    setLifeStage('any');
    setHasChildren(false);
    setHasOtherPets(false);
    setNeedsHypoallergenic(false);
    setIsFirstTimeOwner(false);
    onShowToast('Reset match preferences to defaults.');
  };

  // Scoring engine for each dog
  const scoredDogs = useMemo<ScoredDog[]>(() => {
    return dogs.map((dog) => {
      let score = 80; // baseline high score
      let spaceScore = 85;
      let energyScore = 85;
      let familyScore = 85;
      let trainingScore = 85;
      const reasons: string[] = [];

      const breedLower = dog.breed.toLowerCase();
      const summaryLower = (dog.summary || '').toLowerCase();
      const traits = dog.temperament?.traits || [];
      const traitsStr = traits.join(' ').toLowerCase();

      // Breed classification helpers
      const isSmall = breedLower.includes('french bulldog') || breedLower.includes('cavalier') || breedLower.includes('poodle') || breedLower.includes('basset');
      const isLarge = breedLower.includes('golden') || breedLower.includes('shepherd') || breedLower.includes('bernese') || breedLower.includes('labrador');
      const isAussieOrHerding = breedLower.includes('australian') || breedLower.includes('collie') || breedLower.includes('shepherd');
      const isLowEnergyBreed = breedLower.includes('french bulldog') || breedLower.includes('basset') || breedLower.includes('cavalier');
      const isHypoBreed = breedLower.includes('poodle') || breedLower.includes('doodle') || breedLower.includes('bichon') || breedLower.includes('schnauzer');

      // 1. Living Space Factor
      if (livingSpace === 'apartment') {
        if (isSmall || isLowEnergyBreed) {
          score += 10;
          spaceScore = 98;
          reasons.push('Comfortable in compact living & apartment environments');
        } else if (isAussieOrHerding) {
          score -= 12;
          spaceScore = 65;
        } else {
          score += 2;
          spaceScore = 80;
        }
      } else if (livingSpace === 'house_yard' || livingSpace === 'acreage') {
        if (isLarge || isAussieOrHerding) {
          score += 10;
          spaceScore = 96;
          reasons.push('Thrives with secure yard space to explore & run');
        }
      }

      // 2. Activity Level Factor
      if (activityLevel === 'low') {
        if (isLowEnergyBreed || dog.category === 'senior') {
          score += 12;
          energyScore = 98;
          reasons.push('Content with gentle daily strolls & indoor cuddling');
        } else if (isAussieOrHerding) {
          score -= 14;
          energyScore = 60;
        }
      } else if (activityLevel === 'high') {
        if (isAussieOrHerding || breedLower.includes('retriever') || breedLower.includes('pointer')) {
          score += 14;
          energyScore = 99;
          reasons.push('Excels on running trails, agility & vigorous exercise');
        } else if (breedLower.includes('french bulldog')) {
          score -= 10;
          energyScore = 65;
        }
      } else {
        // moderate
        if (breedLower.includes('retriever') || breedLower.includes('cavalier') || dog.category === 'puppy') {
          score += 8;
          energyScore = 92;
          reasons.push('Balanced energy: playful in afternoon, calm in evening');
        }
      }

      // 3. Children Factor
      if (hasChildren) {
        if (traitsStr.includes('child') || traitsStr.includes('gentle') || breedLower.includes('golden') || breedLower.includes('cavalier')) {
          score += 10;
          familyScore = 99;
          reasons.push('Tested gentle & patient around toddlers & young kids');
        }
      }

      // 4. Other Pets Factor
      if (hasOtherPets) {
        if (traitsStr.includes('social') || breedLower.includes('golden') || breedLower.includes('retriever')) {
          score += 6;
          familyScore = Math.min(100, familyScore + 5);
          reasons.push('Friendly with household dogs & sociable nature');
        }
      }

      // 5. Hypoallergenic Requirement
      if (needsHypoallergenic) {
        if (isHypoBreed) {
          score += 18;
          trainingScore = 96;
          reasons.push('Low-dander, low-shed coat suitable for allergy-sensitive homes');
        } else {
          score -= 16;
        }
      }

      // 6. First-Time Owner Factor
      if (isFirstTimeOwner) {
        if (breedLower.includes('golden') || breedLower.includes('cavalier') || dog.temperament?.trainability.includes('Eager')) {
          score += 8;
          trainingScore = 98;
          reasons.push('Highly forgiving & eager-to-please temperament for first-time owners');
        } else if (breedLower.includes('shepherd') || isAussieOrHerding) {
          score -= 6;
          trainingScore = 75;
        }
      }

      // 7. Size Match
      if (dogSize === 'small') {
        if (isSmall) {
          score += 8;
          reasons.push('Matches compact toy/small breed preference');
        } else {
          score -= 10;
        }
      } else if (dogSize === 'large') {
        if (isLarge) {
          score += 8;
          reasons.push('Matches sturdy medium-to-large breed preference');
        } else {
          score -= 8;
        }
      }

      // 8. Life Stage Match
      if (lifeStage === 'puppy' && dog.category === 'puppy') {
        score += 8;
      } else if (lifeStage === 'rescue' && (dog.isRescue || dog.category === 'rescue')) {
        score += 15;
        reasons.push('Adoption-ready rescue eligible for PawPalace adoption grant');
      }

      // Ensure score is bounded between 68% and 99%
      const finalScore = Math.min(99, Math.max(68, score));

      // Choose an appropriate highlight badge
      let highlightBadge = 'Top Compatibility Fit';
      if (needsHypoallergenic && isHypoBreed) {
        highlightBadge = 'Hypoallergenic Pick';
      } else if (hasChildren && familyScore >= 95) {
        highlightBadge = 'Ideal Family Companion';
      } else if (livingSpace === 'apartment' && spaceScore >= 90) {
        highlightBadge = 'City & Apartment Star';
      } else if (activityLevel === 'high') {
        highlightBadge = 'Outdoor & Trail Partner';
      } else if (finalScore >= 95) {
        highlightBadge = 'Prime Lifestyle Match';
      }

      return {
        dog,
        matchScore: finalScore,
        spaceFitScore: spaceScore,
        energyFitScore: energyScore,
        familyFitScore: familyScore,
        trainingFitScore: trainingScore,
        matchReasons: reasons.slice(0, 3),
        highlightBadge,
      };
    }).sort((a, b) => b.matchScore - a.matchScore);
  }, [dogs, livingSpace, activityLevel, dogSize, lifeStage, hasChildren, hasOtherPets, needsHypoallergenic, isFirstTimeOwner]);

  const top3Dogs = scoredDogs.slice(0, 3);
  const otherRankedDogs = scoredDogs.slice(3);

  // Toggle dog comparison selection
  const handleToggleCompare = (dogId: string) => {
    if (comparingDogIds.includes(dogId)) {
      setComparingDogIds((prev) => prev.filter((id) => id !== dogId));
    } else {
      if (comparingDogIds.length >= 3) {
        onShowToast('You can compare up to 3 dogs at a time.');
        return;
      }
      setComparingDogIds((prev) => [...prev, dogId]);
    }
  };

  const comparedDogs = useMemo(() => {
    return scoredDogs.filter((sd) => comparingDogIds.includes(sd.dog.id));
  }, [scoredDogs, comparingDogIds]);

  return (
    <div className="min-h-screen bg-[#f9f9ff] dark:bg-[#0b1120] text-[#111c2d] dark:text-[#dee8ff] pb-24 transition-colors">
      
      {/* Top Hero Section */}
      <div className="bg-linear-to-b from-[#f0f3ff] via-[#f7f9ff] to-[#f9f9ff] dark:from-[#131b2e] dark:via-[#101728] dark:to-[#0b1120] border-b border-[#dee8ff] dark:border-[#1e2a42] pt-10 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 bg-[#ffdcc3] dark:bg-[#8d4b00]/40 text-[#8d4b00] dark:text-[#ffdcc3] px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3">
                <span className="material-symbols-outlined text-sm">auto_awesome</span>
                <span>Veterinary Temperament Matching Engine</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-[#111c2d] dark:text-white tracking-tight">
                {t.recommendedTitle}
              </h1>
              <p className="mt-2 text-sm sm:text-base text-[#554336] dark:text-[#cbd5e1] max-w-2xl leading-relaxed">
                {t.recommendedSubtitle}
              </p>
            </div>

            {/* Quick Lifestyle Preset Pills */}
            <div className="bg-white dark:bg-[#131d2e] p-3.5 rounded-2xl border border-[#dee8ff] dark:border-[#22314d] shadow-xs">
              <span className="text-xs font-bold text-[#887364] dark:text-[#94a3b8] block mb-2">
                Quick Lifestyle Presets:
              </span>
              <div className="flex flex-wrap gap-2">
                <button
                  id="preset-family-btn"
                  type="button"
                  onClick={() => applyPreset('family')}
                  className="px-2.5 py-1 text-xs font-bold rounded-lg bg-[#f0f3ff] dark:bg-[#1e293b] hover:bg-[#dee8ff] dark:hover:bg-[#2d3d57] text-[#111c2d] dark:text-white border border-[#dee8ff] dark:border-[#2e3e5c] flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span>👨‍👩‍👧</span>
                  <span>Family with Kids</span>
                </button>
                <button
                  id="preset-city-btn"
                  type="button"
                  onClick={() => applyPreset('city')}
                  className="px-2.5 py-1 text-xs font-bold rounded-lg bg-[#f0f3ff] dark:bg-[#1e293b] hover:bg-[#dee8ff] dark:hover:bg-[#2d3d57] text-[#111c2d] dark:text-white border border-[#dee8ff] dark:border-[#2e3e5c] flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span>🏢</span>
                  <span>City Apartment</span>
                </button>
                <button
                  id="preset-outdoor-btn"
                  type="button"
                  onClick={() => applyPreset('outdoor')}
                  className="px-2.5 py-1 text-xs font-bold rounded-lg bg-[#f0f3ff] dark:bg-[#1e293b] hover:bg-[#dee8ff] dark:hover:bg-[#2d3d57] text-[#111c2d] dark:text-white border border-[#dee8ff] dark:border-[#2e3e5c] flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span>🏃</span>
                  <span>Trail & Hike</span>
                </button>
                <button
                  id="preset-calm-btn"
                  type="button"
                  onClick={() => applyPreset('calm')}
                  className="px-2.5 py-1 text-xs font-bold rounded-lg bg-[#f0f3ff] dark:bg-[#1e293b] hover:bg-[#dee8ff] dark:hover:bg-[#2d3d57] text-[#111c2d] dark:text-white border border-[#dee8ff] dark:border-[#2e3e5c] flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span>🛋️</span>
                  <span>Low Maintenance</span>
                </button>
              </div>
            </div>
          </div>

          {/* Interactive Match Filter Bar */}
          <div className="mt-8 bg-white dark:bg-[#131d2e] rounded-2xl p-5 sm:p-6 border border-[#dee8ff] dark:border-[#22314d] shadow-xs">
            <div className="flex items-center justify-between border-b border-[#e7eeff] dark:border-[#1e2b44] pb-4 mb-5">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#8d4b00] dark:text-[#ffb77d] text-xl">tune</span>
                <h2 className="font-bold text-base text-[#111c2d] dark:text-white">
                  {t.lifestyleQuizTitle}
                </h2>
              </div>
              <button
                id="reset-match-prefs-btn"
                type="button"
                onClick={handleResetPreferences}
                className="text-xs text-[#8d4b00] dark:text-[#ffdcc3] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">restart_alt</span>
                <span>{t.resetPreferencesBtn}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Space */}
              <div>
                <label className="block text-xs font-bold text-[#887364] dark:text-[#94a3b8] uppercase tracking-wider mb-1.5">
                  {t.livingSpaceLabel}
                </label>
                <select
                  id="select-living-space"
                  value={livingSpace}
                  onChange={(e) => setLivingSpace(e.target.value as LivingSpace)}
                  className="w-full bg-[#f0f3ff] text-[#111c2d] dark:bg-[#1a253a] dark:text-white border border-[#dee8ff] dark:border-[#2e3e5c] rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#8d4b00]"
                >
                  <option value="any">Any Home Setup</option>
                  <option value="apartment">Apartment / Condo (No private yard)</option>
                  <option value="house_yard">House with Fenced Yard</option>
                  <option value="acreage">Acreage / Farm / Rural Land</option>
                </select>
              </div>

              {/* Activity Level */}
              <div>
                <label className="block text-xs font-bold text-[#887364] dark:text-[#94a3b8] uppercase tracking-wider mb-1.5">
                  {t.activityLevelLabel}
                </label>
                <select
                  id="select-activity-level"
                  value={activityLevel}
                  onChange={(e) => setActivityLevel(e.target.value as ActivityLevel)}
                  className="w-full bg-[#f0f3ff] text-[#111c2d] dark:bg-[#1a253a] dark:text-white border border-[#dee8ff] dark:border-[#2e3e5c] rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#8d4b00]"
                >
                  <option value="low">Gentle & Relaxed (30 min walk/day)</option>
                  <option value="moderate">Moderate & Playful (1–2 hrs/day)</option>
                  <option value="high">Athletic & Energetic (2+ hrs / Hiking)</option>
                  <option value="any">Any Activity Level</option>
                </select>
              </div>

              {/* Dog Size */}
              <div>
                <label className="block text-xs font-bold text-[#887364] dark:text-[#94a3b8] uppercase tracking-wider mb-1.5">
                  {t.sizePreferenceLabel}
                </label>
                <select
                  id="select-dog-size"
                  value={dogSize}
                  onChange={(e) => setDogSize(e.target.value as DogSize)}
                  className="w-full bg-[#f0f3ff] text-[#111c2d] dark:bg-[#1a253a] dark:text-white border border-[#dee8ff] dark:border-[#2e3e5c] rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#8d4b00]"
                >
                  <option value="any">Any Size</option>
                  <option value="small">Small / Toy (&lt; 25 lbs)</option>
                  <option value="medium">Medium (25–55 lbs)</option>
                  <option value="large">Large / Giant (55+ lbs)</option>
                </select>
              </div>

              {/* Life Stage */}
              <div>
                <label className="block text-xs font-bold text-[#887364] dark:text-[#94a3b8] uppercase tracking-wider mb-1.5">
                  Life Stage & Category
                </label>
                <select
                  id="select-life-stage"
                  value={lifeStage}
                  onChange={(e) => setLifeStage(e.target.value as LifeStagePref)}
                  className="w-full bg-[#f0f3ff] text-[#111c2d] dark:bg-[#1a253a] dark:text-white border border-[#dee8ff] dark:border-[#2e3e5c] rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#8d4b00]"
                >
                  <option value="any">All Ages</option>
                  <option value="puppy">Puppies (8–16 Weeks)</option>
                  <option value="young_adult">Young & Adult</option>
                  <option value="rescue">Vetted Rescue Companions</option>
                </select>
              </div>
            </div>

            {/* Checkbox Toggles for Household Criteria */}
            <div className="mt-4 pt-4 border-t border-[#e7eeff] dark:border-[#1e2b44] flex flex-wrap items-center gap-4 sm:gap-6 text-xs text-[#111c2d] dark:text-[#e2e8f0]">
              <label className="inline-flex items-center gap-2 font-semibold cursor-pointer select-none">
                <input
                  id="check-has-children"
                  type="checkbox"
                  checked={hasChildren}
                  onChange={(e) => setHasChildren(e.target.checked)}
                  className="w-4 h-4 rounded text-[#8d4b00] focus:ring-[#8d4b00]"
                />
                <span>Has Young Children (&lt;8 yrs)</span>
              </label>

              <label className="inline-flex items-center gap-2 font-semibold cursor-pointer select-none">
                <input
                  id="check-has-other-pets"
                  type="checkbox"
                  checked={hasOtherPets}
                  onChange={(e) => setHasOtherPets(e.target.checked)}
                  className="w-4 h-4 rounded text-[#8d4b00] focus:ring-[#8d4b00]"
                />
                <span>Has Other Dogs or Cats</span>
              </label>

              <label className="inline-flex items-center gap-2 font-semibold cursor-pointer select-none">
                <input
                  id="check-hypoallergenic"
                  type="checkbox"
                  checked={needsHypoallergenic}
                  onChange={(e) => setNeedsHypoallergenic(e.target.checked)}
                  className="w-4 h-4 rounded text-[#8d4b00] focus:ring-[#8d4b00]"
                />
                <span>Low-Shed / Hypoallergenic Needs</span>
              </label>

              <label className="inline-flex items-center gap-2 font-semibold cursor-pointer select-none">
                <input
                  id="check-first-time-owner"
                  type="checkbox"
                  checked={isFirstTimeOwner}
                  onChange={(e) => setIsFirstTimeOwner(e.target.checked)}
                  className="w-4 h-4 rounded text-[#8d4b00] focus:ring-[#8d4b00]"
                />
                <span>First-Time Dog Owner Friendly</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Comparison Drawer Trigger Bar (if any dogs selected) */}
      {comparingDogIds.length > 0 && (
        <div className="sticky top-0 z-30 bg-[#8d4b00] text-white py-2.5 px-4 shadow-md flex items-center justify-between">
          <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
            <span className="text-xs font-bold">
              Comparing {comparingDogIds.length} dog{comparingDogIds.length > 1 ? 's' : ''} (up to 3)
            </span>
            <div className="flex items-center gap-2">
              <button
                id="open-compare-drawer-btn"
                onClick={() => setIsCompareOpen(true)}
                className="bg-white text-[#8d4b00] hover:bg-[#ffdcc3] px-3 py-1 rounded-full text-xs font-bold transition-colors cursor-pointer"
              >
                View Side-by-Side Comparison
              </button>
              <button
                id="clear-compare-btn"
                onClick={() => setComparingDogIds([])}
                className="text-xs text-white/80 hover:text-white px-2 cursor-pointer"
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* Section 1: Prime Matches Spotlight */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <span className="text-xs font-bold text-[#8d4b00] dark:text-[#ffb77d] tracking-wider uppercase">
                Highest Veterinary Fit
              </span>
              <h2 className="text-2xl font-black text-[#111c2d] dark:text-white tracking-tight">
                {t.topMatchesLabel}
              </h2>
            </div>
            <span className="text-xs text-[#887364] dark:text-[#94a3b8]">
              Ranked dynamically by compatibility score
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {top3Dogs.map(({ dog, matchScore, spaceFitScore, energyFitScore, familyFitScore, trainingFitScore, matchReasons, highlightBadge }, idx) => {
              const isComparing = comparingDogIds.includes(dog.id);
              const isFav = favoritedDogIds.includes(dog.id);

              return (
                <div
                  key={dog.id}
                  id={`top-match-card-${dog.id}`}
                  className="relative bg-white dark:bg-[#131d2e] rounded-2xl border-2 border-[#ffdcc3] dark:border-[#3b4b6a] shadow-md hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden group"
                >
                  {/* Rank Badge */}
                  <div className="absolute top-3 left-3 z-10 bg-[#8d4b00] text-white text-xs font-black px-2.5 py-1 rounded-full shadow-md flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">stars</span>
                    <span>#{idx + 1} Best Match</span>
                  </div>

                  {/* Favorite button */}
                  <button
                    id={`top-match-fav-${dog.id}`}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleFavorite(dog.id);
                    }}
                    className="absolute top-3 right-3 z-10 p-2 bg-black/40 hover:bg-black/60 text-white rounded-full backdrop-blur-xs transition-colors cursor-pointer"
                    title="Save to Wishlist"
                  >
                    <span className="material-symbols-outlined text-lg">
                      {isFav ? 'favorite' : 'favorite_border'}
                    </span>
                  </button>

                  {/* Dog Image */}
                  <div 
                    onClick={() => onSelectDog(dog)}
                    className="relative h-60 w-full overflow-hidden cursor-pointer bg-[#e7eeff] dark:bg-[#1c283f]"
                  >
                    <img
                      src={dog.image}
                      alt={dog.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/70 via-transparent to-transparent"></div>
                    
                    <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between text-white">
                      <div>
                        <h3 className="text-xl font-bold">{dog.name}</h3>
                        <p className="text-xs text-white/90 font-medium">{dog.breed} • {dog.ageText}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-xs text-white/80 block">Adoption Fee</span>
                        <span className="text-lg font-black">{formatPrice(dog.price)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      {/* Compatibility Progress bar */}
                      <div className="mb-4 bg-[#f0f3ff] dark:bg-[#162035] p-3 rounded-xl border border-[#dee8ff] dark:border-[#233150]">
                        <div className="flex items-center justify-between text-xs font-bold mb-1.5">
                          <span className="text-[#8d4b00] dark:text-[#ffb77d] flex items-center gap-1">
                            <span className="material-symbols-outlined text-sm">verified</span>
                            <span>{highlightBadge}</span>
                          </span>
                          <span className="text-base font-black text-[#006c4a] dark:text-[#85f8c4]">
                            {matchScore}%
                          </span>
                        </div>
                        <div className="w-full bg-[#dee8ff] dark:bg-[#2b3a54] h-2 rounded-full overflow-hidden">
                          <div
                            className="bg-linear-to-r from-[#8d4b00] to-[#006c4a] h-full rounded-full transition-all duration-500"
                            style={{ width: `${matchScore}%` }}
                          ></div>
                        </div>

                        {/* Factor breakdown micro tags */}
                        <div className="grid grid-cols-2 gap-2 mt-3 pt-2 border-t border-[#dee8ff] dark:border-[#233150] text-[11px] text-[#554336] dark:text-[#94a3b8]">
                          <div>Space Fit: <b className="text-[#111c2d] dark:text-white">{spaceFitScore}%</b></div>
                          <div>Energy Sync: <b className="text-[#111c2d] dark:text-white">{energyFitScore}%</b></div>
                          <div>Family Safety: <b className="text-[#111c2d] dark:text-white">{familyFitScore}%</b></div>
                          <div>Trainability: <b className="text-[#111c2d] dark:text-white">{trainingFitScore}%</b></div>
                        </div>
                      </div>

                      {/* Why Recommended bullets */}
                      <div className="space-y-1.5 mb-4">
                        <span className="text-[11px] font-bold text-[#887364] dark:text-[#94a3b8] uppercase tracking-wider block">
                          Why matched for you:
                        </span>
                        {matchReasons.map((reason, rIdx) => (
                          <div key={rIdx} className="flex items-start gap-1.5 text-xs text-[#111c2d] dark:text-[#cbd5e1]">
                            <span className="material-symbols-outlined text-[#006c4a] text-sm shrink-0 mt-0.5">check_circle</span>
                            <span>{reason}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="pt-3 border-t border-[#e7eeff] dark:border-[#1e2b44] flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                        <button
                          id={`top-match-profile-${dog.id}`}
                          type="button"
                          onClick={() => onSelectDog(dog)}
                          className="flex-1 bg-[#8d4b00] hover:bg-[#b15f00] text-white py-2 px-3 rounded-xl text-xs font-bold transition-colors cursor-pointer text-center"
                        >
                          View Full Profile
                        </button>
                        <button
                          id={`top-match-chat-${dog.id}`}
                          type="button"
                          onClick={() => onOpenChat(dog)}
                          className="p-2 bg-[#ffdcc3] hover:bg-[#ffcfad] text-[#8d4b00] dark:bg-[#8d4b00]/30 dark:hover:bg-[#8d4b00]/50 dark:text-[#ffdcc3] rounded-xl text-xs font-bold transition-colors cursor-pointer"
                          title="Chat with Breeder"
                        >
                          <span className="material-symbols-outlined text-base">chat</span>
                        </button>
                      </div>

                      <button
                        id={`top-match-compare-${dog.id}`}
                        type="button"
                        onClick={() => handleToggleCompare(dog.id)}
                        className={`w-full py-1.5 px-3 rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
                          isComparing
                            ? 'bg-[#111c2d] text-white dark:bg-white dark:text-[#111c2d]'
                            : 'bg-[#f0f3ff] dark:bg-[#162035] text-[#554336] dark:text-[#94a3b8] hover:bg-[#dee8ff] dark:hover:bg-[#1c2842] border border-[#dee8ff] dark:border-[#233150]'
                        }`}
                      >
                        <span className="material-symbols-outlined text-sm">
                          {isComparing ? 'check_box' : 'check_box_outline_blank'}
                        </span>
                        <span>{isComparing ? 'Selected for Comparison' : 'Add to Compare'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Section 2: All Other Matched Dogs */}
        {otherRankedDogs.length > 0 && (
          <div className="mt-14">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-[#111c2d] dark:text-white">
                  Additional Matched Companions ({otherRankedDogs.length})
                </h3>
                <p className="text-xs text-[#887364] dark:text-[#94a3b8]">
                  Other verified dogs evaluated against your lifestyle criteria
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {otherRankedDogs.map(({ dog, matchScore, highlightBadge, matchReasons }) => {
                const isFav = favoritedDogIds.includes(dog.id);
                const isComparing = comparingDogIds.includes(dog.id);

                return (
                  <div
                    key={dog.id}
                    id={`matched-dog-${dog.id}`}
                    className="bg-white dark:bg-[#131d2e] rounded-2xl border border-[#dee8ff] dark:border-[#22314d] overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div>
                      {/* Image */}
                      <div
                        onClick={() => onSelectDog(dog)}
                        className="relative h-48 w-full overflow-hidden cursor-pointer bg-[#e7eeff] dark:bg-[#1c283f]"
                      >
                        <img
                          src={dog.image}
                          alt={dog.name}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                        <button
                          id={`matched-dog-fav-${dog.id}`}
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleFavorite(dog.id);
                          }}
                          className="absolute top-3 right-3 p-1.5 bg-black/40 hover:bg-black/60 text-white rounded-full backdrop-blur-xs transition-colors cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-base">
                            {isFav ? 'favorite' : 'favorite_border'}
                          </span>
                        </button>
                        <div className="absolute bottom-2 left-2 bg-[#8d4b00] text-white text-[11px] font-bold px-2 py-0.5 rounded-md shadow-xs">
                          {matchScore}% Match
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-bold text-base text-[#111c2d] dark:text-white">
                              {dog.name}
                            </h4>
                            <p className="text-xs text-[#887364] dark:text-[#94a3b8]">
                              {dog.breed} • {dog.ageText}
                            </p>
                          </div>
                          <span className="font-extrabold text-sm text-[#8d4b00] dark:text-[#ffdcc3]">
                            {formatPrice(dog.price)}
                          </span>
                        </div>

                        <div className="mt-2 text-xs text-[#554336] dark:text-[#94a3b8] line-clamp-1">
                          📍 {dog.location} • {dog.breederName}
                        </div>

                        {/* Top Reason */}
                        {matchReasons.length > 0 && (
                          <div className="mt-3 p-2 rounded-lg bg-[#f0f3ff] dark:bg-[#162035] border border-[#dee8ff] dark:border-[#233150] text-[11px] text-[#111c2d] dark:text-[#cbd5e1] flex items-center gap-1.5">
                            <span className="material-symbols-outlined text-[#006c4a] text-sm">verified</span>
                            <span className="line-clamp-1">{matchReasons[0]}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="p-4 pt-0 border-t border-[#e7eeff] dark:border-[#1e2b44] mt-2 flex items-center gap-2">
                      <button
                        id={`matched-profile-btn-${dog.id}`}
                        type="button"
                        onClick={() => onSelectDog(dog)}
                        className="flex-1 bg-[#8d4b00] hover:bg-[#b15f00] text-white py-1.5 px-3 rounded-lg text-xs font-bold transition-colors cursor-pointer text-center"
                      >
                        Profile
                      </button>
                      <button
                        id={`matched-chat-btn-${dog.id}`}
                        type="button"
                        onClick={() => onOpenChat(dog)}
                        className="p-1.5 bg-[#ffdcc3] hover:bg-[#ffcfad] text-[#8d4b00] dark:bg-[#8d4b00]/30 dark:hover:bg-[#8d4b00]/50 dark:text-[#ffdcc3] rounded-lg text-xs font-bold transition-colors cursor-pointer"
                        title="Chat"
                      >
                        <span className="material-symbols-outlined text-sm">chat</span>
                      </button>
                      <button
                        id={`matched-compare-btn-${dog.id}`}
                        type="button"
                        onClick={() => handleToggleCompare(dog.id)}
                        className={`p-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                          isComparing
                            ? 'bg-[#111c2d] text-white dark:bg-white dark:text-[#111c2d]'
                            : 'bg-[#f0f3ff] dark:bg-[#162035] text-[#554336] dark:text-[#94a3b8] border border-[#dee8ff] dark:border-[#233150] hover:bg-[#dee8ff] dark:hover:bg-[#1c2842]'
                        }`}
                        title="Compare"
                      >
                        <span className="material-symbols-outlined text-sm">compare_arrows</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>

      {/* Side-by-Side Dog Comparison Modal */}
      {isCompareOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setIsCompareOpen(false)}
        >
          <div 
            className="bg-white dark:bg-[#131d2e] rounded-3xl max-w-4xl w-full p-6 shadow-2xl border border-[#dee8ff] dark:border-[#233150] max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[#e7eeff] dark:border-[#1e2b44] pb-4 mb-6">
              <div>
                <h3 className="text-xl font-black text-[#111c2d] dark:text-white">
                  Side-by-Side Compatibility Breakdown
                </h3>
                <p className="text-xs text-[#887364] dark:text-[#94a3b8]">
                  Comparing your selected canine matches across lifestyle and temperament traits
                </p>
              </div>
              <button
                id="close-compare-modal-btn"
                type="button"
                onClick={() => setIsCompareOpen(false)}
                className="p-1.5 hover:bg-[#f0f3ff] dark:hover:bg-[#1e2b44] text-[#554336] dark:text-[#cbd5e1] rounded-full text-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className={`grid grid-cols-1 md:grid-cols-${comparedDogs.length} gap-6`}>
              {comparedDogs.map(({ dog, matchScore, spaceFitScore, energyFitScore, familyFitScore, trainingFitScore, matchReasons }) => (
                <div key={dog.id} className="border border-[#dee8ff] dark:border-[#22314d] rounded-2xl p-4 bg-[#f0f3ff] dark:bg-[#162035]">
                  <img
                    src={dog.image}
                    alt={dog.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-44 object-cover rounded-xl mb-3"
                  />
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-lg font-black text-[#111c2d] dark:text-white">{dog.name}</h4>
                    <span className="text-xs font-black bg-[#006c4a] text-white px-2 py-0.5 rounded-full">
                      {matchScore}% Match
                    </span>
                  </div>
                  <p className="text-xs text-[#887364] dark:text-[#94a3b8] mb-3">{dog.breed} • {formatPrice(dog.price)}</p>

                  <div className="space-y-2.5 text-xs text-[#111c2d] dark:text-[#dee8ff]">
                    <div>
                      <div className="flex justify-between font-semibold mb-1">
                        <span>Space Fit</span>
                        <span>{spaceFitScore}%</span>
                      </div>
                      <div className="w-full bg-[#dee8ff] dark:bg-[#2b3a54] h-1.5 rounded-full overflow-hidden">
                        <div className="bg-[#8d4b00] h-full rounded-full" style={{ width: `${spaceFitScore}%` }}></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between font-semibold mb-1">
                        <span>Energy Sync</span>
                        <span>{energyFitScore}%</span>
                      </div>
                      <div className="w-full bg-[#dee8ff] dark:bg-[#2b3a54] h-1.5 rounded-full overflow-hidden">
                        <div className="bg-[#8d4b00] h-full rounded-full" style={{ width: `${energyFitScore}%` }}></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between font-semibold mb-1">
                        <span>Family & Kids</span>
                        <span>{familyFitScore}%</span>
                      </div>
                      <div className="w-full bg-[#dee8ff] dark:bg-[#2b3a54] h-1.5 rounded-full overflow-hidden">
                        <div className="bg-[#006c4a] h-full rounded-full" style={{ width: `${familyFitScore}%` }}></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between font-semibold mb-1">
                        <span>Trainability</span>
                        <span>{trainingFitScore}%</span>
                      </div>
                      <div className="w-full bg-[#dee8ff] dark:bg-[#2b3a54] h-1.5 rounded-full overflow-hidden">
                        <div className="bg-[#8d4b00] h-full rounded-full" style={{ width: `${trainingFitScore}%` }}></div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#dee8ff] dark:border-[#273752]">
                    <span className="text-[11px] font-bold text-[#887364] dark:text-[#94a3b8] block mb-1">Key Strengths:</span>
                    <ul className="text-[11px] space-y-1 text-[#111c2d] dark:text-[#cbd5e1]">
                      {matchReasons.map((r, i) => (
                        <li key={i} className="flex items-center gap-1">
                          <span className="text-[#006c4a]">✓</span> {r}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button
                    id={`compare-view-dog-${dog.id}`}
                    type="button"
                    onClick={() => {
                      setIsCompareOpen(false);
                      onSelectDog(dog);
                    }}
                    className="mt-4 w-full bg-[#8d4b00] hover:bg-[#b15f00] text-white py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                  >
                    View {dog.name}'s Profile
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
