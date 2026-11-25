import { create } from "zustand";

export interface Friend {
  id: string;
  name: string;
  city: string;
  bike: string;
  seasonDistance: string;
  ridesCount: number;
  isRiding: boolean;
  avatar: string;
}

interface FriendsState {
  friends: Friend[];
  requests: Friend[];
  invitedCompanion: Friend | null;
  acceptRequest: (id: string) => void;
  setInvitedCompanion: (friend: Friend | null) => void;
}

const INITIAL_FRIENDS: Friend[] = [
  {
    id: "1",
    name: "Дмитрий Соколов",
    city: "Москва, Россия",
    bike: "Kawasaki Ninja 650",
    seasonDistance: "4 250 км",
    ridesCount: 28,
    isRiding: true,
    avatar:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRMxP62uqnwM3zFLSibHXK6_3-I1K-CBlYyXKte6rbK2HAjd5aeJO3Op50T&s=10",
  },
  {
    id: "2",
    name: "Елена Морозова",
    city: "Санкт-Петербург",
    bike: "Yamaha MT-07",
    seasonDistance: "3 120 км",
    ridesCount: 19,
    isRiding: false,
    avatar:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRfUOzJapuI9JKgapZB4DLUU1FF9q08Y8eT6KbuysUzOHKIsWja9dz-tr0&s=10",
  },
  {
    id: "3",
    name: "Артём Волков",
    city: "Москва, Россия",
    bike: "BMW R 1250 GS",
    seasonDistance: "8 940 км",
    ridesCount: 54,
    isRiding: true,
    avatar:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSFW0-D9c0znsafb8S8R9kXdw5PtcKyV_Y4j5fs6mGmzB03zoGO3ZOG0ac&s=10",
  },
];

const INITIAL_REQUESTS: Friend[] = [
  {
    id: "4",
    name: "Максим Ковалёв",
    city: "Казань, Россия",
    bike: "Honda CB650R",
    seasonDistance: "1 800 км",
    ridesCount: 11,
    isRiding: false,
    avatar:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRhv7681GQA5VKJvTiexMhpctCNRVviCiVNUsd30kMECYsB_PXtS38QCZMz&s=10",
  },
];

export const useFriendsStore = create<FriendsState>()((set) => ({
  friends: INITIAL_FRIENDS,
  requests: INITIAL_REQUESTS,
  invitedCompanion: null,

  acceptRequest: (id) =>
    set((state) => {
      const target = state.requests.find((r) => r.id === id);
      if (!target) return state;
      return {
        requests: state.requests.filter((r) => r.id !== id),
        friends: [target, ...state.friends],
      };
    }),

  setInvitedCompanion: (friend) => set({ invitedCompanion: friend }),
}));
