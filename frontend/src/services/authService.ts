import api from './api';
import type { LoginCredentials, RegisterData, JwtResponse, ProfileData, PasswordUpdateData } from '../types';

export const authService = {
  async login(credentials: LoginCredentials): Promise<JwtResponse> {
    const response = await api.post<JwtResponse>('/auth/login', credentials);
    return response.data;
  },

  async register(data: RegisterData): Promise<{ message: string }> {
    const response = await api.post<{ message: string }>('/auth/register', data);
    return response.data;
  },

  async getProfile(): Promise<ProfileData> {
    const response = await api.get<ProfileData>('/profile');
    return response.data;
  },

  async updateProfile(data: Partial<ProfileData>): Promise<ProfileData> {
    const response = await api.put<ProfileData>('/profile', data);
    return response.data;
  },

  async changePassword(data: PasswordUpdateData): Promise<{ message: string }> {
    const response = await api.put<{ message: string }>('/profile/password', data);
    return response.data;
  }
};
