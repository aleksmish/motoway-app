import { create } from "zustand";

export interface Vehicle {
  id: string;
  image: string;
  name: string;
  make: string;
  horsepower: number;
  model: string;
  yearBuilt: number;
  color: string;
}

interface GarageState {
  vehicles: Vehicle[];
  totalRides: number;
  totalDistanceKm: number;
  totalDurationMin: number;
  addVehicle: (vehicle: Vehicle) => void;
  recordRideStats: (distanceKm: number, durationMin: number) => void;
  updateVehicle: (updatedVehicle: Vehicle) => void;
}

const DEFAULT_VEHICLES: Vehicle[] = [
  {
    id: "1",
    image:
      "https://ixbt.online/live/images/original/33/84/42/2025/11/08/224da534e2.jpg",
    name: "Kawasaki Ninja ZX-10R",
    make: "Kawasaki Heavy Industries",
    horsepower: 203,
    model: "Ninja ZX-10R",
    yearBuilt: 2025,
    color: "Black",
  },
];

export const useGarageStore = create<GarageState>()((set) => ({
  vehicles: DEFAULT_VEHICLES,
  totalRides: 0,
  totalDistanceKm: 0,
  totalDurationMin: 0,

  addVehicle: (vehicle) =>
    set((state) => ({
      vehicles: [...state.vehicles, vehicle],
    })),

  recordRideStats: (distanceKm, durationMin) =>
    set((state) => ({
      totalRides: state.totalRides + 1,
      totalDistanceKm: Number((state.totalDistanceKm + distanceKm).toFixed(1)),
      totalDurationMin: state.totalDurationMin + durationMin,
    })),

  updateVehicle: (updatedVehicle: Vehicle) =>
    set((state) => ({
      vehicles: state.vehicles.map((v) =>
        v.id === updatedVehicle.id ? updatedVehicle : v,
      ),
    })),
}));
