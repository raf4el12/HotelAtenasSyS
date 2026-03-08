import { z } from 'zod';

export const productSchema = z.object({
  name: z.string().min(1, 'El nombre del producto es requerido'),
  category: z.enum(
    ['BEVERAGE_WATER', 'BEVERAGE_ENERGY', 'BEVERAGE_ALCOHOL', 'SNACK_CANDY', 'SNACK_SAVORY'],
    { required_error: 'La categoria es requerida' },
  ),
  price: z
    .number({ invalid_type_error: 'El precio debe ser un valor numerico' })
    .min(0, 'El precio debe ser mayor o igual a 0'),
  stock: z
    .number({ invalid_type_error: 'El stock debe ser un valor numerico' })
    .int('El stock debe ser entero')
    .min(0, 'El stock no puede ser negativo')
    .optional(),
  minStock: z
    .number({ invalid_type_error: 'El stock minimo debe ser un valor numerico' })
    .int('El stock minimo debe ser entero')
    .min(0, 'El stock minimo no puede ser negativo')
    .optional(),
});

export type ProductFormData = z.infer<typeof productSchema>;
