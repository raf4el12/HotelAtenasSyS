import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { reservationsService } from '@/services/reservations.service';
import type { PaginationParams } from '@/types/pagination.types';
import type { CreateReservationPayload } from '../types';
import { toast } from 'sonner';

export function useReservations(
  params: PaginationParams & { status?: string; stayMode?: string; roomId?: string; guestId?: string },
) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['reservations', params],
    queryFn: () => reservationsService.findAll(params),
  });

  const createMutation = useMutation({
    mutationFn: (data: CreateReservationPayload) => reservationsService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reservations'] });
      toast.success('Reserva creada exitosamente');
    },
    onError: () => toast.error('Error al crear la reserva'),
  });

  const confirmMutation = useMutation({
    mutationFn: (id: string) => reservationsService.confirm(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reservations'] });
      toast.success('Reserva confirmada');
    },
    onError: () => toast.error('Error al confirmar la reserva'),
  });

  const checkInMutation = useMutation({
    mutationFn: (id: string) => reservationsService.checkIn(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reservations'] });
      toast.success('Check-in registrado');
    },
    onError: () => toast.error('Error al registrar check-in'),
  });

  const cancelMutation = useMutation({
    mutationFn: (id: string) => reservationsService.cancel(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reservations'] });
      toast.success('Reserva cancelada');
    },
    onError: () => toast.error('Error al cancelar la reserva'),
  });

  const noShowMutation = useMutation({
    mutationFn: (id: string) => reservationsService.noShow(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reservations'] });
      toast.success('Reserva marcada como no-show');
    },
    onError: () => toast.error('Error al marcar como no-show'),
  });

  return {
    ...query,
    createMutation,
    confirmMutation,
    checkInMutation,
    cancelMutation,
    noShowMutation,
  };
}
