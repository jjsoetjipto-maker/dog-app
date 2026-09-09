import React, { useState, useMemo } from 'react';
import { Dog, Screen } from '../types';

interface FindDogsScreenProps {
  dogs: Dog[];
  onSelectDog: (dog: Dog) => void;
  onOpenChat: (dog: Dog) => void;
  onToggleFavorite: (id: string) => void;
  favoritedDogIds: string[];
  setCurrentScreen: (screen: Screen) => void;
  onShowToast: (msg: string) => void;
  initialSearchQuery?: string;
}

export const FindDogsScreen: React.FC<FindDogsScreenProps> = ({
  dogs,
  onSelectDog,
  onOpenChat,
  onToggleFavorite,
  favoritedDogIds,
  setCurrentScreen,
  onShowToast,
  initialSearchQuery = ''
}) => {
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'puppy' | 'rescue'>('all');
  const [breedSearch, setBreedSearch] = useState('');
  const [selectedBreeds, setSelectedBreeds] = useState<string[]>([]);
  const [selectedGender, setSelectedGender] = useState<string>('all');
  const [selectedAge, setSelectedAge] = useState<string>('all');
  const [maxFee, setMaxFee] = useState<number>(3000);
  const [requireOFA, setRequireOFA] = useState<boolean>(true);
  const [requireDNA, setRequireDNA] = useState<boolean>(true);
  const [sortBy, setSortBy] = useState<string>('featured');
  const [alertEmail, setAlertEmail] = useState('');

  const breedList = [
    { name: 'Golden Retriever', count: 42 },
    { name: 'Pembroke Welsh Corgi', count: 28 },
    { name: 'French Bulldog', count: 19 },
    { name: 'Australian Shepherd', count: 24 },
    { name: 'Cavalier King Charles', count: 16 },
    { name: 'Bernedoodle (F1B)', count: 31 },
    { name: 'Border Collie & Lab Mix', count: 22 },
    { name: 'Miniature Dachshund', count: 18 },
    { name: 'Malinois / Shepherd Mix', count: 14 }
  ];

  const toggleBreed = (breedName: string) => {
    setSelectedBreeds((prev) =>
      prev.includes(breedName) ? prev.filter((b) => b !== breedName) : [...prev, breedName]
    );
  };

  const filteredDogs = useMemo(() => {
    return dogs.filter((d) => {
      // Category
      if (categoryFilter === 'puppy' && d.category !== 'puppy') return false;
      if (categoryFilter === 'rescue' && !d.isRescue) return false;

      // Breeds
      if (selectedBreeds.length > 0 && !selectedBreeds.some((b) => d.breed.toLowerCase().includes(b.toLowerCase()))) {
        return false;
      }

      // Keyword Search
      if (initialSearchQuery && !d.breed.toLowerCase().includes(initialSearchQuery.toLowerCase()) && !d.name.toLowerCase().includes(initialSearchQuery.toLowerCase())) {
        return false;
      }

      // Gender
      if (selectedGender !== 'all' && d.gender.toLowerCase() !== selectedGender.toLowerCase()) {
        return false;
      }

      // Price / Fee
      if (d.price > maxFee) return false;

      return true;
    }).sort((a, b) => {
      if (sortBy === 'fee-low') return a.price - b.price;
      if (sortBy === 'fee-high') return b.price - a.price;
      if (sortBy === 'distance') return (a.distanceMiles || 0) - (b.distanceMiles || 0);
      return 0; // featured
    });
  }, [dogs, categoryFilter, selectedBreeds, initialSearchQuery, selectedGender, maxFee, sortBy]);

  const handleAlertSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!alertEmail || !alertEmail.includes('@')) {
      onShowToast('Please provide a valid email.');
      return;
    }
    onShowToast(`Match Alert Created! You will receive instant notifications for new OFA-cleared litters.`);
    setAlertEmail('');
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* Top Header Banner */}
      <section className="bg-gradient-to-b from-[#e7eeff] to-[#f9f9ff] py-10 px-4 sm:px-6 lg:px-8 border-b border-[#dee8ff]">
        <div className="max-w-7xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ffdcc3] text-[#8d4b00] text-xs font-bold">
            <span className="material-symbols-outlined text-sm">verified</span>
            <span>Audited Home Litters & Accredited Rescues</span>
          </div>
          <h1 className="font-['Epilogue'] font-bold text-3xl sm:text-4xl text-[#111c2d] tracking-tight">
            Find Your New Best Friend
          </h1>
          <p className="text-xs sm:text-sm text-[#554336] max-w-2xl leading-relaxed">
            Every listed companion is backed by parental DNA and orthopedic screenings, home-raised socialization protocols, 72-hour escrow protection, and our 10-year genetic health guarantee.
          </p>

          {/* Active Filter Tags */}
          <div className="flex flex-wrap items-center gap-2 pt-3">
            <span className="text-[11px] font-bold text-[#887364] uppercase tracking-wider">Active:</span>
            
            <span className="inline-flex items-center gap-1 text-xs bg-white text-[#111c2d] px-3 py-1 rounded-full border border-[#dee8ff]">
              <span>Category: {categoryFilter === 'all' ? 'All Dogs' : categoryFilter}</span>
              {categoryFilter !== 'all' && (
                <button onClick={() => setCategoryFilter('all')} className="text-[#887364] hover:text-[#111c2d] cursor-pointer">×</button>
              )}
            </span>

            <span className="inline-flex items-center gap-1 text-xs bg-white text-[#006c4a] px-3 py-1 rounded-full border border-[#82f5c1]">
              <span className="material-symbols-outlined text-xs">verified</span>
              <span>OFA Cleared Lineage</span>
            </span>

            <span className="inline-flex items-center gap-1 text-xs bg-white text-[#006c4a] px-3 py-1 rounded-full border border-[#82f5c1]">
              <span className="material-symbols-outlined text-xs">biotech</span>
              <span>250+ Genetic DNA Panel</span>
            </span>

            <button
              onClick={() => {
                setCategoryFilter('all');
                setSelectedBreeds([]);
                setSelectedGender('all');
                setMaxFee(3000);
              }}
              className="text-xs text-[#8d4b00] font-bold hover:underline cursor-pointer ml-2"
            >
              Reset Filters
            </button>
          </div>
        </div>
      </section>

      {/* Main Two Column Area */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Filter Sidebar */}
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-white rounded-3xl p-5 border border-[#dee8ff] shadow-xs space-y-6">
              
              <div className="flex items-center justify-between pb-3 border-b border-[#e7eeff]">
                <h3 className="font-bold text-sm text-[#111c2d] flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-base text-[#8d4b00]">tune</span>
                  <span>Filter Companions</span>
                </h3>
              </div>

              {/* Category Radio */}
              <div>
                <label className="block text-[11px] font-bold text-[#887364] uppercase tracking-wider mb-2">
                  Category Type
                </label>
                <div className="space-y-1.5 text-xs text-[#554336]">
                  {[
                    { id: 'all', label: 'All Dogs (248)' },
                    { id: 'puppy', label: 'Ethical Puppies (182)' },
                    { id: 'rescue', label: 'Rescue & Shelter (66)' }
                  ].map((cat) => (
                    <label key={cat.id} className="flex items-center gap-2 cursor-pointer hover:text-[#111c2d]">
                      <input
                        type="radio"
                        name="catRadio"
                        checked={categoryFilter === cat.id}
                        onChange={() => setCategoryFilter(cat.id as any)}
                        className="text-[#8d4b00] focus:ring-[#ffdcc3]"
                      />
                      <span>{cat.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Breed Selection */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-[11px] font-bold text-[#887364] uppercase tracking-wider">
                    Breed
                  </label>
                  {selectedBreeds.length > 0 && (
                    <button
                      onClick={() => setSelectedBreeds([])}
                      className="text-[10px] text-[#8d4b00] font-bold hover:underline"
                    >
                      Clear
                    </button>
                  )}
                </div>
                <input
                  type="text"
                  value={breedSearch}
                  onChange={(e) => setBreedSearch(e.target.value)}
                  placeholder="Search breed..."
                  className="w-full px-2.5 py-1.5 text-xs bg-[#f0f3ff] border border-[#dee8ff] rounded-xl mb-2 focus:outline-none focus:border-[#8d4b00]"
                />
                <div className="max-h-40 overflow-y-auto space-y-1.5 text-xs text-[#554336] pr-1">
                  {breedList
                    .filter((b) => b.name.toLowerCase().includes(breedSearch.toLowerCase()))
                    .map((b) => (
                      <label key={b.name} className="flex items-center justify-between cursor-pointer hover:text-[#111c2d]">
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={selectedBreeds.includes(b.name)}
                            onChange={() => toggleBreed(b.name)}
                            className="rounded text-[#8d4b00] focus:ring-[#ffdcc3]"
                          />
                          <span className="text-xs truncate max-w-[150px]">{b.name}</span>
                        </div>
                        <span className="text-[10px] text-[#887364]">({b.count})</span>
                      </label>
                    ))}
                </div>
              </div>

              {/* Life Stage */}
              <div>
                <label className="block text-[11px] font-bold text-[#887364] uppercase tracking-wider mb-2">
                  Life Stage
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {['all', 'Puppy (8-16w)', 'Young (4-12m)', 'Adult'].map((age) => (
                    <button
                      key={age}
                      onClick={() => setSelectedAge(age)}
                      className={`text-[11px] px-2.5 py-1.5 rounded-lg border font-medium cursor-pointer ${
                        selectedAge === age
                          ? 'bg-[#ffdcc3] text-[#8d4b00] border-[#8d4b00]'
                          : 'bg-[#f0f3ff] text-[#554336] border-[#dee8ff]'
                      }`}
                    >
                      {age === 'all' ? 'All Ages' : age}
                    </button>
                  ))}
                </div>
              </div>

              {/* Gender */}
              <div>
                <label className="block text-[11px] font-bold text-[#887364] uppercase tracking-wider mb-2">
                  Gender
                </label>
                <div className="grid grid-cols-3 gap-1.5 text-xs">
                  {['all', 'Male', 'Female'].map((g) => (
                    <button
                      key={g}
                      onClick={() => setSelectedGender(g)}
                      className={`py-1.5 rounded-lg border font-medium cursor-pointer text-center ${
                        selectedGender === g
                          ? 'bg-[#ffdcc3] text-[#8d4b00] border-[#8d4b00]'
                          : 'bg-[#f0f3ff] text-[#554336] border-[#dee8ff]'
                      }`}
                    >
                      {g === 'all' ? 'Any' : g}
                    </button>
                  ))}
                </div>
              </div>

              {/* Health & Trust Standards (Strict) */}
              <div className="p-3.5 bg-[#f0f3ff] rounded-2xl border border-[#dee8ff] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-[#006c4a] uppercase tracking-wider">
                    Health Credentials
                  </span>
                  <span className="bg-[#82f5c1] text-[#006c4a] text-[9px] font-bold px-1.5 py-0.5 rounded">
                    Strict
                  </span>
                </div>
                <label className="flex items-center gap-2 text-xs text-[#554336] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={requireOFA}
                    onChange={(e) => setRequireOFA(e.target.checked)}
                    className="rounded text-[#006c4a]"
                  />
                  <span>OFA Hips/Elbows Cleared</span>
                </label>
                <label className="flex items-center gap-2 text-xs text-[#554336] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={requireDNA}
                    onChange={(e) => setRequireDNA(e.target.checked)}
                    className="rounded text-[#006c4a]"
                  />
                  <span>DNA 250+ Disorder Clear</span>
                </label>
              </div>

              {/* Placement Fee Slider with Histogram representation */}
              <div>
                <div className="flex justify-between items-center mb-1 text-xs">
                  <span className="font-bold text-[#887364] uppercase text-[11px]">Max Adoption Fee</span>
                  <span className="font-bold text-[#8d4b00]">${maxFee.toLocaleString()}</span>
                </div>

                {/* Decorative fee density histogram */}
                <div className="flex items-end gap-1 h-8 mb-2 px-1">
                  {[20, 45, 80, 100, 70, 50, 30, 15].map((h, i) => (
                    <div
                      key={i}
                      className="flex-1 bg-[#ffdcc3] rounded-t-xs"
                      style={{ height: `${h}%` }}
                    ></div>
                  ))}
                </div>

                <input
                  type="range"
                  min="300"
                  max="3500"
                  step="50"
                  value={maxFee}
                  onChange={(e) => setMaxFee(Number(e.target.value))}
                  className="w-full accent-[#8d4b00] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-[#887364] mt-1">
                  <span>$300 (Rescue)</span>
                  <span>$1,800</span>
                  <span>$3,500+</span>
                </div>
              </div>

            </div>
          </div>

          {/* Right Dogs Showcase */}
          <div className="lg:col-span-9 space-y-6">
            
            {/* Top Toolbar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-[#dee8ff]">
              <div>
                <p className="text-xs text-[#554336]">
                  Showing <strong className="text-[#111c2d]">{filteredDogs.length}</strong> verified dogs & puppies
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs">
                <span className="text-[#887364]">Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-[#f0f3ff] border border-[#dee8ff] rounded-xl px-3 py-1.5 font-bold text-[#111c2d] focus:outline-none focus:border-[#8d4b00] cursor-pointer"
                >
                  <option value="featured">Featured Recommendations</option>
                  <option value="distance">Nearest Distance</option>
                  <option value="fee-low">Fee: Low to High</option>
                  <option value="fee-high">Fee: High to Low</option>
                </select>
              </div>
            </div>

            {/* Dogs Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDogs.map((dog) => {
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
                        <span className="bg-white/95 backdrop-blur-xs text-[#006c4a] text-[10px] font-bold px-2.5 py-1 rounded-full border border-[#82f5c1] flex items-center gap-1 shadow-xs">
                          <span className="material-symbols-outlined text-xs">verified</span>
                          <span>{dog.verifiedStatus}</span>
                        </span>
                        {dog.isRescue && (
                          <span className="bg-[#a33900] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                            Rescue Shelter
                          </span>
                        )}
                      </div>

                      {/* Favorite Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleFavorite(dog.id);
                          onShowToast(isFavorited ? `Removed ${dog.name} from wishlist` : `Saved ${dog.name} to wishlist!`);
                        }}
                        className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center text-[#887364] hover:text-[#ba1a1a] transition-colors cursor-pointer shadow-sm z-10"
                      >
                        <span className="material-symbols-outlined text-base">
                          {isFavorited ? 'favorite' : 'favorite_border'}
                        </span>
                      </button>

                      {/* Price Tag Overlay */}
                      <div className="absolute bottom-3 left-3 bg-[#111c2d]/85 backdrop-blur-xs text-white text-xs font-bold px-2.5 py-1 rounded-xl pointer-events-none">
                        ${dog.price.toLocaleString()}
                      </div>
                    </div>

                    {/* Dog Details */}
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

                        {/* Badges pills */}
                        <div className="flex flex-wrap gap-1 mt-2.5">
                          {dog.badges.slice(0, 2).map((b, i) => (
                            <span key={i} className="text-[10px] bg-[#f0f3ff] text-[#554336] px-2 py-0.5 rounded font-medium border border-[#dee8ff]">
                              {b}
                            </span>
                          ))}
                        </div>

                        {/* Breeder Info */}
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

                      {/* Action Buttons */}
                      <div className="mt-4 grid grid-cols-2 gap-2">
                        <button
                          onClick={() => {
                            onSelectDog(dog);
                            setCurrentScreen('dog-detail');
                          }}
                          className="w-full bg-[#f0f3ff] hover:bg-[#dee8ff] text-[#111c2d] py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer text-center"
                        >
                          Profile
                        </button>
                        <button
                          onClick={() => onOpenChat(dog)}
                          className="w-full bg-[#8d4b00] hover:bg-[#b15f00] text-white py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1"
                        >
                          <span className="material-symbols-outlined text-sm">chat</span>
                          <span>Inquire</span>
                        </button>
                      </div>

                    </div>
                  </div>
                );
              })}
            </div>

            {/* Match Alert Notification Box */}
            <div className="bg-[#ffdcc3]/40 border border-[#dbc2b0] rounded-3xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#8d4b00] text-white flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-xl">notifications_active</span>
                </div>
                <div>
                  <h4 className="font-bold text-xs sm:text-sm text-[#111c2d]">
                    Can't find the exact companion you're searching for?
                  </h4>
                  <p className="text-[11px] text-[#554336]">
                    Set a PawPalace Match Alert. We will notify you the moment an OFA-cleared litter is born.
                  </p>
                </div>
              </div>

              <form onSubmit={handleAlertSubmit} className="flex gap-2 w-full sm:w-auto">
                <input
                  type="email"
                  value={alertEmail}
                  onChange={(e) => setAlertEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="px-3 py-2 bg-white border border-[#dee8ff] rounded-xl text-xs focus:outline-none focus:border-[#8d4b00] w-full sm:w-48"
                />
                <button
                  type="submit"
                  className="bg-[#8d4b00] hover:bg-[#b15f00] text-white px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer transition-colors"
                >
                  Notify Me
                </button>
              </form>
            </div>

          </div>

        </div>
      </section>

    </div>
  );
};
