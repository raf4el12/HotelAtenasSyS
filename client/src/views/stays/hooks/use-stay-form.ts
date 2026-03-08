import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { staySchema, type StayFormData } from '../functions/stay.schema';

export function useStayForm() {
  return useForm<StayFormData>({
    resolver: zodResolver(staySchema),
    defaultValues: {
      guestId: '',
      roomId: '',
      stayMode: 'OVERNIGHT',
      rateRuleId: '',
      packageId: '',
      checkIn: '',
      checkOut: '',
      reservationId: '',
    },
  });
}
