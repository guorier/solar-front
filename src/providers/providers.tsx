// src/providers/providers.tsx

'use client';

import ReactQueryProvider from './react-query.provider';
import SessionProviders from './session.provider';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
      <SessionProviders>
        <ReactQueryProvider>{children}</ReactQueryProvider>
      </SessionProviders>
  );
}