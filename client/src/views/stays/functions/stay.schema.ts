import { z } from 'zod';

export const staySchema = z.object({
  guestId: z.string().min(1, 'El huésped es requerido'),
  roomId: z.string().min(1, 'La habitación es requerida'),
  stayMode: z.enum(['HOURLY', 'OVERNIGHT', 'PACKAGE']),
  rateRuleId: z.string().optional(),
  packageId: z.string().optional(),
  checkIn: z.string().min(1, 'La fecha de check-in es requerida'),
  checkOut: z.string().min(1, 'La fecha de check-out es requerida'),
  reservationId: z.string().optional(),
});

export type StayFormData = z.infer<typeof staySchema>;
