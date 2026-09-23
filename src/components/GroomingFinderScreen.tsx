import React, { useState, useEffect, useMemo } from 'react';
import { GroomingSalon, GroomingAppointment, GroomingSalonType, UserProfile } from '../types';
import {
  GROOMING_SALONS,
  calculateDistanceMiles,
  loadSavedGroomerIds,
  saveSavedGroomerIds,
  loadStoredGroomingAppointments,
  saveStoredGroomingAppointments
} from '../data/groomingData';
import { GroomingGoogleMap } from './GroomingGoogleMap';
import { LocationPermissionModal } from './LocationPermissionModal';
import {
  UserCoordinates,
  getSavedCoordinates,
  saveCoordinates,
  requestCurrentGPSLocation,
  watchCurrentGPSLocation
} from '../services/locationService';

interface GroomingFinderScreenProps {
  onShowToast: (msg: string) => void;
  currentUser?: UserProfile;
}

export const GroomingFinderScreen: React.FC<GroomingFinderScreenProps> = ({
  onShowToast,
  currentUser
}) => {
  // Geolocation state: initialize from saved GPS if available
  const [geoStatus, setGeoStatus] = useState<'idle' | 'requesting' | 'acquired' | 'denied' | 'unsupported'>('idle');
  const [userCoords, setUserCoords] = useState<UserCoordinates>(() => getSavedCoordinates());
  const [maxRadiusMiles, setMaxRadiusMiles] = useState<number>(50);
  const [showLocationModal, setShowLocationModal] = useState<boolean>(false);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [filterOpenNow, setFilterOpenNow] = useState(false);
  const [filterWalkIns, setFilterWalkIns] = useState(false);
  const [filterSavedOnly, setFilterSavedOnly] = useState(false);
  const [filterMobileOnly, setFilterMobileOnly] = useState(false);
  const [viewMode, setViewMode] = useState<'split' | 'grid'>('split');
  const [selectedSalon, setSelectedSalon] = useState<GroomingSalon | null>(GROOMING_SALONS[0]);

  // Saved / Favorite Salons
  const [savedSalonIds, setSavedSalonIds] = useState<string[]>(() => loadSavedGroomerIds());

  // Booking Modal state
  const [bookingSalon, setBookingSalon] = useState<GroomingSalon | null>(null);
  const [selectedServiceId, setSelectedServiceId] = useState<string>('');
  const [petName, setPetName] = useState('Archie');
  const [petBreed, setPetBreed] = useState('Golden Retriever');
  const [petWeightLbs, setPetWeightLbs] = useState<number>(65);
  const [coatType, setCoatType] = useState('Double Coat (Heavy Shedding)');
  const [bookingDate, setBookingDate] = useState('Tomorrow');
  const [bookingTimeSlot, setBookingTimeSlot] = useState('Morning (10:00 AM)');
  const [guardianName, setGuardianName] = useState(currentUser?.name || 'Marcus Vance');
  const [guardianPhone, setGuardianPhone] = useState(currentUser?.phone || '(512) 892-4011');
  const [guardianEmail, setGuardianEmail] = useState(currentUser?.email || 'marcus.vance@example.com');
  const [specialNotes, setSpecialNotes] = useState('');

  // Appointments Modal state
  const [appointments, setAppointments] = useState<GroomingAppointment[]>(() => loadStoredGroomingAppointments());
  const [showAppointmentsModal, setShowAppointmentsModal] = useState(false);

  // Automatically make device GPS the active current location on mount
  useEffect(() => {
    let unmounted = false;

    // Immediately trigger GPS to make GPS their current location
    setGeoStatus('requesting');
    requestCurrentGPSLocation()
      .then((coords) => {
        if (unmounted) return;
        setUserCoords(coords);
        setGeoStatus('acquired');
        setShowLocationModal(false);

        // If closest salon is > 50 mi away, auto-expand radius to statewide
        const closestDistance = Math.min(
          ...GROOMING_SALONS.map((s) =>
            calculateDistanceMiles(coords.lat, coords.lng, s.coordinates.lat, s.coordinates.lng)
          )
        );
        if (closestDistance > 50) {
          setMaxRadiusMiles(0); // Statewide / all distances
        }

        onShowToast(`📍 Current location set to ${coords.city} via device GPS!`);
      })
      .catch((err) => {
        if (unmounted) return;
        console.warn('Auto GPS acquisition in Grooming:', err);
        const cached = getSavedCoordinates();
        if (cached.source === 'gps') {
          setUserCoords(cached);
          setGeoStatus('acquired');
        } else {
          setGeoStatus('idle');
        }
      });

    // Also watch for GPS coordinate updates
    const stopWatch = watchCurrentGPSLocation((updatedCoords) => {
      if (unmounted) return;
      setUserCoords(updatedCoords);
      setGeoStatus('acquired');
    });

    return () => {
      unmounted = true;
      stopWatch();
    };
  }, []);

  // Manual or button-triggered GPS request
  const handleRequestLocation = async (silent = false) => {
    setGeoStatus('requesting');
    try {
      const coords = await requestCurrentGPSLocation();
      setUserCoords(coords);
      setGeoStatus('acquired');
      setShowLocationModal(false);

      const closestDistance = Math.min(
        ...GROOMING_SALONS.map((s) =>
          calculateDistanceMiles(coords.lat, coords.lng, s.coordinates.lat, s.coordinates.lng)
        )
      );
      if (closestDistance > 50) {
        setMaxRadiusMiles(0);
      }

      if (!silent) {
        onShowToast(`📍 GPS Connected: ${coords.city}`);
      }
    } catch (error: any) {
      console.warn('GPS request declined in Grooming:', error);
      setGeoStatus('denied');
      if (!silent) {
        onShowToast('Location permission declined. You can choose a Texas metro preset below.');
      }
    }
  };

  // City preset fallback selector
  const handleSelectCityPreset = (cityName: string, lat: number, lng: number) => {
    const coords: UserCoordinates = {
      lat,
      lng,
      city: cityName,
      source: 'city_preset'
    };
    setUserCoords(coords);
    saveCoordinates(coords);
    setGeoStatus('acquired');
    onShowToast(`Location updated to ${cityName}. Recalculating distances...`);
  };

  // Toggle Favorite
  const handleToggleSaveSalon = (id: string, name: string) => {
    setSavedSalonIds((prev) => {
      const isSaved = prev.includes(id);
      const next = isSaved ? prev.filter((item) => item !== id) : [...prev, id];
      saveSavedGroomerIds(next);
      onShowToast(isSaved ? `Removed ${name} from saved groomers.` : `Saved ${name} to your favorites!`);
      return next;
    });
  };

  // Calculate dynamic distances & filter salons
  const salonsWithDistance = useMemo(() => {
    return GROOMING_SALONS.map((salon) => {
      const dist = calculateDistanceMiles(
        userCoords.lat,
        userCoords.lng,
        salon.coordinates.lat,
        salon.coordinates.lng
      );
      return {
        ...salon,
        distanceMiles: dist
      };
    }).sort((a, b) => (a.distanceMiles ?? 999) - (b.distanceMiles ?? 999));
  }, [userCoords]);

  const filteredSalons = useMemo(() => {
    return salonsWithDistance.filter((salon) => {
      // Type
      if (selectedType !== 'all' && salon.salonType !== selectedType) {
        return false;
      }
      // Mobile van quick filter
      if (filterMobileOnly && !salon.isMobileVan) {
        return false;
      }
      // Open now
      if (filterOpenNow && !salon.isOpenNow) {
        return false;
      }
      // Walk ins
      if (filterWalkIns && !salon.acceptsWalkIns) {
        return false;
      }
      // Saved only
      if (filterSavedOnly && !savedSalonIds.includes(salon.id)) {
        return false;
      }
      // Distance radius filter (if GPS or preset active)
      if (salon.distanceMiles && salon.distanceMiles > maxRadiusMiles) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = salon.name.toLowerCase().includes(q);
        const matchesCity = salon.city.toLowerCase().includes(q) || salon.zip.includes(q);
        const matchesService = salon.services.some((s) => s.name.toLowerCase().includes(q) || s.description.toLowerCase().includes(q));
        const matchesSpecialty = salon.specialties.some((s) => s.toLowerCase().includes(q));
        const matchesGroomer = salon.headGroomer.name.toLowerCase().includes(q);
        if (!matchesName && !matchesCity && !matchesService && !matchesSpecialty && !matchesGroomer) {
          return false;
        }
      }
      return true;
    });
  }, [
    salonsWithDistance,
    selectedType,
    filterMobileOnly,
    filterOpenNow,
    filterWalkIns,
    filterSavedOnly,
    maxRadiusMiles,
    savedSalonIds,
    searchQuery
  ]);

  // Open booking modal
  const handleOpenBooking = (salon: GroomingSalon, defaultServiceId?: string) => {
    setBookingSalon(salon);
    setSelectedServiceId(defaultServiceId || salon.services[0]?.id || '');
  };

  // Submit booking
  const handleConfirmBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingSalon) return;

    const chosenService = bookingSalon.services.find((s) => s.id === selectedServiceId) || bookingSalon.services[0];

    const newAppt: GroomingAppointment = {
      id: `groom-appt-${Date.now()}`,
      salonId: bookingSalon.id,
      salonName: bookingSalon.name,
      salonAddress: bookingSalon.address,
      salonPhone: bookingSalon.phone,
      petName,
      petBreed,
      petWeightLbs,
      serviceId: chosenService.id,
      serviceName: chosenService.name,
      date: bookingDate,
      timeSlot: bookingTimeSlot,
      guardianName,
      guardianPhone,
      guardianEmail,
      specialNotes,
      status: 'confirmed',
      createdAt: new Date().toISOString().split('T')[0]
    };

    const next = [newAppt, ...appointments];
    setAppointments(next);
    saveStoredGroomingAppointments(next);
    setBookingSalon(null);
    onShowToast(`Confirmed grooming appointment for ${petName} at ${bookingSalon.name}!`);
  };

  // Cancel booking
  const handleCancelAppointment = (id: string) => {
    const next = appointments.filter((a) => a.id !== id);
    setAppointments(next);
    saveStoredGroomingAppointments(next);
    onShowToast('Grooming appointment cancelled.');
  };

  return (
    <div className="space-y-8 pb-20">
      
      {/* Editorial Header Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-[#1c2e42] via-[#111c2d] to-[#203a43] text-white p-8 sm:p-12 relative overflow-hidden shadow-xl border border-white/10">
          <div className="relative z-10 max-w-3xl space-y-4">
            
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#82f5c1]/20 border border-[#82f5c1]/40 text-[#82f5c1] text-xs font-bold">
              <span className="material-symbols-outlined text-sm">content_cut</span>
              <span>Certified Master Groomers & Mobile Doorstep Spas</span>
            </div>

            <h1 className="font-['Epilogue'] font-bold text-3xl sm:text-4xl lg:text-5xl text-white tracking-tight">
              Find Top Dog Grooming Salons Near You
            </h1>

            <p className="text-xs sm:text-sm text-[#dee8ff]/80 leading-relaxed">
              Locate trusted local grooming salons, mobile spa vans that come directly to your driveway, and Fear Free certified groomers. Compare breed-standard hand-scissoring, hypoallergenic oatmeal soaks, and de-shedding blowouts with upfront pricing.
            </p>

            {/* LIVE GPS LOCATION RADAR BAR */}
            <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-4">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
                  geoStatus === 'acquired'
                    ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30'
                    : geoStatus === 'requesting'
                    ? 'bg-amber-500 text-white animate-pulse'
                    : 'bg-white/20 text-[#ffdcc3]'
                }`}>
                  <span className="material-symbols-outlined text-xl">
                    {geoStatus === 'acquired' ? 'my_location' : geoStatus === 'requesting' ? 'radar' : 'location_on'}
                  </span>
                </div>
                <div>
                  <p className="text-xs font-bold text-white flex items-center gap-1.5">
                    <span>{geoStatus === 'acquired' ? 'Current Location Active' : 'Find Groomers Near You'}</span>
                    {geoStatus === 'acquired' && (
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                    )}
                  </p>
                  <p className="text-[11px] text-[#dee8ff]/80">
                    {geoStatus === 'acquired'
                      ? `${userCoords.city} • Calculating live distance to salons`
                      : geoStatus === 'denied'
                      ? 'GPS access blocked. Choose your city below or enter your zip code.'
                      : 'Enable your current location to see salons and mobile vans closest to you.'}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setShowLocationModal(true)}
                  disabled={geoStatus === 'requesting'}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-md cursor-pointer ring-2 ring-[#ffdcc3]/50 ${
                    geoStatus === 'acquired'
                      ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                      : 'bg-[#ffdcc3] hover:bg-[#ffe6d4] text-[#8d4b00]'
                  }`}
                >
                  <span className="material-symbols-outlined text-base animate-pulse">
                    {geoStatus === 'requesting' ? 'hourglass_top' : 'near_me'}
                  </span>
                  <span>
                    {geoStatus === 'requesting'
                      ? 'Acquiring GPS...'
                      : geoStatus === 'acquired'
                      ? 'GPS Active (Change)'
                      : 'Ask Access for Location'}
                  </span>
                </button>

                {/* City Preset Dropdown / Quick buttons */}
                <div className="flex items-center gap-1.5 text-xs text-white">
                  <span className="text-[11px] text-[#dee8ff]/70 hidden md:inline">Or:</span>
                  <button
                    type="button"
                    onClick={() => handleSelectCityPreset('Austin, TX', 30.2672, -97.7431)}
                    className="px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-semibold cursor-pointer"
                  >
                    Austin
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSelectCityPreset('Dallas, TX', 32.7767, -96.7970)}
                    className="px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-semibold cursor-pointer"
                  >
                    Dallas
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSelectCityPreset('Houston, TX', 29.7604, -95.3698)}
                    className="px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-semibold cursor-pointer"
                  >
                    Houston
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => setShowAppointmentsModal(true)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold border border-white/20 transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-base text-[#82f5c1]">calendar_month</span>
                <span>My Grooming Bookings ({appointments.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setFilterMobileOnly(!filterMobileOnly)}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                  filterMobileOnly
                    ? 'bg-[#82f5c1] text-[#006c4a] border-[#82f5c1]'
                    : 'bg-white/10 hover:bg-white/20 text-white border-white/20'
                }`}
              >
                <span className="material-symbols-outlined text-base">rv_hookup</span>
                <span>Doorstep Mobile Vans Only</span>
              </button>
            </div>

          </div>

          <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none text-white hidden md:block">
            <span className="material-symbols-outlined text-[300px]">content_cut</span>
          </div>
        </div>
      </section>

      {/* SEARCH, CATEGORY PILLS & RADIUS FILTER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        
        {/* Search Bar + Controls */}
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          <div className="relative flex-1">
            <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[#887364] text-lg">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by salon name, zip code, de-shedding, blueberry facial, or mobile van..."
              className="w-full pl-10 pr-4 py-3 bg-white rounded-2xl border border-[#dee8ff] text-xs focus:outline-hidden focus:border-[#8d4b00] shadow-xs"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            )}
          </div>

          {/* Distance Radius Slider */}
          <div className="bg-white px-4 py-2.5 rounded-2xl border border-[#dee8ff] shadow-xs flex items-center gap-3">
            <span className="material-symbols-outlined text-[#8d4b00] text-base">distance</span>
            <div className="text-xs">
              <span className="text-[#887364] text-[11px] font-bold uppercase tracking-wider block">Max Distance:</span>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min="5"
                  max="100"
                  step="5"
                  value={maxRadiusMiles}
                  onChange={(e) => setMaxRadiusMiles(Number(e.target.value))}
                  className="w-24 sm:w-32 accent-[#8d4b00] cursor-pointer"
                />
                <span className="font-bold text-[#111c2d] min-w-[50px]">{maxRadiusMiles} mi</span>
              </div>
            </div>
          </div>

          {/* View Mode Toggle */}
          <div className="hidden sm:flex items-center gap-1 bg-white p-1 rounded-2xl border border-[#dee8ff] shadow-xs">
            <button
              onClick={() => setViewMode('split')}
              className={`p-2 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors ${
                viewMode === 'split' ? 'bg-[#111c2d] text-white' : 'text-[#554336] hover:bg-gray-100'
              }`}
              title="Split List & Map View"
            >
              <span className="material-symbols-outlined text-base">splitscreen</span>
              <span>Split View</span>
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors ${
                viewMode === 'grid' ? 'bg-[#111c2d] text-white' : 'text-[#554336] hover:bg-gray-100'
              }`}
              title="Full Grid View"
            >
              <span className="material-symbols-outlined text-base">grid_view</span>
              <span>Grid View</span>
            </button>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          {[
            { id: 'all', label: 'All Grooming Salons', icon: 'storefront' },
            { id: 'mobile-van', label: 'Doorstep Mobile Vans', icon: 'rv_hookup' },
            { id: 'luxury-spa', label: 'Luxury Canine Spas', icon: 'spa' },
            { id: 'boutique-salon', label: 'Boutique Salons', icon: 'pets' },
            { id: 'fear-free', label: 'Fear-Free Certified', icon: 'health_and_safety' },
            { id: 'self-wash', label: 'Self-Wash Bays', icon: 'bathtub' }
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedType(cat.id)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap border transition-all cursor-pointer ${
                selectedType === cat.id
                  ? 'bg-[#8d4b00] text-white border-[#8d4b00] shadow-xs'
                  : 'bg-white text-[#554336] border-[#dee8ff] hover:bg-[#f0f3ff]'
              }`}
            >
              <span className="material-symbols-outlined text-base">{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          ))}

          <div className="h-6 w-px bg-gray-200 mx-1 shrink-0"></div>

          {/* Quick Toggles */}
          <button
            onClick={() => setFilterOpenNow(!filterOpenNow)}
            className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap border cursor-pointer transition-colors ${
              filterOpenNow
                ? 'bg-emerald-600 text-white border-emerald-600'
                : 'bg-white text-[#554336] border-[#dee8ff] hover:bg-[#f0f3ff]'
            }`}
          >
            Open Now
          </button>

          <button
            onClick={() => setFilterWalkIns(!filterWalkIns)}
            className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap border cursor-pointer transition-colors ${
              filterWalkIns
                ? 'bg-emerald-600 text-white border-emerald-600'
                : 'bg-white text-[#554336] border-[#dee8ff] hover:bg-[#f0f3ff]'
            }`}
          >
            Walk-Ins Welcome
          </button>

          <button
            onClick={() => setFilterSavedOnly(!filterSavedOnly)}
            className={`flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap border cursor-pointer transition-colors ${
              filterSavedOnly
                ? 'bg-rose-500 text-white border-rose-500'
                : 'bg-white text-[#554336] border-[#dee8ff] hover:bg-[#f0f3ff]'
            }`}
          >
            <span className="material-symbols-outlined text-sm">favorite</span>
            <span>Saved ({savedSalonIds.length})</span>
          </button>
        </div>

        {/* Results Counter */}
        <div className="flex items-center justify-between text-xs text-[#554336] pt-1">
          <p>
            Showing <strong className="text-[#111c2d]">{filteredSalons.length}</strong> certified grooming salons within {maxRadiusMiles} miles of {userCoords.city}.
          </p>
          {geoStatus === 'acquired' && (
            <span className="text-emerald-700 font-bold flex items-center gap-1">
              <span className="material-symbols-outlined text-xs">near_me</span>
              Sorted by closest driving distance
            </span>
          )}
        </div>

      </section>

      {/* MAIN DISPLAY: SPLIT OR GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`grid gap-8 ${viewMode === 'split' ? 'grid-cols-1 lg:grid-cols-12' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'}`}>
          
          {/* SALONS LIST (7 cols on split, full on grid) */}
          <div className={`${viewMode === 'split' ? 'lg:col-span-7' : 'col-span-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3'} space-y-6`}>
            
            {filteredSalons.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-[#dee8ff] space-y-4">
                <span className="material-symbols-outlined text-5xl text-gray-300">content_cut</span>
                <h3 className="font-['Epilogue'] font-bold text-lg text-[#111c2d]">No Grooming Salons Found in this Range</h3>
                <p className="text-xs text-[#554336] max-w-md mx-auto">
                  Try widening your distance radius, removing filters, or searching for Austin, Dallas, or Houston.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setMaxRadiusMiles(100);
                    setSelectedType('all');
                    setFilterMobileOnly(false);
                    setFilterOpenNow(false);
                    setSearchQuery('');
                  }}
                  className="px-5 py-2.5 bg-[#8d4b00] text-white rounded-xl text-xs font-bold cursor-pointer"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              filteredSalons.map((salon) => {
                const isSelected = selectedSalon?.id === salon.id;
                const isSaved = savedSalonIds.includes(salon.id);

                return (
                  <div
                    key={salon.id}
                    onClick={() => setSelectedSalon(salon)}
                    className={`bg-white rounded-3xl p-6 border transition-all cursor-pointer shadow-xs hover:shadow-md relative overflow-hidden ${
                      isSelected && viewMode === 'split'
                        ? 'border-[#8d4b00] ring-2 ring-[#ffdcc3]'
                        : 'border-[#dee8ff] hover:border-[#8d4b00]/40'
                    }`}
                  >
                    {/* Top Row: Image & Info */}
                    <div className="flex flex-col sm:flex-row gap-4 items-start">
                      <div className="relative w-full sm:w-36 h-36 rounded-2xl overflow-hidden shrink-0 bg-gray-100">
                        <img
                          src={salon.image}
                          alt={salon.name}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                        {salon.isMobileVan && (
                          <div className="absolute top-2 left-2 bg-[#8d4b00] text-white text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 shadow-sm">
                            <span className="material-symbols-outlined text-xs">rv_hookup</span>
                            <span>Mobile Van</span>
                          </div>
                        )}
                        {salon.salonType === 'fear-free' && (
                          <div className="absolute top-2 left-2 bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 shadow-sm">
                            <span className="material-symbols-outlined text-xs">sentiment_satisfied</span>
                            <span>Fear Free</span>
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0 space-y-1.5 w-full">
                        
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-[11px] font-bold uppercase tracking-wider text-[#8d4b00]">
                                {salon.typeLabel}
                              </span>
                              {salon.distanceMiles !== undefined && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#ffdcc3] text-[#8d4b00] text-[10px] font-bold">
                                  <span className="material-symbols-outlined text-xs">near_me</span>
                                  <span>{salon.distanceMiles} mi away</span>
                                </span>
                              )}
                            </div>
                            <h3 className="font-['Epilogue'] font-bold text-base text-[#111c2d] leading-snug hover:text-[#8d4b00] transition-colors">
                              {salon.name}
                            </h3>
                          </div>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToggleSaveSalon(salon.id, salon.name);
                            }}
                            className={`p-2 rounded-full transition-colors cursor-pointer shrink-0 ${
                              isSaved ? 'text-rose-500 bg-rose-50' : 'text-gray-400 hover:text-rose-500 hover:bg-gray-100'
                            }`}
                            title={isSaved ? 'Remove from favorites' : 'Save salon'}
                          >
                            <span className="material-symbols-outlined text-lg">
                              {isSaved ? 'favorite' : 'favorite_border'}
                            </span>
                          </button>
                        </div>

                        {/* Rating & City */}
                        <div className="flex items-center gap-3 text-xs">
                          <div className="flex items-center gap-1 text-amber-500 font-bold">
                            <span className="material-symbols-outlined text-sm">star</span>
                            <span>{salon.rating.toFixed(1)}</span>
                            <span className="text-[#887364] font-normal">({salon.reviewCount})</span>
                          </div>
                          <span className="text-gray-300">•</span>
                          <span className="text-[#554336]">{salon.city}, {salon.state}</span>
                          <span className="text-gray-300">•</span>
                          <span className="font-bold text-[#8d4b00]">{salon.priceRange}</span>
                        </div>

                        {/* Hours / Open Status */}
                        <p className="text-[11px] text-[#554336] flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                          <span className="font-semibold text-emerald-700">{salon.isOpenNow ? 'Open Now' : 'Closed'}</span>
                          <span className="text-gray-400">—</span>
                          <span className="truncate">{salon.hours}</span>
                        </p>

                        {/* Specialties pills */}
                        <div className="flex flex-wrap gap-1 pt-1">
                          {salon.specialties.slice(0, 3).map((spec, i) => (
                            <span key={i} className="text-[10px] bg-[#f0f3ff] text-[#334b6e] font-medium px-2 py-0.5 rounded-md border border-[#dee8ff]">
                              {spec}
                            </span>
                          ))}
                        </div>

                      </div>
                    </div>

                    {/* Services Preview Bar */}
                    <div className="mt-4 pt-3 border-t border-[#f0f3ff] space-y-2">
                      <p className="text-[11px] font-bold text-[#887364] uppercase tracking-wider">
                        Available Services & Starting Rates:
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {salon.services.slice(0, 2).map((srv) => (
                          <div key={srv.id} className="p-2 rounded-xl bg-[#f9f9ff] border border-[#dee8ff] flex items-center justify-between text-xs">
                            <div className="truncate pr-2">
                              <p className="font-bold text-[#111c2d] truncate">{srv.name}</p>
                              <p className="text-[10px] text-[#887364]">{srv.durationMinutes} min</p>
                            </div>
                            <span className="font-bold text-[#8d4b00] shrink-0">From ${srv.startingPrice}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-4 pt-3 border-t border-[#f0f3ff] flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <a
                          href={`tel:${salon.phone.replace(/[^\d]/g, '')}`}
                          onClick={(e) => e.stopPropagation()}
                          className="px-3 py-1.5 rounded-xl border border-[#dee8ff] text-xs font-semibold text-[#111c2d] hover:bg-gray-50 flex items-center gap-1"
                        >
                          <span className="material-symbols-outlined text-sm text-[#006c4a]">call</span>
                          <span>{salon.phone}</span>
                        </a>

                        <a
                          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(salon.name + ' ' + salon.address)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="px-3 py-1.5 rounded-xl border border-[#dee8ff] text-xs font-semibold text-[#111c2d] hover:bg-gray-50 flex items-center gap-1"
                        >
                          <span className="material-symbols-outlined text-sm text-blue-600">directions</span>
                          <span>Directions</span>
                        </a>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenBooking(salon);
                        }}
                        className="bg-[#8d4b00] hover:bg-[#b15f00] text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-sm">calendar_month</span>
                        <span>Book Grooming</span>
                      </button>
                    </div>

                  </div>
                );
              })
            )}

          </div>

          {/* RIGHT COLUMN: MAP & ACTIVE SALON DETAILS (Split view only) */}
          {viewMode === 'split' && (
            <div className="lg:col-span-5 space-y-6">
              
              {/* Interactive Google Map Card */}
              <div className="bg-white rounded-3xl p-5 border border-[#dee8ff] shadow-xs space-y-4 sticky top-6">
                
                <div className="flex items-center justify-between pb-2 border-b border-[#dee8ff]">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#8d4b00]">map</span>
                    <h4 className="font-bold text-xs text-[#111c2d] uppercase tracking-wider">
                      Google Maps Live Grooming Radar
                    </h4>
                  </div>
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                    GPS Connected
                  </span>
                </div>

                {/* Real Google Maps */}
                <GroomingGoogleMap
                  salons={filteredSalons}
                  selectedSalon={selectedSalon}
                  onSelectSalon={(s) => setSelectedSalon(s)}
                  onBookSalon={(s) => handleOpenBooking(s)}
                  userCoords={userCoords}
                  geoStatus={geoStatus}
                  onRequestLocation={handleRequestLocation}
                  className="h-80 w-full"
                />

                {/* Selected Salon Deep Detail Highlight */}
                {selectedSalon && (
                  <div className="bg-[#f8faff] rounded-2xl p-4 border border-[#dee8ff] space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#8d4b00]">
                          {selectedSalon.typeLabel}
                        </span>
                        <h5 className="font-['Epilogue'] font-bold text-sm text-[#111c2d]">
                          {selectedSalon.name}
                        </h5>
                        <p className="text-[11px] text-[#554336] mt-0.5">{selectedSalon.address}</p>
                      </div>
                      <span className="text-xs font-bold text-[#8d4b00] bg-[#ffdcc3] px-2 py-1 rounded-lg shrink-0">
                        {selectedSalon.distanceMiles} mi
                      </span>
                    </div>

                    {/* Head Groomer Card */}
                    <div className="flex items-center gap-3 p-2.5 rounded-xl bg-white border border-[#dee8ff]">
                      <img
                        src={selectedSalon.headGroomer.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'}
                        alt={selectedSalon.headGroomer.name}
                        className="w-11 h-11 rounded-full object-cover border border-[#dee8ff] shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="font-bold text-xs text-[#111c2d] truncate">{selectedSalon.headGroomer.name}</p>
                        <p className="text-[10px] text-[#8d4b00] font-semibold truncate">{selectedSalon.headGroomer.title}</p>
                        <p className="text-[10px] text-[#887364] truncate">{selectedSalon.headGroomer.certifications}</p>
                      </div>
                    </div>

                    {/* Salon Features */}
                    <div>
                      <p className="text-[10px] font-bold text-[#887364] uppercase tracking-wider mb-1">
                        Facility & Safety Highlights:
                      </p>
                      <ul className="space-y-1">
                        {selectedSalon.features.map((feat, i) => (
                          <li key={i} className="text-[11px] text-[#554336] flex items-center gap-1.5">
                            <span className="material-symbols-outlined text-emerald-600 text-sm">check_circle</span>
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleOpenBooking(selectedSalon)}
                      className="w-full bg-[#8d4b00] hover:bg-[#b15f00] text-white py-2.5 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-sm">calendar_month</span>
                      <span>Book Appointment at {selectedSalon.name.split(' ')[0]}</span>
                    </button>
                  </div>
                )}

              </div>

            </div>
          )}

        </div>
      </section>

      {/* ONLINE APPOINTMENT BOOKING MODAL */}
      {bookingSalon && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-[#dee8ff] max-h-[92vh] flex flex-col">
            
            {/* Modal Header */}
            <div className="bg-[#111c2d] text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-[#ffdcc3] text-2xl">content_cut</span>
                <div>
                  <h3 className="font-['Epilogue'] font-bold text-base">
                    Book Grooming Appointment
                  </h3>
                  <p className="text-xs text-[#dee8ff]/80">{bookingSalon.name}</p>
                </div>
              </div>
              <button
                onClick={() => setBookingSalon(null)}
                className="p-1.5 text-white/70 hover:text-white rounded-full hover:bg-white/10 transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleConfirmBooking} className="p-5 sm:p-6 overflow-y-auto space-y-4 text-xs">
              
              {/* Select Service */}
              <div>
                <label className="block font-bold text-[#111c2d] mb-1.5">Select Service *</label>
                <div className="space-y-2">
                  {bookingSalon.services.map((srv) => (
                    <label
                      key={srv.id}
                      className={`flex items-start justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                        selectedServiceId === srv.id
                          ? 'border-[#8d4b00] bg-[#ffdcc3]/20 ring-1 ring-[#8d4b00]'
                          : 'border-[#dee8ff] hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-start gap-2.5 pr-2">
                        <input
                          type="radio"
                          name="selectedService"
                          checked={selectedServiceId === srv.id}
                          onChange={() => setSelectedServiceId(srv.id)}
                          className="mt-0.5 text-[#8d4b00] focus:ring-[#8d4b00]"
                        />
                        <div>
                          <p className="font-bold text-[#111c2d]">{srv.name}</p>
                          <p className="text-[11px] text-[#554336] mt-0.5">{srv.description}</p>
                          <p className="text-[10px] text-[#887364] mt-1">Est. Duration: {srv.durationMinutes} min</p>
                        </div>
                      </div>
                      <span className="font-bold text-[#8d4b00] shrink-0">From ${srv.startingPrice}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Dog Information */}
              <div className="p-4 rounded-2xl bg-[#f9f9ff] border border-[#dee8ff] space-y-3">
                <h4 className="font-bold text-[#111c2d] flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-sm text-[#8d4b00]">pets</span>
                  <span>Companion Details</span>
                </h4>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-medium text-[#554336] mb-1">Pet Name *</label>
                    <input
                      type="text"
                      required
                      value={petName}
                      onChange={(e) => setPetName(e.target.value)}
                      className="w-full px-3 py-2 bg-white rounded-xl border border-[#dee8ff] focus:border-[#8d4b00] text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-[#554336] mb-1">Breed *</label>
                    <input
                      type="text"
                      required
                      value={petBreed}
                      onChange={(e) => setPetBreed(e.target.value)}
                      className="w-full px-3 py-2 bg-white rounded-xl border border-[#dee8ff] focus:border-[#8d4b00] text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-medium text-[#554336] mb-1">Approx. Weight (lbs)</label>
                    <input
                      type="number"
                      value={petWeightLbs}
                      onChange={(e) => setPetWeightLbs(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-white rounded-xl border border-[#dee8ff] focus:border-[#8d4b00] text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-[#554336] mb-1">Coat Type</label>
                    <select
                      value={coatType}
                      onChange={(e) => setCoatType(e.target.value)}
                      className="w-full px-3 py-2 bg-white rounded-xl border border-[#dee8ff] focus:border-[#8d4b00] text-xs"
                    >
                      <option>Double Coat (Heavy Shedding)</option>
                      <option>Curly / Doodle / Poodle Fleece</option>
                      <option>Short Smooth Coat</option>
                      <option>Long Silky Coat</option>
                      <option>Wirehair / Terrier Coat</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Date & Time */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#111c2d] mb-1">Preferred Date *</label>
                  <select
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    className="w-full px-3 py-2 bg-white rounded-xl border border-[#dee8ff] focus:border-[#8d4b00] text-xs"
                  >
                    <option>Tomorrow</option>
                    <option>In 2 Days</option>
                    <option>This Saturday</option>
                    <option>Next Week</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-[#111c2d] mb-1">Time Window *</label>
                  <select
                    value={bookingTimeSlot}
                    onChange={(e) => setBookingTimeSlot(e.target.value)}
                    className="w-full px-3 py-2 bg-white rounded-xl border border-[#dee8ff] focus:border-[#8d4b00] text-xs"
                  >
                    <option>Morning (9:00 AM - 11:30 AM)</option>
                    <option>Mid-Day (12:00 PM - 2:30 PM)</option>
                    <option>Late Afternoon (3:00 PM - 5:30 PM)</option>
                  </select>
                </div>
              </div>

              {/* Guardian Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-[#554336] mb-1">Your Name *</label>
                  <input
                    type="text"
                    required
                    value={guardianName}
                    onChange={(e) => setGuardianName(e.target.value)}
                    className="w-full px-3 py-2 bg-white rounded-xl border border-[#dee8ff] focus:border-[#8d4b00] text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-[#554336] mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={guardianPhone}
                    onChange={(e) => setGuardianPhone(e.target.value)}
                    className="w-full px-3 py-2 bg-white rounded-xl border border-[#dee8ff] focus:border-[#8d4b00] text-xs"
                  />
                </div>
              </div>

              {/* Special Handling Notes */}
              <div>
                <label className="block font-bold text-[#111c2d] mb-1">Special Handling / Temperament Notes</label>
                <textarea
                  rows={2}
                  value={specialNotes}
                  onChange={(e) => setSpecialNotes(e.target.value)}
                  placeholder="e.g. Nervous around loud dryers, sensitive skin allergies, requires hip joint support..."
                  className="w-full px-3 py-2 bg-white rounded-xl border border-[#dee8ff] focus:border-[#8d4b00] text-xs"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setBookingSalon(null)}
                  className="px-4 py-2.5 text-gray-600 hover:text-gray-800 text-xs font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#8d4b00] hover:bg-[#b15f00] text-white rounded-xl text-xs font-bold shadow-md cursor-pointer transition-colors"
                >
                  Confirm Grooming Booking
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* MY BOOKED APPOINTMENTS MODAL */}
      {showAppointmentsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-[#dee8ff] max-h-[90vh] flex flex-col">
            
            <div className="bg-[#111c2d] text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#82f5c1]">calendar_month</span>
                <h3 className="font-['Epilogue'] font-bold text-base">Your Grooming Bookings</h3>
              </div>
              <button
                onClick={() => setShowAppointmentsModal(false)}
                className="p-1.5 text-white/70 hover:text-white rounded-full hover:bg-white/10 transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            </div>

            <div className="p-5 sm:p-6 overflow-y-auto space-y-4">
              {appointments.length === 0 ? (
                <div className="text-center py-8 space-y-2 text-[#887364]">
                  <span className="material-symbols-outlined text-4xl text-gray-300">calendar_today</span>
                  <p className="text-xs">No active grooming appointments scheduled yet.</p>
                </div>
              ) : (
                appointments.map((appt) => (
                  <div key={appt.id} className="p-4 rounded-2xl bg-[#f8faff] border border-[#dee8ff] space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md uppercase">
                          {appt.status}
                        </span>
                        <h4 className="font-bold text-sm text-[#111c2d] mt-1">{appt.salonName}</h4>
                        <p className="text-[11px] text-[#554336]">{appt.salonAddress}</p>
                      </div>
                      <button
                        onClick={() => handleCancelAppointment(appt.id)}
                        className="text-[11px] text-rose-600 hover:text-rose-800 font-semibold cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>

                    <div className="bg-white p-2.5 rounded-xl border border-[#dee8ff] text-xs space-y-1">
                      <p><strong>Companion:</strong> {appt.petName} ({appt.petBreed}, {appt.petWeightLbs} lbs)</p>
                      <p><strong>Service:</strong> {appt.serviceName}</p>
                      <p><strong>Date & Time:</strong> {appt.date} • {appt.timeSlot}</p>
                      {appt.specialNotes && (
                        <p className="text-[11px] text-gray-600"><strong>Notes:</strong> {appt.specialNotes}</p>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>

          </div>
        </div>
      )}

      {/* Location Access Request Modal */}
      <LocationPermissionModal
        isOpen={showLocationModal}
        onClose={() => setShowLocationModal(false)}
        onRequestLocation={() => handleRequestLocation(false)}
        onSelectCity={handleSelectCityPreset}
        geoStatus={geoStatus}
        currentCity={userCoords.city}
      />

    </div>
  );
};
