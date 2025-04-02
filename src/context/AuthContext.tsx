// src/context/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { login as apiLogin, logout as apiLogout, isAuthenticated } from '@/lib/api';
import { User } from '@/lib/types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (phoneNumber: string) => Promise<void>;
  logout: () => void;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load user from localStorage on mount
  useEffect(() => {
    const loadUser = () => {
      setIsLoading(true);
      try {
        const userJson = localStorage.getItem('healthBuddieUser');
        if (userJson) {
          const userData = JSON.parse(userJson);
          // Ensure phone number exists
          if (userData.phoneNumber) {
            setUser({
              id: userData.id || `user-${Date.now()}`,
              phoneNumber: userData.phoneNumber,
              createdAt: new Date(userData.createdAt || Date.now()),
              lastActive: new Date(userData.lastActive || Date.now()),
              verified: true
            });
            console.log('User loaded from localStorage:', userData.phoneNumber);
          } else {
            console.error('No phone number found in stored user data');
            // Clear invalid user data
            localStorage.removeItem('healthBuddieUser');
            localStorage.removeItem('healthBuddieToken');
          }
        }
      } catch (err) {
        console.error('Error loading user data', err);
        // Clear potentially corrupted data
        localStorage.removeItem('healthBuddieUser');
        localStorage.removeItem('healthBuddieToken');
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = async (phoneNumber: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('Logging in with phone number:', phoneNumber);
      
      // Call the API login function
      const result = await apiLogin(phoneNumber);
      
      // Set the user in state
      if (result.user) {
        setUser(result.user);
        console.log('User set in state after login:', result.user);
      }
      
      return result;
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'Failed to log in');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    apiLogout();
    setUser(null);
  };

  const value = {
    user,
    isAuthenticated: !!user && isAuthenticated(),
    isLoading,
    login,
    logout,
    error
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};