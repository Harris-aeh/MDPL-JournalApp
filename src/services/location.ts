import * as Location from 'expo-location';

import type { EntryLocation } from '@/types';

export class LocationPermissionError extends Error {
  constructor() {
    super('Location permission was not granted.');
    this.name = 'LocationPermissionError';
  }
}

/**
 * Requests permission and resolves the device's current location, including a
 * best-effort human-readable address via reverse geocoding.
 * Throws LocationPermissionError when the user denies access so callers can
 * show a friendly message instead of crashing ).
 */
export async function getCurrentLocation(): Promise<EntryLocation> {
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== 'granted') {
    throw new LocationPermissionError();
  }

  const position = await Location.getCurrentPositionAsync({
    accuracy: Location.Accuracy.Balanced,
  });

  const result: EntryLocation = {
    latitude: position.coords.latitude,
    longitude: position.coords.longitude,
  };

  try {
    const [place] = await Location.reverseGeocodeAsync({
      latitude: result.latitude,
      longitude: result.longitude,
    });
    if (place) {
      result.address = [place.city, place.region, place.country]
        .filter(Boolean)
        .join(', ');
    }
  } catch {
    // Reverse geocoding is optional; ignore failures and keep raw coordinates.
  }

  return result;
}
