import { z } from 'zod';

export const floorSchema = z.object({
  name: z.string().min(1, 'El nombre del piso es requerido'),
  number: z
    .number({ invalid_type_error: 'El numero debe ser un valor numerico' })
    .int('El numero debe ser entero')
    .min(0, 'El numero debe ser mayor o igual a 0'),
});

export type FloorFormData = z.infer<typeof floorSchema>;
