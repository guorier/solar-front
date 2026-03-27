// src/app/login/signup/page.tsx
import { Suspense } from 'react';
import SignUpPageClient from './SignUpPageClient';

export default function Page() {
  return (
    <Suspense fallback={null}>
      <SignUpPageClient />
    </Suspense>
  );
}