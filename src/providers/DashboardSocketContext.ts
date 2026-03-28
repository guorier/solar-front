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

export type DashboardChartItem = {
  label: string;
  value: number;
  timestamp?: string;
};

type DashboardSocketContextType = {
  realtimeData: DashboardSocketMap;
  powerTrendListData: PowerTrendListItem[];
  powerTrendChartData: PowerTrendChartItem[];
  dashboardChartDataMap: Record<string, DashboardChartItem[]>;
};

export const DashboardSocketContext = createContext<DashboardSocketContextType>({
  realtimeData: {},
  powerTrendListData: [],
  powerTrendChartData: [],
  dashboardChartDataMap: {},
});

export function useDashboardSocketContext() {
  return useContext(DashboardSocketContext);
}
