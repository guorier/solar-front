'use client';

import { createContext, useContext } from 'react';
import type { useDashboardSocket } from '@/hooks/useDashboardSocket';

type DashboardSocketMap = ReturnType<typeof useDashboardSocket>;

export type PowerTrendListItem = {
  deviceAddresses?: number | string;
  equipmentType?: string;
  gridPowerW?: number;
  fluctuate?: number;
  targetPwplId?: string;
  fluctuateRate?: number;
  timeStampStr?: string;
  alrmCode?: string;
  formattedEfficiency?: number | string;
  prevGridPowerW?: number;
  dailyTotalPowerW?: number;
  pwplNm?: string;
  irradianceWm2?: number;
  temperatureC?: number;
};

export type PowerTrendChartItem = {
  gridPowerW?: number;
  fluctuate?: number;
  targetPwplId?: string;
  timeStampStr?: string;
  pwplNm?: string;
};

type DashboardSocketContextType = {
  // 현황 모니터링 (실시간 인버터 상태)
  realtimeData: DashboardSocketMap;
  // 추이 목록 (최신 발전 데이터)
  powerTrendListData: PowerTrendListItem[];
  // 추이 차트 (차트용 데이터 - 시계열 발전량)
  powerTrendChartData: PowerTrendChartItem[];
};

export const DashboardSocketContext = createContext<DashboardSocketContextType>({
  realtimeData: {},
  powerTrendListData: [],
  powerTrendChartData: [],
});

export function useDashboardSocketContext() {
  return useContext(DashboardSocketContext);
}
