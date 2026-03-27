// src/app/info/[id]/page.tsx
'use client';

import { use } from 'react';
import SafetyForm from '@/constants/eqpmnt/safety/SafetyForm';

export default function InfoDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  return <SafetyForm eqpmntId={id} initialMode="edit" />;
}
