import apiClient from '@/lib/axios';
import type { PaginationParams, PaginatedResponse } from '@/types/pagination.types';
import type { Guest, CreateGuestPayload } from '@/views/guests/types';

export const guestsService = {
  findAll: async (params: PaginationParams): Promise<PaginatedResponse<Guest>> => {
    const response = await apiClient.get<PaginatedResponse<Guest>>('/guests', { params });
    return response.data;
  },
  findById: async (id: string): Promise<Guest> => {
    const response = await apiClient.get<Guest>(`/guests/${id}`);
    return response.data;
  },
  findByDni: async (dni: string): Promise<Guest> => {
    const response = await apiClient.get<Guest>(`/guests/dni/${dni}`);
    return response.data;
  },
  create: async (data: CreateGuestPayload): Promise<Guest> => {
    const response = await apiClient.post<Guest>('/guests', data);
    return response.data;
  },
  update: async (id: string, data: Partial<CreateGuestPayload>): Promise<Guest> => {
    const response = await apiClient.patch<Guest>(`/guests/${id}`, data);
    return response.data;
  },
};
