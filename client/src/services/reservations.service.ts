import apiClient from '@/lib/axios';
import type { PaginationParams, PaginatedResponse } from '@/types/pagination.types';
import type { Reservation, CreateReservationPayload } from '@/views/reservations/types';

export const reservationsService = {
  findAll: async (
    params: PaginationParams & { status?: string; stayMode?: string; roomId?: string; guestId?: string },
  ): Promise<PaginatedResponse<Reservation>> => {
    const response = await apiClient.get<PaginatedResponse<Reservation>>('/reservations', { params });
    return response.data;
  },
  findById: async (id: string): Promise<Reservation> => {
    const response = await apiClient.get<Reservation>(`/reservations/${id}`);
    return response.data;
  },
  create: async (data: CreateReservationPayload): Promise<Reservation> => {
    const response = await apiClient.post<Reservation>('/reservations', data);
    return response.data;
  },
  confirm: async (id: string): Promise<Reservation> => {
    const response = await apiClient.patch<Reservation>(`/reservations/${id}/confirm`, {});
    return response.data;
  },
  checkIn: async (id: string): Promise<Reservation> => {
    const response = await apiClient.patch<Reservation>(`/reservations/${id}/check-in`, {});
    return response.data;
  },
  cancel: async (id: string): Promise<Reservation> => {
    const response = await apiClient.patch<Reservation>(`/reservations/${id}/cancel`, {});
    return response.data;
  },
  noShow: async (id: string): Promise<Reservation> => {
    const response = await apiClient.patch<Reservation>(`/reservations/${id}/no-show`, {});
    return response.data;
  },
};
