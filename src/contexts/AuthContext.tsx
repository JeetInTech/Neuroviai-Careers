import React, { createContext, useContext, useEffect, useState } from 'react';
import api from '../lib/api';

type User = {
  id: string;
  email: string;
  username?: string;
  display_name?: string;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  signIn: (usernameOrEmail: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, username: string, displayName?: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        setUser(null);
        return;
      }

      const profile = await api.getMyProfile();
      setUser({
        id: profile.id,
        email: profile.email,
        username: profile.username,
        display_name: profile.display_name,
      });
    } catch (error) {
      // Token might be expired
      api.clearToken();
      setUser(null);
    }
  };

  useEffect(() => {
    // Check if user is logged in on mount
    const initAuth = async () => {
      await refreshUser();
      setLoading(false);
    };
    initAuth();
  }, []);

  const signIn = async (usernameOrEmail: string, password: string) => {
    const result = await api.signIn(usernameOrEmail, password);
    
    if (result.success) {
      await refreshUser();
    } else {
      throw new Error(result.message || 'Sign in failed');
    }
  };

  const signUp = async (email: string, password: string, username: string, displayName?: string) => {
    const result = await api.signUp(email, password, username, displayName);
    
    if (!result.success) {
      throw new Error(result.message || 'Sign up failed');
    }
  };

  const signOut = async () => {
    await api.signOut();
    setUser(null);
  };

  const resetPassword = async (email: string) => {
    await api.resetPassword(email);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut, resetPassword, refreshUser }}>
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