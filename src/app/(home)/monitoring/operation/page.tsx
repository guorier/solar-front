// src/app/monitoring/operation/page.tsx
'use client';

import { Suspense, useEffect, useState } from 'react';
// import MonitoringClient from './MonitoringClient';
import OperationMonitor from '@/constants/monitoring/operation/OperationMonitor';

export default function MonitoringPage() {
  const [pwplIds, setPwplIds] = useState<string[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('pwplIds');

    if (stored) {
      try {
        const ids = JSON.parse(stored) as string[];
        setPwplIds(ids);
      } catch (error) {
        console.error(error);
      }
    }
  }, []);

  // useEffect(() => {
  //   console.log('operation storage', localStorage.getItem('pwplIds'));
  //   console.log('operation state', pwplIds);
  // }, [pwplIds]);

  return (
    <Suspense fallback={null}>
      <OperationMonitor pwplIds={pwplIds} />
    </Suspense>
  );
}