import { createAsyncThunk } from '@reduxjs/toolkit';
import { authService } from '@/services/auth.service';
import { getDeviceId } from '@/utils/device-id';
import type { LoginRequest, AuthResponse } from '@/types/auth.types';
import type { AxiosError } from 'axios';
import type { ApiErrorResponse } from '@/types/auth.types';

export const loginThunk = createAsyncThunk<
  AuthResponse,
  Omit<LoginRequest, 'deviceId'>,
  { rejectValue: string }
>('auth/login', async (credentials, { rejectWithValue }) => {
  try {
    const deviceId = getDeviceId();
    const response = await authService.login({ ...credentials, deviceId });
    return response;
  } catch (error) {
    const axiosError = error as AxiosError<ApiErrorResponse>;
    const message = axiosError.response?.data?.message;
    if (Array.isArray(message)) {
      return rejectWithValue(message.join(', '));
    }
    return rejectWithValue(message ?? 'Error al iniciar sesión');
  }
});

export const logoutThunk = createAsyncThunk<void, void, { rejectValue: string }>(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      const deviceId = getDeviceId();
      await authService.logout({ deviceId });
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      const message = axiosError.response?.data?.message;
      if (Array.isArray(message)) {
        return rejectWithValue(message.join(', '));
      }
      return rejectWithValue(message ?? 'Error al cerrar sesión');
    }
  },
);
