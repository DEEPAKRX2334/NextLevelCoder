import React, { createContext, useState, useEffect, useContext } from 'react';
import { authService } from '../services/authService';
import type { LoginCredentials, RegisterData, ProfileData, JwtResponse } from '../types';
import { useToast } from './ToastContext';

interface AuthContextType {
  user: JwtResponse | null;
  profile: ProfileData | null;
  loading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  refreshProfile: () => Promise<void>;
  updateProfile: (data: Partial<ProfileData>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<JwtResponse | null>(null);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  const { addToast } = useToast();

  useEffect(() => {
    const initializeAuth = async () => {
      const storedUser = localStorage.getItem('user');
      const storedToken = localStorage.getItem('token');

      if (storedUser && storedToken) {
        try {
          setUser(JSON.parse(storedUser));
          const profileData = await authService.getProfile();
          setProfile(profileData);
        } catch (error) {
          console.error('Failed to load user profile on boot:', error);
          logout();
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    setLoading(true);
    try {
      const response = await authService.login(credentials);
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response));
      setUser(response);
      
      const profileData = await authService.getProfile();
      setProfile(profileData);
    } catch (error) {
      logout();
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: RegisterData) => {
    await authService.register(data);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setProfile(null);
  };

  const refreshProfile = async () => {
    if (user) {
      try {
        const profileData = await authService.getProfile();
        setProfile((prev) => {
          if (prev && profileData) {
            const xpGained = profileData.xp - prev.xp;
            const levelChanged = profileData.level !== prev.level;
            
            if (xpGained > 0) {
              addToast(`+${xpGained} XP Earned!`, 'xp', { xpAmount: xpGained });
            }
            if (levelChanged) {
              addToast(`Level Up! You are now a ${profileData.level}!`, 'level', { levelName: profileData.level });
            }
          }
          return profileData;
        });
      } catch (error) {
        console.error('Failed to refresh profile:', error);
      }
    }
  };

  const updateProfile = async (data: Partial<ProfileData>) => {
    if (profile) {
      const updated = await authService.updateProfile(data);
      setProfile(updated);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        login,
        register,
        logout,
        refreshProfile,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
export default AuthContext;
