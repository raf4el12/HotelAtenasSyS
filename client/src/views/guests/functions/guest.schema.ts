import { z } from 'zod';

export const guestSchema = z.object({
  dni: z.string().min(1, 'El DNI es requerido'),
  firstName: z.string().min(1, 'El nombre es requerido'),
  lastName: z.string().min(1, 'El apellido es requerido'),
  phone: z.string().optional(),
  email: z
    .string()
    .email('Ingresa un correo electronico valido')
    .optional()
    .or(z.literal('')),
});

export type GuestFormData = z.infer<typeof guestSchema>;
