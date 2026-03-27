import { Suspense } from 'react';
import MenuAuthorityPageClient from './MenuAuthorityPageClient'; //임시작업

export default function Page() {
  return (
    <Suspense fallback={null}>
      <MenuAuthorityPageClient />
    </Suspense>
  );
}