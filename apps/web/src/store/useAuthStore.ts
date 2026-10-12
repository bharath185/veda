'use client';

import { create } from 'zustand';

export interface AuthUser {
  id?: string;
  name: string;
  phone?: string;
  email?: string;
  role: 'CUSTOMER' | 'ADMIN' | 'VENDOR';
  doshaProfile?: string;
}

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isLoggedIn: boolean;
  login: (user: AuthUser, token?: string) => void;
  logout: () => void;
  checkAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isLoggedIn: false,

  login: (user: AuthUser, token: string = 'veda-demo-token-jwt') => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('shopflow_user', JSON.stringify(user));
      localStorage.setItem('shopflow_token', token);
      window.dispatchEvent(new Event('shopflow_auth_change'));
    }
    set({ user, token, isLoggedIn: true });
  },

  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('shopflow_user');
      localStorage.removeItem('shopflow_token');
      window.dispatchEvent(new Event('shopflow_auth_change'));
    }
    set({ user: null, token: null, isLoggedIn: false });
  },

  checkAuth: () => {
    if (typeof window === 'undefined') return;
    try {
      const storedUser = localStorage.getItem('shopflow_user');
      const storedToken = localStorage.getItem('shopflow_token');
      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        set({ user: parsed, token: storedToken || 'veda-demo-token-jwt', isLoggedIn: true });
        return;
      }
    } catch {
      // ignore parsing error
    }
    set({ user: null, token: null, isLoggedIn: false });
  },
}));
