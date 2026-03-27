// src/providers/DashboardSocketProvider.tsx
'use client';

import { ReactNode, useMemo, useEffect } from 'react';
import { useGetPlantBaseCombo } from '@/services/plants/query';
import { useDashboardSocket } from '@/hooks/useDashboardSocket';
import { DashboardSocketContext } from './DashboardSocketContext';

const normalizeMac = (value: string | null | undefined) =>
  String(value ?? '')
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '');

export function DashboardSocketProvider({ children }: { children: ReactNode }) {
  const { data: plantCombo } = useGetPlantBaseCombo();

  const allMacAddrList = useMemo(() => {
    return (
      plantCombo
        ?.map((plant) => plant.macAddr)
        .filter((macAddr): macAddr is string => Boolean(macAddr)) ?? []
    );
  }, [plantCombo]);

  const socketStatusMap = useDashboardSocket(allMacAddrList);

  useEffect(() => {
    console.log('[대시보드 소켓] 전체 MAC 주소 목록', allMacAddrList);
  }, [allMacAddrList]);

  useEffect(() => {
    console.log('[대시보드 소켓] 실시간 상태 맵', socketStatusMap);
  }, [socketStatusMap]);

  useEffect(() => {
    const normalizedMap = Object.entries(socketStatusMap ?? {}).reduce<Record<string, unknown>>(
      (acc, [key, value]) => {
        acc[normalizeMac(key)] = value;
        return acc;
      },
      {},
    );

    console.log('[대시보드 소켓] 정규화된 실시간 상태 맵', normalizedMap);
  }, [socketStatusMap]);

  return (
    <DashboardSocketContext.Provider value={socketStatusMap}>
      {children}
    </DashboardSocketContext.Provider>
  );
}
