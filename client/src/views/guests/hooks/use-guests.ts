import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { guestsService } from '@/services/guests.service';
import type { PaginationParams } from '@/types/pagination.types';
import type { CreateGuestPayload } from '../types';
import { toast } from 'sonner';

export function useGuests(params: PaginationParams) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['guests', params],
    queryFn: () => guestsService.findAll(params),
  });

  const createMutation = useMutation({
    mutationFn: (data: CreateGuestPayload) => guestsService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['guests'] });
      toast.success('Huesped creado exitosamente');
    },
    onError: () => toast.error('Error al crear el huesped'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateGuestPayload> }) =>
      guestsService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['guests'] });
      toast.success('Huesped actualizado exitosamente');
    },
    onError: () => toast.error('Error al actualizar el huesped'),
  });

  return { ...query, createMutation, updateMutation };
}
