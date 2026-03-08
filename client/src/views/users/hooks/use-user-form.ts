import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  createUserSchema,
  updateUserSchema,
  type CreateUserFormData,
  type UpdateUserFormData,
} from '../functions/user.schema';
import type { User } from '../types';

export function useUserCreateForm() {
  return useForm<CreateUserFormData>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      email: '',
      password: '',
      role: 'RECEPTIONIST',
      profile: {
        firstName: '',
        lastName: '',
        dni: '',
        phone: '',
        shift: '',
      },
    },
  });
}

export function useUserEditForm(user?: User) {
  return useForm<UpdateUserFormData>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      email: user?.email ?? '',
      role: user?.role ?? 'RECEPTIONIST',
      profile: {
        firstName: user?.profile?.firstName ?? '',
        lastName: user?.profile?.lastName ?? '',
        phone: user?.profile?.phone ?? '',
      },
    },
  });
}
