import { Suspense } from 'react';
import MenuTransferPageClient from './MenuTransferPageClient';  //빌드떄문에 임시작업

export default function Page() {
  return (
    <Suspense fallback={null}>
      <MenuTransferPageClient />
    </Suspense>
  );
}