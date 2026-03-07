import { z } from 'zod';

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'El correo es requerido')
    .email('Ingresa un correo electronico valido'),
  password: z
    .string()
    .min(1, 'La contrasena es requerida')
    .min(6, 'La contrasena debe tener al menos 6 caracteres'),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
