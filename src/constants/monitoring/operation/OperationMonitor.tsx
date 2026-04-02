// src\constants\monitoring\operation\OperationMonitor.tsx
'use client';

import { TitleComponent } from '@/components';
import { useState, useEffect, useMemo } from 'react';
import type { MonitorWeatherRes } from '@/services/monitoring/weather/type';
import { useGetMonitorWeather } from '@/services/monitoring/weather/query';
import type { BarChartData } from '@/components/monitoring/monitoring-barchart.component';
import { useSearchParams } from 'next/navigation';
import { useDashboardSocketContext } from '@/providers/DashboardSocketContext';
import { useGetPlantBaseCombo } from '@/services/plants/query';

import { TopDashboardSection } from './components/TopPanel';
import { SidePieChartGroup } from './components/PieCharts';
import { safeToFixed } from './utils/utils';
import {
  aggregateRealtimeData,
  buildRealtimeMapFromSocketStatus,
  buildOperationSocketInverterMap,
  buildSelectedInverterMap,
  normalizeMac,
  normalizeSocketStatusMap,
  readSocketCacheMap,
  writeSocketCacheMap,
  mergeSocketStatusMapWithCache,
} from './utils/socketUtils';
import { getRestoredSelection } from './utils/selectionUtils';
import {
  buildFrequencyChartData,
  buildIrradianceChartData,
  buildPowerFactorChartData,
  buildTemperatureChartData,
  buildTodayPowerChartData,
  buildVoltageChartData,
} from './utils/chartInverterMap';
import type { DashboardSocketPlantStatus, GenTableItem, MonitoringOpProps } from './utils/types';

/* =========================
 * 메인 컴포넌트
 * ========================= */
export default function MonitoringOp({ pwplIds: initialPwplIds }: MonitoringOpProps) {
  const searchParams = useSearchParams();
  const { realtimeData: socketStatusMap, operationChartDataMap } = useDashboardSocketContext();

  /* =========================
   * 상태값 — SSR 안전한 초기값 (모두 빈값)
   * ========================= */
  const { data: plantCombo } = useGetPlantBaseCombo();

  const [pwplIds, setPwplIds] = useState<string[]>(initialPwplIds);
  const [selectedPlantNames, setSelectedPlantNames] = useState<string[]>([]);
  const [selectedMacAddrs, setSelectedMacAddrs] = useState<string[]>([]);
  const [cachedSocketStatusMap, setCachedSocketStatusMap] = useState<
    Record<string, DashboardSocketPlantStatus>
  >({});

  const [, setGenTableState] = useState<GenTableItem[]>([]);
  const [, setChartDataState] = useState<BarChartData[]>([]);
  const [isSocketReady, setIsSocketReady] = useState(false);
  const [lastRefreshedAt, setLastRefreshedAt] = useState<Date | null>(null);

  /* =========================
   * 마운트 후 localStorage 복원 (클라이언트 전용)
   * ========================= */
  useEffect(() => {
    const restored = getRestoredSelection(searchParams, initialPwplIds);
    setPwplIds(restored.pwplIds);
    setSelectedPlantNames(restored.plantNames);
    setSelectedMacAddrs(restored.macAddrs);

    const cacheMap = readSocketCacheMap();
    const filteredCacheMap = restored.macAddrs.reduce<Record<string, DashboardSocketPlantStatus>>(
      (acc, macAddr) => {
        const normalizedMacAddr = normalizeMac(macAddr);
        const cachedItem = cacheMap[normalizedMacAddr];
        if (cachedItem) {
          acc[normalizedMacAddr] = cachedItem;
        }
        return acc;
      },
      {},
    );
    setCachedSocketStatusMap(filteredCacheMap);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  /* =========================
   * 파생값
   * ========================= */
  const selectedPlantNameText = useMemo(() => {
    if (selectedPlantNames.length === 0) return '선택된 발전소 없음';
    if (selectedPlantNames.length === 1) return selectedPlantNames[0];
    return selectedPlantNames.join(', ');
  }, [selectedPlantNames]);

  // selectedMacAddrs가 비어있으면 plantCombo에서 pwplIds 기준으로 MAC 자동 파생
  const effectiveMacAddrs = useMemo(() => {
    if (selectedMacAddrs.length > 0) return selectedMacAddrs;
    if (!plantCombo || pwplIds.length === 0) return [];
    return pwplIds
      .map((id) => {
        const plant = plantCombo.find((p) => p.pwplId === id);
        return plant?.macAddr ? normalizeMac(plant.macAddr) : '';
      })
      .filter(Boolean);
  }, [selectedMacAddrs, plantCombo, pwplIds]);

  const weatherPwplId = useMemo(() => pwplIds[0] ?? '', [pwplIds]);
  const pwplIdsKey = useMemo(() => pwplIds.join(','), [pwplIds]);
  const selectedMacKey = useMemo(() => effectiveMacAddrs.join(','), [effectiveMacAddrs]);

  const { data: weatherData } = useGetMonitorWeather(
    { pwplId: weatherPwplId },
    Boolean(weatherPwplId),
  );

  /* =========================
   * 선택 MAC 기준 캐시 재조회
   * ========================= */
  useEffect(() => {
    if (effectiveMacAddrs.length === 0) {
      setCachedSocketStatusMap({});
      return;
    }

    const nextCacheMap = readSocketCacheMap();
    const filteredCacheMap = effectiveMacAddrs.reduce<Record<string, DashboardSocketPlantStatus>>(
      (acc, macAddr) => {
        const normalizedMacAddr = normalizeMac(macAddr);
        const cachedItem = nextCacheMap[normalizedMacAddr];
        if (cachedItem) {
          acc[normalizedMacAddr] = cachedItem;
        }
        return acc;
      },
      {},
    );
    setCachedSocketStatusMap(filteredCacheMap);
  }, [selectedMacKey, effectiveMacAddrs]);

  /* =========================
   * 실시간 소켓값 캐시 반영
   * ========================= */
  useEffect(() => {
    if (effectiveMacAddrs.length === 0) return;

    const normalizedLiveMap = normalizeSocketStatusMap(socketStatusMap);
    const hasSelectedLiveData = effectiveMacAddrs.some((macAddr) =>
      Boolean(normalizedLiveMap[normalizeMac(macAddr)]),
    );

    if (!hasSelectedLiveData) return;

    const currentCacheMap = readSocketCacheMap();
    const nextCacheMap = { ...currentCacheMap };

    effectiveMacAddrs.forEach((macAddr) => {
      const normalizedMacAddr = normalizeMac(macAddr);
      const liveItem = normalizedLiveMap[normalizedMacAddr];
      if (liveItem) {
        nextCacheMap[normalizedMacAddr] = liveItem;
      }
    });

    writeSocketCacheMap(nextCacheMap);
    setLastRefreshedAt(new Date());
    setCachedSocketStatusMap((prev) => {
      const mergedMap = { ...prev };
      effectiveMacAddrs.forEach((macAddr) => {
        const normalizedMacAddr = normalizeMac(macAddr);
        const liveItem = normalizedLiveMap[normalizedMacAddr];
        if (liveItem) {
          mergedMap[normalizedMacAddr] = liveItem;
        }
      });
      return mergedMap;
    });
  }, [socketStatusMap, selectedMacKey, effectiveMacAddrs]);

  /* =========================
   * 실시간 데이터 메모
   * ========================= */
  const effectiveSocketStatusMap = useMemo(
    () => mergeSocketStatusMapWithCache(socketStatusMap, cachedSocketStatusMap, effectiveMacAddrs),
    [socketStatusMap, cachedSocketStatusMap, effectiveMacAddrs],
  );

  const inverterRealtimeMap = useMemo(
    () => buildRealtimeMapFromSocketStatus(effectiveSocketStatusMap, effectiveMacAddrs),
    [effectiveSocketStatusMap, effectiveMacAddrs],
  );

  const selectedInverterMap = useMemo(
    () => buildSelectedInverterMap(inverterRealtimeMap, effectiveMacAddrs),
    [inverterRealtimeMap, effectiveMacAddrs],
  );

  const operationSocketInverterMap = useMemo(
    () => buildOperationSocketInverterMap(operationChartDataMap, pwplIds, selectedPlantNames),
    [operationChartDataMap, pwplIds, selectedPlantNames],
  );

  const effectiveSelectedInverterMap = useMemo(
    () =>
      Object.keys(operationSocketInverterMap).length > 0
        ? operationSocketInverterMap
        : selectedInverterMap,
    [operationSocketInverterMap, selectedInverterMap],
  );

  const realtimeData = useMemo(
    () => aggregateRealtimeData(effectiveSelectedInverterMap),
    [effectiveSelectedInverterMap],
  );

  const formattedAvgVoltage = useMemo(
    () => buildVoltageChartData(effectiveSelectedInverterMap),
    [effectiveSelectedInverterMap],
  );

  const powerFactorChartData = useMemo(
    () => buildPowerFactorChartData(effectiveSelectedInverterMap),
    [effectiveSelectedInverterMap],
  );

  const frequencyChartData = useMemo(
    () => buildFrequencyChartData(effectiveSelectedInverterMap),
    [effectiveSelectedInverterMap],
  );

  const todayPowerChartData = useMemo(
    () => buildTodayPowerChartData(effectiveSelectedInverterMap),
    [effectiveSelectedInverterMap],
  );

  const irradianceChartData = useMemo(
    () => buildIrradianceChartData(effectiveSelectedInverterMap),
    [effectiveSelectedInverterMap],
  );

  const temperatureChartData = useMemo(
    () => buildTemperatureChartData(effectiveSelectedInverterMap),
    [effectiveSelectedInverterMap],
  );

  /* =========================
   * 오늘 데이터 동기화
   * ========================= */
  useEffect(() => {
    const totalGridPowerW = Object.values(effectiveSelectedInverterMap).reduce(
      (sum, item) => sum + item.gridPowerW,
      0,
    );

    const todayData: GenTableItem = {
      label: '오늘',
      genTimeH: 0,
      genMwh: safeToFixed(totalGridPowerW / 1000, 2),
      invMwh: 0,
      acdcRate: 0,
      co2Tco2: 0,
    };

    setGenTableState((prevTable) => {
      if (prevTable.length === 0) return [todayData];
      const hasToday = prevTable.some((row) => row.label === '오늘');
      if (!hasToday) return [...prevTable, todayData];
      return prevTable.map((row) => (row.label === '오늘' ? { ...row, ...todayData } : row));
    });

    setChartDataState((prevChart) => {
      const value = safeToFixed(totalGridPowerW / 1000, 2);
      if (prevChart.length === 0) return [{ category: '오늘', value }];
      const hasToday = prevChart.some((row) => row.category === '오늘');
      if (!hasToday) return [...prevChart, { category: '오늘', value }];
      return prevChart.map((row) => (row.category === '오늘' ? { ...row, value } : row));
    });
  }, [effectiveSelectedInverterMap]);

  /* =========================
   * 선택 변경 시 상태 초기화
   * ========================= */
  useEffect(() => {
    setGenTableState([]);
    setChartDataState([]);
    setIsSocketReady(false);
  }, [pwplIdsKey, selectedMacKey]);

  /* =========================
   * 소켓 첫 데이터 도착 감지
   * ========================= */
  useEffect(() => {
    if (isSocketReady) return;
    const hasData = Object.keys(operationChartDataMap).some(
      (key) => operationChartDataMap[key].length > 0,
    );
    if (hasData) setIsSocketReady(true);
  }, [operationChartDataMap, isSocketReady]);

  useEffect(() => {
    const hasData = Object.keys(operationChartDataMap).some(
      (key) => operationChartDataMap[key].length > 0,
    );
    if (hasData) setLastRefreshedAt(new Date());
  }, [operationChartDataMap]);

  /* =========================
   * 렌더
   * ========================= */
  return (
    <>
      <div className="title-group" style={{ zIndex: 10 }}>
        <TitleComponent
          title="발전소 모니터링"
          subTitle={selectedPlantNameText}
          desc="Real-time Plant Operations Dashboard"
        />
        {lastRefreshedAt && (
          <span style={{ fontSize: '16px', color: '#6b7280' }}>
            마지막 갱신: {lastRefreshedAt.toLocaleTimeString('ko-KR')}
          </span>
        )}
      </div>

      <div className="flex flex-1" style={{ position: 'relative' }}>
        <SidePieChartGroup
          items={[
            { centerText: 'GRID 전압', data: formattedAvgVoltage },
            { centerText: '역률', data: powerFactorChartData },
            { centerText: 'GRID 주파수', data: frequencyChartData },
          ]}
        />

        <TopDashboardSection
          realtimeData={realtimeData}
          weatherData={weatherData as MonitorWeatherRes | undefined}
        />

        <SidePieChartGroup
          items={[
            { centerText: '금일 발전량', data: todayPowerChartData },
            { centerText: '일사량', data: irradianceChartData },
            { centerText: 'PV 모듈 온도', data: temperatureChartData },
          ]}
        />
      </div>
    </>
  );
}
