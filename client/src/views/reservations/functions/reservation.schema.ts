import { z } from 'zod';

export const reservationSchema = z.object({
  guestId: z.string().min(1, 'El huésped es requerido'),
  roomId: z.string().min(1, 'La habitación es requerida'),
  stayMode: z.enum(['HOURLY', 'OVERNIGHT', 'PACKAGE']),
  scheduledCheckIn: z.string().min(1, 'La fecha de check-in es requerida'),
  scheduledCheckOut: z.string().min(1, 'La fecha de check-out es requerida'),
  estimatedPrice: z.number().min(0, 'El precio debe ser mayor o igual a 0'),
  notes: z.string().optional(),
});

export type ReservationFormData = z.infer<typeof reservationSchema>;
