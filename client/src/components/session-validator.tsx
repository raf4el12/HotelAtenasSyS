'use client';

import { useSessionValidator } from '@/hooks/use-session-validator';

export function SessionValidator({ children }: { children: React.ReactNode }) {
  useSessionValidator();
  return <>{children}</>;
}
