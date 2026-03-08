import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { packageSchema, type PackageFormData } from '../functions/package.schema';
import type { Package } from '../types';

export function usePackageForm(pkg?: Package) {
  return useForm<PackageFormData>({
    resolver: zodResolver(packageSchema),
    defaultValues: {
      name: pkg?.name ?? '',
      description: pkg?.description ?? '',
      category: pkg?.category ?? 'NORMAL',
      stayMode: pkg?.stayMode ?? 'OVERNIGHT',
      totalPrice: pkg?.totalPrice ?? 0,
      validFrom: pkg?.validFrom ?? '',
      validTo: pkg?.validTo ?? '',
      items: pkg?.items?.map((item) => ({ productId: item.productId, quantity: item.quantity })) ?? [],
    },
  });
}
