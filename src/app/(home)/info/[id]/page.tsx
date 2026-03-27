// src/app/info/[id]/page.tsx
'use client';

import { use } from 'react';
import PlantForm from '@/constants/plants/PlantForm';

export default function InfoDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  return <PlantForm pwplId={id} initialMode="edit" />;
}