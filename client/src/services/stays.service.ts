import apiClient from '@/lib/axios';
import type { PaginationParams, PaginatedResponse } from '@/types/pagination.types';
import type { Stay, CreateStayPayload } from '@/views/stays/types';

export const staysService = {
  findAll: async (
    params: PaginationParams & { status?: string; stayMode?: string; roomId?: string; guestId?: string },
  ): Promise<PaginatedResponse<Stay>> => {
    const response = await apiClient.get<PaginatedResponse<Stay>>('/stays', { params });
    return response.data;
  },
  findById: async (id: string): Promise<Stay> => {
    const response = await apiClient.get<Stay>(`/stays/${id}`);
    return response.data;
  },
  create: async (data: CreateStayPayload): Promise<Stay> => {
    const response = await apiClient.post<Stay>('/stays', data);
    return response.data;
  },
  checkOut: async (id: string): Promise<Stay> => {
    const response = await apiClient.patch<Stay>(`/stays/${id}/check-out`, {});
    return response.data;
  },
  cancel: async (id: string): Promise<Stay> => {
    const response = await apiClient.patch<Stay>(`/stays/${id}/cancel`, {});
    return response.data;
  },
};
