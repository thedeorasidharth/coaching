import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '@/lib/axios';

interface User {
  _id: string;
  username: string;
  role: 'admin' | 'student';
  name: string;
}

interface AuthState {
  user: User | null;
  loading: boolean;
  isHydrated: boolean;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  checkAuth: (role: 'admin' | 'student') => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      loading: false,
      isHydrated: false,
      setUser: (user) => set({ user }),
      setLoading: (loading) => set({ loading }),
      checkAuth: async (role) => {
        set({ loading: true });
        try {
          const endpoint = role === 'admin' ? '/admin/me' : '/student/me';
          const response = await api.get(endpoint);
          set({ user: response.data, loading: false });
        } catch (error) {
          console.error('Auth check failed:', error);
          set({ user: null, loading: false });
        }
      },
      logout: () => {
        set({ user: null });
        // Optional: clear any other local state if needed
      },
    }),
    {
      name: 'auth-storage',
      onRehydrateStorage: () => (state) => {
        if (state) state.isHydrated = true;
      },
    }
  )
);
