import apiClient from '@/lib/axios';
import type { PaginationParams, PaginatedResponse } from '@/types/pagination.types';
import type { Floor, CreateFloorPayload } from '@/views/floors/types';

export const floorsService = {
  findAll: async (params: PaginationParams): Promise<PaginatedResponse<Floor>> => {
    const response = await apiClient.get<PaginatedResponse<Floor>>('/floors', { params });
    return response.data;
  },
  findById: async (id: string): Promise<Floor> => {
    const response = await apiClient.get<Floor>(`/floors/${id}`);
    return response.data;
  },
  create: async (data: CreateFloorPayload): Promise<Floor> => {
    const response = await apiClient.post<Floor>('/floors', data);
    return response.data;
  },
  update: async (id: string, data: Partial<CreateFloorPayload>): Promise<Floor> => {
    const response = await apiClient.patch<Floor>(`/floors/${id}`, data);
    return response.data;
  },
  remove: async (id: string): Promise<void> => {
    await apiClient.delete(`/floors/${id}`);
  },
};
