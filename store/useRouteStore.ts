import type { LngLat } from "@maplibre/maplibre-react-native";
import { create } from "zustand";

export interface Route {
  id: string;
  title: string;
  region: string;
  distance: number;
  duration: number;
  difficulty: "Лёгкий" | "Средний" | "Серпантин";
  isFavorite: boolean;
  isCompleted: boolean;
  author: string;
  coords: LngLat[];
}

interface RouteStoreState {
  routes: Route[];
  selectedRoute: Route | null;
  addRoute: (route: Omit<Route, "id">) => void;
  toggleFavorite: (id: string) => void;
  completeRide: (route: Omit<Route, "id">) => void;
  selectRouteForMap: (route: Route | null) => void;
  markRouteCompleted: (id: string) => void;
}

const DEFAULT_ROUTES: Route[] = [
  {
    id: "1",
    title: "Зеленоград — Сергиев Посад",
    region: "Московская область",
    distance: 88000,
    duration: 5040,
    difficulty: "Средний",
    isFavorite: true,
    isCompleted: true,
    author: "Александр Иванов",
    coords: [
      [37.1814, 55.9825],
      [37.51, 56.15],
      [38.1333, 56.3104],
    ],
  },
  {
    id: "2",
    title: "Дмитровские холмы — Яхрома",
    region: "Север Подмосковья",
    distance: 114000,
    duration: 6480,
    difficulty: "Серпантин",
    isFavorite: true,
    isCompleted: false,
    author: "Дмитрий Соколов",
    coords: [
      [37.565, 56.012],
      [37.482, 56.275],
      [37.5208, 56.3439],
    ],
  },
  {
    id: "3",
    title: "Новорижский прохват — Истры",
    region: "Запад Подмосковья",
    distance: 62000,
    duration: 2940,
    difficulty: "Лёгкий",
    isFavorite: false,
    isCompleted: true,
    author: "Артём Волков",
    coords: [
      [37.375, 55.792],
      [37.05, 55.855],
      [36.8594, 55.9142],
    ],
  },
  {
    id: "4",
    title: "Приокский серпантин — Таруса",
    region: "Калужская область",
    distance: 156000,
    duration: 9000,
    difficulty: "Серпантин",
    isFavorite: false,
    isCompleted: false,
    author: "Редакция MotoWay",
    coords: [
      [37.585, 55.575],
      [37.412, 54.921],
      [37.1764, 54.7289],
    ],
  },
];

export const formatDistance = (meters: number): string => {
  if (meters < 1000) return `${Math.round(meters)} м`;
  return `${(meters / 1000).toFixed(1)} км`;
};

export const formatDuration = (totalSeconds: number): string => {
  const totalMinutes = Math.max(1, Math.round(totalSeconds / 60));
  if (totalMinutes < 60) return `${totalMinutes} мин`;
  const hours = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;
  return mins > 0 ? `${hours} ч ${mins} мин` : `${hours} ч`;
};

export const getCompletedStats = (routes: Route[]) => {
  const completed = routes.filter((r) => r.isCompleted);
  const totalDistance = completed.reduce((acc, r) => acc + r.distance, 0);
  const totalDuration = completed.reduce((acc, r) => acc + r.duration, 0);

  return {
    totalRides: completed.length,
    totalDistanceKm: formatDistance(totalDistance),
    totalDuration: totalDuration > 0 ? formatDuration(totalDuration) : "0 мин",
  };
};

export const useRouteStore = create<RouteStoreState>()((set) => ({
  routes: DEFAULT_ROUTES,
  selectedRoute: null,
  addRoute: (newRoute) =>
    set((state) => ({
      routes: [{ ...newRoute, id: String(Date.now()) }, ...state.routes],
    })),

  toggleFavorite: (id) =>
    set((state) => ({
      routes: state.routes.map((r) =>
        r.id === id ? { ...r, isFavorite: !r.isFavorite } : r,
      ),
    })),
  markRouteCompleted: (id) => {
    set((state) => ({
      routes: state.routes.map((r) =>
        r.id === id ? { ...r, isCompleted: true } : r,
      ),
    }));
  },
  completeRide: (rideData) =>
    set((state) => ({
      routes: [
        { ...rideData, id: String(Date.now()), isCompleted: true },
        ...state.routes,
      ],
    })),

  selectRouteForMap: (route) => set({ selectedRoute: route }),
}));
