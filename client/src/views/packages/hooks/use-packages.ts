import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { packagesService } from '@/services/packages.service';
import type { PaginationParams } from '@/types/pagination.types';
import type { CreatePackagePayload } from '../types';
import { toast } from 'sonner';

export function usePackages(
  params: PaginationParams & { category?: string; stayMode?: string },
) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['packages', params],
    queryFn: () => packagesService.findAll(params),
  });

  const createMutation = useMutation({
    mutationFn: (data: CreatePackagePayload) => packagesService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['packages'] });
      toast.success('Paquete creado exitosamente');
    },
    onError: () => toast.error('Error al crear el paquete'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreatePackagePayload> }) =>
      packagesService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['packages'] });
      toast.success('Paquete actualizado exitosamente');
    },
    onError: () => toast.error('Error al actualizar el paquete'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => packagesService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['packages'] });
      toast.success('Paquete eliminado exitosamente');
    },
    onError: () => toast.error('Error al eliminar el paquete'),
  });

  return { ...query, createMutation, updateMutation, deleteMutation };
}
