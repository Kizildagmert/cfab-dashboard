import { create } from 'zustand';

export type UserRole = 'admin' | 'user';

export interface AuthState {
  token: string | null;
  role: UserRole | null;
  isAuthenticated: boolean;
  login: (token: string, role: UserRole) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  role: null,
  isAuthenticated: false,

  login: (token, role) =>
    set({
      token,
      role,
      isAuthenticated: true,
    }),

  logout: () =>
    set({
      token: null,
      role: null,
      isAuthenticated: false,
    }),
}));
