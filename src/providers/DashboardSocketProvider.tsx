// src/providers/DashboardSocketProvider.tsx
'use client';

import { ReactNode, useMemo, useEffect, useState, useCallback } from 'react';
import { useGetPlantBaseCombo } from '@/services/plants/query';
import { useDashboardSocket } from '@/hooks/useDashboardSocket';
import { usePowerTrendSocket } from '@/hooks/usePowerTrendSocket';
import { DashboardSocketContext } from './DashboardSocketContext';
import type { PowerTrendChartItem, PowerTrendListItem } from './DashboardSocketContext';

const normalizeMac = (value: string | null | undefined) =>
  String(value ?? '')
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '');

export function DashboardSocketProvider({ children }: { children: ReactNode }) {
  const { data: plantCombo } = useGetPlantBaseCombo();

  // 환경변수 확인
  useEffect(() => {
    console.log('🔍 환경 변수 확인:', {
      NEXT_PUBLIC_WS_SOLAR: process.env.NEXT_PUBLIC_WS_SOLAR,
      NEXT_PUBLIC_WS_SOLAR_CHART_TOPIC: process.env.NEXT_PUBLIC_WS_SOLAR_CHART_TOPIC,
      NEXT_PUBLIC_WS_SOLAR_LIST_TOPIC: process.env.NEXT_PUBLIC_WS_SOLAR_LIST_TOPIC,
    });
  }, []);

  // 모든 발전소의 MAC 주소 리스트
  const allMacAddrList = useMemo(() => {
    return (
      plantCombo
        ?.map((plant) => plant.macAddr)
        .filter((macAddr): macAddr is string => Boolean(macAddr)) ?? []
    );
  }, [plantCombo]);

  // 모든 발전소의 ID 리스트
  const allPwplIds = useMemo(() => {
    return (
      plantCombo
        ?.map((plant) => plant.pwplId)
        .filter((pwplId): pwplId is string => Boolean(pwplId)) ?? []
    );
  }, [plantCombo]);

  // 현황 모니터링 (실시간 인버터 상태)
  const realtimeData = useDashboardSocket(allMacAddrList);

  // 추이 목록 및 차트 데이터
  const [powerTrendListData, setPowerTrendListData] = useState<PowerTrendListItem[]>([]);
  const [powerTrendChartData, setPowerTrendChartData] = useState<PowerTrendChartItem[]>([]);

  const handlePowerTrendChartMessage = useCallback((json: unknown) => {
    console.log('📊 [프로바이더] 추이 차트 데이터 수신:', json);
    setPowerTrendChartData(Array.isArray(json) ? json : [json]);
  }, []);

  const handlePowerTrendListMessage = useCallback((json: unknown) => {
    console.log('📋 [프로바이더] 추이 목록 데이터 수신:', json);
    setPowerTrendListData(Array.isArray(json) ? json : [json]);
  }, []);

  // 추이 데이터 웹소켓 구독
  usePowerTrendSocket({
    pwplIds: allPwplIds,
    onChartMessage: handlePowerTrendChartMessage,
    onListMessage: handlePowerTrendListMessage,
  });

  useEffect(() => {
    console.log('[대시보드 소켓] 전체 MAC 주소 목록', allMacAddrList);
  }, [allMacAddrList]);

  useEffect(() => {
    console.log('[대시보드 소켓] 전체 발전소 ID 목록', allPwplIds);
  }, [allPwplIds]);

  useEffect(() => {
    console.log('[대시보드 소켓] 실시간 상태 맵', realtimeData);
  }, [realtimeData]);

  useEffect(() => {
    console.log('[대시보드 소켓] 추이 목록 데이터', powerTrendListData);
  }, [powerTrendListData]);

  useEffect(() => {
    const normalizedMap = Object.entries(realtimeData ?? {}).reduce<Record<string, unknown>>(
      (acc, [key, value]) => {
        acc[normalizeMac(key)] = value;
        return acc;
      },
      {},
    );

    console.log('[대시보드 소켓] 정규화된 실시간 상태 맵', normalizedMap);
  }, [realtimeData]);

  return (
    <DashboardSocketContext.Provider
      value={{
        realtimeData,
        powerTrendListData,
        powerTrendChartData,
      }}
    >
      {children}
    </DashboardSocketContext.Provider>
  );
}
