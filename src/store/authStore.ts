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
  token?: string;
}

export const isTokenValid = (token: string | null | undefined): boolean => {
  if (!token || typeof token !== 'string') return false;
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return false;
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const json = typeof window !== 'undefined' && window.atob 
      ? window.atob(base64) 
      : Buffer.from(base64, 'base64').toString('utf-8');
    const payload = JSON.parse(json);
    if (payload.exp && payload.exp * 1000 <= Date.now()) {
      return false; // Token expired
    }
    return true;
  } catch {
    return false;
  }
};

interface AuthState {
  user: User | null;
  role: 'admin' | 'student' | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  isHydrated: boolean;
  authChecked: boolean;
  setUser: (user: User | null, token?: string | null) => void;
  setLoading: (loading: boolean) => void;
  checkAuth: (targetRole?: 'admin' | 'student', options?: { silent?: boolean }) => Promise<User | null>;
  logout: () => Promise<void>;
}

let activeCheckPromise: Promise<User | null> | null = null;

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      role: null,
      token: null,
      isAuthenticated: false,
      loading: true,
      isHydrated: false,
      authChecked: false,

      setUser: (user, token) => {
        if (user) {
          const formattedName = user.name || user.fullName || 'User';
          const authToken = token || user.token || get().token || null;
          const userObj = { ...user, name: formattedName, token: authToken || undefined };
          set({
            user: userObj,
            role: user.role || null,
            token: authToken,
            isAuthenticated: true,
            loading: false,
            authChecked: true
          });
        } else {
          set({
            user: null,
            role: null,
            token: null,
            isAuthenticated: false,
            loading: false,
            authChecked: true
          });
        }
      },

      setLoading: (loading) => set({ loading }),

      checkAuth: async (targetRole, options) => {
        const silent = options?.silent ?? false;
        
        // If not a silent background check, show loading state
        if (!silent) {
          set({ loading: true });
        }

        // Deduplicate in-flight auth requests
        if (activeCheckPromise) {
          return activeCheckPromise;
        }

        activeCheckPromise = (async () => {
          let fetchedUser: User | null = null;
          let authFailed = false;

          try {
            const roleToCheck = targetRole || get().role || (typeof window !== 'undefined' && window.location.pathname.startsWith('/admin') ? 'admin' : 'student');
            const endpoint = roleToCheck === 'admin' ? '/admin/me' : '/student/me';

            const response = await api.get(endpoint, { withCredentials: true });
            if (response.data && response.data._id) {
              const rawData = response.data;
              const authToken = rawData.token || get().token || null;
              fetchedUser = {
                ...rawData,
                name: rawData.name || rawData.fullName || 'User',
                role: rawData.role || roleToCheck,
                token: authToken || undefined
              };
            }
          } catch (error: unknown) {
            const err = error as { response?: { status?: number } };
            const status = err?.response?.status;
            if (status === 401 || status === 403) {
              // Target endpoint rejected auth
              if (!targetRole) {
                try {
                  const altRole = get().role === 'admin' ? 'student' : 'admin';
                  const altEndpoint = altRole === 'admin' ? '/admin/me' : '/student/me';
                  const response = await api.get(altEndpoint, { withCredentials: true });
                  if (response.data && response.data._id) {
                    const rawData = response.data;
                    const authToken = rawData.token || get().token || null;
                    fetchedUser = {
                      ...rawData,
                      name: rawData.name || rawData.fullName || 'User',
                      role: rawData.role || altRole,
                      token: authToken || undefined
                    };
                  } else {
                    authFailed = true;
                  }
                } catch {
                  authFailed = true;
                }
              } else {
                authFailed = true;
              }
            } else {
              // Server error (500) or network unreachable
              const currentToken = get().token || get().user?.token;
              if (silent && currentToken && isTokenValid(currentToken) && get().user) {
                // If silent background check and network failed, keep existing valid local session
                fetchedUser = get().user;
              } else {
                authFailed = true;
              }
            }
          } finally {
            activeCheckPromise = null;
            if (fetchedUser) {
              set({
                user: fetchedUser,
                role: fetchedUser.role,
                token: fetchedUser.token || get().token || null,
                isAuthenticated: true,
                loading: false,
                authChecked: true
              });
            } else if (authFailed) {
              set({
                user: null,
                role: null,
                token: null,
                isAuthenticated: false,
                loading: false,
                authChecked: true
              });
              if (typeof window !== 'undefined') {
                localStorage.removeItem('auth-storage');
                sessionStorage.clear();
              }
            } else {
              set({ loading: false, authChecked: true });
            }
          }
          return fetchedUser;
        })();

        return activeCheckPromise;
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
            token: null,
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
        token: state.token,
        isAuthenticated: state.isAuthenticated
      }),
      onRehydrateStorage: () => (state) => {
        if (!state) return;
        state.isHydrated = true;
        const activeToken = state.token || state.user?.token;
        if (state.isAuthenticated && state.user && activeToken && isTokenValid(activeToken)) {
          state.loading = false;
          state.authChecked = true;
        } else {
          state.user = null;
          state.role = null;
          state.token = null;
          state.isAuthenticated = false;
          state.loading = false;
          state.authChecked = true;
          if (typeof window !== 'undefined' && (state.token || (activeToken && !isTokenValid(activeToken)))) {
            localStorage.removeItem('auth-storage');
          }
        }
      },
    }
  )
);

