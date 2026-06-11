import { create } from 'zustand';
import { apiClient } from '../lib/api-client';

interface User {
  id: string;
  email: string;
  username: string;
  name: string | null;
  avatar?: any;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;
  checkAuth: () => Promise<void>;
  setUser: (user: User | null) => void;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  isInitialized: false,

  setUser: (user) => set({ user, isAuthenticated: !!user, isLoading: false, isInitialized: true }),

  checkAuth: async () => {
    if (get().isInitialized) return; // Prevent duplicate checks
    try {
      set({ isLoading: true });
      const data = await apiClient.get<{ user: User }>('/auth/me');
      set({ user: data.user, isAuthenticated: true, isLoading: false, isInitialized: true });
    } catch (error) {
      set({ user: null, isAuthenticated: false, isLoading: false, isInitialized: true });
    }
  },

  logout: async () => {
    try {
      await apiClient.post('/auth/logout', {});
      set({ user: null, isAuthenticated: false });
    } catch (error) {
      console.error('Logout failed', error);
    }
  },
}));
