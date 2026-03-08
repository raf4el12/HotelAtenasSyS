import { z } from 'zod';

export const createUserSchema = z.object({
  email: z
    .string()
    .min(1, 'El correo es requerido')
    .email('Ingresa un correo electronico valido'),
  password: z
    .string()
    .min(1, 'La contrasena es requerida')
    .min(6, 'La contrasena debe tener al menos 6 caracteres'),
  role: z.enum(['ADMIN', 'RECEPTIONIST', 'HOUSEKEEPING'], {
    required_error: 'El rol es requerido',
  }),
  profile: z.object({
    firstName: z.string().min(1, 'El nombre es requerido'),
    lastName: z.string().min(1, 'El apellido es requerido'),
    dni: z.string().min(1, 'El DNI es requerido'),
    phone: z.string().optional(),
    shift: z.string().optional(),
  }),
});

export const updateUserSchema = z.object({
  email: z.string().email('Ingresa un correo electronico valido').optional(),
  role: z.enum(['ADMIN', 'RECEPTIONIST', 'HOUSEKEEPING']).optional(),
  profile: z
    .object({
      firstName: z.string().min(1, 'El nombre es requerido').optional(),
      lastName: z.string().min(1, 'El apellido es requerido').optional(),
      phone: z.string().optional(),
    })
    .optional(),
});

export type CreateUserFormData = z.infer<typeof createUserSchema>;
export type UpdateUserFormData = z.infer<typeof updateUserSchema>;
