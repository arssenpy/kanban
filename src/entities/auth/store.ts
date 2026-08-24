import { create } from "zustand";
import { User } from "./types";

type AuthState = {
  user: User | null;
  isInitialized: boolean;
  setUser: (user: User) => void;
  clearUser: () => void;
  setInitialized: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isInitialized: false,
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null }),
  setInitialized: () => set({ isInitialized: true }),
}));
