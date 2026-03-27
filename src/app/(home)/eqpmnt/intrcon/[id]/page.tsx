// src/app/info/[id]/page.tsx
'use client';

import { use } from 'react';
import IntrconForm from '@/constants/eqpmnt/intrcon/IntrconForm';

export default function InfoDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  return <IntrconForm eqpmntId={id} initialMode="edit" />;
}
