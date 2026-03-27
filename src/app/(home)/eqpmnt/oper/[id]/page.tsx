// src/app/info/[id]/page.tsx
'use client';

import { use } from 'react';
import OperForm from '@/constants/eqpmnt/oper/OperForm';

export default function InfoDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  return <OperForm eqpmntId={id} initialMode="edit" />;
}
