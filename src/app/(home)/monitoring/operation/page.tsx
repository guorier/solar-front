// src/app/monitoring/operation/page.tsx
'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import OperationMonitor from '@/constants/monitoring/operation/OperationMonitor';

type StoredPlantItem = {
  pwplId: string;
  macAddr?: string;
};

const getStoredPwplIds = (value: string | null): string[] => {
  if (!value) {
    return [];
  }

  try {
    const parsed = JSON.parse(value) as Array<string | StoredPlantItem>;

    if (!Array.isArray(parsed) || parsed.length === 0) {
      return [];
    }

    if (typeof parsed[0] === 'string') {
      return parsed.filter((item): item is string => typeof item === 'string');
    }

    return parsed
      .map((item) => (item && typeof item === 'object' ? item.pwplId : ''))
      .filter(Boolean);
  } catch (error) {
    console.error(error);
    return [];
  }
};

export default function MonitoringPage() {
  const router = useRouter();
  const [pwplIds, setPwplIds] = useState<string[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('pwplIds');
    const ids = getStoredPwplIds(stored);

    if (ids.length !== 1) {
      alert('발전소를 1개만 선택해야 합니다.\n발전소를 선택해 주세요.');
      router.replace('/');
      return;
    }

    setPwplIds(ids);
  }, [router]);

  return (
    <Suspense fallback={null}>
      <OperationMonitor pwplIds={pwplIds} />
    </Suspense>
  );
}
