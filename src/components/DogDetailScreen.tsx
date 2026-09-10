import React, { useState, useEffect } from 'react';
import { Dog, GearProduct, Screen, UserProfile, SafeMeetingPoint } from '../types';
import { getFallbackMeetingPoints } from '../data/meetingPointsData';
import { SafeMeetingPointModal } from './SafeMeetingPointModal';
import { DogIndividualPriceChart } from './DogIndividualPriceChart';
import { getSellerForDog, getDogActivities } from '../data/dogCareAndActivities';

interface DogDetailScreenProps {
  dog: Dog;
  user: UserProfile;
  onOpenLogin: () => void;
  onOpenChat: (dog: Dog) => void;
  onAddToCart: (product: GearProduct) => void;
  recommendedGear: GearProduct[];
  setCurrentScreen: (screen: Screen) => void;
  onShowToast: (msg: string) => void;
}

export const DogDetailScreen: React.FC<DogDetailScreenProps> = ({
  dog,
  user,
  onOpenLogin,
  onOpenChat,
  onAddToCart,
  recommendedGear,
  setCurrentScreen,
  onShowToast
}) => {
  const seller = getSellerForDog(dog);
  const activities = getDogActivities(dog);

  const galleryImages = dog.gallery && dog.gallery.length > 0 ? dog.gallery : [dog.image];
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Application form state (automatically synced with user profile)
  const [applicantName, setApplicantName] = useState(user?.isLoggedIn ? user.name : 'Marcus Vance');
  const [applicantEmail, setApplicantEmail] = useState(user?.isLoggedIn ? user.email : 'marcus.vance@example.com');
  const [applicantPhone, setApplicantPhone] = useState(user?.isLoggedIn ? user.phone : '(512) 892-4011');
  const [homeType, setHomeType] = useState('Single Family with Fenced Yard');
  const [experienceLevel, setExperienceLevel] = useState('Experienced Dog Guardian');
  const [deliveryMethod, setDeliveryMethod] = useState(`Local Breeder Pickup in ${dog.location}`);
  const [selectedMeetingPoint, setSelectedMeetingPoint] = useState<SafeMeetingPoint | null>(() => {
    return getFallbackMeetingPoints(dog.location)[0] || null;
  });
  const [isMeetingPointModalOpen, setIsMeetingPointModalOpen] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  const [applicationSubmitted, setApplicationSubmitted] = useState(false);

  // Synchronize form when user logs in or updates their name/phone/email
  useEffect(() => {
    if (user && user.isLoggedIn) {
      setApplicantName(user.name);
      setApplicantEmail(user.email);
      setApplicantPhone(user.phone || '');
    }
  }, [user]);

  // Reset form and image index whenever selected dog changes
  useEffect(() => {
    setActiveImageIndex(0);
    setApplicationSubmitted(false);
    setIsApplying(false);
    setDeliveryMethod(`Local Breeder Pickup in ${dog.location}`);
    setSelectedMeetingPoint(getFallbackMeetingPoints(dog.location)[0] || null);
  }, [dog.id, dog.location]);

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    setIsApplying(true);
    setTimeout(() => {
      setIsApplying(false);
      setApplicationSubmitted(true);
      onShowToast(`Application for ${dog.name} successfully submitted! ${dog.breederName} will review today.`);
    }, 1200);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10 pb-20">
      
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs text-[#887364]">
        <button onClick={() => setCurrentScreen('home')} className="hover:text-[#8d4b00] cursor-pointer">
          Home
        </button>
        <span>/</span>
        <button onClick={() => setCurrentScreen('find-dogs')} className="hover:text-[#8d4b00] cursor-pointer">
          Find Dogs
        </button>
        <span>/</span>
        <span className="text-[#554336]">{dog.breed}</span>
        <span>/</span>
        <span className="text-[#111c2d] font-bold">{dog.name}</span>
      </nav>

      {/* Owner Moderation Rejection Alert Banner (Hidden from Shop) */}
      {(dog.approvalStatus === 'rejected' || dog.photoApprovalStatus === 'rejected' || dog.nameApprovalStatus === 'rejected') && (
        <div className="bg-red-50 border-2 border-red-300 rounded-3xl p-5 flex flex-col sm:flex-row items-start gap-4 shadow-sm text-red-950 animate-in fade-in duration-300">
          <div className="w-10 h-10 rounded-2xl bg-red-100 border border-red-300 flex items-center justify-center shrink-0 text-red-700">
            <span className="material-symbols-outlined text-2xl">block</span>
          </div>
          <div className="flex-1 space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-bold text-sm text-red-900">
                Listing Rejected by Platform Owner • Excluded from Shop
              </h3>
              <span className="bg-red-700 text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                Unavailable
              </span>
            </div>
            <p className="text-xs text-red-800 leading-relaxed">
              This companion listing was rejected by the owner during pedigree, health clearance, or photo moderation.
              It is not listed in the public marketplace or searchable catalog, and adoption applications are locked.
            </p>
            {(dog.photoNotes || dog.nameNotes) && (
              <p className="text-[11px] text-red-700 bg-red-100/70 p-2.5 rounded-xl border border-red-200 mt-2 italic">
                Moderation Notes: &ldquo;{dog.photoNotes || dog.nameNotes}&rdquo;
              </p>
            )}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setCurrentScreen('find-dogs')}
                className="px-4 py-2 bg-red-800 hover:bg-red-900 text-white font-bold text-xs rounded-xl inline-flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
              >
                <span className="material-symbols-outlined text-sm">storefront</span>
                <span>Browse Available Shop Companions</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Two-Column Profile Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left Column: Visual Gallery & Detailed Credentials */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* Main Photo Gallery */}
          <div className="space-y-3">
            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden bg-[#f0f3ff] border border-[#dee8ff] shadow-md group">
              <img
                src={galleryImages[activeImageIndex]}
                alt={dog.name}
                className="w-full h-full object-cover transition-all duration-300"
                referrerPolicy="no-referrer"
              />

              {/* Status Badges on Image */}
              <div className="absolute top-4 left-4 flex flex-wrap gap-1.5">
                <span className="bg-white/95 backdrop-blur-md text-[#006c4a] text-xs font-bold px-3 py-1 rounded-full border border-[#82f5c1] flex items-center gap-1 shadow-sm">
                  <span className="material-symbols-outlined text-sm">verified</span>
                  <span>{dog.verifiedStatus}</span>
                </span>
                <span className="bg-[#111c2d]/90 text-[#ffdcc3] text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                  10-Yr Genetic Guarantee
                </span>
              </div>

              {/* Verified Home-Raised Badge */}
              <div className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-xs text-white text-xs px-3 py-1.5 rounded-xl flex items-center gap-1.5">
                <span className="material-symbols-outlined text-sm text-[#82f5c1]">home</span>
                <span>Early Neurological Stimulation (ENS) Protocol Certified</span>
              </div>
            </div>

            {/* Gallery Thumbnails */}
            {galleryImages.length > 1 && (
              <div className="flex items-center gap-3">
                {galleryImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all cursor-pointer ${
                      activeImageIndex === idx ? 'border-[#8d4b00] scale-105 shadow-md' : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`${dog.name} thumb ${idx}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* About & Temperament Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#dee8ff] shadow-xs space-y-6">
            <div>
              <h3 className="font-['Epilogue'] font-bold text-xl text-[#111c2d]">
                About {dog.name} & Behavioral Temperament
              </h3>
              <p className="text-xs sm:text-sm text-[#554336] leading-relaxed mt-3">
                {dog.summary}
              </p>
            </div>

            {/* Trait Chips */}
            {dog.temperament?.traits && (
              <div>
                <h4 className="text-[11px] font-bold text-[#887364] uppercase tracking-wider mb-2.5">
                  Verified Puppy Milestones & Socialization
                </h4>
                <div className="flex flex-wrap gap-2">
                  {dog.temperament.traits.map((t, idx) => (
                    <span
                      key={idx}
                      className="bg-[#f0f3ff] border border-[#dee8ff] text-[#554336] text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1.5"
                    >
                      <span className="material-symbols-outlined text-sm text-[#006c4a]">check_circle</span>
                      <span>{t}</span>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Heritage & Stats Table */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-[#f0f3ff] text-xs">
              <div className="p-3.5 rounded-2xl bg-[#f9f9ff] border border-[#dee8ff]">
                <span className="text-[#887364] block text-[11px]">Breed Lineage</span>
                <span className="font-bold text-[#111c2d] text-xs mt-0.5 block">
                  {dog.temperament?.breedHeritage || dog.breed}
                </span>
              </div>
              <div className="p-3.5 rounded-2xl bg-[#f9f9ff] border border-[#dee8ff]">
                <span className="text-[#887364] block text-[11px]">Energy & Drive</span>
                <span className="font-bold text-[#111c2d] text-xs mt-0.5 block">
                  {dog.temperament?.energyLevel || 'Moderate Playful'}
                </span>
              </div>
              <div className="p-3.5 rounded-2xl bg-[#f9f9ff] border border-[#dee8ff]">
                <span className="text-[#887364] block text-[11px]">Trainability & Focus</span>
                <span className="font-bold text-[#111c2d] text-xs mt-0.5 block">
                  {dog.temperament?.trainability || 'High responsiveness'}
                </span>
              </div>
              <div className="p-3.5 rounded-2xl bg-[#f9f9ff] border border-[#dee8ff]">
                <span className="text-[#887364] block text-[11px]">Coat Texture & Pigment</span>
                <span className="font-bold text-[#111c2d] text-xs mt-0.5 block">
                  {dog.temperament?.coatColor || dog.color}
                </span>
              </div>
            </div>

          </div>

          {/* What the Dog Likes to Do (Hobbies, Toys & Daily Quirks) */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#dee8ff] shadow-xs space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#8d4b00] bg-[#ffdcc3] px-2.5 py-0.5 rounded-full">
                  Seller Daily Care Observations
                </span>
                <h3 className="font-['Epilogue'] font-bold text-xl text-[#111c2d] mt-1.5">
                  What Does {dog.name} Like to Do?
                </h3>
                <p className="text-xs text-[#554336] mt-0.5">
                  Direct personality insights, favorite play activities, and habits observed by seller {seller.name}.
                </p>
              </div>
              <span className="material-symbols-outlined text-[#8d4b00] text-3xl">sports_baseball</span>
            </div>

            {/* Favorite Toys */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-[#111c2d] flex items-center gap-1.5">
                <span className="material-symbols-outlined text-sm text-[#8d4b00]">toys</span>
                <span>Favorite Toys & Chews</span>
              </h4>
              <div className="flex flex-wrap gap-2">
                {activities.favoriteToys.map((toy, idx) => (
                  <span
                    key={idx}
                    className="bg-[#fff9f4] border border-[#ffdcc3] text-[#8d4b00] text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1.5"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#8d4b00]"></span>
                    <span>{toy}</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Favorite Games & Daily Play */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-[#111c2d] flex items-center gap-1.5">
                <span className="material-symbols-outlined text-sm text-[#006c4a]">directions_run</span>
                <span>Favorite Games & Daily Play</span>
              </h4>
              <div className="flex flex-wrap gap-2">
                {activities.favoriteGames.map((game, idx) => (
                  <span
                    key={idx}
                    className="bg-[#f0fbf6] border border-[#d2f4e3] text-[#006c4a] text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1.5"
                  >
                    <span className="material-symbols-outlined text-sm text-[#006c4a]">sports_tennis</span>
                    <span>{game}</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Habits & Downtime Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
              <div className="bg-[#f9f9ff] border border-[#dee8ff] p-3.5 rounded-2xl">
                <span className="text-[11px] font-bold text-[#8d4b00] flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">auto_awesome</span>
                  <span>Charming Daily Quirk</span>
                </span>
                <p className="text-xs text-[#554336] mt-1 italic font-medium leading-relaxed">
                  &ldquo;{activities.dailyQuirk}&rdquo;
                </p>
              </div>

              <div className="bg-[#f9f9ff] border border-[#dee8ff] p-3.5 rounded-2xl">
                <span className="text-[11px] font-bold text-[#111c2d] flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm text-[#006c4a]">bedtime</span>
                  <span>Rest & Relaxation Habit</span>
                </span>
                <p className="text-xs text-[#554336] mt-1 leading-relaxed">
                  {activities.relaxationSpot}
                </p>
              </div>

              <div className="bg-[#f9f9ff] border border-[#dee8ff] p-3.5 rounded-2xl">
                <span className="text-[11px] font-bold text-[#111c2d] flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm text-[#8d4b00]">cookie</span>
                  <span>Favorite Healthy Treat</span>
                </span>
                <p className="text-xs text-[#554336] mt-1 leading-relaxed">
                  {activities.favoriteTreat}
                </p>
              </div>

              <div className="bg-[#f9f9ff] border border-[#dee8ff] p-3.5 rounded-2xl">
                <span className="text-[11px] font-bold text-[#111c2d] flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm text-[#006c4a]">bolt</span>
                  <span>Peak Playtime Window</span>
                </span>
                <p className="text-xs text-[#554336] mt-1 leading-relaxed">
                  {activities.energyWindow}
                </p>
              </div>
            </div>

            {/* Inquire Action Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => onOpenChat(dog)}
                className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-[#fff5ed] to-[#ffebd8] hover:from-[#ffe8d2] hover:to-[#ffdcc3] border border-[#ffdcc3] text-[#8d4b00] font-bold text-xs flex items-center justify-between cursor-pointer transition-all shadow-2xs"
              >
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-base">chat</span>
                  <span>Chat with Seller ({seller.name}) about {dog.name}&apos;s Hobbies & Routine</span>
                </div>
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
            </div>
          </div>

          {/* Health & Genetic Credentials Checklist */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#dee8ff] shadow-xs space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-['Epilogue'] font-bold text-xl text-[#111c2d]">
                  Health & Genetic Clearances
                </h3>
                <p className="text-xs text-[#554336] mt-0.5">
                  Verified by the Orthopedic Foundation for Animals (OFA) and PawPalace Vet Board
                </p>
              </div>
              <span className="material-symbols-outlined text-[#006c4a] text-3xl">verified_user</span>
            </div>

            <div className="space-y-3">
              {(dog.healthCredentials || [
                { title: 'OFA Hip & Elbow Clearances', desc: 'Parent lines certified OFA Excellent hips and normal elbows.' },
                { title: 'OFA Advanced Cardiac Clear', desc: 'Evaluated by board-certified veterinary cardiologist.' },
                { title: 'OFA CAER Eye Exam', desc: 'Annual eye clearance free of inherited ocular disorders.' },
                { title: 'DNA Genetic 250+ Disorder Panel', desc: 'Embark screened negative for all breed-specific variants.' }
              ]).map((cred, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3.5 rounded-2xl bg-[#f0f3ff] border border-[#dee8ff]">
                  <span className="material-symbols-outlined text-[#006c4a] text-xl shrink-0 mt-0.5">
                    check_circle
                  </span>
                  <div>
                    <h5 className="font-bold text-xs text-[#111c2d]">{cred.title}</h5>
                    <p className="text-xs text-[#554336] mt-0.5">{cred.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2">
              <button
                onClick={() => onShowToast('Official OFA & Embark Genetic Certificate PDF downloaded.')}
                className="w-full sm:w-auto bg-[#f0f3ff] hover:bg-[#dee8ff] text-[#8d4b00] border border-[#dbc2b0] px-4 py-2.5 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <span className="material-symbols-outlined text-base">download</span>
                <span>Download Official Veterinary Health Dossier (PDF)</span>
              </button>
            </div>
          </div>

          {/* Individual Dog Price Trajectory & Milestone Line Chart */}
          <DogIndividualPriceChart dog={dog} variant="detailed" />

          {/* Safe Meeting & Handshake Point Feature */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#dee8ff] shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#dee8ff] pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-[#ffdcc3] text-[#8d4b00] flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-xl">pin_drop</span>
                </div>
                <div>
                  <h3 className="font-['Epilogue'] font-bold text-base text-[#111c2d]">
                    Verified Safe Meeting & Pickup Point
                  </h3>
                  <p className="text-xs text-[#887364]">
                    Protected in-person handoffs in {dog.location}
                  </p>
                </div>
              </div>
              <span className="inline-flex items-center gap-1 self-start sm:self-auto bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold px-2.5 py-1 rounded-full">
                <span className="material-symbols-outlined text-xs text-emerald-600">verified</span>
                <span>Google Maps Grounded</span>
              </span>
            </div>

            {selectedMeetingPoint ? (
              <div className="p-4 rounded-2xl bg-[#fffaf6] border border-[#ffcfad] space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-bold bg-[#ffdcc3] text-[#8d4b00] px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                      {selectedMeetingPoint.categoryLabel}
                    </span>
                    <h4 className="font-bold text-sm text-[#111c2d] mt-1">
                      {selectedMeetingPoint.name}
                    </h4>
                  </div>
                  {selectedMeetingPoint.rating && (
                    <div className="text-xs font-bold text-[#b15f00] flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm">star</span>
                      <span>{selectedMeetingPoint.rating}</span>
                      <span className="text-[#887364]">({selectedMeetingPoint.reviewCount}+ reviews)</span>
                    </div>
                  )}
                </div>

                <div className="flex items-start gap-1.5 text-xs text-[#554336]">
                  <span className="material-symbols-outlined text-sm text-[#8d4b00] shrink-0 mt-0.5">location_on</span>
                  <p className="font-medium">{selectedMeetingPoint.address}</p>
                </div>

                {selectedMeetingPoint.hours && (
                  <div className="flex items-center gap-1 text-[11px] text-[#887364]">
                    <span className="material-symbols-outlined text-xs text-emerald-600">schedule</span>
                    <span>{selectedMeetingPoint.hours}</span>
                  </div>
                )}

                {selectedMeetingPoint.googleMapsSnippet && (
                  <p className="text-[11px] text-[#554336] italic bg-white/80 p-2 rounded-xl border border-[#dee8ff]">
                    &ldquo;{selectedMeetingPoint.googleMapsSnippet}&rdquo;
                  </p>
                )}

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {selectedMeetingPoint.safetyFeatures.map((feat, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] font-semibold bg-white border border-[#dee8ff] text-[#554336] px-2 py-0.5 rounded-lg flex items-center gap-1"
                    >
                      <span className="material-symbols-outlined text-[11px] text-[#006c4a]">check</span>
                      <span>{feat}</span>
                    </span>
                  ))}
                </div>

                <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#ffcfad]/60">
                  <a
                    href={selectedMeetingPoint.mapsUri}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2 px-3 bg-[#f0f3ff] hover:bg-[#dee8ff] border border-[#dee8ff] text-[#111c2d] rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <span className="material-symbols-outlined text-sm text-[#8d4b00]">open_in_new</span>
                    <span>View on Google Maps</span>
                  </a>

                  <button
                    type="button"
                    onClick={() => setIsMeetingPointModalOpen(true)}
                    className="py-2 px-3 bg-[#8d4b00] hover:bg-[#b15f00] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
                  >
                    <span className="material-symbols-outlined text-sm">explore</span>
                    <span>Browse Safe Meeting Points</span>
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setIsMeetingPointModalOpen(true)}
                className="w-full py-4 px-4 rounded-2xl border-2 border-dashed border-[#dee8ff] hover:border-[#8d4b00] text-center space-y-1 cursor-pointer transition-colors"
              >
                <span className="material-symbols-outlined text-2xl text-[#8d4b00]">add_location_alt</span>
                <p className="text-xs font-bold text-[#111c2d]">Select a Verified Meeting Point in {dog.location}</p>
                <p className="text-[11px] text-[#887364]">Grounded via Google Maps and monitored under PawPalace Escrow rules.</p>
              </button>
            )}

            <div className="flex items-center gap-2 text-[11px] text-[#006c4a] bg-emerald-50/70 p-2.5 rounded-xl border border-emerald-200">
              <span className="material-symbols-outlined text-sm shrink-0">shield</span>
              <span>
                <strong>PawPalace Safe Meetup Protocol:</strong> All in-person exchanges are recommended at accredited veterinary hospitals or municipal safe zones.
              </span>
            </div>
          </div>

        </div>

        {/* Right Column: Sticky Action Box, Breeder Card, Application & Gear */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Main Action Box */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#dee8ff] shadow-lg space-y-6">
            
            <div>
              <div className="flex items-center justify-between">
                <span className="bg-[#ffdcc3] text-[#8d4b00] text-xs font-bold px-3 py-1 rounded-full">
                  {dog.category.toUpperCase()} • READY FOR REHOMING
                </span>
                <span className="text-xs font-bold text-[#006c4a] flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-[#006c4a]"></span>
                  <span>Available</span>
                </span>
              </div>

              <h1 className="font-['Epilogue'] font-bold text-3xl text-[#111c2d] mt-2">
                {dog.name}
              </h1>
              <p className="text-xs text-[#554336] font-medium mt-0.5">
                {dog.breed} • {dog.ageText} • {dog.gender}
              </p>
            </div>

            {/* Fee Display */}
            <div className="p-4 rounded-2xl bg-[#f9f9ff] border border-[#dee8ff]">
              <div className="flex items-baseline justify-between">
                <span className="text-xs text-[#887364] font-medium">Placement / Adoption Fee</span>
                <span className="font-['Epilogue'] font-bold text-2xl text-[#8d4b00]">
                  ${dog.price.toLocaleString()}
                </span>
              </div>
              <p className="text-[11px] text-[#006c4a] mt-1 font-semibold flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">lock</span>
                <span>Protected by PawPalace 72-Hour Post-Vet Escrow</span>
              </p>
            </div>

            {/* Dual Actions: Apply or Inquire */}
            <div className="space-y-2.5">
              <a
                href="#apply-section"
                className="w-full bg-[#8d4b00] hover:bg-[#b15f00] text-white py-3.5 rounded-2xl font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md text-center"
              >
                <span className="material-symbols-outlined text-base">assignment</span>
                <span>Apply to Welcome {dog.name}</span>
              </a>

              <button
                id="dog-detail-inquire-btn"
                onClick={() => onOpenChat(dog)}
                className="w-full bg-[#f0f3ff] hover:bg-[#dee8ff] text-[#111c2d] border border-[#dee8ff] py-3.5 rounded-2xl font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <span className="material-symbols-outlined text-base text-[#8d4b00]">chat</span>
                <span>Chat with Seller ({seller.name})</span>
              </button>

              <button
                onClick={() => onOpenChat(dog)}
                className="w-full bg-[#fff5ed] hover:bg-[#ffebd8] text-[#8d4b00] border border-[#ffdcc3] py-2.5 rounded-xl font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">sports_baseball</span>
                <span>Ask: What does {dog.name} like to do?</span>
              </button>
            </div>

            {/* Seller Summary Card */}
            <div className="pt-5 border-t border-[#e7eeff]">
              <div className="flex items-center gap-3">
                <img
                  src={seller.avatarUrl}
                  alt={seller.name}
                  className="w-12 h-12 rounded-2xl object-cover border-2 border-[#dee8ff] shadow-xs shrink-0"
                  referrerPolicy="no-referrer"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1">
                    <h4 className="font-bold text-xs text-[#111c2d] truncate">
                      {seller.name}
                    </h4>
                    <span className="material-symbols-outlined text-sm text-[#006c4a]">verified</span>
                  </div>
                  <p className="text-[11px] text-[#554336] truncate">
                    {seller.role}
                  </p>
                  <div className="flex items-center gap-2 text-[11px] font-bold text-[#8d4b00] mt-0.5">
                    <span className="flex items-center gap-0.5">
                      <span className="material-symbols-outlined text-xs text-[#b15f00]">star</span>
                      <span>{dog.breederRating}</span>
                    </span>
                    <span>•</span>
                    <span className="text-[#006c4a] font-semibold">{seller.badge}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 mt-4 text-[11px] text-[#554336] bg-[#f0f3ff] p-3 rounded-2xl">
                <div>
                  <span className="text-[#887364] block">Direct Seller Response</span>
                  <span className="font-bold text-[#111c2d]">{seller.responseRate}</span>
                </div>
                <div>
                  <span className="text-[#887364] block">Seller Experience</span>
                  <span className="font-bold text-[#111c2d]">{seller.yearsActive} Years Certified</span>
                </div>
              </div>
            </div>

          </div>

          {/* Interactive Guardian Application Form */}
          <div id="apply-section" className="bg-white rounded-3xl p-6 sm:p-7 border border-[#dee8ff] shadow-sm space-y-4">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#8d4b00] text-xl">pets</span>
              <h3 className="font-bold text-sm text-[#111c2d]">
                Guardian Application for {dog.name}
              </h3>
            </div>
            <p className="text-xs text-[#554336]">
              Submitting an application does not charge your card. Once pre-approved, deposit funds are held safely in third-party escrow.
            </p>

            {applicationSubmitted ? (
              <div className="p-5 rounded-2xl bg-[#82f5c1]/20 border border-[#82f5c1] text-center space-y-3">
                <span className="material-symbols-outlined text-3xl text-[#006c4a]">check_circle</span>
                <h4 className="font-bold text-sm text-[#006c4a]">Application Received!</h4>
                <p className="text-xs text-[#554336]">
                  {dog.breederName} has been notified and usually responds within 2-4 hours to arrange a video interview.
                </p>

                {selectedMeetingPoint && deliveryMethod.includes('Local') && (
                  <div className="p-3 bg-white rounded-xl border border-emerald-300 text-left space-y-1.5 shadow-2xs">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md flex items-center gap-1">
                        <span className="material-symbols-outlined text-xs">location_on</span>
                        <span>Designated Meeting Point</span>
                      </span>
                      <span className="text-[10px] text-[#887364]">Google Maps Grounded</span>
                    </div>
                    <p className="font-bold text-xs text-[#111c2d]">{selectedMeetingPoint.name}</p>
                    <p className="text-[11px] text-[#554336]">{selectedMeetingPoint.address}</p>
                    <div className="pt-1">
                      <a
                        href={selectedMeetingPoint.mapsUri}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-[#8d4b00] hover:underline"
                      >
                        <span className="material-symbols-outlined text-xs">open_in_new</span>
                        <span>Open Directions in Google Maps</span>
                      </a>
                    </div>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row items-center justify-center gap-2 pt-1">
                  <button
                    onClick={() => onOpenChat(dog)}
                    className="w-full sm:w-auto bg-[#006c4a] text-white px-4 py-2.5 rounded-xl text-xs font-bold hover:bg-[#005137] transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <span className="material-symbols-outlined text-sm">chat</span>
                    <span>Open Live Chat With Breeder</span>
                  </button>
                  <button
                    onClick={() => setIsMeetingPointModalOpen(true)}
                    className="w-full sm:w-auto bg-white border border-[#dee8ff] text-[#111c2d] px-4 py-2.5 rounded-xl text-xs font-bold hover:bg-[#f0f3ff] transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <span className="material-symbols-outlined text-sm text-[#8d4b00]">pin_drop</span>
                    <span>View Meeting Details</span>
                  </button>
                </div>
              </div>
            ) : (dog.approvalStatus === 'rejected' || dog.photoApprovalStatus === 'rejected' || dog.nameApprovalStatus === 'rejected') ? (
              <div className="bg-red-50 border border-red-200 rounded-2xl p-5 text-center space-y-3">
                <span className="material-symbols-outlined text-3xl text-red-600">lock</span>
                <h4 className="font-bold text-xs text-red-900">Adoption Applications Locked</h4>
                <p className="text-[11px] text-red-700 leading-relaxed">
                  This companion listing was rejected by platform owner moderation and is excluded from shop adoption.
                </p>
                <button
                  type="button"
                  onClick={() => setCurrentScreen('find-dogs')}
                  className="px-4 py-2 bg-red-800 text-white font-bold text-xs rounded-xl hover:bg-red-900 transition-colors cursor-pointer shadow-xs"
                >
                  Browse Available Companions
                </button>
              </div>
            ) : (
              <form onSubmit={handleApply} className="space-y-3 text-xs">
                {user && user.isLoggedIn ? (
                  <div className="flex items-center gap-2.5 p-2 bg-[#f0f3ff] rounded-xl border border-[#dee8ff]">
                    <img
                      src={user.avatarUrl}
                      alt={user.name}
                      className="w-7 h-7 rounded-full object-cover border border-[#ffdcc3]"
                      referrerPolicy="no-referrer"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] font-bold text-[#111c2d] truncate">
                        Applicant: {user.name}
                      </p>
                      <p className="text-[10px] text-[#887364] truncate">
                        {user.location} • Verified Guardian
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="p-2.5 bg-[#ffdcc3]/40 rounded-xl border border-[#ffdcc3] flex items-center justify-between text-[11px]">
                    <span className="text-[#8d4b00] font-medium">Have an account?</span>
                    <button
                      type="button"
                      onClick={onOpenLogin}
                      className="text-[#8d4b00] font-bold underline cursor-pointer hover:text-[#554336]"
                    >
                      Sign In to Auto-Fill
                    </button>
                  </div>
                )}

                <div>
                  <label className="block text-[11px] font-bold text-[#887364] uppercase mb-1">Guardian Full Name</label>
                  <input
                    type="text"
                    required
                    value={applicantName}
                    onChange={(e) => setApplicantName(e.target.value)}
                    className="w-full px-3 py-2 bg-[#f0f3ff] border border-[#dee8ff] rounded-xl text-[#111c2d] focus:outline-none focus:border-[#8d4b00]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-bold text-[#887364] uppercase mb-1">Email</label>
                    <input
                      type="email"
                      required
                      value={applicantEmail}
                      onChange={(e) => setApplicantEmail(e.target.value)}
                      className="w-full px-3 py-2 bg-[#f0f3ff] border border-[#dee8ff] rounded-xl text-[#111c2d] focus:outline-none focus:border-[#8d4b00]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-[#887364] uppercase mb-1">Phone</label>
                    <input
                      type="tel"
                      required
                      value={applicantPhone}
                      onChange={(e) => setApplicantPhone(e.target.value)}
                      className="w-full px-3 py-2 bg-[#f0f3ff] border border-[#dee8ff] rounded-xl text-[#111c2d] focus:outline-none focus:border-[#8d4b00]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#887364] uppercase mb-1">Living Environment</label>
                  <select
                    value={homeType}
                    onChange={(e) => setHomeType(e.target.value)}
                    className="w-full px-3 py-2 bg-[#f0f3ff] border border-[#dee8ff] rounded-xl text-[#111c2d] font-semibold focus:outline-none focus:border-[#8d4b00]"
                  >
                    <option value="Single Family with Fenced Yard">Single Family Home with Fenced Yard</option>
                    <option value="Townhouse / Condo">Townhouse / Condo with Green Belt</option>
                    <option value="Apartment">Apartment (Regular Daily Exercise Planned)</option>
                    <option value="Ranch / Farm">Ranch / Farm / Acreage</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#887364] uppercase mb-1">Experience Level</label>
                  <select
                    value={experienceLevel}
                    onChange={(e) => setExperienceLevel(e.target.value)}
                    className="w-full px-3 py-2 bg-[#f0f3ff] border border-[#dee8ff] rounded-xl text-[#111c2d] font-semibold focus:outline-none focus:border-[#8d4b00]"
                  >
                    <option value="Experienced Dog Guardian">Experienced Dog Guardian</option>
                    <option value="First-Time Dog Owner">First-Time Dog Owner (Eager to learn)</option>
                    <option value="Currently have another dog">Currently have another friendly dog</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#887364] uppercase mb-1">Delivery Preference</label>
                  <select
                    value={deliveryMethod}
                    onChange={(e) => setDeliveryMethod(e.target.value)}
                    className="w-full px-3 py-2 bg-[#f0f3ff] border border-[#dee8ff] rounded-xl text-[#111c2d] font-semibold focus:outline-none focus:border-[#8d4b00]"
                  >
                    <option value={`Local Breeder Pickup in ${dog.location}`}>Local In-Person Pickup in {dog.location}</option>
                    <option value="Chaperoned In-Cabin Flight Nanny">Chaperoned In-Cabin Flight Nanny (Hand delivered)</option>
                    <option value="Climate-Controlled Ground Courier">Climate-Controlled Ground Courier</option>
                  </select>
                </div>

                {deliveryMethod.includes('Local') && (
                  <div className="p-3.5 bg-[#fffaf6] rounded-2xl border border-[#ffcfad] space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-[#8d4b00] uppercase tracking-wider flex items-center gap-1">
                        <span className="material-symbols-outlined text-xs">pin_drop</span>
                        <span>Safe Meeting Point</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => setIsMeetingPointModalOpen(true)}
                        className="text-[11px] font-bold text-[#8d4b00] hover:underline cursor-pointer flex items-center gap-0.5"
                      >
                        <span>Change Point</span>
                        <span className="material-symbols-outlined text-xs">chevron_right</span>
                      </button>
                    </div>

                    {selectedMeetingPoint ? (
                      <div>
                        <p className="font-bold text-xs text-[#111c2d] truncate">{selectedMeetingPoint.name}</p>
                        <p className="text-[11px] text-[#554336] truncate">{selectedMeetingPoint.address}</p>
                        <div className="flex items-center gap-2 pt-1.5 text-[10px]">
                          <span className="bg-white border border-[#dee8ff] px-2 py-0.5 rounded-md font-semibold text-emerald-800">
                            {selectedMeetingPoint.categoryLabel}
                          </span>
                          <a
                            href={selectedMeetingPoint.mapsUri}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#8d4b00] font-bold hover:underline flex items-center gap-0.5"
                          >
                            <span className="material-symbols-outlined text-xs">open_in_new</span>
                            <span>Google Maps</span>
                          </a>
                        </div>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setIsMeetingPointModalOpen(true)}
                        className="text-xs text-[#8d4b00] font-bold underline cursor-pointer"
                      >
                        Select a Verified Meeting Point
                      </button>
                    )}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isApplying}
                  className="w-full bg-[#8d4b00] hover:bg-[#b15f00] text-white py-3 rounded-2xl font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                >
                  {isApplying ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      <span>Submitting to {dog.breederName}...</span>
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-base">send</span>
                      <span>Submit Guardian Application (No Fee)</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Recommended Starter Gear for Dog */}
          <div className="bg-white rounded-3xl p-6 border border-[#dee8ff] shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-xs text-[#111c2d] flex items-center gap-1.5">
                <span className="material-symbols-outlined text-base text-[#006c4a]">shopping_bag</span>
                <span>Recommended Starter Gear for {dog.name}</span>
              </h4>
              <button
                onClick={() => setCurrentScreen('dog-gear')}
                className="text-[11px] font-bold text-[#8d4b00] hover:underline cursor-pointer"
              >
                View All Gear
              </button>
            </div>

            <div className="space-y-3">
              {recommendedGear.slice(0, 3).map((item) => (
                <div key={item.id} className="flex items-center gap-3 p-3 rounded-2xl border border-[#dee8ff] bg-[#f9f9ff]">
                  <img src={item.image} alt={item.name} className="w-14 h-14 rounded-xl object-cover border border-[#dee8ff] shrink-0" referrerPolicy="no-referrer" />
                  <div className="flex-1 min-w-0">
                    <h5 className="font-bold text-xs text-[#111c2d] truncate">{item.name}</h5>
                    <p className="text-[11px] text-[#887364]">{item.brand}</p>
                    <p className="text-xs font-bold text-[#8d4b00] mt-0.5">${item.price.toFixed(2)}</p>
                  </div>
                  <button
                    onClick={() => {
                      onAddToCart(item);
                      onShowToast(`Added ${item.name} to bag!`);
                    }}
                    className="bg-[#111c2d] hover:bg-[#8d4b00] text-white p-2 rounded-xl transition-colors cursor-pointer"
                    title="Add to bag"
                  >
                    <span className="material-symbols-outlined text-base">add_shopping_cart</span>
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* Safe Meeting Point Modal */}
      <SafeMeetingPointModal
        isOpen={isMeetingPointModalOpen}
        onClose={() => setIsMeetingPointModalOpen(false)}
        defaultLocation={dog.location}
        dogName={dog.name}
        dogBreed={dog.breed}
        selectedMeetingPoint={selectedMeetingPoint}
        onSelectMeetingPoint={(point) => {
          setSelectedMeetingPoint(point);
          setIsMeetingPointModalOpen(false);
        }}
        onShowToast={onShowToast}
      />

    </div>
  );
};
