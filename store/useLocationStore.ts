import * as Location from "expo-location";
import { create } from "zustand";

export interface Coords {
  latitude: number;
  longitude: number;
}

interface LocationState {
  coords: Coords | null;
  permissionGranted: boolean | null;
  isTracking: boolean;
  trackPoints: Coords[];
  requestAndFetchLocation: () => Promise<Coords | null>;
  startTracking: () => Promise<void>;
  stopTracking: () => Coords[];
}

let locationSubscription: Location.LocationSubscription | null = null;

export const useLocationStore = create<LocationState>((set, get) => ({
  coords: null,
  permissionGranted: null,
  isTracking: false,
  trackPoints: [],

  requestAndFetchLocation: async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      const granted = status === "granted";
      set({ permissionGranted: granted });

      if (!granted) return null;

      let loc = await Location.getLastKnownPositionAsync({});
      if (!loc) {
        loc = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
      }

      const currentCoords = {
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      };
      set({ coords: currentCoords });
      return currentCoords;
    } catch {
      return null;
    }
  },

  startTracking: async () => {
    if (get().isTracking) return;

    const initial = await get().requestAndFetchLocation();
    if (!initial) return;

    set({ isTracking: true, trackPoints: [initial] });

    locationSubscription = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.High,
        distanceInterval: 1,
        timeInterval: 3000,
      },
      (loc) => {
        const nextPoint = {
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
        };
        set((state) => ({
          coords: nextPoint,
          trackPoints: [...state.trackPoints, nextPoint],
        }));
      },
    );
  },

  stopTracking: () => {
    if (locationSubscription) {
      locationSubscription.remove();
      locationSubscription = null;
    }
    const recorded = get().trackPoints;
    set({ isTracking: false, trackPoints: [] });
    return recorded;
  },
}));
