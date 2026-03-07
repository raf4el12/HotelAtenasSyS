'use client';

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux-store/hooks';
import { selectIsAuthenticated, clearAuth } from '@/redux-store/slices/auth';

export function useSessionValidator() {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  useEffect(() => {
    if (!isAuthenticated) return;

    const cookies = document.cookie.split(';').map((c) => c.trim());
    const hasAccessToken = cookies.some((c) => c.startsWith('accessToken='));

    if (!hasAccessToken) {
      dispatch(clearAuth());
    }
  }, [isAuthenticated, dispatch]);
}
