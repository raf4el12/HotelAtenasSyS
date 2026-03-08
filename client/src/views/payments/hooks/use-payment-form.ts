import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { paymentSchema, type PaymentFormData } from '../functions/payment.schema';

export function usePaymentForm() {
  return useForm<PaymentFormData>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      amount: 0,
      method: 'CASH',
      type: 'STAY_PAYMENT',
      stayId: '',
      reservationId: '',
      notes: '',
      referenceCode: '',
    },
  });
}
