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
          setUser({
            id: userData.id || `user-${Date.now()}`,
            phoneNumber: userData.phoneNumber,
            createdAt: new Date(),
            lastActive: new Date(),
            verified: true
          });
        }
      } catch (err) {
        console.error('Error loading user data', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  // Modify the login function or context to log more details
const login = async (phoneNumber: string) => {
  try {
    console.log('Attempting to log in with phone number:', phoneNumber);
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phoneNumber })
    });
    
    if (!response.ok) {
      const error = await response.text();
      console.error('Login error response:', error);
      throw new Error(error || 'Login failed');
    }
    
    const data = await response.json();
    
    // Log token and user details
    console.log('Login response:', data);
    
    // Save token and phone number
    if (data.token) {
      localStorage.setItem('healthBuddieToken', data.token);
      localStorage.setItem('healthBuddieUser', JSON.stringify({
        phoneNumber: phoneNumber, // Explicitly store phone number
        ...data.user
      }));
    }
    
    return data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

  const logout = () => {
    apiLogout();
    setUser(null);
  };

  const value = {
    user,
    isAuthenticated: isAuthenticated(),
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