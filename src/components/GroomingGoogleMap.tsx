import React, { useState, useEffect } from 'react';
import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin,
  InfoWindow,
  useMap
} from '@vis.gl/react-google-maps';
import { GroomingSalon } from '../types';

interface GroomingGoogleMapProps {
  salons: GroomingSalon[];
  selectedSalon: GroomingSalon | null;
  onSelectSalon: (salon: GroomingSalon) => void;
  onBookSalon: (salon: GroomingSalon) => void;
  userCoords: { lat: number; lng: number; city?: string };
  geoStatus: 'idle' | 'requesting' | 'acquired' | 'denied' | 'unsupported';
  onRequestLocation: () => void;
  className?: string;
}

function MapPanController({
  targetSalon,
  userCoords,
  panTrigger
}: {
  targetSalon: GroomingSalon | null;
  userCoords: { lat: number; lng: number };
  panTrigger: number;
}) {
  const map = useMap();

  useEffect(() => {
    if (!map) return;
    if (targetSalon) {
      map.panTo(targetSalon.coordinates);
      map.setZoom(14);
    }
  }, [map, targetSalon]);

  // Auto pan to user when coords update from live GPS
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

export const GroomingGoogleMap: React.FC<GroomingGoogleMapProps> = ({
  salons,
  selectedSalon,
  onSelectSalon,
  onBookSalon,
  userCoords,
  geoStatus,
  onRequestLocation,
  className = 'h-[500px] lg:h-[620px]'
}) => {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';
  const [activeInfoWindowSalon, setActiveInfoWindowSalon] = useState<GroomingSalon | null>(selectedSalon || null);
  const [userPanTrigger, setUserPanTrigger] = useState(0);
  const [userMarkerOpen, setUserMarkerOpen] = useState(false);
  const [mapType, setMapType] = useState<'roadmap' | 'satellite'>('roadmap');

  useEffect(() => {
    if (selectedSalon) {
      setActiveInfoWindowSalon(selectedSalon);
    }
  }, [selectedSalon]);

  const handleMarkerClick = (salon: GroomingSalon) => {
    onSelectSalon(salon);
    setActiveInfoWindowSalon(salon);
  };

  const getSalonColor = (salon: GroomingSalon) => {
    if (salon.isMobileVan) {
      return { bg: '#059669', border: '#047857', text: '#ffffff', label: 'Mobile Van' };
    }
    switch (salon.salonType) {
      case 'luxury-spa':
        return { bg: '#8d4b00', border: '#633300', text: '#ffffff', label: 'Luxury Spa' };
      case 'self-wash':
        return { bg: '#0284c7', border: '#0369a1', text: '#ffffff', label: 'Self Wash' };
      case 'fear-free':
        return { bg: '#7c3aed', border: '#6d28d9', text: '#ffffff', label: 'Fear Free' };
      case 'boutique-salon':
      default:
        return { bg: '#db2777', border: '#be185d', text: '#ffffff', label: 'Boutique' };
    }
  };

  return (
    <div className={`relative w-full rounded-3xl overflow-hidden border border-[#dee8ff] dark:border-[#233150] shadow-md bg-[#e6edfa] dark:bg-[#0f172a] ${className}`}>
      
      {/* Floating Header */}
      <div className="absolute top-3 left-3 right-3 z-10 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
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

        <div className="pointer-events-auto flex items-center gap-1 bg-white/95 dark:bg-[#111c2d]/95 backdrop-blur-md p-1 rounded-full shadow-md border border-[#dee8ff] dark:border-[#233150]">
          <button
            type="button"
            onClick={() => setMapType('roadmap')}
            className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-colors cursor-pointer ${
              mapType === 'roadmap' ? 'bg-[#8d4b00] text-white' : 'text-[#554336] dark:text-[#cbd5e1] hover:bg-black/5'
            }`}
          >
            Map
          </button>
          <button
            type="button"
            onClick={() => setMapType('satellite')}
            className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-colors cursor-pointer ${
              mapType === 'satellite' ? 'bg-[#8d4b00] text-white' : 'text-[#554336] dark:text-[#cbd5e1] hover:bg-black/5'
            }`}
          >
            Satellite
          </button>
        </div>
      </div>

      {/* Real Google Maps */}
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
          <MapPanController
            targetSalon={selectedSalon}
            userCoords={userCoords}
            panTrigger={userPanTrigger}
          />

          {/* User Location Marker */}
          <AdvancedMarker
            position={{ lat: userCoords.lat, lng: userCoords.lng }}
            title="Your Current Location (GPS)"
            onClick={() => setUserMarkerOpen(true)}
          >
            <div className="relative flex items-center justify-center cursor-pointer group">
              <span className="animate-ping absolute inline-flex h-8 w-8 rounded-full bg-emerald-400 opacity-60"></span>
              <div className="relative w-8 h-8 rounded-full bg-emerald-600 border-2 border-white shadow-lg flex items-center justify-center text-white ring-2 ring-emerald-300">
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
                <div className="flex items-center gap-1.5 font-bold text-xs text-emerald-700">
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

          {/* Salon Markers */}
          {salons.map((salon) => {
            const isSelected = selectedSalon?.id === salon.id;
            const style = getSalonColor(salon);

            return (
              <AdvancedMarker
                key={salon.id}
                position={salon.coordinates}
                title={salon.name}
                onClick={() => handleMarkerClick(salon)}
                zIndex={isSelected ? 100 : salon.isMobileVan ? 50 : 10}
              >
                <Pin
                  background={style.bg}
                  borderColor={style.border}
                  glyphColor={style.text}
                  scale={isSelected ? 1.25 : 1.0}
                >
                  <span className="material-symbols-outlined text-[13px] text-white">
                    {salon.isMobileVan ? 'rv_hookup' : 'content_cut'}
                  </span>
                </Pin>
              </AdvancedMarker>
            );
          })}

          {/* Info Window */}
          {activeInfoWindowSalon && (
            <InfoWindow
              position={activeInfoWindowSalon.coordinates}
              onCloseClick={() => setActiveInfoWindowSalon(null)}
              pixelOffset={[0, -32]}
            >
              <div className="p-1 max-w-[280px] sm:max-w-[320px] text-[#111c2d]">
                <div className="relative h-28 rounded-lg overflow-hidden mb-2">
                  <img
                    src={activeInfoWindowSalon.image}
                    alt={activeInfoWindowSalon.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-1.5 left-1.5">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#111c2d]/80 text-white backdrop-blur-xs">
                      {activeInfoWindowSalon.typeLabel}
                    </span>
                  </div>
                  {activeInfoWindowSalon.distanceMiles !== undefined && (
                    <div className="absolute bottom-1.5 right-1.5 bg-black/75 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                      {activeInfoWindowSalon.distanceMiles} mi away
                    </div>
                  )}
                </div>

                <h4 className="font-bold text-sm leading-snug line-clamp-1 mb-1">
                  {activeInfoWindowSalon.name}
                </h4>

                <div className="flex items-center gap-1.5 text-xs mb-1.5">
                  <span className="text-amber-500 font-bold">★ {activeInfoWindowSalon.rating}</span>
                  <span className="text-gray-500 text-[11px]">({activeInfoWindowSalon.reviewCount} reviews)</span>
                  <span className="text-gray-400">•</span>
                  <span className="text-emerald-700 font-semibold">{activeInfoWindowSalon.priceRange}</span>
                </div>

                <p className="text-[11px] text-gray-600 flex items-start gap-1 mb-1 leading-tight">
                  <span className="material-symbols-outlined text-xs text-gray-500 shrink-0 mt-0.5">location_on</span>
                  <span className="line-clamp-2">{activeInfoWindowSalon.address}, {activeInfoWindowSalon.city}</span>
                </p>

                <p className="text-[11px] text-gray-600 flex items-center gap-1 mb-2">
                  <span className="material-symbols-outlined text-xs text-gray-500">schedule</span>
                  <span className="truncate">{activeInfoWindowSalon.hours}</span>
                </p>

                <div className="flex items-center gap-1.5 pt-1.5 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => onBookSalon(activeInfoWindowSalon)}
                    className="flex-1 bg-[#8d4b00] hover:bg-[#b15f00] text-white py-1.5 px-2 rounded-lg text-[11px] font-bold transition-colors cursor-pointer flex items-center justify-center gap-1"
                  >
                    <span className="material-symbols-outlined text-xs">calendar_month</span>
                    <span>Book Grooming</span>
                  </button>

                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${activeInfoWindowSalon.coordinates.lat},${activeInfoWindowSalon.coordinates.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 py-1.5 px-2.5 rounded-lg text-[11px] font-bold transition-colors flex items-center gap-1"
                    title="Get Turn-by-Turn Directions in Google Maps"
                  >
                    <span className="material-symbols-outlined text-xs">directions</span>
                    <span>Directions</span>
                  </a>
                </div>
              </div>
            </InfoWindow>
          )}

        </Map>
      </APIProvider>

      {/* Legend Footer */}
      <div className="absolute bottom-3 left-3 right-3 z-10 pointer-events-none">
        <div className="pointer-events-auto bg-white/95 dark:bg-[#111c2d]/95 backdrop-blur-md px-3.5 py-2 rounded-2xl shadow-lg border border-[#dee8ff] dark:border-[#233150] flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-3 text-[11px] font-bold text-[#554336] dark:text-[#cbd5e1] overflow-x-auto py-0.5">
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-[#059669]"></span>
              <span>Mobile Van</span>
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-[#8d4b00]"></span>
              <span>Luxury Spa</span>
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-[#7c3aed]"></span>
              <span>Fear Free</span>
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-[#db2777]"></span>
              <span>Boutique Salon</span>
            </span>
          </div>

          <div className="text-[11px] text-[#887364] dark:text-[#94a3b8] font-medium">
            Showing <strong>{salons.length}</strong> grooming spots
          </div>
        </div>
      </div>

    </div>
  );
};
