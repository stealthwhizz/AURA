import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api, Farmer } from '@/lib/api';

interface AuthContextType {
  farmer: Farmer | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: {
    name: string;
    email: string;
    phone: string;
    password: string;
    location: string;
    crops: string[];
  }) => Promise<void>;
  logout: () => void;
  updateFarmer: (data: Partial<Farmer>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [farmer, setFarmer] = useState<Farmer | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing token and load farmer data
    const token = api.getToken();
    if (token) {
      const storedFarmer = localStorage.getItem('aura_farmer');
      if (storedFarmer) {
        try {
          setFarmer(JSON.parse(storedFarmer));
        } catch {
          localStorage.removeItem('aura_farmer');
        }
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const result = await api.login(email, password);
    setFarmer(result.farmer);
    localStorage.setItem('aura_farmer', JSON.stringify(result.farmer));
  };

  const register = async (data: {
    name: string;
    email: string;
    phone: string;
    password: string;
    location: string;
    crops: string[];
  }) => {
    const result = await api.register(data);
    setFarmer(result.farmer);
    localStorage.setItem('aura_farmer', JSON.stringify(result.farmer));
  };

  const logout = () => {
    api.logout();
    setFarmer(null);
    localStorage.removeItem('aura_farmer');
  };

  const updateFarmer = async (data: Partial<Farmer>) => {
    if (!farmer) return;
    const updated = await api.updateFarmer(farmer._id, data);
    setFarmer(updated);
    localStorage.setItem('aura_farmer', JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider
      value={{
        farmer,
        isAuthenticated: !!farmer,
        isLoading,
        login,
        register,
        logout,
        updateFarmer,
      }}
    >
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
