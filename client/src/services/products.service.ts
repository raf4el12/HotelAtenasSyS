import apiClient from '@/lib/axios';
import type { PaginationParams, PaginatedResponse } from '@/types/pagination.types';
import type { Product, CreateProductPayload, UpdateStockPayload } from '@/views/products/types';

export const productsService = {
  findAll: async (
    params: PaginationParams & { category?: string; status?: string },
  ): Promise<PaginatedResponse<Product>> => {
    const response = await apiClient.get<PaginatedResponse<Product>>('/products', { params });
    return response.data;
  },
  findById: async (id: string): Promise<Product> => {
    const response = await apiClient.get<Product>(`/products/${id}`);
    return response.data;
  },
  create: async (data: CreateProductPayload): Promise<Product> => {
    const response = await apiClient.post<Product>('/products', data);
    return response.data;
  },
  update: async (id: string, data: Partial<CreateProductPayload>): Promise<Product> => {
    const response = await apiClient.patch<Product>(`/products/${id}`, data);
    return response.data;
  },
  updateStock: async (id: string, data: UpdateStockPayload): Promise<Product> => {
    const response = await apiClient.patch<Product>(`/products/${id}/stock`, data);
    return response.data;
  },
};
