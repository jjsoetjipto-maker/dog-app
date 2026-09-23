import React, { useState } from 'react';

interface LocationPermissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRequestLocation: () => void;
  onSelectCity: (cityName: string, lat: number, lng: number) => void;
  geoStatus: 'idle' | 'requesting' | 'acquired' | 'denied' | 'unsupported';
  currentCity?: string;
}

export const LocationPermissionModal: React.FC<LocationPermissionModalProps> = ({
  isOpen,
  onClose,
  onRequestLocation,
  onSelectCity,
  geoStatus,
  currentCity = 'Austin, TX'
}) => {
  const [zipInput, setZipInput] = useState('');

  if (!isOpen) return null;

  const popularCities = [
    { name: 'Austin, TX', lat: 30.2672, lng: -97.7431, icon: 'location_city' },
    { name: 'Dallas, TX', lat: 32.7767, lng: -96.7970, icon: 'apartment' },
    { name: 'Houston, TX', lat: 29.7604, lng: -95.3698, icon: 'domain' },
    { name: 'San Antonio, TX', lat: 29.4241, lng: -98.4936, icon: 'account_balance' },
    { name: 'Fort Worth, TX', lat: 32.7555, lng: -97.3308, icon: 'villa' }
  ];

  const handleZipSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanZip = zipInput.trim();
    if (!cleanZip) return;
    // Simple Texas zip mapping fallback or approximate
    if (cleanZip.startsWith('75') || cleanZip.startsWith('76')) {
      onSelectCity(`Dallas / Fort Worth (${cleanZip})`, 32.7767, -96.7970);
    } else if (cleanZip.startsWith('77') || cleanZip.startsWith('73')) {
      onSelectCity(`Houston Area (${cleanZip})`, 29.7604, -95.3698);
    } else if (cleanZip.startsWith('782')) {
      onSelectCity(`San Antonio (${cleanZip})`, 29.4241, -98.4936);
    } else {
      onSelectCity(`Austin Metro (${cleanZip})`, 30.2672, -97.7431);
    }
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/65 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-[#131d2e] rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-[#dee8ff] dark:border-[#233150] relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Background glow */}
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 w-48 h-48 bg-[#8d4b00]/15 rounded-full blur-2xl pointer-events-none"></div>

        {/* Header with Close */}
        <div className="flex items-start justify-between gap-4 mb-4 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#ffdcc3] dark:bg-[#3d2414] text-[#8d4b00] dark:text-[#ffb77d] flex items-center justify-center shrink-0 shadow-xs">
              <span className="material-symbols-outlined text-2xl animate-pulse">my_location</span>
            </div>
            <div>
              <div className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 dark:text-emerald-400 px-2 py-0.5 rounded-full mb-1">
                <span className="material-symbols-outlined text-xs">verified_user</span>
                <span>Privacy Protected</span>
              </div>
              <h3 className="font-['Epilogue'] font-black text-xl text-[#111c2d] dark:text-white leading-tight">
                Ask Access for Location
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-[#1f2b40] text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {/* Explanation text */}
        <div className="text-xs text-[#554336] dark:text-[#cbd5e1] space-y-2 mb-6 leading-relaxed relative z-10">
          <p>
            Allow PawPalace to access your location to discover the <strong>closest 24/7 veterinary emergency trauma centers</strong>, accredited clinics, and boutique dog groomers on Google Maps.
          </p>
          <div className="p-3 bg-[#f0f3ff] dark:bg-[#1a253a] rounded-xl border border-[#dee8ff] dark:border-[#233150] text-[11px] text-[#445368] dark:text-[#94a3b8] flex items-start gap-2">
            <span className="material-symbols-outlined text-base text-[#006c4a] shrink-0 mt-0.5">lock</span>
            <span>
              Your GPS coordinates are processed exclusively in your browser to compute real-time driving mileage. We never track or sell your location data.
            </span>
          </div>
        </div>

        {/* State Banners */}
        {geoStatus === 'requesting' && (
          <div className="p-3.5 mb-5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/50 text-amber-900 dark:text-amber-200 text-xs flex items-center gap-2.5 animate-pulse">
            <span className="material-symbols-outlined text-lg animate-spin">sync</span>
            <span>
              <strong>Prompting browser for permission...</strong> Please click <strong>"Allow"</strong> when your browser asks for location access.
            </span>
          </div>
        )}

        {geoStatus === 'denied' && (
          <div className="p-3.5 mb-5 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/50 text-red-900 dark:text-red-200 text-xs space-y-1.5">
            <div className="flex items-center gap-1.5 font-bold">
              <span className="material-symbols-outlined text-base text-red-600">error</span>
              <span>Location Permission Blocked</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              Your browser declined location access. To enable it, click the lock/settings icon next to the URL bar and select "Allow Location", or select your city below.
            </p>
          </div>
        )}

        {/* Primary Action Button: Request Location */}
        <div className="space-y-3 mb-6 relative z-10">
          <button
            type="button"
            onClick={onRequestLocation}
            disabled={geoStatus === 'requesting'}
            className="w-full py-3.5 px-4 bg-[#8d4b00] hover:bg-[#b15f00] active:bg-[#633300] text-white rounded-2xl text-xs sm:text-sm font-black shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <span className={`material-symbols-outlined text-lg ${geoStatus === 'requesting' ? 'animate-spin' : ''}`}>
              {geoStatus === 'requesting' ? 'sync' : 'near_me'}
            </span>
            <span>
              {geoStatus === 'requesting'
                ? 'Requesting Browser Permission...'
                : 'Allow & Detect My Current Location'}
            </span>
          </button>
        </div>

        {/* City Presets Alternative */}
        <div className="relative z-10 pt-4 border-t border-[#dee8ff] dark:border-[#233150] space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-[#111c2d] dark:text-white">
            <span>Or Choose Texas Metro Area:</span>
            <span className="text-[11px] text-[#887364] dark:text-[#94a3b8] font-normal">
              Active: {currentCity}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {popularCities.map((city) => (
              <button
                key={city.name}
                type="button"
                onClick={() => {
                  onSelectCity(city.name, city.lat, city.lng);
                  onClose();
                }}
                className={`p-2.5 rounded-xl border text-xs font-bold transition-all text-left flex items-center gap-2 cursor-pointer ${
                  currentCity.includes(city.name.split(',')[0])
                    ? 'bg-[#111c2d] text-white border-[#111c2d] shadow-xs'
                    : 'bg-[#f0f3ff] dark:bg-[#1a253a] hover:bg-[#dee8ff] dark:hover:bg-[#233150] text-[#111c2d] dark:text-white border-[#dee8ff] dark:border-[#233150]'
                }`}
              >
                <span className="material-symbols-outlined text-base text-[#8d4b00] dark:text-[#ffdcc3]">
                  {city.icon}
                </span>
                <span className="truncate">{city.name.split(',')[0]}</span>
              </button>
            ))}
          </div>

          {/* Quick Zip code entry */}
          <form onSubmit={handleZipSubmit} className="pt-2 flex items-center gap-2">
            <div className="relative flex-1">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[#887364]">
                pin_drop
              </span>
              <input
                type="text"
                value={zipInput}
                onChange={(e) => setZipInput(e.target.value)}
                placeholder="Or enter 5-digit Zip Code..."
                className="w-full pl-9 pr-3 py-2 bg-[#f0f3ff] dark:bg-[#1a253a] border border-[#dee8ff] dark:border-[#233150] rounded-xl text-xs text-[#111c2d] dark:text-white placeholder-[#887364] focus:outline-none focus:border-[#8d4b00]"
                maxLength={5}
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-[#111c2d] dark:bg-[#253247] hover:bg-black text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
            >
              Set Zip
            </button>
          </form>
        </div>

        {/* Footer actions */}
        <div className="mt-5 pt-3 border-t border-[#dee8ff] dark:border-[#233150] flex items-center justify-between text-xs text-[#887364] dark:text-[#94a3b8]">
          <button
            type="button"
            onClick={onClose}
            className="hover:underline font-bold text-[#554336] dark:text-[#cbd5e1] cursor-pointer"
          >
            Not Now (Keep Default)
          </button>
          <span>Google Maps Platform</span>
        </div>

      </div>
    </div>
  );
};
