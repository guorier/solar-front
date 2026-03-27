// src/app/info/[id]/page.tsx
'use client';

import { use } from 'react';
import EngyForm from '@/constants/eqpmnt/engy/EngyForm';

export default function InfoDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  return <EngyForm eqpmntId={id} initialMode="edit" />;
}
