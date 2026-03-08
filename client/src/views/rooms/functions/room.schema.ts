import { z } from 'zod';

export const roomSchema = z.object({
  number: z.string().min(1, 'El numero de habitacion es requerido'),
  category: z.enum(['NORMAL', 'PREMIUM']).optional(),
  floorId: z.string().min(1, 'El piso es requerido'),
});

export type RoomFormData = z.infer<typeof roomSchema>;
