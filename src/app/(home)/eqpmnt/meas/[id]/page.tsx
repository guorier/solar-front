// src/app/info/[id]/page.tsx
'use client';

import { use } from 'react';
import MeasForm from '@/constants/eqpmnt/meas/MeasForm';

export default function InfoDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  return <MeasForm eqpmntId={id} initialMode="edit" />;
}
