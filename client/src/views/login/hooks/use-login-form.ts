'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/redux-store/hooks';
import { loginThunk } from '@/redux-store/thunks/auth.thunks';
import { selectIsLoading, selectAuthError, clearError } from '@/redux-store/slices/auth';
import { loginSchema, type LoginFormValues } from '../functions/login.schema';
import { toast } from 'sonner';

export function useLoginForm() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const isLoading = useAppSelector(selectIsLoading);
  const authError = useAppSelector(selectAuthError);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  useEffect(() => {
    if (authError) {
      toast.error(authError);
      dispatch(clearError());
    }
  }, [authError, dispatch]);

  async function onSubmit(values: LoginFormValues) {
    try {
      await dispatch(loginThunk(values)).unwrap();
      toast.success('Sesion iniciada correctamente');
      router.push('/dashboard');
    } catch {
      // Error handled via authError selector
    }
  }

  return {
    form,
    isLoading,
    onSubmit: form.handleSubmit(onSubmit),
  };
}
