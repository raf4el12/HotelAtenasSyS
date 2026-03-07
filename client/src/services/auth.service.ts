import apiClient from '@/lib/axios';
import type {
  AuthResponse,
  LoginRequest,
  LogoutRequest,
  AuthUser,
} from '@/types/auth.types';

export const authService = {
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/login', data);
    return response.data;
  },

  refresh: async (deviceId: string): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/refresh', { deviceId });
    return response.data;
  },

  logout: async (data: LogoutRequest): Promise<void> => {
    await apiClient.post('/auth/logout', data);
  },

  logoutAll: async (): Promise<void> => {
    await apiClient.post('/auth/logout-all');
  },

  getProfile: async (): Promise<AuthUser> => {
    const response = await apiClient.get<AuthUser>('/auth/profile');
    return response.data;
  },

  updateProfile: async (data: Partial<AuthUser>): Promise<AuthUser> => {
    const response = await apiClient.patch<AuthUser>('/auth/profile', data);
    return response.data;
  },
};
