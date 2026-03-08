import apiClient from '@/lib/axios';
import type { PaginationParams, PaginatedResponse } from '@/types/pagination.types';
import type { Room, CreateRoomPayload, UpdateRoomStatusPayload } from '@/views/rooms/types';

export const roomsService = {
  findAll: async (
    params: PaginationParams & { status?: string; category?: string; floorId?: string },
  ): Promise<PaginatedResponse<Room>> => {
    const response = await apiClient.get<PaginatedResponse<Room>>('/rooms', { params });
    return response.data;
  },
  findById: async (id: string): Promise<Room> => {
    const response = await apiClient.get<Room>(`/rooms/${id}`);
    return response.data;
  },
  create: async (data: CreateRoomPayload): Promise<Room> => {
    const response = await apiClient.post<Room>('/rooms', data);
    return response.data;
  },
  update: async (id: string, data: Partial<CreateRoomPayload>): Promise<Room> => {
    const response = await apiClient.patch<Room>(`/rooms/${id}`, data);
    return response.data;
  },
  updateStatus: async (id: string, data: UpdateRoomStatusPayload): Promise<Room> => {
    const response = await apiClient.patch<Room>(`/rooms/${id}/status`, data);
    return response.data;
  },
  remove: async (id: string): Promise<void> => {
    await apiClient.delete(`/rooms/${id}`);
  },
};
