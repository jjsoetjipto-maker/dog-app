export interface UserCoordinates {
  lat: number;
  lng: number;
  city: string;
  source: 'gps' | 'city_preset' | 'default';
  accuracy?: number;
  lastUpdated?: number;
}

const STORAGE_KEY = 'pawpalace_gps_location';

// Default fallback (Austin, TX)
export const DEFAULT_COORDINATES: UserCoordinates = {
  lat: 30.2672,
  lng: -97.7431,
  city: 'Austin, TX',
  source: 'default'
};

/**
 * Loads stored coordinates from localStorage if available
 */
export function getSavedCoordinates(): UserCoordinates {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (typeof parsed.lat === 'number' && typeof parsed.lng === 'number') {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Failed to read cached coordinates:', e);
  }
  return DEFAULT_COORDINATES;
}

/**
 * Saves coordinates to localStorage
 */
export function saveCoordinates(coords: UserCoordinates): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(coords));
  } catch (e) {
    console.warn('Failed to save coordinates to localStorage:', e);
  }
}

/**
 * Approximate Texas / US metro name based on latitude & longitude
 */
export function approximateCityFromCoords(lat: number, lng: number): string {
  // Austin area
  if (lat >= 30.0 && lat <= 30.6 && lng >= -98.1 && lng <= -97.4) {
    return 'Austin, TX';
  }
  // Dallas / Fort Worth area
  if (lat >= 32.4 && lat <= 33.3 && lng >= -97.6 && lng <= -96.4) {
    if (lng < -97.1) return 'Fort Worth, TX';
    return 'Dallas, TX';
  }
  // Houston area
  if (lat >= 29.4 && lat <= 30.2 && lng >= -95.9 && lng <= -94.9) {
    return 'Houston, TX';
  }
  // San Antonio area
  if (lat >= 29.1 && lat <= 29.8 && lng >= -98.8 && lng <= -98.1) {
    return 'San Antonio, TX';
  }
  // El Paso
  if (lat >= 31.6 && lat <= 32.0 && lng >= -106.6 && lng <= -106.2) {
    return 'El Paso, TX';
  }

  return `Current Location (${lat.toFixed(3)}°, ${lng.toFixed(3)}°)`;
}

/**
 * Tries reverse geocoding via OpenStreetMap Nominatim with a fast timeout
 */
export async function reverseGeocode(lat: number, lng: number): Promise<string> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2500);

    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=14&addressdetails=1`,
      {
        headers: { 'Accept-Language': 'en' },
        signal: controller.signal
      }
    );
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      const addr = data.address || {};
      const city = addr.city || addr.town || addr.village || addr.suburb || addr.municipality || addr.county;
      const state = addr.state_code || addr.state;
      if (city && state) {
        return `${city}, ${state}`;
      } else if (city) {
        return city;
      }
    }
  } catch {
    // Network or abort timeout, fallback to approximate
  }

  return approximateCityFromCoords(lat, lng);
}

/**
 * Requests the browser's current GPS location immediately
 */
export function requestCurrentGPSLocation(): Promise<UserCoordinates> {
  return new Promise((resolve, reject) => {
    if (!('geolocation' in navigator)) {
      reject(new Error('Geolocation is not supported by your browser'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude, accuracy } = position.coords;

        // Try reverse geocoding city name
        const detectedCity = await reverseGeocode(latitude, longitude);

        const newCoords: UserCoordinates = {
          lat: latitude,
          lng: longitude,
          city: detectedCity,
          source: 'gps',
          accuracy,
          lastUpdated: Date.now()
        };

        saveCoordinates(newCoords);
        resolve(newCoords);
      },
      (error) => {
        reject(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 12000,
        maximumAge: 30000
      }
    );
  });
}

/**
 * Watches continuous device GPS location updates
 */
export function watchCurrentGPSLocation(
  onUpdate: (coords: UserCoordinates) => void,
  onError?: (err: GeolocationPositionError) => void
): () => void {
  if (!('geolocation' in navigator)) {
    return () => {};
  }

  const watchId = navigator.geolocation.watchPosition(
    async (position) => {
      const { latitude, longitude, accuracy } = position.coords;
      const detectedCity = approximateCityFromCoords(latitude, longitude);

      const newCoords: UserCoordinates = {
        lat: latitude,
        lng: longitude,
        city: detectedCity,
        source: 'gps',
        accuracy,
        lastUpdated: Date.now()
      };

      saveCoordinates(newCoords);
      onUpdate(newCoords);
    },
    (err) => {
      if (onError) onError(err);
    },
    {
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: 10000
    }
  );

  return () => {
    navigator.geolocation.clearWatch(watchId);
  };
}
