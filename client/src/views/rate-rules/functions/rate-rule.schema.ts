import { z } from 'zod';

export const rateRuleSchema = z.object({
  name: z.string().min(1, 'El nombre de la tarifa es requerido'),
  description: z.string().optional(),
  stayMode: z.enum(['HOURLY', 'OVERNIGHT', 'PACKAGE'], {
    required_error: 'El modo de estancia es requerido',
  }),
  category: z.enum(['NORMAL', 'PREMIUM'], {
    required_error: 'La categoria es requerida',
  }),
  price: z
    .number({ invalid_type_error: 'El precio debe ser un valor numerico' })
    .min(0, 'El precio debe ser mayor o igual a 0'),
  durationMin: z
    .number({ invalid_type_error: 'La duracion minima debe ser un valor numerico' })
    .int()
    .min(0)
    .optional(),
  priority: z
    .number({ invalid_type_error: 'La prioridad debe ser un valor numerico' })
    .int()
    .min(0)
    .optional(),
  validFrom: z.string().optional(),
  validTo: z.string().optional(),
});

export type RateRuleFormData = z.infer<typeof rateRuleSchema>;
