import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { guestSchema, type GuestFormData } from '../functions/guest.schema';
import type { Guest } from '../types';

export function useGuestForm(guest?: Guest) {
  return useForm<GuestFormData>({
    resolver: zodResolver(guestSchema),
    defaultValues: {
      dni: guest?.dni ?? '',
      firstName: guest?.firstName ?? '',
      lastName: guest?.lastName ?? '',
      phone: guest?.phone ?? '',
      email: guest?.email ?? '',
    },
  });
}
