import { z } from 'zod';

export const paymentSchema = z.object({
  amount: z.number().min(0.01, 'El monto debe ser mayor a 0'),
  method: z.enum(['CASH', 'YAPE', 'PLIN', 'TRANSFER', 'CARD']),
  type: z.enum(['STAY_PAYMENT', 'RESERVATION_DEPOSIT', 'POS_SALE', 'ROOM_CHARGE', 'ROOM_CHARGE_SETTLE']),
  stayId: z.string().optional(),
  reservationId: z.string().optional(),
  notes: z.string().optional(),
  referenceCode: z.string().optional(),
});

export type PaymentFormData = z.infer<typeof paymentSchema>;

export const voidSchema = z.object({
  reason: z.string().min(1, 'El motivo es requerido'),
});

export type VoidFormData = z.infer<typeof voidSchema>;
