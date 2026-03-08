import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productsService } from '@/services/products.service';
import type { PaginationParams } from '@/types/pagination.types';
import type { CreateProductPayload } from '../types';
import { toast } from 'sonner';

export function useProducts(
  params: PaginationParams & { category?: string; status?: string },
) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['products', params],
    queryFn: () => productsService.findAll(params),
  });

  const createMutation = useMutation({
    mutationFn: (data: CreateProductPayload) => productsService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Producto creado exitosamente');
    },
    onError: () => toast.error('Error al crear el producto'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateProductPayload> }) =>
      productsService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Producto actualizado exitosamente');
    },
    onError: () => toast.error('Error al actualizar el producto'),
  });

  return { ...query, createMutation, updateMutation };
}
