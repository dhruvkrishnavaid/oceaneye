 import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// Define the user interface
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user' | 'monitor';
  organization?: string;
  avatar?: string;
  createdAt: string;
  lastLoginAt?: string;
}

// Define the auth state interface
interface AuthState {
  // State
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  
  // Actions
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  setUser: (user: User) => void;
  setToken: (token: string) => void;
  clearAuth: () => void;
  updateUser: (updates: Partial<User>) => void;
}

// Create the auth store with persist middleware
export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      // Actions
      login: async (email: string, password: string) => {
        try {
          set({ isLoading: true });
          
          // TODO: Replace with actual API call
          // This is a mock implementation
          const mockUser: User = {
            id: '1',
            email,
            name: 'Admin User',
            role: 'admin',
            organization: 'Ocean Monitoring Center',
            createdAt: new Date().toISOString(),
            lastLoginAt: new Date().toISOString(),
          };
          
          const mockToken = 'mock-jwt-token-' + Date.now();
          
          // Simulate API delay
          await new Promise((resolve) => setTimeout(resolve, 1000));
          
          set({
            user: mockUser,
            token: mockToken,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
        });
      },

      setUser: (user: User) => {
        set({ user, isAuthenticated: true });
      },

      setToken: (token: string) => {
        set({ token });
      },

      clearAuth: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
        });
      },

      updateUser: (updates: Partial<User>) => {
        const { user } = get();
        if (user) {
          set({
            user: { ...user, ...updates },
          });
        }
      },
    }),
    {
      name: 'oceaneye-auth', // Storage key
      storage: createJSONStorage(() => localStorage), // Use localStorage
      partialize: (state) => ({
        // Only persist these fields
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

// Export the store hook - this is the only hook needed
// Usage: const { user, isAuthenticated, login, logout } = useAuthStore();