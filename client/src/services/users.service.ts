import apiClient from '@/lib/axios';
import type { PaginationParams, PaginatedResponse } from '@/types/pagination.types';
import type { User, CreateUserPayload, UpdateUserPayload } from '@/views/users/types';

export const usersService = {
  findAll: async (params: PaginationParams): Promise<PaginatedResponse<User>> => {
    const response = await apiClient.get<PaginatedResponse<User>>('/users', { params });
    return response.data;
  },
  findById: async (id: string): Promise<User> => {
    const response = await apiClient.get<User>(`/users/${id}`);
    return response.data;
  },
  create: async (data: CreateUserPayload): Promise<User> => {
    const response = await apiClient.post<User>('/users', data);
    return response.data;
  },
  update: async (id: string, data: UpdateUserPayload): Promise<User> => {
    const response = await apiClient.patch<User>(`/users/${id}`, data);
    return response.data;
  },
  remove: async (id: string): Promise<void> => {
    await apiClient.delete(`/users/${id}`);
  },
};
