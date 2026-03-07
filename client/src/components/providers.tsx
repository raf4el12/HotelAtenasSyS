'use client';

import { QueryProvider } from './query-provider';
import { StoreProvider } from '@/redux-store/store-provider';
import { SessionValidator } from './session-validator';
import { Toaster } from '@/components/ui/sonner';

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <QueryProvider>
      <StoreProvider>
        <SessionValidator>
          {children}
          <Toaster />
        </SessionValidator>
      </StoreProvider>
    </QueryProvider>
  );
}
