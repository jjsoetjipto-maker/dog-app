import React, { useState } from 'react';
import { Dog, GearProduct, Screen } from '../types';
import { DogIndividualPriceChart } from './DogIndividualPriceChart';
import { DogRaisingTipsCard } from './DogRaisingTipsCard';

interface HomeScreenProps {
  dogs: Dog[];
  gear: GearProduct[];
  onSelectDog: (dog: Dog) => void;
  onOpenChat: (dog: Dog) => void;
  onAddToCart: (product: GearProduct) => void;
  onToggleDogFavorite: (id: string) => void;
  onToggleGearFavorite: (id: string) => void;
  favoritedDogIds: string[];
  favoritedGearIds: string[];
  setCurrentScreen: (screen: Screen) => void;
  onShowToast: (msg: string) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  dogs,
  gear,
  onSelectDog,
  onOpenChat,
  onAddToCart,
  onToggleDogFavorite,
  onToggleGearFavorite,
  favoritedDogIds,
  favoritedGearIds,
  setCurrentScreen,
  onShowToast
}) => {
  const [heroTab, setHeroTab] = useState<'dogs' | 'gear'>('dogs');
  const [selectedBreed, setSelectedBreed] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('any');
  const [selectedAge, setSelectedAge] = useState('all');

  const featuredDogs = dogs.slice(0, 4);
  const featuredGear = gear.slice(0, 4);

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
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#e7eeff]/60 via-[#f0f3ff]/40 to-transparent pt-12 pb-16 px-4 sm:px-6 lg:px-8 border-b border-[#dee8ff]">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#ffdcc3]/30 rounded-full blur-3xl pointer-events-none -z-10"></div>
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-[#82f5c1]/20 rounded-full blur-3xl pointer-events-none -z-10"></div>

        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Headline & Search Widget */}
            <div className="lg:col-span-7 space-y-6">
              
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#ffdcc3]/60 border border-[#dbc2b0] text-[#8d4b00] text-xs font-bold">
                <span className="material-symbols-outlined text-[16px]">verified</span>
                <span>The Premier Ethical Companion & Care Network</span>
              </div>

              <h1 className="font-['Epilogue'] font-bold text-4xl sm:text-5xl lg:text-6xl text-[#111c2d] leading-[1.1] tracking-tight">
                Bringing Healthy Companions & <span className="text-[#8d4b00]">Premium Care</span> Together
              </h1>

              <p className="text-base sm:text-lg text-[#554336] leading-relaxed max-w-2xl">
                Ethically raised puppies from OFA-screened home breeders, vetted shelter rescues, and veterinarian-engineered canine gear. All protected by the PawPalace 10-Year Genetic Warranty and Safe Escrow.
              </p>

              {/* Dual-Tab Search Widget */}
              <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-xl border border-[#dee8ff] max-w-2xl">
                {/* Tabs */}
                <div className="flex items-center gap-2 mb-4 border-b border-[#e7eeff] pb-3">
                  <button
                    onClick={() => setHeroTab('dogs')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                      heroTab === 'dogs'
                        ? 'bg-[#8d4b00] text-white shadow-xs'
                        : 'text-[#554336] hover:bg-[#f0f3ff]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-base">pets</span>
                    <span>Find a Dog or Puppy</span>
                  </button>
                  <button
                    onClick={() => setHeroTab('gear')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                      heroTab === 'gear'
                        ? 'bg-[#8d4b00] text-white shadow-xs'
                        : 'text-[#554336] hover:bg-[#f0f3ff]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-base">fitness_center</span>
                    <span>Shop Canine Gear</span>
                  </button>
                </div>

                {/* Form Inputs */}
                <form onSubmit={handleHeroSearch} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {heroTab === 'dogs' ? (
                    <>
                      <div>
                        <label className="block text-[11px] font-bold text-[#887364] uppercase tracking-wider mb-1">
                          Breed or Heritage
                        </label>
                        <select
                          value={selectedBreed}
                          onChange={(e) => setSelectedBreed(e.target.value)}
                          className="w-full bg-[#f0f3ff] border border-[#dee8ff] rounded-xl px-3 py-2 text-xs font-semibold text-[#111c2d] focus:outline-none focus:border-[#8d4b00]"
                        >
                          <option value="all">All Verified Breeds</option>
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
                          Location Radius
                        </label>
                        <select
                          value={selectedLocation}
                          onChange={(e) => setSelectedLocation(e.target.value)}
                          className="w-full bg-[#f0f3ff] border border-[#dee8ff] rounded-xl px-3 py-2 text-xs font-semibold text-[#111c2d] focus:outline-none focus:border-[#8d4b00]"
                        >
                          <option value="any">Nationwide (Nanny Flight)</option>
                          <option value="50">Within 50 miles</option>
                          <option value="150">Within 150 miles</option>
                          <option value="300">Within 300 miles</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-[#887364] uppercase tracking-wider mb-1">
                          Life Stage
                        </label>
                        <select
                          value={selectedAge}
                          onChange={(e) => setSelectedAge(e.target.value)}
                          className="w-full bg-[#f0f3ff] border border-[#dee8ff] rounded-xl px-3 py-2 text-xs font-semibold text-[#111c2d] focus:outline-none focus:border-[#8d4b00]"
                        >
                          <option value="all">All Ages (Puppy & Adult)</option>
                          <option value="puppy">8-12 Weeks (Puppy)</option>
                          <option value="young">Young (3-12 Months)</option>
                          <option value="adult">Adult (1-5 Years)</option>
                        </select>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="sm:col-span-2">
                        <label className="block text-[11px] font-bold text-[#887364] uppercase tracking-wider mb-1">
                          Equipment Type
                        </label>
                        <select
                          className="w-full bg-[#f0f3ff] border border-[#dee8ff] rounded-xl px-3 py-2 text-xs font-semibold text-[#111c2d] focus:outline-none focus:border-[#8d4b00]"
                        >
                          <option value="all">All Vet-Approved Essentials</option>
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
                      className="w-full bg-[#8d4b00] hover:bg-[#b15f00] text-white py-3 rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md hover:shadow-lg"
                    >
                      <span className="material-symbols-outlined text-base">search</span>
                      <span>
                        {heroTab === 'dogs' ? 'Explore 240+ Verified Dogs & Puppies' : 'Explore Vet-Approved Gear Catalog'}
                      </span>
                    </button>
                  </div>
                </form>
              </div>

            </div>

            {/* Right Column: Tips on How to Raise Dogs (Expert Guide Showcase) */}
            <div className="lg:col-span-5 relative flex flex-col min-h-[460px]">
              <DogRaisingTipsCard onShowToast={onShowToast} />
            </div>

          </div>
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
          <button
            onClick={() => setCurrentScreen('find-dogs')}
            className="text-xs font-bold text-[#8d4b00] hover:text-[#b15f00] flex items-center gap-1 cursor-pointer"
          >
            <span>View All 240+ Verified Dogs</span>
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </button>
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

                  {/* Favorite Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleDogFavorite(dog.id);
                      onShowToast(isFavorited ? `Removed ${dog.name} from wishlist` : `Added ${dog.name} to wishlist!`);
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

      {/* Essential Canine Equipment Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-[#006c4a] uppercase tracking-wider mb-1">
              <span className="material-symbols-outlined text-base">medical_services</span>
              <span>Canine Orthopedics & Safety</span>
            </div>
            <h2 className="font-['Epilogue'] font-bold text-2xl sm:text-3xl text-[#111c2d]">
              Essential Canine Equipment & Starter Gear
            </h2>
          </div>
          <button
            onClick={() => setCurrentScreen('dog-gear')}
            className="text-xs font-bold text-[#8d4b00] hover:text-[#b15f00] flex items-center gap-1 cursor-pointer"
          >
            <span>Shop All Equipment & Gear</span>
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
                      onShowToast(isFavorited ? `Removed from wishlist` : `Saved ${product.name} to wishlist!`);
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
                        ${product.price.toFixed(2)}
                      </span>
                      {product.originalPrice && (
                        <span className="text-xs text-[#887364] line-through">
                          ${product.originalPrice.toFixed(2)}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="mt-4">
                    <button
                      onClick={() => {
                        onAddToCart(product);
                        onShowToast(`Added ${product.name} to your bag!`);
                      }}
                      className="w-full bg-[#111c2d] hover:bg-[#8d4b00] text-white py-2.5 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <span className="material-symbols-outlined text-sm">shopping_bag</span>
                      <span>Add to Bag</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
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
            onClick={() => onShowToast('Canine Concierge requested! A specialist will connect via chat or phone.')}
            className="bg-[#8d4b00] hover:bg-[#b15f00] text-white px-6 py-3 rounded-full text-xs font-bold whitespace-nowrap cursor-pointer transition-colors shadow-sm"
          >
            Speak with a Canine Matchmaker
          </button>
        </div>
      </section>

    </div>
  );
};
