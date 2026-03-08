import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { usersService } from '@/services/users.service';
import type { PaginationParams } from '@/types/pagination.types';
import type { CreateUserPayload, UpdateUserPayload } from '../types';
import { toast } from 'sonner';

export function useUsers(params: PaginationParams & { role?: string }) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['users', params],
    queryFn: () => usersService.findAll(params),
  });

  const createMutation = useMutation({
    mutationFn: (data: CreateUserPayload) => usersService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('Usuario creado exitosamente');
    },
    onError: () => toast.error('Error al crear el usuario'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateUserPayload }) =>
      usersService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('Usuario actualizado exitosamente');
    },
    onError: () => toast.error('Error al actualizar el usuario'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => usersService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('Usuario desactivado exitosamente');
    },
    onError: () => toast.error('Error al desactivar el usuario'),
  });

  return { ...query, createMutation, updateMutation, deleteMutation };
}
