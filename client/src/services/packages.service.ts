import apiClient from '@/lib/axios';
import type { PaginationParams, PaginatedResponse } from '@/types/pagination.types';
import type {
  Package,
  CreatePackagePayload,
  AddPackageItemPayload,
} from '@/views/packages/types';

export const packagesService = {
  findAll: async (
    params: PaginationParams & { category?: string; stayMode?: string },
  ): Promise<PaginatedResponse<Package>> => {
    const response = await apiClient.get<PaginatedResponse<Package>>('/packages', { params });
    return response.data;
  },
  findById: async (id: string): Promise<Package> => {
    const response = await apiClient.get<Package>(`/packages/${id}`);
    return response.data;
  },
  create: async (data: CreatePackagePayload): Promise<Package> => {
    const response = await apiClient.post<Package>('/packages', data);
    return response.data;
  },
  update: async (id: string, data: Partial<CreatePackagePayload>): Promise<Package> => {
    const response = await apiClient.patch<Package>(`/packages/${id}`, data);
    return response.data;
  },
  remove: async (id: string): Promise<void> => {
    await apiClient.delete(`/packages/${id}`);
  },
  addItem: async (id: string, data: AddPackageItemPayload): Promise<Package> => {
    const response = await apiClient.post<Package>(`/packages/${id}/items`, data);
    return response.data;
  },
  removeItem: async (id: string, productId: string): Promise<void> => {
    await apiClient.delete(`/packages/${id}/items/${productId}`);
  },
};
