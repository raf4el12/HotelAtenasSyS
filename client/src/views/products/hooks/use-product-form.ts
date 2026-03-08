import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { productSchema, type ProductFormData } from '../functions/product.schema';
import type { Product } from '../types';

export function useProductForm(product?: Product) {
  return useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: product?.name ?? '',
      category: product?.category ?? 'BEVERAGE_WATER',
      price: product?.price ?? 0,
      stock: product?.stock ?? 0,
      minStock: product?.minStock ?? 0,
    },
  });
}
