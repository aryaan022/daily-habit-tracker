/**
 * Authentication Context
 * 
 * WHY: Centralized auth state management across the entire application
 * WHAT: Provides login/logout functionality and user state
 * 
 * CURRENT: Frontend-only auth with localStorage (demo purposes)
 * FUTURE: Will integrate with Supabase auth when backend is added
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthState } from '@/types';
import { storage, STORAGE_KEYS } from '@/utils/storage';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user data for demo (replace with real API calls)
const DEMO_USERS: User[] = [
  {
    id: '1',
    email: 'demo@example.com',
    name: 'Demo User',
    createdAt: new Date().toISOString(),
  },
];

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
  });

  // Check for existing auth on app load
  useEffect(() => {
    const savedUser = storage.get<User>(STORAGE_KEYS.USER);
    const savedToken = storage.get<string>(STORAGE_KEYS.AUTH_TOKEN);
    
    if (savedUser && savedToken) {
      setAuthState({
        user: savedUser,
        isLoading: false,
        isAuthenticated: true,
      });
    } else {
      setAuthState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  /**
   * Demo login function (replace with real auth API)
   */
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }));
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Demo validation (replace with real API call)
      const user = DEMO_USERS.find(u => u.email === email);
      if (!user || password !== 'demo123') {
        throw new Error('Invalid credentials');
      }
      
      // Generate demo token (replace with real JWT)
      const token = `demo_token_${Date.now()}`;
      
      // Save to localStorage
      storage.set(STORAGE_KEYS.USER, user);
      storage.set(STORAGE_KEYS.AUTH_TOKEN, token);
      
      setAuthState({
        user,
        isLoading: false,
        isAuthenticated: true,
      });
      
      return true;
    } catch (error) {
      console.error('Login error:', error);
      setAuthState(prev => ({ ...prev, isLoading: false }));
      return false;
    }
  };

  /**
   * Demo registration function (replace with real auth API)
   */
  const register = async (email: string, password: string, name: string): Promise<boolean> => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }));
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if user already exists (demo logic)
      const existingUser = DEMO_USERS.find(u => u.email === email);
      if (existingUser) {
        throw new Error('User already exists');
      }
      
      // Create new user (in real app, this would be API call)
      const newUser: User = {
        id: `user_${Date.now()}`,
        email,
        name,
        createdAt: new Date().toISOString(),
      };
      
      // Generate demo token
      const token = `demo_token_${Date.now()}`;
      
      // Save to localStorage
      storage.set(STORAGE_KEYS.USER, newUser);
      storage.set(STORAGE_KEYS.AUTH_TOKEN, token);
      
      setAuthState({
        user: newUser,
        isLoading: false,
        isAuthenticated: true,
      });
      
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      setAuthState(prev => ({ ...prev, isLoading: false }));
      return false;
    }
  };

  /**
   * Logout and clear all user data
   */
  const logout = () => {
    storage.clearAll();
    setAuthState({
      user: null,
      isLoading: false,
      isAuthenticated: false,
    });
  };

  const value: AuthContextType = {
    ...authState,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}