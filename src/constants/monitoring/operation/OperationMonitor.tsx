// src/constants/monitoring/operation/MonitoringOp.tsx
'use client';

import { TitleComponent } from '@/components';
import { useState, useEffect, useMemo } from 'react';
import type { MonitorWeatherRes } from '@/services/monitoring/weather/type';
import { useGetMonitorWeather } from '@/services/monitoring/weather/query';
import { ModalPlantSelector } from '@/constants/monitoring/ModalPlantSelector';
import type { BarChartData } from '@/components/monitoring/monitoring-barchart.component';
import { useSearchParams } from 'next/navigation';
import { useDashboardSocketContext } from '@/providers/DashboardSocketContext';

import { TopDashboardSection } from './parts/TopPanel';
import { SidePieChartGroup } from './parts/PieCharts';
import {
  aggregateRealtimeData,
  buildRealtimeMapFromSocketStatus,
  buildSelectedInverterMap,
  getRestoredSelection,
  normalizeMac,
  normalizeSocketStatusMap,
  readSocketCacheMap,
  safeToFixed,
  writeSocketCacheMap,
  mergeSocketStatusMapWithCache,
} from './parts/utils';
import {
  buildConnectionStatusChartData,
  buildFrequencyChartData,
  buildOperationStatusChartData,
  buildPowerFactorChartData,
  buildTodayPowerChartData,
  buildVoltageChartData,
} from './parts/chartInverterMap';
import type { DashboardSocketPlantStatus, GenTableItem, MonitoringOpProps } from './parts/types';

/* =========================
 * 메인 컴포넌트
 * ========================= */
export default function MonitoringOp({ pwplIds: initialPwplIds }: MonitoringOpProps) {
  const searchParams = useSearchParams();
  const socketStatusMap = useDashboardSocketContext() as Record<string, DashboardSocketPlantStatus>;

  const restoredSelection = useMemo(
    () => getRestoredSelection(searchParams, initialPwplIds),
    [searchParams, initialPwplIds],
  );

  /* =========================
   * 상태값
   * ========================= */
  const [pwplIds, setPwplIds] = useState<string[]>(restoredSelection.pwplIds);
  const [selectedPlantNames, setSelectedPlantNames] = useState<string[]>(
    restoredSelection.plantNames,
  );
  const [selectedMacAddrs, setSelectedMacAddrs] = useState<string[]>(restoredSelection.macAddrs);
  const [modalOpen, setModalOpen] = useState(false);
  const [cachedSocketStatusMap, setCachedSocketStatusMap] = useState<
    Record<string, DashboardSocketPlantStatus>
  >(() => {
    if (typeof window === 'undefined') {
      return {};
    }

    const initialCacheMap = readSocketCacheMap();

    return restoredSelection.macAddrs.reduce<Record<string, DashboardSocketPlantStatus>>(
      (acc, macAddr) => {
        const normalizedMacAddr = normalizeMac(macAddr);
        const cachedItem = initialCacheMap[normalizedMacAddr];

        if (cachedItem) {
          acc[normalizedMacAddr] = cachedItem;
        }

        return acc;
      },
      {},
    );
  });

  const [, setGenTableState] = useState<GenTableItem[]>([]);
  const [, setChartDataState] = useState<BarChartData[]>([]);

  /* =========================
   * 파생값
   * ========================= */
  const selectedPlantNameText = useMemo(() => {
    if (selectedPlantNames.length === 0) return '선택된 발전소 없음';
    if (selectedPlantNames.length === 1) return selectedPlantNames[0];
    return selectedPlantNames.join(', ');
  }, [selectedPlantNames]);

  const weatherPwplId = useMemo(() => pwplIds[0] ?? '', [pwplIds]);
  const pwplIdsKey = useMemo(() => pwplIds.join(','), [pwplIds]);
  const selectedMacKey = useMemo(() => selectedMacAddrs.join(','), [selectedMacAddrs]);

  const { data: weatherData } = useGetMonitorWeather(
    { pwplId: weatherPwplId },
    Boolean(weatherPwplId),
  );

  /* =========================
   * 선택값 복원 effect
   * ========================= */
  useEffect(() => {
    setPwplIds(restoredSelection.pwplIds);
    setSelectedPlantNames(restoredSelection.plantNames);
    setSelectedMacAddrs(restoredSelection.macAddrs);

    const nextCacheMap = readSocketCacheMap();
    const filteredCacheMap = restoredSelection.macAddrs.reduce<
      Record<string, DashboardSocketPlantStatus>
    >((acc, macAddr) => {
      const normalizedMacAddr = normalizeMac(macAddr);
      const cachedItem = nextCacheMap[normalizedMacAddr];

      if (cachedItem) {
        acc[normalizedMacAddr] = cachedItem;
      }

      return acc;
    }, {});

    setCachedSocketStatusMap(filteredCacheMap);
  }, [restoredSelection]);

  /* =========================
   * 선택 MAC 기준 캐시 재조회
   * ========================= */
  useEffect(() => {
    if (selectedMacAddrs.length === 0) {
      setCachedSocketStatusMap({});
      return;
    }

    const nextCacheMap = readSocketCacheMap();
    const filteredCacheMap = selectedMacAddrs.reduce<Record<string, DashboardSocketPlantStatus>>(
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
  }, [selectedMacKey, selectedMacAddrs]);

  /* =========================
   * 실시간 소켓값 캐시 반영
   * ========================= */
  useEffect(() => {
    if (selectedMacAddrs.length === 0) {
      return;
    }

    const normalizedLiveMap = normalizeSocketStatusMap(socketStatusMap);
    const hasSelectedLiveData = selectedMacAddrs.some((macAddr) => {
      const normalizedMacAddr = normalizeMac(macAddr);
      return Boolean(normalizedLiveMap[normalizedMacAddr]);
    });

    if (!hasSelectedLiveData) {
      return;
    }

    const currentCacheMap = readSocketCacheMap();
    const nextCacheMap = { ...currentCacheMap };

    selectedMacAddrs.forEach((macAddr) => {
      const normalizedMacAddr = normalizeMac(macAddr);
      const liveItem = normalizedLiveMap[normalizedMacAddr];

      if (liveItem) {
        nextCacheMap[normalizedMacAddr] = liveItem;
      }
    });

    writeSocketCacheMap(nextCacheMap);
    setCachedSocketStatusMap((prev) => {
      const mergedMap = { ...prev };

      selectedMacAddrs.forEach((macAddr) => {
        const normalizedMacAddr = normalizeMac(macAddr);
        const liveItem = normalizedLiveMap[normalizedMacAddr];

        if (liveItem) {
          mergedMap[normalizedMacAddr] = liveItem;
        }
      });

      return mergedMap;
    });
  }, [socketStatusMap, selectedMacKey, selectedMacAddrs]);

  /* =========================
   * 실시간 데이터 메모
   * ========================= */
  const effectiveSocketStatusMap = useMemo(
    () => mergeSocketStatusMapWithCache(socketStatusMap, cachedSocketStatusMap, selectedMacAddrs),
    [socketStatusMap, cachedSocketStatusMap, selectedMacAddrs],
  );

  const inverterRealtimeMap = useMemo(
    () => buildRealtimeMapFromSocketStatus(effectiveSocketStatusMap, selectedMacAddrs),
    [effectiveSocketStatusMap, selectedMacAddrs],
  );

  const selectedInverterMap = useMemo(
    () => buildSelectedInverterMap(inverterRealtimeMap, selectedMacAddrs),
    [inverterRealtimeMap, selectedMacAddrs],
  );

  const realtimeData = useMemo(
    () => aggregateRealtimeData(selectedInverterMap),
    [selectedInverterMap],
  );

  const averageVoltageChartData = useMemo(
    () => buildVoltageChartData(selectedInverterMap),
    [selectedInverterMap],
  );

  const powerFactorChartData = useMemo(
    () => buildPowerFactorChartData(selectedInverterMap),
    [selectedInverterMap],
  );

  const frequencyChartData = useMemo(
    () => buildFrequencyChartData(selectedInverterMap),
    [selectedInverterMap],
  );

  const todayPowerChartData = useMemo(
    () => buildTodayPowerChartData(selectedInverterMap),
    [selectedInverterMap],
  );

  const operationStatusChartData = useMemo(
    () => buildOperationStatusChartData(selectedInverterMap),
    [selectedInverterMap],
  );

  const connectionStatusChartData = useMemo(
    () => buildConnectionStatusChartData(selectedInverterMap),
    [selectedInverterMap],
  );

  /* =========================
   * 오늘 데이터 동기화
   * ========================= */
  useEffect(() => {
    const totalGridPowerW = Object.values(selectedInverterMap).reduce(
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
      if (prevTable.length === 0) {
        return [todayData];
      }

      const hasToday = prevTable.some((row) => row.label === '오늘');

      if (!hasToday) {
        return [...prevTable, todayData];
      }

      return prevTable.map((row) =>
        row.label === '오늘'
          ? {
              ...row,
              genTimeH: todayData.genTimeH,
              genMwh: todayData.genMwh,
              invMwh: todayData.invMwh,
              acdcRate: todayData.acdcRate,
              co2Tco2: todayData.co2Tco2,
            }
          : row,
      );
    });

    setChartDataState((prevChart) => {
      if (prevChart.length === 0) {
        return [
          {
            category: '오늘',
            value: safeToFixed(totalGridPowerW / 1000, 2),
          },
        ];
      }

      const hasToday = prevChart.some((row) => row.category === '오늘');

      if (!hasToday) {
        return [
          ...prevChart,
          {
            category: '오늘',
            value: safeToFixed(totalGridPowerW / 1000, 2),
          },
        ];
      }

      return prevChart.map((row) =>
        row.category === '오늘'
          ? {
              ...row,
              value: safeToFixed(totalGridPowerW / 1000, 2),
            }
          : row,
      );
    });
  }, [selectedInverterMap]);

  /* =========================
   * 선택 변경 시 상태 초기화
   * ========================= */
  useEffect(() => {
    setGenTableState([]);
    setChartDataState([]);
  }, [pwplIdsKey, selectedMacKey]);

  /* =========================
   * 렌더
   * ========================= */
  return (
    <>
      <div className="title-group">
        <TitleComponent
          title="발전소 모니터링"
          subTitle={selectedPlantNameText}
          desc="Real-time Plant Operations Dashboard"
        />
      </div>

      <div className="flex flex-1">
        <SidePieChartGroup
          items={[
            { centerText: '전압데이터', data: averageVoltageChartData },
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
            { centerText: '일사량', data: operationStatusChartData },
            { centerText: 'PV 모듈 온도', data: connectionStatusChartData },
          ]}
        />
      </div>

      <ModalPlantSelector
        isOpen={modalOpen}
        onOpenChange={setModalOpen}
        selectionMode="multiple"
        onApplySingle={(plant) => {
          const nextMacAddrs =
            'macAddr' in plant && typeof plant.macAddr === 'string'
              ? [normalizeMac(plant.macAddr)]
              : [];

          localStorage.setItem(
            'pwplIds',
            JSON.stringify([
              {
                pwplId: plant.pwplId,
                macAddr: nextMacAddrs[0] ?? '',
              },
            ]),
          );
          localStorage.setItem('pwplNms', JSON.stringify([plant.pwplNm]));
          localStorage.setItem('macAddrs', JSON.stringify(nextMacAddrs));
          setPwplIds([plant.pwplId]);
          setSelectedPlantNames([plant.pwplNm]);
          setSelectedMacAddrs(nextMacAddrs);
        }}
        onApplyMulti={(plants) => {
          const ids = plants.map((v) => v.pwplId);
          const names = plants.map((v) => v.pwplNm);
          const macAddrs = plants
            .map((v) =>
              'macAddr' in v && typeof v.macAddr === 'string' ? normalizeMac(v.macAddr) : '',
            )
            .filter(Boolean);

          localStorage.setItem(
            'pwplIds',
            JSON.stringify(
              plants.map((v) => ({
                pwplId: v.pwplId,
                macAddr:
                  'macAddr' in v && typeof v.macAddr === 'string' ? normalizeMac(v.macAddr) : '',
              })),
            ),
          );
          localStorage.setItem('pwplNms', JSON.stringify(names));
          localStorage.setItem('macAddrs', JSON.stringify(macAddrs));
          setPwplIds(ids);
          setSelectedPlantNames(names);
          setSelectedMacAddrs(macAddrs);
        }}
      />
    </>
  );
}
