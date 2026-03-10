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
  documentType: z.string().optional(),
  nationality: z.string().optional(),
  dateOfBirth: z.string().optional(),
  gender: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  notes: z.string().optional(),
});

export type GuestFormData = z.infer<typeof guestSchema>;
