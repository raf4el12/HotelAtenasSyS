import { z } from 'zod';

export const packageItemSchema = z.object({
  productId: z.string().min(1, 'Selecciona un producto'),
  quantity: z
    .number({ invalid_type_error: 'La cantidad debe ser numerica' })
    .int()
    .min(1, 'La cantidad minima es 1'),
});

export const packageSchema = z.object({
  name: z.string().min(1, 'El nombre del paquete es requerido'),
  description: z.string().optional(),
  category: z.enum(['NORMAL', 'PREMIUM'], { required_error: 'La categoria es requerida' }),
  stayMode: z.enum(['HOURLY', 'OVERNIGHT', 'PACKAGE'], {
    required_error: 'El modo de estancia es requerido',
  }),
  totalPrice: z
    .number({ invalid_type_error: 'El precio total debe ser numerico' })
    .min(0, 'El precio debe ser mayor o igual a 0'),
  validFrom: z.string().optional(),
  validTo: z.string().optional(),
  items: z.array(packageItemSchema).min(0),
});

export type PackageFormData = z.infer<typeof packageSchema>;
export type PackageItemFormData = z.infer<typeof packageItemSchema>;
