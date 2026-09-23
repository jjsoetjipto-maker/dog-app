import React, { useState, useEffect, useMemo } from 'react';
import { VetClinic, VetAppointment, UserProfile } from '../types';
import {
  VET_CLINICS,
  VET_EMERGENCY_HOTLINES,
  calculateDistanceMiles,
  loadSavedVetIds,
  saveSavedVetIds,
  loadStoredAppointments,
  saveStoredAppointments
} from '../data/vetData';
import { VetGoogleMap } from './VetGoogleMap';
import { LocationPermissionModal } from './LocationPermissionModal';
import {
  UserCoordinates,
  getSavedCoordinates,
  saveCoordinates,
  requestCurrentGPSLocation,
  watchCurrentGPSLocation
} from '../services/locationService';

interface VetFinderScreenProps {
  onShowToast: (msg: string) => void;
  currentUser?: UserProfile;
  initialSearchZip?: string;
}

export const VetFinderScreen: React.FC<VetFinderScreenProps> = ({
  onShowToast,
  currentUser,
  initialSearchZip = ''
}) => {
  // Geolocation state: initialize from saved coordinates if available
  const [geoStatus, setGeoStatus] = useState<'idle' | 'requesting' | 'acquired' | 'denied' | 'unsupported'>('idle');
  const [userCoords, setUserCoords] = useState<UserCoordinates>(() => getSavedCoordinates());
  const [maxRadiusMiles, setMaxRadiusMiles] = useState<number>(50);
  const [showLocationModal, setShowLocationModal] = useState<boolean>(false);

  // Search & Filtering state
  const [searchQuery, setSearchQuery] = useState(initialSearchZip);
  const [selectedCareType, setSelectedCareType] = useState<string>('all');
  const [filterOpenNow, setFilterOpenNow] = useState(false);
  const [filterEmergencyOnly, setFilterEmergencyOnly] = useState(false);
  const [filterAahaOnly, setFilterAahaOnly] = useState(false);
  const [filterFearFreeOnly, setFilterFearFreeOnly] = useState(false);
  const [filterVirtualOnly, setFilterVirtualOnly] = useState(false);
  const [filterSavedOnly, setFilterSavedOnly] = useState(false);
  const [viewMode, setViewMode] = useState<'split' | 'map-only' | 'grid'>('split');
  const [selectedClinic, setSelectedClinic] = useState<VetClinic | null>(VET_CLINICS[0]);

  // Saved / Bookmarked Vets
  const [savedVetIds, setSavedVetIds] = useState<string[]>(() => loadSavedVetIds());

  // Appointments state
  const [appointments, setAppointments] = useState<VetAppointment[]>(() => loadStoredAppointments());
  const [showAppointmentsModal, setShowAppointmentsModal] = useState(false);

  // Booking Modal state
  const [bookingClinic, setBookingClinic] = useState<VetClinic | null>(null);
  const [bookingPetName, setBookingPetName] = useState('Archie');
  const [bookingPetBreed, setBookingPetBreed] = useState('Golden Retriever');
  const [bookingReason, setBookingReason] = useState('Routine Pediatric Puppy Wellness & Microchip Check');
  const [bookingDate, setBookingDate] = useState('Tomorrow');
  const [bookingTimeSlot, setBookingTimeSlot] = useState('Morning (10:30 AM)');
  const [bookingGuardianName, setBookingGuardianName] = useState(currentUser?.name || 'Marcus Vance');
  const [bookingGuardianPhone, setBookingGuardianPhone] = useState(currentUser?.phone || '(512) 892-4011');
  const [bookingGuardianEmail, setBookingGuardianEmail] = useState(currentUser?.email || 'marcus.vance@example.com');
  const [bookingNotes, setBookingNotes] = useState('');

  // Clinic Details Modal
  const [detailClinic, setDetailClinic] = useState<VetClinic | null>(null);

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

        // Check distance to closest clinic; if outside default 50 mi radius, automatically expand to statewide
        const closestDistance = Math.min(
          ...VET_CLINICS.map((c) =>
            calculateDistanceMiles(coords.lat, coords.lng, c.coordinates.lat, c.coordinates.lng)
          )
        );
        if (closestDistance > 50) {
          setMaxRadiusMiles(0); // Show all distances statewide
        }

        onShowToast(`📍 Current location set to ${coords.city} via device GPS!`);
      })
      .catch((err) => {
        if (unmounted) return;
        console.warn('GPS auto acquisition:', err);
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
        ...VET_CLINICS.map((c) =>
          calculateDistanceMiles(coords.lat, coords.lng, c.coordinates.lat, c.coordinates.lng)
        )
      );
      if (closestDistance > 50) {
        setMaxRadiusMiles(0);
      }

      if (!silent) {
        onShowToast(`📍 GPS Connected: ${coords.city}`);
      }
    } catch (error: any) {
      console.warn('GPS request declined:', error);
      setGeoStatus('denied');
      if (!silent) {
        onShowToast('Location permission declined. You can select a city preset or browse all clinics.');
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
    onShowToast(`Location set to ${cityName}. Recalculating clinic distances...`);
  };

  // Toggle Favorite Vet
  const handleToggleSaveVet = (id: string, name: string) => {
    setSavedVetIds((prev) => {
      const isSaved = prev.includes(id);
      const next = isSaved ? prev.filter((item) => item !== id) : [...prev, id];
      saveSavedVetIds(next);
      onShowToast(isSaved ? `Removed ${name} from saved clinics.` : `Saved ${name} to your preferred veterinary network!`);
      return next;
    });
  };

  // Compute dynamic distance & sort clinics
  const clinicsWithDistance = useMemo(() => {
    return VET_CLINICS.map((clinic) => {
      const dist = calculateDistanceMiles(
        userCoords.lat,
        userCoords.lng,
        clinic.coordinates.lat,
        clinic.coordinates.lng
      );
      return {
        ...clinic,
        distanceMiles: dist
      };
    }).sort((a, b) => (a.distanceMiles ?? 999) - (b.distanceMiles ?? 999));
  }, [userCoords]);

  // Filtered Clinics
  const filteredClinics = useMemo(() => {
    return clinicsWithDistance.filter((c) => {
      // Radius limit
      if (maxRadiusMiles > 0 && (c.distanceMiles ?? 0) > maxRadiusMiles) {
        return false;
      }

      // Care Type
      if (selectedCareType !== 'all' && c.careType !== selectedCareType) {
        return false;
      }

      // Quick toggles
      if (filterOpenNow && !c.isOpenNow) return false;
      if (filterEmergencyOnly && !c.is24_7Emergency) return false;
      if (filterAahaOnly && !c.accreditations.some((a) => a.includes('AAHA'))) return false;
      if (filterFearFreeOnly && !c.accreditations.some((a) => a.toLowerCase().includes('fear free'))) return false;
      if (filterVirtualOnly && !c.virtualConsultAvailable) return false;
      if (filterSavedOnly && !savedVetIds.includes(c.id)) return false;

      // Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = c.name.toLowerCase().includes(q);
        const matchesType = c.typeLabel.toLowerCase().includes(q);
        const matchesLead = c.leadVet.name.toLowerCase().includes(q);
        const matchesService = c.services.some((s) => s.toLowerCase().includes(q));
        const matchesAddress = c.address.toLowerCase().includes(q) || c.zip.includes(q) || c.city.toLowerCase().includes(q);
        if (!matchesName && !matchesType && !matchesLead && !matchesService && !matchesAddress) {
          return false;
        }
      }

      return true;
    });
  }, [
    clinicsWithDistance,
    maxRadiusMiles,
    selectedCareType,
    filterOpenNow,
    filterEmergencyOnly,
    filterAahaOnly,
    filterFearFreeOnly,
    filterVirtualOnly,
    filterSavedOnly,
    savedVetIds,
    searchQuery
  ]);

  // Handle Booking Submit
  const handleConfirmBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingClinic) return;

    const newAppointment: VetAppointment = {
      id: `appt-${Date.now()}`,
      clinicId: bookingClinic.id,
      clinicName: bookingClinic.name,
      clinicPhone: bookingClinic.phone,
      clinicAddress: bookingClinic.address,
      petName: bookingPetName.trim() || 'Companion',
      petBreed: bookingPetBreed.trim() || 'Canine',
      reason: bookingReason,
      date: bookingDate,
      timeSlot: bookingTimeSlot,
      guardianName: bookingGuardianName.trim() || 'Guardian',
      guardianPhone: bookingGuardianPhone.trim() || '(512) 555-0100',
      guardianEmail: bookingGuardianEmail.trim() || 'guardian@example.com',
      notes: bookingNotes.trim(),
      status: 'confirmed',
      createdAt: 'Just now'
    };

    const nextAppointments = [newAppointment, ...appointments];
    setAppointments(nextAppointments);
    saveStoredAppointments(nextAppointments);

    onShowToast(`Appointment requested at ${bookingClinic.name}! Confirmation sent to ${bookingGuardianEmail}.`);
    setBookingClinic(null);
    setBookingNotes('');
  };

  const handleCancelAppointment = (apptId: string) => {
    const next = appointments.filter((a) => a.id !== apptId);
    setAppointments(next);
    saveStoredAppointments(next);
    onShowToast('Appointment cancelled.');
  };

  return (
    <div className="space-y-8 pb-20">
      
      {/* 24/7 Emergency Triage Ribbon */}
      <div className="bg-[#8d2b00] text-white text-xs py-2 px-4 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 font-medium">
            <span className="material-symbols-outlined text-sm text-[#ffdcc3] animate-pulse">emergency</span>
            <span><strong>Canine Emergency Triage:</strong> Immediate 24/7 hospital dispatch & poison control.</span>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="tel:8884264435"
              className="bg-[#ffdcc3] text-[#8d2b00] px-3 py-1 rounded-full font-bold hover:bg-white transition-colors flex items-center gap-1 shadow-xs"
            >
              <span className="material-symbols-outlined text-xs">call</span>
              <span>ASPCA Poison: (888) 426-4435</span>
            </a>
            <a
              href="tel:5123432837"
              className="bg-black/30 hover:bg-black/50 text-white px-3 py-1 rounded-full font-bold transition-colors flex items-center gap-1 border border-white/20"
            >
              <span className="material-symbols-outlined text-xs">local_hospital</span>
              <span>24/7 ER: (512) 343-2837</span>
            </a>
          </div>
        </div>
      </div>

      {/* Hero Banner Stage */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-[#111c2d] via-[#1a2942] to-[#263143] text-white rounded-3xl p-8 sm:p-12 relative overflow-hidden shadow-xl border border-[#2b3a54]">
          <div className="relative z-10 max-w-3xl space-y-4">
            
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#82f5c1]/20 border border-[#82f5c1]/40 text-[#82f5c1] text-xs font-bold">
              <span className="material-symbols-outlined text-sm">verified</span>
              <span>Google Maps Platform Verified Healthcare Directory</span>
            </div>

            <h1 className="font-['Epilogue'] font-black text-3xl sm:text-4xl lg:text-5xl tracking-tight text-white leading-tight">
              Veterinary Hospital & Emergency Clinic Finder
            </h1>

            <p className="text-xs sm:text-sm text-[#dee8ff]/90 leading-relaxed max-w-2xl">
              Locate verified veterinary hospitals, 24/7 emergency trauma centers, Fear Free pediatric practices, and OFA orthopedic surgeons on an interactive Google Map with live distance calculations.
            </p>

            {/* Quick Action Badges */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => setShowLocationModal(true)}
                className="px-4 py-2 bg-[#8d4b00] hover:bg-[#b15f00] text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-md transition-all cursor-pointer ring-2 ring-[#ffdcc3]/50"
                title="Ask permission to access current device location"
              >
                <span className="material-symbols-outlined text-sm animate-pulse">near_me</span>
                <span>Ask Access for Location</span>
              </button>

              <button
                type="button"
                onClick={() => setShowAppointmentsModal(true)}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl text-xs flex items-center gap-2 border border-white/20 transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">calendar_month</span>
                <span>My Appointments ({appointments.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setFilterEmergencyOnly(!filterEmergencyOnly)}
                className={`px-4 py-2 font-bold rounded-xl text-xs flex items-center gap-2 transition-all cursor-pointer ${
                  filterEmergencyOnly
                    ? 'bg-red-600 text-white shadow-md'
                    : 'bg-red-950/60 hover:bg-red-900/80 text-red-200 border border-red-500/40'
                }`}
              >
                <span className="material-symbols-outlined text-sm">emergency</span>
                <span>{filterEmergencyOnly ? 'Showing 24/7 ER Only' : 'Filter 24/7 ER Hospitals'}</span>
              </button>
            </div>

          </div>

          {/* Decorative Glow */}
          <div className="absolute right-0 bottom-0 translate-x-12 translate-y-12 w-96 h-96 bg-[#8d4b00]/20 rounded-full blur-3xl pointer-events-none"></div>
        </div>
      </section>

      {/* GPS Location & Radius Filter Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3">
        <div className="bg-white dark:bg-[#131d2e] rounded-3xl p-5 border border-[#dee8ff] dark:border-[#233150] shadow-sm space-y-4">
          
          <div className="flex flex-wrap items-center justify-between gap-4">
            
            {/* Geolocation Controls */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <button
                type="button"
                onClick={() => setShowLocationModal(true)}
                disabled={geoStatus === 'requesting'}
                className="px-4 py-2.5 bg-[#8d4b00] hover:bg-[#b15f00] text-white text-xs font-bold rounded-2xl flex items-center gap-2 shadow-xs transition-all cursor-pointer disabled:opacity-50 ring-2 ring-[#ffdcc3]/40"
              >
                <span className={`material-symbols-outlined text-base ${geoStatus === 'requesting' ? 'animate-spin' : 'animate-pulse'}`}>
                  {geoStatus === 'requesting' ? 'sync' : 'near_me'}
                </span>
                <span>
                  {geoStatus === 'requesting'
                    ? 'Acquiring GPS...'
                    : geoStatus === 'acquired' && userCoords.source === 'gps'
                    ? 'GPS Connected (Change)'
                    : 'Ask Access for Location'}
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleRequestLocation(false)}
                className="px-3 py-2 bg-[#f0f3ff] dark:bg-[#1a253a] hover:bg-[#dee8ff] text-[#111c2d] dark:text-white rounded-2xl text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer border border-[#dee8ff] dark:border-[#233150]"
                title="Direct GPS locate"
              >
                <span className="material-symbols-outlined text-sm text-[#8d4b00]">my_location</span>
                <span>Locate Me</span>
              </button>

              {/* City Presets */}
              <div className="flex flex-wrap items-center gap-1.5 text-xs">
                <span className="text-[#887364] dark:text-[#94a3b8] text-[11px] font-bold mr-1">
                  Texas Metros:
                </span>
                <button
                  type="button"
                  onClick={() => handleSelectCityPreset('Austin, TX', 30.2672, -97.7431)}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-colors cursor-pointer ${
                    userCoords.city?.includes('Austin')
                      ? 'bg-[#111c2d] text-white'
                      : 'bg-[#f0f3ff] dark:bg-[#1a253a] text-[#554336] dark:text-[#cbd5e1] hover:bg-[#dee8ff]'
                  }`}
                >
                  Austin
                </button>
                <button
                  type="button"
                  onClick={() => handleSelectCityPreset('Dallas, TX', 32.7767, -96.7970)}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-colors cursor-pointer ${
                    userCoords.city?.includes('Dallas')
                      ? 'bg-[#111c2d] text-white'
                      : 'bg-[#f0f3ff] dark:bg-[#1a253a] text-[#554336] dark:text-[#cbd5e1] hover:bg-[#dee8ff]'
                  }`}
                >
                  Dallas
                </button>
                <button
                  type="button"
                  onClick={() => handleSelectCityPreset('Houston, TX', 29.7604, -95.3698)}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-colors cursor-pointer ${
                    userCoords.city?.includes('Houston')
                      ? 'bg-[#111c2d] text-white'
                      : 'bg-[#f0f3ff] dark:bg-[#1a253a] text-[#554336] dark:text-[#cbd5e1] hover:bg-[#dee8ff]'
                  }`}
                >
                  Houston
                </button>
                <button
                  type="button"
                  onClick={() => handleSelectCityPreset('San Antonio, TX', 29.4241, -98.4936)}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-colors cursor-pointer ${
                    userCoords.city?.includes('San Antonio')
                      ? 'bg-[#111c2d] text-white'
                      : 'bg-[#f0f3ff] dark:bg-[#1a253a] text-[#554336] dark:text-[#cbd5e1] hover:bg-[#dee8ff]'
                  }`}
                >
                  San Antonio
                </button>
              </div>
            </div>

            {/* Radius Selector */}
            <div className="flex items-center gap-2 text-xs">
              <span className="text-[#887364] dark:text-[#94a3b8] font-semibold text-[11px]">Radius:</span>
              <select
                value={maxRadiusMiles}
                onChange={(e) => setMaxRadiusMiles(Number(e.target.value))}
                className="px-3 py-1.5 bg-[#f0f3ff] dark:bg-[#1a253a] border border-[#dee8ff] dark:border-[#233150] rounded-xl font-bold text-xs text-[#111c2d] dark:text-white focus:outline-none focus:border-[#8d4b00]"
              >
                <option value={10}>Within 10 miles</option>
                <option value={25}>Within 25 miles</option>
                <option value={50}>Within 50 miles</option>
                <option value={100}>Within 100 miles</option>
                <option value={0}>All Distances (Statewide)</option>
              </select>
            </div>

          </div>

          {/* Search bar & View mode toggle */}
          <div className="pt-3 border-t border-[#f0f3ff] dark:border-[#1e2b44] flex flex-wrap items-center justify-between gap-3">
            
            {/* Search Input */}
            <div className="relative flex-1 min-w-[260px]">
              <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[#887364] text-base">
                search
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by hospital name, doctor, zip code (e.g. 78701), or specialty..."
                className="w-full pl-10 pr-4 py-2.5 bg-[#f0f3ff] dark:bg-[#1a253a] border border-[#dee8ff] dark:border-[#233150] rounded-2xl text-xs text-[#111c2d] dark:text-white placeholder-[#887364] focus:outline-none focus:border-[#8d4b00]"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              )}
            </div>

            {/* View Mode Toggle: Split View (List + Google Map) vs Full Google Map vs Grid */}
            <div className="flex items-center gap-1 bg-[#f0f3ff] dark:bg-[#1a253a] p-1 rounded-2xl border border-[#dee8ff] dark:border-[#233150]">
              <button
                type="button"
                onClick={() => setViewMode('split')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1 ${
                  viewMode === 'split'
                    ? 'bg-[#8d4b00] text-white shadow-xs'
                    : 'text-[#554336] dark:text-[#cbd5e1] hover:bg-black/5'
                }`}
                title="List + Google Map Side-by-Side"
              >
                <span className="material-symbols-outlined text-sm">view_sidebar</span>
                <span>Split View</span>
              </button>

              <button
                type="button"
                onClick={() => setViewMode('map-only')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1 ${
                  viewMode === 'map-only'
                    ? 'bg-[#8d4b00] text-white shadow-xs'
                    : 'text-[#554336] dark:text-[#cbd5e1] hover:bg-black/5'
                }`}
                title="Full Screen Google Map"
              >
                <span className="material-symbols-outlined text-sm">map</span>
                <span>Full Map</span>
              </button>

              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1 ${
                  viewMode === 'grid'
                    ? 'bg-[#8d4b00] text-white shadow-xs'
                    : 'text-[#554336] dark:text-[#cbd5e1] hover:bg-black/5'
                }`}
                title="Card Grid Only"
              >
                <span className="material-symbols-outlined text-sm">grid_view</span>
                <span>Grid</span>
              </button>
            </div>

          </div>

          {/* Care Type & Accreditations Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 pt-1 overflow-x-auto text-xs">
            <span className="text-[11px] font-bold text-[#887364] dark:text-[#94a3b8] mr-1">
              Care Types:
            </span>

            {[
              { id: 'all', label: 'All Vets' },
              { id: 'emergency-hospital', label: '24/7 ER Trauma' },
              { id: 'general-practice', label: 'General Practice' },
              { id: 'specialty-surgery', label: 'Surgery & OFA' },
              { id: 'urgent-care', label: 'Urgent Care' },
              { id: 'mobile-vet', label: 'Mobile In-Home' }
            ].map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setSelectedCareType(t.id)}
                className={`px-3 py-1 rounded-full font-bold transition-colors cursor-pointer ${
                  selectedCareType === t.id
                    ? 'bg-[#111c2d] text-white'
                    : 'bg-[#f0f3ff] dark:bg-[#1a253a] text-[#554336] dark:text-[#cbd5e1] hover:bg-[#dee8ff]'
                }`}
              >
                {t.label}
              </button>
            ))}

            <span className="text-gray-300 dark:text-gray-700 mx-1">|</span>

            <button
              type="button"
              onClick={() => setFilterAahaOnly(!filterAahaOnly)}
              className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-colors cursor-pointer ${
                filterAahaOnly
                  ? 'bg-blue-600 text-white'
                  : 'bg-[#f0f3ff] dark:bg-[#1a253a] text-[#554336] dark:text-[#cbd5e1] border border-[#dee8ff]'
              }`}
            >
              AAHA Certified
            </button>

            <button
              type="button"
              onClick={() => setFilterFearFreeOnly(!filterFearFreeOnly)}
              className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-colors cursor-pointer ${
                filterFearFreeOnly
                  ? 'bg-purple-600 text-white'
                  : 'bg-[#f0f3ff] dark:bg-[#1a253a] text-[#554336] dark:text-[#cbd5e1] border border-[#dee8ff]'
              }`}
            >
              Fear Free Gold
            </button>

            <button
              type="button"
              onClick={() => setFilterVirtualOnly(!filterVirtualOnly)}
              className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-colors cursor-pointer ${
                filterVirtualOnly
                  ? 'bg-emerald-600 text-white'
                  : 'bg-[#f0f3ff] dark:bg-[#1a253a] text-[#554336] dark:text-[#cbd5e1] border border-[#dee8ff]'
              }`}
            >
              Virtual Consult
            </button>

            <button
              type="button"
              onClick={() => setFilterSavedOnly(!filterSavedOnly)}
              className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-colors cursor-pointer flex items-center gap-1 ${
                filterSavedOnly
                  ? 'bg-amber-600 text-white'
                  : 'bg-[#f0f3ff] dark:bg-[#1a253a] text-[#554336] dark:text-[#cbd5e1] border border-[#dee8ff]'
              }`}
            >
              <span className="material-symbols-outlined text-xs">bookmark</span>
              <span>Saved ({savedVetIds.length})</span>
            </button>
          </div>

        </div>
      </section>

      {/* Ask Location Access Notice Banner if not GPS */}
      {userCoords.source !== 'gps' && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-[#ffdcc3]/70 via-[#fff1e5]/60 to-[#ffdcc3]/40 dark:from-[#3d2414]/70 dark:to-[#22160d]/70 border border-[#ffb77d]/70 dark:border-[#8d4b00]/50 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#8d4b00] text-white flex items-center justify-center shrink-0 shadow-xs">
                <span className="material-symbols-outlined text-xl animate-pulse">my_location</span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black text-[#111c2d] dark:text-white">
                    Need driving distance to nearest emergency trauma hospitals?
                  </span>
                  <span className="text-[10px] uppercase font-bold bg-[#8d4b00] text-white px-1.5 py-0.5 rounded">
                    Fast Triage
                  </span>
                </div>
                <p className="text-[11px] text-[#554336] dark:text-[#cbd5e1] mt-0.5">
                  Currently showing clinics around <strong>{userCoords.city}</strong>. Ask access for your live location to calculate real driving mileage and navigate directly via Google Maps.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
              <button
                type="button"
                onClick={() => setShowLocationModal(true)}
                className="w-full sm:w-auto px-4 py-2 bg-[#8d4b00] hover:bg-[#b15f00] text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer ring-2 ring-[#ffdcc3]"
              >
                <span className="material-symbols-outlined text-sm">near_me</span>
                <span>Ask Access for Location</span>
              </button>
            </div>
          </div>
        </section>
      )}

      {/* GPS Active Notice Banner when GPS is current location */}
      {userCoords.source === 'gps' && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-emerald-50/90 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-2xl p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                <span className="material-symbols-outlined text-lg">my_location</span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-emerald-900 dark:text-emerald-200">
                    Live GPS Location Active
                  </span>
                  <span className="text-[10px] uppercase font-bold bg-emerald-600 text-white px-1.5 py-0.5 rounded">
                    Current Device
                  </span>
                </div>
                <p className="text-[11px] text-emerald-800/90 dark:text-emerald-300 mt-0.5">
                  Calculating driving mileage from <strong>{userCoords.city}</strong> ({userCoords.lat.toFixed(4)}°, {userCoords.lng.toFixed(4)}°).
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
              <button
                type="button"
                onClick={() => handleRequestLocation(false)}
                className="w-full sm:w-auto px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">sync</span>
                <span>Refresh GPS</span>
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Main Directory & Map Display */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Full Map View Mode */}
        {viewMode === 'map-only' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-xs text-[#887364] dark:text-[#94a3b8]">
                Displaying <strong>{filteredClinics.length}</strong> veterinary hospitals on Google Maps around <strong>{userCoords.city}</strong>
              </p>
              <button
                type="button"
                onClick={() => setViewMode('split')}
                className="text-xs text-[#8d4b00] dark:text-[#ffdcc3] font-bold hover:underline"
              >
                Switch to Split View
              </button>
            </div>

            <VetGoogleMap
              clinics={filteredClinics}
              selectedClinic={selectedClinic}
              onSelectClinic={(c) => setSelectedClinic(c)}
              onBookClinic={(c) => setBookingClinic(c)}
              onViewDetails={(c) => setDetailClinic(c)}
              userCoords={userCoords}
              geoStatus={geoStatus}
              onRequestLocation={handleRequestLocation}
              className="h-[680px] w-full"
            />
          </div>
        )}

        {/* Split View Mode (List + Sticky Google Map) */}
        {viewMode === 'split' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Clinic Directory Cards */}
            <div className="lg:col-span-7 space-y-4">
              
              <div className="flex items-center justify-between pb-2 border-b border-[#dee8ff] dark:border-[#233150]">
                <p className="text-xs font-bold text-[#111c2d] dark:text-white">
                  {filteredClinics.length} Available Veterinary Hospitals
                </p>
                <span className="text-[11px] text-[#887364] dark:text-[#94a3b8]">
                  Sorted by closest to {userCoords.city}
                </span>
              </div>

              {filteredClinics.length === 0 ? (
                <div className="text-center py-16 bg-white dark:bg-[#131d2e] rounded-3xl p-8 border border-dashed border-[#dee8ff] dark:border-[#233150] space-y-3">
                  <span className="material-symbols-outlined text-4xl text-[#887364]">search_off</span>
                  <h4 className="font-bold text-sm text-[#111c2d] dark:text-white">No Veterinary Clinics Match Your Criteria</h4>
                  <p className="text-xs text-[#887364] dark:text-[#94a3b8] max-w-sm mx-auto">
                    Try expanding your search radius, selecting 'All Distances', or clearing active filter chips.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCareType('all');
                      setMaxRadiusMiles(0);
                      setFilterEmergencyOnly(false);
                      setFilterAahaOnly(false);
                      setFilterFearFreeOnly(false);
                      setFilterVirtualOnly(false);
                      setFilterSavedOnly(false);
                    }}
                    className="px-4 py-2 bg-[#8d4b00] text-white rounded-xl text-xs font-bold hover:bg-[#b15f00] cursor-pointer"
                  >
                    Reset All Filters
                  </button>
                </div>
              ) : (
                filteredClinics.map((clinic) => {
                  const isSelected = selectedClinic?.id === clinic.id;
                  const isSaved = savedVetIds.includes(clinic.id);

                  return (
                    <div
                      key={clinic.id}
                      onClick={() => setSelectedClinic(clinic)}
                      className={`bg-white dark:bg-[#131d2e] rounded-3xl p-5 border transition-all cursor-pointer shadow-xs ${
                        isSelected
                          ? 'border-[#8d4b00] ring-2 ring-[#ffdcc3] dark:ring-[#8d4b00]/40'
                          : 'border-[#dee8ff] dark:border-[#233150] hover:border-[#8d4b00]/50'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row gap-4">
                        
                        {/* Image & Quick Badges */}
                        <div className="relative sm:w-44 h-36 rounded-2xl overflow-hidden shrink-0">
                          <img
                            src={clinic.image}
                            alt={clinic.name}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-2 left-2 flex flex-col gap-1">
                            {clinic.is24_7Emergency ? (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-red-600 text-white shadow-xs">
                                24/7 EMERGENCY
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#111c2d]/85 text-white backdrop-blur-xs">
                                {clinic.typeLabel.split('&')[0]}
                              </span>
                            )}
                          </div>

                          {clinic.distanceMiles !== undefined && (
                            <div className="absolute bottom-2 right-2 bg-black/80 text-white text-[10px] font-bold px-2 py-0.5 rounded-full backdrop-blur-xs flex items-center gap-0.5">
                              <span className="material-symbols-outlined text-[11px] text-emerald-400">near_me</span>
                              <span>{clinic.distanceMiles} mi</span>
                            </div>
                          )}
                        </div>

                        {/* Clinic Content */}
                        <div className="flex-1 flex flex-col justify-between">
                          <div>
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <h3 className="font-['Epilogue'] font-bold text-sm text-[#111c2d] dark:text-white leading-snug">
                                  {clinic.name}
                                </h3>
                                <p className="text-[11px] text-[#887364] dark:text-[#94a3b8] mt-0.5">
                                  {clinic.address}, {clinic.city}, {clinic.state}
                                </p>
                              </div>

                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleToggleSaveVet(clinic.id, clinic.name);
                                }}
                                className={`p-1.5 rounded-full transition-colors ${
                                  isSaved
                                    ? 'text-amber-500 bg-amber-50'
                                    : 'text-gray-400 hover:text-amber-500 hover:bg-gray-100'
                                }`}
                                title={isSaved ? 'Remove from saved' : 'Save to favorites'}
                              >
                                <span className="material-symbols-outlined text-lg">
                                  {isSaved ? 'bookmark' : 'bookmark_border'}
                                </span>
                              </button>
                            </div>

                            {/* Ratings & Price */}
                            <div className="flex items-center gap-2 mt-1.5 text-xs">
                              <span className="text-amber-500 font-bold">★ {clinic.rating}</span>
                              <span className="text-[#887364] dark:text-[#94a3b8] text-[11px]">
                                ({clinic.reviewCount} reviews)
                              </span>
                              <span className="text-gray-300">•</span>
                              <span className="text-emerald-700 font-bold text-[11px]">{clinic.priceRange}</span>
                              <span className="text-gray-300">•</span>
                              <span className="text-[11px] text-[#554336] dark:text-[#cbd5e1] font-medium">
                                {clinic.hours.split('•')[0]}
                              </span>
                            </div>

                            {/* Lead Doctor badge */}
                            <div className="mt-2 text-[11px] flex items-center gap-2 bg-[#f0f3ff] dark:bg-[#1a253a] px-2.5 py-1 rounded-xl w-fit">
                              <span className="material-symbols-outlined text-xs text-[#8d4b00]">medical_services</span>
                              <span className="font-bold text-[#111c2d] dark:text-white">{clinic.leadVet.name}</span>
                              <span className="text-[10px] text-[#887364] dark:text-[#94a3b8]">({clinic.leadVet.title.split('&')[0]})</span>
                            </div>

                            {/* Accreditations tags */}
                            <div className="flex flex-wrap gap-1 mt-2">
                              {clinic.accreditations.map((acc, i) => (
                                <span
                                  key={i}
                                  className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-[#ffdcc3]/60 text-[#8d4b00] border border-[#ffdcc3]"
                                >
                                  {acc}
                                </span>
                              ))}
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex items-center gap-2 pt-3 mt-3 border-t border-[#f0f3ff] dark:border-[#1e2b44]">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setBookingClinic(clinic);
                              }}
                              className="flex-1 py-2 px-3 bg-[#8d4b00] hover:bg-[#b15f00] text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                            >
                              <span className="material-symbols-outlined text-sm">calendar_month</span>
                              <span>Book Appointment</span>
                            </button>

                            <a
                              href={`tel:${clinic.phone.replace(/[^0-9]/g, '')}`}
                              onClick={(e) => e.stopPropagation()}
                              className="py-2 px-3 bg-[#f0f3ff] dark:bg-[#1a253a] hover:bg-[#dee8ff] text-[#111c2d] dark:text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1 border border-[#dee8ff] dark:border-[#263750]"
                            >
                              <span className="material-symbols-outlined text-sm text-[#006c4a]">call</span>
                              <span>{clinic.phone}</span>
                            </a>

                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setDetailClinic(clinic);
                              }}
                              className="p-2 hover:bg-[#f0f3ff] dark:hover:bg-[#1a253a] text-[#887364] rounded-xl transition-colors cursor-pointer"
                              title="View Full Profile & Services"
                            >
                              <span className="material-symbols-outlined text-base">info</span>
                            </button>
                          </div>

                        </div>

                      </div>
                    </div>
                  );
                })
              )}

            </div>

            {/* Right Column: Interactive Google Map */}
            <div className="lg:col-span-5 sticky top-20">
              <div className="bg-white dark:bg-[#131d2e] rounded-3xl p-4 border border-[#dee8ff] dark:border-[#233150] shadow-sm space-y-3">
                
                <div className="flex items-center justify-between pb-2 border-b border-[#dee8ff] dark:border-[#233150]">
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[#8d4b00] text-base">map</span>
                    <h4 className="font-bold text-xs text-[#111c2d] dark:text-white uppercase tracking-wider">
                      Google Maps Live Radar
                    </h4>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                    Official Map Platform
                  </span>
                </div>

                {/* Google Map Component */}
                <VetGoogleMap
                  clinics={filteredClinics}
                  selectedClinic={selectedClinic}
                  onSelectClinic={(c) => setSelectedClinic(c)}
                  onBookClinic={(c) => setBookingClinic(c)}
                  onViewDetails={(c) => setDetailClinic(c)}
                  userCoords={userCoords}
                  geoStatus={geoStatus}
                  onRequestLocation={handleRequestLocation}
                  className="h-[460px] lg:h-[540px] w-full"
                />

                {/* Active Selected Clinic Mini Summary */}
                {selectedClinic && (
                  <div className="p-3 bg-[#f0f3ff] dark:bg-[#162035] rounded-2xl border border-[#dee8ff] dark:border-[#233150] flex items-center justify-between gap-3 text-xs">
                    <div className="min-w-0">
                      <p className="font-bold text-[#111c2d] dark:text-white truncate">
                        {selectedClinic.name}
                      </p>
                      <p className="text-[11px] text-[#887364] dark:text-[#94a3b8] truncate">
                        {selectedClinic.address} • {selectedClinic.distanceMiles} mi away
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setBookingClinic(selectedClinic)}
                      className="px-3 py-1.5 bg-[#8d4b00] hover:bg-[#b15f00] text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shrink-0"
                    >
                      Book Visit
                    </button>
                  </div>
                )}

              </div>
            </div>

          </div>
        )}

        {/* Grid View Mode */}
        {viewMode === 'grid' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredClinics.map((clinic) => {
              const isSaved = savedVetIds.includes(clinic.id);
              return (
                <div
                  key={clinic.id}
                  className="bg-white dark:bg-[#131d2e] rounded-3xl p-5 border border-[#dee8ff] dark:border-[#233150] shadow-sm flex flex-col justify-between"
                >
                  <div>
                    <div className="relative h-44 rounded-2xl overflow-hidden mb-3">
                      <img
                        src={clinic.image}
                        alt={clinic.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 left-2">
                        {clinic.is24_7Emergency ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-red-600 text-white">
                            24/7 ER
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#111c2d]/80 text-white">
                            {clinic.typeLabel.split('&')[0]}
                          </span>
                        )}
                      </div>
                      {clinic.distanceMiles !== undefined && (
                        <div className="absolute bottom-2 right-2 bg-black/80 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                          {clinic.distanceMiles} mi away
                        </div>
                      )}
                    </div>

                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-['Epilogue'] font-bold text-sm text-[#111c2d] dark:text-white leading-snug">
                        {clinic.name}
                      </h3>
                      <button
                        type="button"
                        onClick={() => handleToggleSaveVet(clinic.id, clinic.name)}
                        className={`p-1 rounded-full ${isSaved ? 'text-amber-500' : 'text-gray-400'}`}
                      >
                        <span className="material-symbols-outlined text-base">
                          {isSaved ? 'bookmark' : 'bookmark_border'}
                        </span>
                      </button>
                    </div>

                    <p className="text-[11px] text-[#887364] dark:text-[#94a3b8] mt-1">
                      {clinic.address}, {clinic.city}
                    </p>

                    <div className="flex items-center gap-2 mt-2 text-xs">
                      <span className="text-amber-500 font-bold">★ {clinic.rating}</span>
                      <span className="text-gray-400">({clinic.reviewCount})</span>
                      <span className="text-gray-300">•</span>
                      <span className="text-emerald-700 font-bold">{clinic.priceRange}</span>
                    </div>
                  </div>

                  <div className="pt-3 mt-4 border-t border-[#f0f3ff] dark:border-[#1e2b44] flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setBookingClinic(clinic)}
                      className="flex-1 py-2 bg-[#8d4b00] hover:bg-[#b15f00] text-white rounded-xl text-xs font-bold transition-colors"
                    >
                      Book Visit
                    </button>
                    <button
                      type="button"
                      onClick={() => setDetailClinic(clinic)}
                      className="p-2 hover:bg-[#f0f3ff] dark:hover:bg-[#1a253a] text-[#887364] rounded-xl"
                    >
                      <span className="material-symbols-outlined text-base">info</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </section>

      {/* Emergency Hotlines Directory Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="bg-[#fff8f5] dark:bg-[#1e130c] border border-[#ffdcc3] dark:border-[#8d4b00]/40 rounded-3xl p-6 sm:p-8">
          <div className="flex items-center gap-2 text-[#8d2b00] dark:text-[#ffdcc3] mb-4">
            <span className="material-symbols-outlined text-2xl">support_agent</span>
            <h3 className="font-['Epilogue'] font-black text-lg sm:text-xl">
              24/7 Canine Emergency Hotlines & Poison Triage
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {VET_EMERGENCY_HOTLINES.map((hotline, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-[#131d2e] p-4 rounded-2xl border border-[#ffdcc3] dark:border-[#2b1f18] shadow-xs flex flex-col justify-between"
              >
                <div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#ffdcc3] text-[#8d2b00] mb-2 inline-block">
                    {hotline.badge}
                  </span>
                  <h4 className="font-bold text-xs text-[#111c2d] dark:text-white">{hotline.name}</h4>
                  <p className="text-[11px] text-[#887364] dark:text-[#94a3b8] mt-1">{hotline.note}</p>
                </div>
                <div className="mt-3 pt-2 border-t border-[#f0f3ff] dark:border-[#1e2b44] flex items-center justify-between">
                  <span className="text-[10px] text-emerald-600 font-bold">{hotline.hours}</span>
                  <a
                    href={`tel:${hotline.phone.replace(/[^0-9]/g, '')}`}
                    className="px-3 py-1 bg-[#8d2b00] text-white rounded-lg text-xs font-bold hover:bg-[#b13700] flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-xs">call</span>
                    <span>{hotline.phone}</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Booking Appointment Modal */}
      {bookingClinic && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setBookingClinic(null)}
        >
          <div
            className="bg-white dark:bg-[#131d2e] rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-[#dee8ff] dark:border-[#233150] max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[#f0f3ff] dark:border-[#1e2b44] pb-3 mb-4">
              <div>
                <h3 className="font-['Epilogue'] font-black text-lg text-[#111c2d] dark:text-white">
                  Schedule Veterinary Visit
                </h3>
                <p className="text-xs text-[#887364] dark:text-[#94a3b8]">
                  {bookingClinic.name}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setBookingClinic(null)}
                className="p-1 hover:bg-[#f0f3ff] dark:hover:bg-[#1e2b44] text-[#887364] rounded-full text-base cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleConfirmBooking} className="space-y-4">
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#111c2d] dark:text-white mb-1">
                    Companion's Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={bookingPetName}
                    onChange={(e) => setBookingPetName(e.target.value)}
                    placeholder="e.g. Archie"
                    className="w-full px-3 py-2 bg-[#f0f3ff] dark:bg-[#0b1120] border border-[#dee8ff] dark:border-[#263750] rounded-xl text-xs text-[#111c2d] dark:text-white focus:outline-none focus:border-[#8d4b00]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#111c2d] dark:text-white mb-1">
                    Breed *
                  </label>
                  <input
                    type="text"
                    required
                    value={bookingPetBreed}
                    onChange={(e) => setBookingPetBreed(e.target.value)}
                    placeholder="e.g. Golden Retriever"
                    className="w-full px-3 py-2 bg-[#f0f3ff] dark:bg-[#0b1120] border border-[#dee8ff] dark:border-[#263750] rounded-xl text-xs text-[#111c2d] dark:text-white focus:outline-none focus:border-[#8d4b00]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#111c2d] dark:text-white mb-1">
                  Primary Reason for Appointment *
                </label>
                <select
                  value={bookingReason}
                  onChange={(e) => setBookingReason(e.target.value)}
                  className="w-full px-3 py-2 bg-[#f0f3ff] dark:bg-[#0b1120] border border-[#dee8ff] dark:border-[#263750] rounded-xl text-xs font-semibold text-[#111c2d] dark:text-white focus:outline-none focus:border-[#8d4b00]"
                >
                  <option value="Routine Pediatric Puppy Wellness & Microchip Check">
                    Pediatric Puppy First Checkup & Core Vaccines
                  </option>
                  <option value="OFA Orthopedic Radiographs & Genetic Screenings">
                    OFA Joint & Lineage Certification Screenings
                  </option>
                  <option value="Annual Canine Wellness & Heartworm Prevention">
                    Annual Wellness & Preventive Care Check
                  </option>
                  <option value="Dental Examination & Tartar Cleaning">
                    Dental Examination & Tartar Cleaning
                  </option>
                  <option value="Skin Allergy, Ear Infection, or Wound Care">
                    Skin Allergy, Ear Infection, or Wound Care
                  </option>
                  <option value="Senior Canine Mobility & Joint Health Evaluation">
                    Senior Canine Mobility & Joint Health Evaluation
                  </option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#111c2d] dark:text-white mb-1">
                    Requested Date
                  </label>
                  <select
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    className="w-full px-3 py-2 bg-[#f0f3ff] dark:bg-[#0b1120] border border-[#dee8ff] dark:border-[#263750] rounded-xl text-xs font-semibold text-[#111c2d] dark:text-white focus:outline-none focus:border-[#8d4b00]"
                  >
                    <option value="Today (Urgent Priority)">Today (Urgent Priority)</option>
                    <option value="Tomorrow">Tomorrow</option>
                    <option value="In 2 Days">In 2 Days</option>
                    <option value="Next Week">Next Week</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#111c2d] dark:text-white mb-1">
                    Time Window
                  </label>
                  <select
                    value={bookingTimeSlot}
                    onChange={(e) => setBookingTimeSlot(e.target.value)}
                    className="w-full px-3 py-2 bg-[#f0f3ff] dark:bg-[#0b1120] border border-[#dee8ff] dark:border-[#263750] rounded-xl text-xs font-semibold text-[#111c2d] dark:text-white focus:outline-none focus:border-[#8d4b00]"
                  >
                    <option value="Morning (9:00 AM - 12:00 PM)">Morning (9:00 AM - 12:00 PM)</option>
                    <option value="Early Afternoon (12:00 PM - 3:00 PM)">Early Afternoon (12:00 PM - 3:00 PM)</option>
                    <option value="Late Afternoon (3:00 PM - 6:00 PM)">Late Afternoon (3:00 PM - 6:00 PM)</option>
                    <option value="Evening (After 6:00 PM - Urgent Care)">Evening (After 6:00 PM - Urgent Care)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#111c2d] dark:text-white mb-1">
                  Guardian Contact
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={bookingGuardianName}
                    onChange={(e) => setBookingGuardianName(e.target.value)}
                    placeholder="Your Name"
                    className="w-full px-3 py-2 bg-[#f0f3ff] dark:bg-[#0b1120] border border-[#dee8ff] dark:border-[#263750] rounded-xl text-xs text-[#111c2d] dark:text-white"
                  />
                  <input
                    type="tel"
                    value={bookingGuardianPhone}
                    onChange={(e) => setBookingGuardianPhone(e.target.value)}
                    placeholder="Your Phone"
                    className="w-full px-3 py-2 bg-[#f0f3ff] dark:bg-[#0b1120] border border-[#dee8ff] dark:border-[#263750] rounded-xl text-xs text-[#111c2d] dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#111c2d] dark:text-white mb-1">
                  Special Notes or Medical History
                </label>
                <textarea
                  rows={2}
                  value={bookingNotes}
                  onChange={(e) => setBookingNotes(e.target.value)}
                  placeholder="Mention previous vaccines, dietary allergies, or anxiety triggers..."
                  className="w-full px-3 py-2 bg-[#f0f3ff] dark:bg-[#0b1120] border border-[#dee8ff] dark:border-[#263750] rounded-xl text-xs text-[#111c2d] dark:text-white focus:outline-none focus:border-[#8d4b00]"
                ></textarea>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-[#f0f3ff] dark:border-[#1e2b44]">
                <button
                  type="button"
                  onClick={() => setBookingClinic(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-[#887364] hover:bg-[#f0f3ff] dark:hover:bg-[#1a253a]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-[#8d4b00] hover:bg-[#b15f00] text-white shadow-xs cursor-pointer"
                >
                  Confirm Appointment Request
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* Appointments Drawer / Modal */}
      {showAppointmentsModal && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setShowAppointmentsModal(false)}
        >
          <div
            className="bg-white dark:bg-[#131d2e] rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-[#dee8ff] dark:border-[#233150] max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[#f0f3ff] dark:border-[#1e2b44] pb-3 mb-4">
              <div>
                <h3 className="font-['Epilogue'] font-black text-lg text-[#111c2d] dark:text-white">
                  My Veterinary Appointments
                </h3>
                <p className="text-xs text-[#887364] dark:text-[#94a3b8]">
                  Scheduled wellness visits, OFA screenings, and emergency triages
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowAppointmentsModal(false)}
                className="p-1 hover:bg-[#f0f3ff] dark:hover:bg-[#1e2b44] text-[#887364] rounded-full text-base cursor-pointer"
              >
                ✕
              </button>
            </div>

            {appointments.length === 0 ? (
              <div className="text-center py-8 text-xs text-[#887364]">
                No active veterinary appointments scheduled.
              </div>
            ) : (
              <div className="space-y-3">
                {appointments.map((appt) => (
                  <div
                    key={appt.id}
                    className="p-3.5 bg-[#f0f3ff] dark:bg-[#162035] rounded-2xl border border-[#dee8ff] dark:border-[#233150] space-y-1.5"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-bold text-xs text-[#111c2d] dark:text-white">{appt.clinicName}</h4>
                        <p className="text-[11px] text-[#8d4b00] font-semibold">{appt.reason}</p>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                        {appt.status}
                      </span>
                    </div>
                    <div className="text-[11px] text-[#554336] dark:text-[#cbd5e1] space-y-0.5 pt-1">
                      <p><strong>Companion:</strong> {appt.petName} ({appt.petBreed})</p>
                      <p><strong>Scheduled:</strong> {appt.date} • {appt.timeSlot}</p>
                      <p><strong>Location:</strong> {appt.clinicAddress}</p>
                    </div>
                    <div className="pt-2 flex items-center justify-between">
                      <a
                        href={`tel:${appt.clinicPhone.replace(/[^0-9]/g, '')}`}
                        className="text-xs font-bold text-[#8d4b00] hover:underline flex items-center gap-1"
                      >
                        <span className="material-symbols-outlined text-xs">call</span>
                        <span>Call Clinic ({appt.clinicPhone})</span>
                      </a>
                      <button
                        type="button"
                        onClick={() => handleCancelAppointment(appt.id)}
                        className="text-xs text-red-600 hover:text-red-800 font-bold"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Clinic Detail Modal */}
      {detailClinic && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setDetailClinic(null)}
        >
          <div
            className="bg-white dark:bg-[#131d2e] rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-[#dee8ff] dark:border-[#233150] max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between border-b border-[#f0f3ff] dark:border-[#1e2b44] pb-4 mb-4">
              <div>
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#ffdcc3] text-[#8d4b00] inline-block mb-1">
                  {detailClinic.typeLabel}
                </span>
                <h3 className="font-['Epilogue'] font-black text-xl text-[#111c2d] dark:text-white">
                  {detailClinic.name}
                </h3>
                <p className="text-xs text-[#887364] dark:text-[#94a3b8] mt-0.5">
                  {detailClinic.address}, {detailClinic.city}, {detailClinic.state} {detailClinic.zip}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setDetailClinic(null)}
                className="p-1 hover:bg-[#f0f3ff] text-[#887364] rounded-full text-base cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-5">
              
              <div className="relative h-56 rounded-2xl overflow-hidden">
                <img
                  src={detailClinic.image}
                  alt={detailClinic.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Lead Vet Spotlight */}
              <div className="p-4 bg-[#f0f3ff] dark:bg-[#162035] rounded-2xl flex items-start gap-4">
                {detailClinic.leadVet.avatarUrl && (
                  <img
                    src={detailClinic.leadVet.avatarUrl}
                    alt={detailClinic.leadVet.name}
                    className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-sm shrink-0"
                  />
                )}
                <div>
                  <h4 className="font-bold text-sm text-[#111c2d] dark:text-white">{detailClinic.leadVet.name}</h4>
                  <p className="text-xs font-semibold text-[#8d4b00]">{detailClinic.leadVet.title}</p>
                  <p className="text-[11px] text-[#887364] mt-0.5">{detailClinic.leadVet.credentials}</p>
                  <p className="text-xs text-[#554336] dark:text-[#cbd5e1] mt-2 leading-relaxed">
                    {detailClinic.leadVet.bio}
                  </p>
                </div>
              </div>

              {/* Services List */}
              <div>
                <h4 className="font-bold text-xs uppercase tracking-wider text-[#887364] mb-2">
                  Specialized Clinical Services
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {detailClinic.services.map((srv, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-xl bg-[#f8faff] dark:bg-[#1a253a] border border-[#dee8ff] dark:border-[#233150] text-xs text-[#111c2d] dark:text-white flex items-center gap-2"
                    >
                      <span className="material-symbols-outlined text-xs text-emerald-600">check_circle</span>
                      <span>{srv}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Insurance */}
              <div>
                <h4 className="font-bold text-xs uppercase tracking-wider text-[#887364] mb-2">
                  Accepted Pet Insurances & Financing
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {detailClinic.acceptedInsurance.map((ins, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 bg-white dark:bg-[#1e2b44] border border-[#dee8ff] dark:border-[#2b3a58] rounded-full text-xs font-semibold text-[#554336] dark:text-[#cbd5e1]"
                    >
                      {ins}
                    </span>
                  ))}
                </div>
              </div>

              {/* Featured Review */}
              {detailClinic.featuredReview && (
                <div className="p-4 bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/60 rounded-2xl">
                  <div className="flex items-center justify-between mb-1 text-xs">
                    <span className="font-bold text-[#111c2d] dark:text-white">
                      Verified Guardian Review • {detailClinic.featuredReview.author}
                    </span>
                    <span className="text-amber-500 font-bold">★★★★★</span>
                  </div>
                  <p className="text-xs italic text-[#554336] dark:text-[#cbd5e1]">
                    "{detailClinic.featuredReview.comment}"
                  </p>
                </div>
              )}

              {/* Actions */}
              <div className="pt-3 border-t border-[#f0f3ff] dark:border-[#1e2b44] flex items-center justify-between gap-3">
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${detailClinic.coordinates.lat},${detailClinic.coordinates.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold rounded-xl text-xs flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-sm">directions</span>
                  <span>Google Maps Directions</span>
                </a>

                <div className="flex items-center gap-2">
                  <a
                    href={`tel:${detailClinic.phone.replace(/[^0-9]/g, '')}`}
                    className="px-4 py-2 bg-[#f0f3ff] dark:bg-[#1a253a] text-[#111c2d] dark:text-white font-bold rounded-xl text-xs flex items-center gap-1.5 border border-[#dee8ff]"
                  >
                    <span className="material-symbols-outlined text-sm text-[#006c4a]">call</span>
                    <span>Call ({detailClinic.phone})</span>
                  </a>
                  <button
                    type="button"
                    onClick={() => {
                      setBookingClinic(detailClinic);
                      setDetailClinic(null);
                    }}
                    className="px-5 py-2 bg-[#8d4b00] hover:bg-[#b15f00] text-white font-bold rounded-xl text-xs cursor-pointer shadow-xs"
                  >
                    Book Visit
                  </button>
                </div>
              </div>

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
