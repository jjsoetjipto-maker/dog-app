import React, { useState, useEffect } from 'react';
import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin,
  InfoWindow,
  useMap
} from '@vis.gl/react-google-maps';
import { VetClinic } from '../types';

interface VetGoogleMapProps {
  clinics: VetClinic[];
  selectedClinic: VetClinic | null;
  onSelectClinic: (clinic: VetClinic) => void;
  onBookClinic: (clinic: VetClinic) => void;
  onViewDetails: (clinic: VetClinic) => void;
  userCoords: { lat: number; lng: number; city?: string };
  geoStatus: 'idle' | 'requesting' | 'acquired' | 'denied' | 'unsupported';
  onRequestLocation: () => void;
  className?: string;
}

// Controller to smoothly pan and zoom the map
function MapPanController({
  targetClinic,
  userCoords,
  panTrigger
}: {
  targetClinic: VetClinic | null;
  userCoords: { lat: number; lng: number };
  panTrigger: number;
}) {
  const map = useMap();

  useEffect(() => {
    if (!map) return;
    if (targetClinic) {
      map.panTo(targetClinic.coordinates);
      map.setZoom(14);
    }
  }, [map, targetClinic]);

  // When user coordinates update (e.g. live GPS acquired), pan map directly to user
  useEffect(() => {
    if (!map) return;
    map.panTo(userCoords);
  }, [map, userCoords.lat, userCoords.lng]);

  useEffect(() => {
    if (!map) return;
    if (panTrigger > 0) {
      map.panTo(userCoords);
      map.setZoom(12);
    }
  }, [map, userCoords, panTrigger]);

  return null;
}

export const VetGoogleMap: React.FC<VetGoogleMapProps> = ({
  clinics,
  selectedClinic,
  onSelectClinic,
  onBookClinic,
  onViewDetails,
  userCoords,
  geoStatus,
  onRequestLocation,
  className = 'h-[500px] lg:h-[620px]'
}) => {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';
  const [activeInfoWindowClinic, setActiveInfoWindowClinic] = useState<VetClinic | null>(selectedClinic || null);
  const [userPanTrigger, setUserPanTrigger] = useState(0);
  const [userMarkerOpen, setUserMarkerOpen] = useState(false);
  const [mapType, setMapType] = useState<'roadmap' | 'satellite' | 'hybrid'>('roadmap');

  // Keep info window in sync when external selection changes
  useEffect(() => {
    if (selectedClinic) {
      setActiveInfoWindowClinic(selectedClinic);
    }
  }, [selectedClinic]);

  // Handle marker click
  const handleMarkerClick = (clinic: VetClinic) => {
    onSelectClinic(clinic);
    setActiveInfoWindowClinic(clinic);
  };

  const getCareTypeColor = (clinic: VetClinic) => {
    if (clinic.is24_7Emergency) {
      return { bg: '#dc2626', border: '#991b1b', text: '#ffffff', label: '24/7 ER' };
    }
    switch (clinic.careType) {
      case 'emergency-hospital':
        return { bg: '#e11d48', border: '#9f1239', text: '#ffffff', label: 'Emergency' };
      case 'specialty-surgery':
        return { bg: '#2563eb', border: '#1e40af', text: '#ffffff', label: 'Surgery' };
      case 'urgent-care':
        return { bg: '#d97706', border: '#b45309', text: '#ffffff', label: 'Urgent Care' };
      case 'mobile-vet':
        return { bg: '#7c3aed', border: '#6d28d9', text: '#ffffff', label: 'Mobile' };
      case 'general-practice':
      default:
        return { bg: '#059669', border: '#047857', text: '#ffffff', label: 'General' };
    }
  };

  return (
    <div className={`relative w-full rounded-3xl overflow-hidden border border-[#dee8ff] dark:border-[#233150] shadow-md bg-[#e6edfa] dark:bg-[#0f172a] ${className}`}>
      
      {/* Floating Header Overlay */}
      <div className="absolute top-3 left-3 right-3 z-10 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        
        {/* GPS location pill */}
        <div className="pointer-events-auto bg-white/95 dark:bg-[#111c2d]/95 backdrop-blur-md px-3 py-1.5 rounded-full shadow-md border border-[#dee8ff] dark:border-[#233150] flex items-center gap-2 text-xs">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="font-bold text-[#111c2d] dark:text-white">
            {userCoords.city || 'Your Location'}
          </span>
          <button
            type="button"
            onClick={() => {
              onRequestLocation();
              setUserPanTrigger((prev) => prev + 1);
            }}
            className="ml-1 text-[11px] text-[#8d4b00] dark:text-[#ffdcc3] hover:underline font-bold flex items-center gap-0.5 cursor-pointer"
            title="Center map on your location"
          >
            <span className="material-symbols-outlined text-sm">my_location</span>
            <span>Recenter</span>
          </button>
        </div>

        {/* Map Type / View controls */}
        <div className="pointer-events-auto flex items-center gap-1.5 bg-white/95 dark:bg-[#111c2d]/95 backdrop-blur-md p-1 rounded-full shadow-md border border-[#dee8ff] dark:border-[#233150]">
          <button
            type="button"
            onClick={() => setMapType('roadmap')}
            className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-colors cursor-pointer ${
              mapType === 'roadmap'
                ? 'bg-[#8d4b00] text-white'
                : 'text-[#554336] dark:text-[#cbd5e1] hover:bg-black/5'
            }`}
          >
            Map
          </button>
          <button
            type="button"
            onClick={() => setMapType('satellite')}
            className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-colors cursor-pointer ${
              mapType === 'satellite'
                ? 'bg-[#8d4b00] text-white'
                : 'text-[#554336] dark:text-[#cbd5e1] hover:bg-black/5'
            }`}
          >
            Satellite
          </button>
        </div>

      </div>

      {/* Real Google Maps Container */}
      <APIProvider apiKey={apiKey} libraries={['marker']}>
        <Map
          mapId="DEMO_MAP_ID"
          internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
          defaultCenter={{ lat: userCoords.lat, lng: userCoords.lng }}
          defaultZoom={11}
          mapTypeId={mapType}
          gestureHandling="greedy"
          disableDefaultUI={false}
          fullscreenControl={true}
          zoomControl={true}
          streetViewControl={true}
          mapTypeControl={false}
          className="w-full h-full"
        >
          {/* Controller to handle animated panning */}
          <MapPanController
            targetClinic={selectedClinic}
            userCoords={userCoords}
            panTrigger={userPanTrigger}
          />

          {/* User Location Pulse Marker */}
          <AdvancedMarker
            position={{ lat: userCoords.lat, lng: userCoords.lng }}
            title="Your Current Location (GPS)"
            onClick={() => setUserMarkerOpen(true)}
          >
            <div className="relative flex items-center justify-center cursor-pointer group">
              <span className="animate-ping absolute inline-flex h-8 w-8 rounded-full bg-blue-400 opacity-60"></span>
              <div className="relative w-8 h-8 rounded-full bg-blue-600 border-2 border-white shadow-lg flex items-center justify-center text-white ring-2 ring-blue-300">
                <span className="material-symbols-outlined text-[18px]">person_pin_circle</span>
              </div>
            </div>
          </AdvancedMarker>

          {/* User Current Location InfoWindow */}
          {userMarkerOpen && (
            <InfoWindow
              position={{ lat: userCoords.lat, lng: userCoords.lng }}
              onCloseClick={() => setUserMarkerOpen(false)}
              pixelOffset={[0, -28]}
            >
              <div className="p-1 max-w-[220px] text-[#111c2d]">
                <div className="flex items-center gap-1.5 font-bold text-xs text-blue-700">
                  <span className="material-symbols-outlined text-sm">my_location</span>
                  <span>Your Current Location</span>
                </div>
                <p className="text-[11px] text-gray-700 font-semibold mt-1">
                  {userCoords.city || 'GPS Live Fix'}
                </p>
                <div className="text-[10px] text-gray-500 font-mono mt-0.5">
                  {userCoords.lat.toFixed(4)}°, {userCoords.lng.toFixed(4)}°
                </div>
                <div className="mt-1.5 pt-1.5 border-t border-gray-100 flex items-center gap-1 text-[10px] text-emerald-700 font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>Distances computed from here</span>
                </div>
              </div>
            </InfoWindow>
          )}

          {/* Clinic Markers */}
          {clinics.map((clinic) => {
            const isSelected = selectedClinic?.id === clinic.id;
            const style = getCareTypeColor(clinic);

            return (
              <AdvancedMarker
                key={clinic.id}
                position={clinic.coordinates}
                title={clinic.name}
                onClick={() => handleMarkerClick(clinic)}
                zIndex={isSelected ? 100 : clinic.is24_7Emergency ? 50 : 10}
              >
                <Pin
                  background={style.bg}
                  borderColor={style.border}
                  glyphColor={style.text}
                  scale={isSelected ? 1.25 : clinic.is24_7Emergency ? 1.15 : 1.0}
                >
                  <span className="material-symbols-outlined text-[13px] text-white">
                    {clinic.is24_7Emergency
                      ? 'emergency'
                      : clinic.careType === 'mobile-vet'
                      ? 'rv_hookup'
                      : clinic.careType === 'specialty-surgery'
                      ? 'medical_services'
                      : clinic.careType === 'urgent-care'
                      ? 'vital_signs'
                      : 'local_hospital'}
                  </span>
                </Pin>
              </AdvancedMarker>
            );
          })}

          {/* InfoWindow for active clicked clinic */}
          {activeInfoWindowClinic && (
            <InfoWindow
              position={activeInfoWindowClinic.coordinates}
              onCloseClick={() => setActiveInfoWindowClinic(null)}
              pixelOffset={[0, -32]}
            >
              <div className="p-1 max-w-[280px] sm:max-w-[320px] text-[#111c2d]">
                
                {/* Header with image & tag */}
                <div className="relative h-28 rounded-lg overflow-hidden mb-2">
                  <img
                    src={activeInfoWindowClinic.image}
                    alt={activeInfoWindowClinic.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-1.5 left-1.5">
                    {activeInfoWindowClinic.is24_7Emergency ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-600 text-white shadow-xs">
                        24/7 ER Trauma
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#111c2d]/80 text-white backdrop-blur-xs">
                        {activeInfoWindowClinic.typeLabel}
                      </span>
                    )}
                  </div>
                  {activeInfoWindowClinic.distanceMiles !== undefined && (
                    <div className="absolute bottom-1.5 right-1.5 bg-black/75 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                      {activeInfoWindowClinic.distanceMiles} mi away
                    </div>
                  )}
                </div>

                {/* Details */}
                <h4 className="font-bold text-sm leading-snug line-clamp-1 mb-1">
                  {activeInfoWindowClinic.name}
                </h4>

                <div className="flex items-center gap-1.5 text-xs mb-1.5">
                  <span className="text-amber-500 font-bold">★ {activeInfoWindowClinic.rating}</span>
                  <span className="text-gray-500 text-[11px]">({activeInfoWindowClinic.reviewCount} reviews)</span>
                  <span className="text-gray-400">•</span>
                  <span className="text-emerald-700 font-semibold">{activeInfoWindowClinic.priceRange}</span>
                </div>

                <p className="text-[11px] text-gray-600 flex items-start gap-1 mb-1 leading-tight">
                  <span className="material-symbols-outlined text-xs text-gray-500 shrink-0 mt-0.5">location_on</span>
                  <span className="line-clamp-2">{activeInfoWindowClinic.address}, {activeInfoWindowClinic.city}</span>
                </p>

                <p className="text-[11px] text-gray-600 flex items-center gap-1 mb-2">
                  <span className="material-symbols-outlined text-xs text-gray-500">schedule</span>
                  <span className="truncate">{activeInfoWindowClinic.hours}</span>
                </p>

                {/* Actions */}
                <div className="flex items-center gap-1.5 pt-1.5 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => onBookClinic(activeInfoWindowClinic)}
                    className="flex-1 bg-[#8d4b00] hover:bg-[#b15f00] text-white py-1.5 px-2 rounded-lg text-[11px] font-bold transition-colors cursor-pointer flex items-center justify-center gap-1"
                  >
                    <span className="material-symbols-outlined text-xs">calendar_month</span>
                    <span>Book Appt</span>
                  </button>

                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${activeInfoWindowClinic.coordinates.lat},${activeInfoWindowClinic.coordinates.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-blue-50 hover:bg-blue-100 text-blue-700 py-1.5 px-2.5 rounded-lg text-[11px] font-bold transition-colors flex items-center gap-1"
                    title="Get Turn-by-Turn Directions in Google Maps"
                  >
                    <span className="material-symbols-outlined text-xs">directions</span>
                    <span>Directions</span>
                  </a>

                  <button
                    type="button"
                    onClick={() => onViewDetails(activeInfoWindowClinic)}
                    className="p-1.5 hover:bg-gray-100 text-gray-600 rounded-lg transition-colors cursor-pointer"
                    title="View Full Profile"
                  >
                    <span className="material-symbols-outlined text-sm">info</span>
                  </button>
                </div>

              </div>
            </InfoWindow>
          )}

        </Map>
      </APIProvider>

      {/* Floating Legend / Quick Filter Bar at bottom of map */}
      <div className="absolute bottom-3 left-3 right-3 z-10 pointer-events-none">
        <div className="pointer-events-auto bg-white/95 dark:bg-[#111c2d]/95 backdrop-blur-md px-3.5 py-2 rounded-2xl shadow-lg border border-[#dee8ff] dark:border-[#233150] flex flex-wrap items-center justify-between gap-2 text-xs">
          
          <div className="flex items-center gap-3 text-[11px] font-bold text-[#554336] dark:text-[#cbd5e1] overflow-x-auto py-0.5">
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-red-600"></span>
              <span>24/7 ER</span>
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
              <span>General Practice</span>
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
              <span>Specialty Surgery</span>
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-600"></span>
              <span>Urgent Care</span>
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-600"></span>
              <span>Mobile Vet</span>
            </span>
          </div>

          <div className="text-[11px] text-[#887364] dark:text-[#94a3b8] font-medium">
            Showing <strong>{clinics.length}</strong> verified locations
          </div>

        </div>
      </div>

    </div>
  );
};
