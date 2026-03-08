import apiClient from '@/lib/axios';
import type { PaginationParams, PaginatedResponse } from '@/types/pagination.types';
import type { Payment, CreatePaymentPayload, VoidPaymentPayload } from '@/views/payments/types';

export const paymentsService = {
  findAll: async (
    params: PaginationParams & {
      method?: string;
      type?: string;
      stayId?: string;
      reservationId?: string;
      voided?: boolean;
    },
  ): Promise<PaginatedResponse<Payment>> => {
    const response = await apiClient.get<PaginatedResponse<Payment>>('/payments', { params });
    return response.data;
  },
  findById: async (id: string): Promise<Payment> => {
    const response = await apiClient.get<Payment>(`/payments/${id}`);
    return response.data;
  },
  findByStay: async (stayId: string): Promise<{ payments: Payment[]; totalPaid: number }> => {
    const response = await apiClient.get<{ payments: Payment[]; totalPaid: number }>(
      `/payments/by-stay/${stayId}`,
    );
    return response.data;
  },
  register: async (data: CreatePaymentPayload): Promise<Payment> => {
    const response = await apiClient.post<Payment>('/payments', data);
    return response.data;
  },
  void: async (id: string, data: VoidPaymentPayload): Promise<Payment> => {
    const response = await apiClient.patch<Payment>(`/payments/${id}/void`, data);
    return response.data;
  },
};
