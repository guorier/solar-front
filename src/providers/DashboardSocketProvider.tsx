// src/providers/DashboardSocketProvider.tsx
'use client';

import { ReactNode, useMemo, useEffect, useState, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { useGetPlantBaseCombo } from '@/services/plants/query';
import { useDashboardSocket } from '@/hooks/useDashboardSocket';
import { usePowerTrendSocket } from '@/hooks/usePowerTrendSocket';
import { useDashboardChartSocket } from '@/hooks/useDashboardChartSocket';
import { useOperationChartSocket } from '@/hooks/useOperationChartSocket';
import { DashboardSocketContext } from './DashboardSocketContext';
import type {
  DashboardChartItem,
  PowerTrendChartItem,
  PowerTrendListItem,
} from './DashboardSocketContext';

const toNumber = (value: unknown): number | undefined => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
};

const CHART_HISTORY_LIMIT = 48;

const toChartItems = (payload: unknown, expectedPwplId: string): DashboardChartItem[] => {
  const source = Array.isArray(payload)
    ? payload
    : payload && typeof payload === 'object'
      ? ((payload as { data?: unknown; items?: unknown; chart?: unknown; list?: unknown }).data ??
        (payload as { data?: unknown; items?: unknown; chart?: unknown; list?: unknown }).items ??
        (payload as { data?: unknown; items?: unknown; chart?: unknown; list?: unknown }).chart ??
        (payload as { data?: unknown; items?: unknown; chart?: unknown; list?: unknown }).list ??
        payload)
      : [];

  if (!Array.isArray(source)) {
    return [];
  }

  const items = source
    .map((item) => {
      if (!item || typeof item !== 'object') {
        return null;
      }

      const row = item as Record<string, unknown>;
      const rowPwplId =
        (typeof row.targetPwplId === 'string' && row.targetPwplId) ||
        (typeof row.pwplId === 'string' && row.pwplId) ||
        expectedPwplId;

      if (rowPwplId !== expectedPwplId) {
        return null;
      }

      const label =
        (typeof row.label === 'string' && row.label) ||
        (typeof row.time === 'string' && row.time) ||
        (typeof row.timeStampStr === 'string' && row.timeStampStr) ||
        (typeof row.timeStamp === 'string' && row.timeStamp) ||
        (typeof row.occurredAt === 'string' && row.occurredAt) ||
        '';
      const value =
        toNumber(row.value) ??
        toNumber(row.currentPowerKw) ??
        toNumber(row.powerKw) ??
        (typeof row.gridPowerW === 'number' ? row.gridPowerW / 1000 : undefined);

      if (!label || value === undefined) {
        return null;
      }

      return {
        label,
        value,
        timestamp:
          (typeof row.timeStampStr === 'string' && row.timeStampStr) ||
          (typeof row.timeStamp === 'string' && row.timeStamp) ||
          (typeof row.occurredAt === 'string' && row.occurredAt) ||
          label,
      };
    })
    .filter((item): item is NonNullable<typeof item> => item !== null);

  const aggregatedMap = new Map<string, DashboardChartItem>();

  items.forEach((item) => {
    const key = `${expectedPwplId}__${item.timestamp ?? item.label}`;
    const existing = aggregatedMap.get(key);

    if (existing) {
      aggregatedMap.set(key, {
        ...existing,
        value: existing.value + item.value,
      });
      return;
    }

    aggregatedMap.set(key, item);
  });

  return Array.from(aggregatedMap.values()).sort((a, b) =>
    String(a.timestamp ?? a.label).localeCompare(String(b.timestamp ?? b.label)),
  );
};

const mergeChartItems = (
  previousItems: DashboardChartItem[],
  nextItems: DashboardChartItem[],
): DashboardChartItem[] => {
  const mergedMap = new Map<string, DashboardChartItem>();

  previousItems.forEach((item) => {
    mergedMap.set(String(item.timestamp ?? item.label), item);
  });

  nextItems.forEach((item) => {
    mergedMap.set(String(item.timestamp ?? item.label), item);
  });

  return Array.from(mergedMap.values())
    .sort((a, b) => String(a.timestamp ?? a.label).localeCompare(String(b.timestamp ?? b.label)))
    .slice(-CHART_HISTORY_LIMIT);
};

export function DashboardSocketProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { data: plantCombo } = useGetPlantBaseCombo();

  const shouldUseRealtimeSocket = true;
  const shouldUsePowerTrendSocket = pathname.startsWith('/monitoring/power');
  const shouldUseDashboardChartSocket = pathname === '/';
  const shouldUseOperationChartSocket = pathname.startsWith('/monitoring/operation');

  const allPwplIds = useMemo(() => {
    return (
      plantCombo
        ?.map((plant) => plant.pwplId)
        .filter((pwplId): pwplId is string => Boolean(pwplId)) ?? []
    );
  }, [plantCombo]);

  const realtimeTargets = useMemo(
    () =>
      plantCombo?.map((plant) => ({
        pwplId: plant.pwplId,
        macAddr: plant.macAddr,
      })) ?? [],
    [plantCombo],
  );

  const { socketStatusMap: realtimeData, pwplAggMap: pwplAggSummaryMap } = useDashboardSocket(
    shouldUseRealtimeSocket ? realtimeTargets : [],
  );

  const [powerTrendListData, setPowerTrendListData] = useState<PowerTrendListItem[]>([]);
  const [powerTrendChartData, setPowerTrendChartData] = useState<PowerTrendChartItem[]>([]);
  const [dashboardChartDataMap, setDashboardChartDataMap] = useState<
    Record<string, DashboardChartItem[]>
  >({});

  const handlePowerTrendChartMessage = useCallback((json: unknown) => {
    setPowerTrendChartData(Array.isArray(json) ? json : [json]);
  }, []);

  const handlePowerTrendListMessage = useCallback((json: unknown) => {
    setPowerTrendListData(Array.isArray(json) ? json : [json]);
  }, []);

  const handleDashboardChartMessage = useCallback((pwplId: string, json: unknown) => {
    const nextItems = toChartItems(json, pwplId);

    setDashboardChartDataMap((prev) => ({
      ...prev,
      [pwplId]: mergeChartItems(prev[pwplId] ?? [], nextItems),
    }));
  }, []);

  usePowerTrendSocket({
    pwplIds: shouldUsePowerTrendSocket ? allPwplIds : [],
    onChartMessage: handlePowerTrendChartMessage,
    onListMessage: handlePowerTrendListMessage,
  });

  useDashboardChartSocket({
    pwplIds: shouldUseDashboardChartSocket ? allPwplIds : [],
    onMessage: handleDashboardChartMessage,
  });

  const [operationPwplId, setOperationPwplId] = useState('');

  useEffect(() => {
    if (!shouldUseOperationChartSocket) {
      setOperationPwplId('');
      return;
    }
    try {
      const raw = localStorage.getItem('pwplIds');
      if (!raw) return;
      const parsed = JSON.parse(raw) as string[] | Array<{ pwplId: string }>;
      if (!Array.isArray(parsed) || parsed.length === 0) return;
      const first = parsed[0];
      setOperationPwplId(typeof first === 'string' ? first : (first.pwplId ?? ''));
    } catch {
      // ignore
    }
  }, [shouldUseOperationChartSocket]);

  const operationChartDataMap = useOperationChartSocket({
    pwplIds: shouldUseOperationChartSocket && operationPwplId ? [operationPwplId] : [],
  });

  // useEffect(() => {
  //   console.log('[대시보드 소켓] 실시간 상태 맵', realtimeData);
  // }, [realtimeData]);

  return (
    <DashboardSocketContext.Provider
      value={{
        realtimeData,
        pwplAggSummaryMap,
        powerTrendListData,
        powerTrendChartData,
        dashboardChartDataMap,
        operationChartDataMap,
      }}
    >
      {children}
    </DashboardSocketContext.Provider>
  );
}
