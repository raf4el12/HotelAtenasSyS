import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { rateRulesService } from '@/services/rate-rules.service';
import type { PaginationParams } from '@/types/pagination.types';
import type { CreateRateRulePayload } from '../types';
import { toast } from 'sonner';

export function useRateRules(
  params: PaginationParams & { stayMode?: string; category?: string },
) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['rate-rules', params],
    queryFn: () => rateRulesService.findAll(params),
  });

  const createMutation = useMutation({
    mutationFn: (data: CreateRateRulePayload) => rateRulesService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rate-rules'] });
      toast.success('Tarifa creada exitosamente');
    },
    onError: () => toast.error('Error al crear la tarifa'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateRateRulePayload> }) =>
      rateRulesService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rate-rules'] });
      toast.success('Tarifa actualizada exitosamente');
    },
    onError: () => toast.error('Error al actualizar la tarifa'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => rateRulesService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rate-rules'] });
      toast.success('Tarifa eliminada exitosamente');
    },
    onError: () => toast.error('Error al eliminar la tarifa'),
  });

  return { ...query, createMutation, updateMutation, deleteMutation };
}
