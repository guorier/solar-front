// src/app/info/[id]/page.tsx
'use client';

import { use } from 'react';
import StrctForm from '@/constants/eqpmnt/strct/StrctForm';

export default function InfoDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  return <StrctForm eqpmntId={id} initialMode="edit" />;
}
