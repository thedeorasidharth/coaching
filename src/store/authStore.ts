import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '@/lib/axios';

export interface User {
  _id: string;
  role: 'admin' | 'student';
  name: string;
  fullName?: string;
  email?: string;
  phone?: string;
  username?: string;
  course?: string;
  class?: string;
}

interface AuthState {
  user: User | null;
  role: 'admin' | 'student' | null;
  isAuthenticated: boolean;
  loading: boolean;
  isHydrated: boolean;
  authChecked: boolean;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  checkAuth: (targetRole?: 'admin' | 'student') => Promise<User | null>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      role: null,
      isAuthenticated: false,
      loading: true,
      isHydrated: false,
      authChecked: false,

      setUser: (user) => {
        if (user) {
          const formattedName = user.name || user.fullName || 'User';
          const userObj = { ...user, name: formattedName };
          set({
            user: userObj,
            role: user.role || null,
            isAuthenticated: true,
            loading: false,
            authChecked: true
          });
        } else {
          set({
            user: null,
            role: null,
            isAuthenticated: false,
            loading: false,
            authChecked: true
          });
        }
      },

      setLoading: (loading) => set({ loading }),

      checkAuth: async (targetRole) => {
        set({ loading: true });
        let fetchedUser: User | null = null;

        try {
          const roleToCheck = targetRole || get().role || (typeof window !== 'undefined' && window.location.pathname.startsWith('/admin') ? 'admin' : 'student');
          const endpoint = roleToCheck === 'admin' ? '/admin/me' : '/student/me';

          const response = await api.get(endpoint, { withCredentials: true });
          if (response.data && response.data._id) {
            const rawData = response.data;
            fetchedUser = {
              ...rawData,
              name: rawData.name || rawData.fullName || 'User',
              role: rawData.role || roleToCheck
            };
          }
        } catch (error) {
          // If targeted check failed, try the alternate endpoint if targetRole wasn't explicitly provided
          if (!targetRole) {
            try {
              const altRole = get().role === 'admin' ? 'student' : 'admin';
              const altEndpoint = altRole === 'admin' ? '/admin/me' : '/student/me';
              const response = await api.get(altEndpoint, { withCredentials: true });
              if (response.data && response.data._id) {
                const rawData = response.data;
                fetchedUser = {
                  ...rawData,
                  name: rawData.name || rawData.fullName || 'User',
                  role: rawData.role || altRole
                };
              }
            } catch (e) {
              // Both endpoints failed -> unauthenticated
            }
          }
        } finally {
          // ALWAYS set loading = false and authChecked = true in finally block
          if (fetchedUser) {
            set({
              user: fetchedUser,
              role: fetchedUser.role,
              isAuthenticated: true,
              loading: false,
              authChecked: true
            });
          } else {
            set({
              user: null,
              role: null,
              isAuthenticated: false,
              loading: false,
              authChecked: true
            });
            if (typeof window !== 'undefined') {
              localStorage.removeItem('auth-storage');
              sessionStorage.clear();
            }
          }
        }
        return fetchedUser;
      },

      logout: async () => {
        try {
          const currentRole = get().role || 'student';
          const endpoint = currentRole === 'admin' ? '/admin/logout' : '/student/logout';
          await api.post(endpoint, {}, { withCredentials: true });
        } catch (e) {
          console.error("Logout request error:", e);
        } finally {
          set({
            user: null,
            role: null,
            isAuthenticated: false,
            loading: false,
            authChecked: true
          });
          if (typeof window !== 'undefined') {
            localStorage.removeItem('auth-storage');
            sessionStorage.clear();
          }
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        role: state.role,
        isAuthenticated: state.isAuthenticated
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.isHydrated = true;
        }
      },
    }
  )
);
