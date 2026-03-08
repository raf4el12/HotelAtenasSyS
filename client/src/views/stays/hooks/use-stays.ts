import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { staysService } from '@/services/stays.service';
import type { PaginationParams } from '@/types/pagination.types';
import type { CreateStayPayload } from '../types';
import { toast } from 'sonner';

export function useStays(
  params: PaginationParams & { status?: string; stayMode?: string; roomId?: string; guestId?: string },
) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['stays', params],
    queryFn: () => staysService.findAll(params),
  });

  const createMutation = useMutation({
    mutationFn: (data: CreateStayPayload) => staysService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stays'] });
      toast.success('Estadía registrada exitosamente');
    },
    onError: () => toast.error('Error al registrar la estadía'),
  });

  const checkOutMutation = useMutation({
    mutationFn: (id: string) => staysService.checkOut(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stays'] });
      toast.success('Check-out realizado exitosamente');
    },
    onError: () => toast.error('Error al realizar el check-out'),
  });

  const cancelMutation = useMutation({
    mutationFn: (id: string) => staysService.cancel(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stays'] });
      toast.success('Estadía cancelada');
    },
    onError: () => toast.error('Error al cancelar la estadía'),
  });

  return { ...query, createMutation, checkOutMutation, cancelMutation };
}
