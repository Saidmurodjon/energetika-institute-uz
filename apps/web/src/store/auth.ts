import { create } from 'zustand';

interface Admin {
  id: string;
  email: string;
  name: string;
}

interface AuthState {
  token: string | null;
  admin: Admin | null;
  isAuthenticated: boolean;
  setAuth: (token: string, admin: Admin) => void;
  logout: () => void;
}

// Load from localStorage on init
const storedToken = localStorage.getItem('admin_token');
const storedAdmin = localStorage.getItem('admin_data');

export const useAuthStore = create<AuthState>((set) => ({
  token: storedToken,
  admin: storedAdmin ? JSON.parse(storedAdmin) : null,
  isAuthenticated: !!storedToken,

  setAuth: (token, admin) => {
    localStorage.setItem('admin_token', token);
    localStorage.setItem('admin_data', JSON.stringify(admin));
    set({ token, admin, isAuthenticated: true });
  },

  logout: () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_data');
    set({ token: null, admin: null, isAuthenticated: false });
  },
}));
