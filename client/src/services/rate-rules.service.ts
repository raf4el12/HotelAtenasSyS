import apiClient from '@/lib/axios';
import type { PaginationParams, PaginatedResponse } from '@/types/pagination.types';
import type { RateRule, CreateRateRulePayload } from '@/views/rate-rules/types';

export const rateRulesService = {
  findAll: async (
    params: PaginationParams & { stayMode?: string; category?: string },
  ): Promise<PaginatedResponse<RateRule>> => {
    const response = await apiClient.get<PaginatedResponse<RateRule>>('/rate-rules', { params });
    return response.data;
  },
  findById: async (id: string): Promise<RateRule> => {
    const response = await apiClient.get<RateRule>(`/rate-rules/${id}`);
    return response.data;
  },
  create: async (data: CreateRateRulePayload): Promise<RateRule> => {
    const response = await apiClient.post<RateRule>('/rate-rules', data);
    return response.data;
  },
  update: async (id: string, data: Partial<CreateRateRulePayload>): Promise<RateRule> => {
    const response = await apiClient.patch<RateRule>(`/rate-rules/${id}`, data);
    return response.data;
  },
  remove: async (id: string): Promise<void> => {
    await apiClient.delete(`/rate-rules/${id}`);
  },
};
