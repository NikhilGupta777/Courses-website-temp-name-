// FIX #23: auth-store now uses the canonical UserRole type from @/types
// instead of loose string comparisons.
import { create } from "zustand";
import type { User, UserRole } from "@/types";

interface AuthState {
  user: User | null;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  /** Type-safe role check helper */
  hasRole: (role: UserRole) => boolean;
  isInstructor: () => boolean;
  isAdmin: () => boolean;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isLoading: true,

  setUser:    (user)      => set({ user, isLoading: false }),
  setLoading: (isLoading) => set({ isLoading }),

  hasRole:       (role) => get().user?.role === role,
  isInstructor:  ()     => get().user?.role === "INSTRUCTOR",
  isAdmin:       ()     => get().user?.role === "ADMIN",
}));
