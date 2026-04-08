// src/providers/providers.tsx

'use client';

import { SSRProvider } from '@react-aria/ssr';
import ReactQueryProvider from './react-query.provider';
import SessionProviders from './session.provider';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SSRProvider>
      <SessionProviders>
        <ReactQueryProvider>{children}</ReactQueryProvider>
      </SessionProviders>
    </SSRProvider>
  );
}