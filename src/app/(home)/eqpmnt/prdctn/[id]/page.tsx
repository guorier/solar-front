// src/app/info/[id]/page.tsx
'use client';

import { use } from 'react';
import PrdctnForm from '@/constants/eqpmnt/prdctn/PrdctnForm';

export default function InfoDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  return <PrdctnForm eqpmntId={id} initialMode="edit" />;
}
