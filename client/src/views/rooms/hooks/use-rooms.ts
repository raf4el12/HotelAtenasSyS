import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { roomsService } from '@/services/rooms.service';
import type { PaginationParams } from '@/types/pagination.types';
import type { CreateRoomPayload } from '../types';
import { toast } from 'sonner';

export function useRooms(
  params: PaginationParams & { status?: string; category?: string; floorId?: string },
) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['rooms', params],
    queryFn: () => roomsService.findAll(params),
  });

  const createMutation = useMutation({
    mutationFn: (data: CreateRoomPayload) => roomsService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rooms'] });
      toast.success('Habitacion creada exitosamente');
    },
    onError: () => toast.error('Error al crear la habitacion'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateRoomPayload> }) =>
      roomsService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rooms'] });
      toast.success('Habitacion actualizada exitosamente');
    },
    onError: () => toast.error('Error al actualizar la habitacion'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => roomsService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rooms'] });
      toast.success('Habitacion eliminada exitosamente');
    },
    onError: () => toast.error('Error al eliminar la habitacion'),
  });

  return { ...query, createMutation, updateMutation, deleteMutation };
}
