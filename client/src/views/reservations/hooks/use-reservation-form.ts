import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { reservationSchema, type ReservationFormData } from '../functions/reservation.schema';
import type { Reservation } from '../types';

export function useReservationForm(reservation?: Reservation) {
  return useForm<ReservationFormData>({
    resolver: zodResolver(reservationSchema),
    defaultValues: {
      guestId: reservation?.guestId ?? '',
      roomId: reservation?.roomId ?? '',
      stayMode: reservation?.stayMode ?? 'OVERNIGHT',
      scheduledCheckIn: reservation?.scheduledCheckIn
        ? new Date(reservation.scheduledCheckIn).toISOString().slice(0, 16)
        : '',
      scheduledCheckOut: reservation?.scheduledCheckOut
        ? new Date(reservation.scheduledCheckOut).toISOString().slice(0, 16)
        : '',
      estimatedPrice: reservation?.estimatedPrice ?? 0,
      notes: reservation?.notes ?? '',
    },
  });
}
