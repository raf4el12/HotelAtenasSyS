import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { floorsService } from '@/services/floors.service';
import type { PaginationParams } from '@/types/pagination.types';
import type { CreateFloorPayload } from '../types';
import { toast } from 'sonner';

export function useFloors(params: PaginationParams) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['floors', params],
    queryFn: () => floorsService.findAll(params),
  });

  const createMutation = useMutation({
    mutationFn: (data: CreateFloorPayload) => floorsService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['floors'] });
      toast.success('Piso creado exitosamente');
    },
    onError: () => toast.error('Error al crear el piso'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateFloorPayload> }) =>
      floorsService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['floors'] });
      toast.success('Piso actualizado exitosamente');
    },
    onError: () => toast.error('Error al actualizar el piso'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => floorsService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['floors'] });
      toast.success('Piso eliminado exitosamente');
    },
    onError: () => toast.error('Error al eliminar el piso'),
  });

  return { ...query, createMutation, updateMutation, deleteMutation };
}
