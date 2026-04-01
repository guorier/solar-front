'use client';

import { createContext, useContext } from 'react';
import type { useDashboardSocket } from '@/hooks/useDashboardSocket';
import type { OperationChartSocketItem } from '@/constants/monitoring/operation/utils/types';

type DashboardSocketMap = ReturnType<typeof useDashboardSocket>;

export type { PlantAggSummary } from '@/hooks/useDashboardSocket';

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
  realtimeData: DashboardSocketMap['socketStatusMap'];
  pwplAggSummaryMap: DashboardSocketMap['pwplAggMap'];
  powerTrendListData: PowerTrendListItem[];
  powerTrendChartData: PowerTrendChartItem[];
  dashboardChartDataMap: Record<string, DashboardChartItem[]>;
  operationChartDataMap: Record<string, OperationChartSocketItem[]>;
  setOperationPwplId: (id: string) => void;
};

export const DashboardSocketContext = createContext<DashboardSocketContextType>({
  realtimeData: {},
  pwplAggSummaryMap: {},
  powerTrendListData: [],
  powerTrendChartData: [],
  dashboardChartDataMap: {},
  operationChartDataMap: {},
  setOperationPwplId: () => {},
});

export function useDashboardSocketContext() {
  return useContext(DashboardSocketContext);
}
