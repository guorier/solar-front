// src/app/login/signup-agree/term/page.tsx
import { Suspense } from 'react';
import TermPageClient from './TermPageClient';

export default function Page() {
  return (
    <Suspense fallback={null}>
      <TermPageClient />
    </Suspense>
  );
}