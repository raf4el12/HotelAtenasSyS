import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { paymentsService } from '@/services/payments.service';
import type { PaginationParams } from '@/types/pagination.types';
import type { CreatePaymentPayload } from '../types';
import { toast } from 'sonner';

export function usePayments(
  params: PaginationParams & {
    method?: string;
    type?: string;
    stayId?: string;
    reservationId?: string;
    voided?: boolean;
  },
) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['payments', params],
    queryFn: () => paymentsService.findAll(params),
  });

  const registerMutation = useMutation({
    mutationFn: (data: CreatePaymentPayload) => paymentsService.register(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      toast.success('Pago registrado exitosamente');
    },
    onError: () => toast.error('Error al registrar el pago'),
  });

  const voidMutation = useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      paymentsService.void(id, { reason }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      toast.success('Pago anulado exitosamente');
    },
    onError: () => toast.error('Error al anular el pago'),
  });

  return { ...query, registerMutation, voidMutation };
}
