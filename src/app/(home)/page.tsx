// src/app/(home)/page.tsx
'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import {
  TitleComponent,
  StatusContComponent,
  TopBoxComponent,
  // TabList,
  // Tabs,
  // Tab,
  // TabPanels,
  // TabPanel,
} from '@/components';
import KakaoMap from '@/components/kakaoMap/KakaoMap';
import { ModalPlantSelector } from '@/constants/monitoring/ModalPlantSelector';
import { usePostDashboardSelect } from '@/services/dashboard/query';
import { useGetPlantBaseCombo } from '@/services/plants/query';

import { PlantSelector } from '@/constants/dashboard/PlantSelector';
import { TodayPowerGeneration } from '@/constants/dashboard/TodayPowerGeneration';
import { WeatherInfoSection } from '@/constants/dashboard/WeatherInfoSection';
import { PlantDetailSection } from '@/constants/dashboard/PlantDetailSection';

import { buildStatusData } from '@/utils/dashboardMapper';
import { useDashboardSocketContext } from '@/providers/DashboardSocketContext';
import type { PwplDashboardEntity } from '@/services/dashboard/type';

type MapPlant = {
  pwplId: string;
  title: string;
  lat: number;
  lng: number;
  macAddr?: string;
  topLevel?: 'NORMAL' | 'MAJOR' | 'CRITICAL';
  topMessage?: string;
  criticalCount?: number;
  capacity?: number;
  output?: number;
  gridPowerW?: number;
};

type StoredPlantItem = {
  pwplId: string;
  macAddr: string;
  pwplNm: string;
};

type DashboardSocketPlantStatus = {
  gridPowerW?: number;
  powerKw?: number;
  currentPowerKw?: number;
  capacityKw?: number;
  todayGenerationKwh?: number;
  todayGenerationMwh?: number;
  operationRate?: number;
  areaNm?: string;
  pwplNm?: string;
  pwplLat?: number;
  pwplLot?: number;
  updateTime?: string;
  updatedAt?: string;
  topLevel?: 'NORMAL' | 'MAJOR' | 'CRITICAL';
  topMessage?: string;
  criticalCount?: number;
};

export interface PlantData {
  pwplId: string;
  id: number;
  title: string;
  lat: number;
  lng: number;
  macAddr: string;
  weather: {
    temp: number;
    humidity: number;
    wind: number;
    solar: number;
    pm10: number;
    pm25: number;
  };
  detail: {
    capacity: number;
    output: number;
    todayGen: number;
    rate: number;
    region: string;
    lmp: string;
    updateTime: string;
  };
}

const MONITORING_OPERATION_SOCKET_CACHE_KEY = 'monitoring-operation-socket-cache';

const normalizeMac = (value: string | null | undefined) =>
  String(value ?? '')
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '');

const normalizeSocketStatusMap = (
  socketStatusMap: Record<string, DashboardSocketPlantStatus>,
): Record<string, DashboardSocketPlantStatus> => {
  return Object.entries(socketStatusMap).reduce<Record<string, DashboardSocketPlantStatus>>(
    (acc, [key, value]) => {
      const normalizedKey = normalizeMac(key);

      if (normalizedKey) {
        acc[normalizedKey] = value;
      }

      return acc;
    },
    {},
  );
};

const readSocketCacheMap = (): Record<string, DashboardSocketPlantStatus> => {
  if (typeof window === 'undefined') {
    return {};
  }

  try {
    const raw = localStorage.getItem(MONITORING_OPERATION_SOCKET_CACHE_KEY);

    if (!raw) {
      return {};
    }

    const parsed = JSON.parse(raw) as Record<string, DashboardSocketPlantStatus>;

    return normalizeSocketStatusMap(parsed);
  } catch {
    return {};
  }
};

const writeSocketCacheMap = (cacheMap: Record<string, DashboardSocketPlantStatus>) => {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    localStorage.setItem(
      MONITORING_OPERATION_SOCKET_CACHE_KEY,
      JSON.stringify(normalizeSocketStatusMap(cacheMap)),
    );
  } catch {
    return;
  }
};

const getSocketCurrentPowerKw = (socketStatus?: DashboardSocketPlantStatus): number | undefined => {
  if (!socketStatus) return undefined;

  if (typeof socketStatus.gridPowerW === 'number') {
    return socketStatus.gridPowerW / 1000;
  }

  if (typeof socketStatus.powerKw === 'number') {
    return socketStatus.powerKw;
  }

  if (typeof socketStatus.currentPowerKw === 'number') {
    return socketStatus.currentPowerKw;
  }

  return undefined;
};

const getSocketTodayGenerationKwh = (
  socketStatus?: DashboardSocketPlantStatus,
): number | undefined => {
  if (!socketStatus) return undefined;

  if (typeof socketStatus.todayGenerationKwh === 'number') {
    return socketStatus.todayGenerationKwh;
  }

  if (typeof socketStatus.todayGenerationMwh === 'number') {
    return socketStatus.todayGenerationMwh;
  }

  return undefined;
};

const mergeDashboardDataWithSocket = (
  dashboardData: PwplDashboardEntity | undefined,
  socketStatus: DashboardSocketPlantStatus | undefined,
): PwplDashboardEntity | undefined => {
  if (!dashboardData) return dashboardData;
  if (!dashboardData.plantDetail) return dashboardData;

  const socketCurrentPowerKw = getSocketCurrentPowerKw(socketStatus);
  const socketTodayGeneration = getSocketTodayGenerationKwh(socketStatus);

  return {
    ...dashboardData,
    plantDetail: {
      ...dashboardData.plantDetail,
      pwplNm: socketStatus?.pwplNm ?? dashboardData.plantDetail.pwplNm,
      capacityKw: socketStatus?.capacityKw ?? dashboardData.plantDetail.capacityKw,
      currentPowerKw: socketCurrentPowerKw ?? dashboardData.plantDetail.currentPowerKw,
      todayGenerationMwh: socketTodayGeneration ?? dashboardData.plantDetail.todayGenerationMwh,
      operationRate: socketStatus?.operationRate ?? dashboardData.plantDetail.operationRate,
      areaNm: socketStatus?.areaNm ?? dashboardData.plantDetail.areaNm,
      pwplLat: socketStatus?.pwplLat ?? dashboardData.plantDetail.pwplLat,
      pwplLot: socketStatus?.pwplLot ?? dashboardData.plantDetail.pwplLot,
    },
  };
};

export default function DashboardPage() {
  const [selectedPlant, setSelectedPlant] = useState<PlantData>({
    pwplId: '',
    macAddr: '',
    id: 0,
    title: '',
    lat: 0,
    lng: 0,
    weather: { temp: 0, humidity: 0, wind: 0, solar: 0, pm10: 0, pm25: 0 },
    detail: {
      capacity: 0,
      output: 0,
      todayGen: 0,
      rate: 0,
      region: '',
      lmp: '',
      updateTime: '',
    },
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [pwplIds, setPwplIds] = useState<string[]>([]);
  const [firstSelectedPwplId, setFirstSelectedPwplId] = useState<string>('');
  const [chartType, setChartType] = useState<'TIME' | 'DAY'>('TIME');
  const [plantDetailMap, setPlantDetailMap] = useState<
    Record<string, { capacity?: number; output?: number }>
  >({});

  const toFixedTwo = useCallback((value: number | string | null | undefined): string => {
    const numericValue = Number(value ?? 0);

    if (!Number.isFinite(numericValue)) {
      return '0.00';
    }

    return numericValue.toFixed(2);
  }, []);

  const toFixedTwoNumber = useCallback(
    (value: number | string | null | undefined): number => {
      return Number(toFixedTwo(value));
    },
    [toFixedTwo],
  );

  const socketStatusMap = useDashboardSocketContext() as Record<string, DashboardSocketPlantStatus>;

  const { data: dashboardData } = usePostDashboardSelect({
    pwplIds,
    chartType,
    weatherPwplId: firstSelectedPwplId,
    detailPwplId: firstSelectedPwplId,
  });

  const { data: plantCombo } = useGetPlantBaseCombo();

  const saveSelectedPlants = useCallback(
    (plants: { pwplId: string; macAddr: string; pwplNm: string }[]) => {
      localStorage.setItem(
        'pwplIds',
        JSON.stringify(
          plants.map((v) => ({
            pwplId: v.pwplId,
            macAddr: v.macAddr,
          })),
        ),
      );
      localStorage.setItem('pwplNms', JSON.stringify(plants.map((v) => v.pwplNm)));
      localStorage.setItem('macAddrs', JSON.stringify(plants.map((v) => v.macAddr)));
    },
    [],
  );

  const buildNextSelectedPlant = useCallback(
    (
      prev: PlantData,
      target: {
        pwplId: string;
        macAddr: string;
        pwplNm: string;
        pwplLat: number;
        pwplLot: number;
      },
    ): PlantData => {
      const current = socketStatusMap[target.macAddr];

      return {
        ...prev,
        pwplId: target.pwplId,
        macAddr: target.macAddr,
        title: current?.pwplNm ?? target.pwplNm,
        lat: current?.pwplLat ?? target.pwplLat,
        lng: current?.pwplLot ?? target.pwplLot,
        detail: {
          ...prev.detail,
          capacity: toFixedTwoNumber(current?.capacityKw ?? prev.detail.capacity),
          output: toFixedTwoNumber(getSocketCurrentPowerKw(current) ?? prev.detail.output),
          todayGen: toFixedTwoNumber(getSocketTodayGenerationKwh(current) ?? prev.detail.todayGen),
          rate: toFixedTwoNumber(current?.operationRate ?? prev.detail.rate),
          region: current?.areaNm ?? prev.detail.region,
          updateTime: current?.updateTime ?? current?.updatedAt ?? prev.detail.updateTime,
        },
      };
    },
    [socketStatusMap, toFixedTwoNumber],
  );

  useEffect(() => {
    if (!plantCombo || plantCombo.length === 0) return;
    if (pwplIds.length > 0) return;

    const storedPwplIds = localStorage.getItem('pwplIds');

    try {
      if (storedPwplIds) {
        const parsed = JSON.parse(storedPwplIds) as string[] | StoredPlantItem[];

        if (Array.isArray(parsed) && parsed.length > 0) {
          if (typeof parsed[0] === 'string') {
            const restoredIds = parsed as string[];
            const restoredPlants = plantCombo.filter((v) => restoredIds.includes(v.pwplId));
            const firstPlant = restoredPlants[0];

            if (restoredPlants.length > 0 && firstPlant) {
              setPwplIds(restoredPlants.map((v) => v.pwplId));
              setFirstSelectedPwplId(firstPlant.pwplId);
              setSelectedPlant((prev) => buildNextSelectedPlant(prev, firstPlant));

              saveSelectedPlants(
                restoredPlants.map((v) => ({
                  pwplId: v.pwplId,
                  macAddr: v.macAddr,
                  pwplNm: v.pwplNm,
                })),
              );
              return;
            }
          } else {
            const restoredItems = parsed as StoredPlantItem[];
            const restoredIds = restoredItems.map((v) => v.pwplId);
            const restoredPlants = plantCombo.filter((v) => restoredIds.includes(v.pwplId));
            const firstPlant = restoredPlants[0];

            if (restoredPlants.length > 0 && firstPlant) {
              setPwplIds(restoredPlants.map((v) => v.pwplId));
              setFirstSelectedPwplId(firstPlant.pwplId);
              setSelectedPlant((prev) => buildNextSelectedPlant(prev, firstPlant));

              saveSelectedPlants(
                restoredPlants.map((v) => ({
                  pwplId: v.pwplId,
                  macAddr: v.macAddr,
                  pwplNm: v.pwplNm,
                })),
              );
              return;
            }
          }
        }
      }
    } catch (error) {
      console.error('[DashboardPage] localStorage parse error', error);
    }

    const allPlants = plantCombo.map((v) => ({
      pwplId: v.pwplId,
      macAddr: v.macAddr,
      pwplNm: v.pwplNm,
    }));
    const firstPlant = plantCombo[0];

    if (!firstPlant) return;

    setPwplIds(allPlants.map((v) => v.pwplId));
    setFirstSelectedPwplId(firstPlant.pwplId);
    setSelectedPlant((prev) => buildNextSelectedPlant(prev, firstPlant));
    saveSelectedPlants(allPlants);
  }, [plantCombo, pwplIds.length, buildNextSelectedPlant, saveSelectedPlants]);

  const selectedPlantCombo = useMemo(() => {
    if (!plantCombo || plantCombo.length === 0) return [];
    if (pwplIds.length === 0) return plantCombo;
    return plantCombo.filter((v) => pwplIds.includes(v.pwplId));
  }, [plantCombo, pwplIds]);

  const selectedSocketStatus = socketStatusMap[selectedPlant.macAddr];

  const mergedDashboardData = useMemo(() => {
    return mergeDashboardDataWithSocket(dashboardData, selectedSocketStatus);
  }, [dashboardData, selectedSocketStatus]);

  const roundedSelectedPlant: PlantData = useMemo(
    () => ({
      ...selectedPlant,
      title: selectedSocketStatus?.pwplNm ?? selectedPlant.title,
      lat: selectedSocketStatus?.pwplLat ?? selectedPlant.lat,
      lng: selectedSocketStatus?.pwplLot ?? selectedPlant.lng,
      detail: {
        ...selectedPlant.detail,
        capacity: toFixedTwoNumber(
          selectedSocketStatus?.capacityKw ?? selectedPlant.detail.capacity,
        ),
        output: toFixedTwoNumber(
          getSocketCurrentPowerKw(selectedSocketStatus) ?? selectedPlant.detail.output,
        ),
        todayGen: toFixedTwoNumber(
          getSocketTodayGenerationKwh(selectedSocketStatus) ?? selectedPlant.detail.todayGen,
        ),
        rate: toFixedTwoNumber(selectedSocketStatus?.operationRate ?? selectedPlant.detail.rate),
        region: selectedSocketStatus?.areaNm ?? selectedPlant.detail.region,
        updateTime:
          selectedSocketStatus?.updateTime ??
          selectedSocketStatus?.updatedAt ??
          selectedPlant.detail.updateTime,
      },
    }),
    [selectedPlant, selectedSocketStatus, toFixedTwoNumber],
  );

  const roundedDashboardData = useMemo(() => {
    if (!mergedDashboardData) return mergedDashboardData;

    return {
      ...mergedDashboardData,
      plantDetail: mergedDashboardData.plantDetail
        ? {
            ...mergedDashboardData.plantDetail,
            capacityKw: toFixedTwoNumber(mergedDashboardData.plantDetail.capacityKw ?? 0),
            currentPowerKw: toFixedTwoNumber(mergedDashboardData.plantDetail.currentPowerKw ?? 0),
            todayGenerationMwh: toFixedTwoNumber(
              mergedDashboardData.plantDetail.todayGenerationMwh ?? 0,
            ),
            operationRate: toFixedTwoNumber(mergedDashboardData.plantDetail.operationRate ?? 0),
          }
        : mergedDashboardData.plantDetail,
    };
  }, [mergedDashboardData, toFixedTwoNumber]);

  const livePlantDetail = useMemo(() => {
    const plantDetail = roundedDashboardData?.plantDetail;

    if (!plantDetail) return plantDetail;

    return {
      ...plantDetail,
      pwplNm: selectedSocketStatus?.pwplNm ?? plantDetail.pwplNm,
      capacityKw: toFixedTwoNumber(selectedSocketStatus?.capacityKw ?? plantDetail.capacityKw ?? 0),
      currentPowerKw: toFixedTwoNumber(
        getSocketCurrentPowerKw(selectedSocketStatus) ?? plantDetail.currentPowerKw ?? 0,
      ),
      todayGenerationMwh: toFixedTwoNumber(
        getSocketTodayGenerationKwh(selectedSocketStatus) ?? plantDetail.todayGenerationMwh ?? 0,
      ),
      operationRate: toFixedTwoNumber(
        selectedSocketStatus?.operationRate ?? plantDetail.operationRate ?? 0,
      ),
      areaNm: selectedSocketStatus?.areaNm ?? plantDetail.areaNm,
      pwplLat: selectedSocketStatus?.pwplLat ?? plantDetail.pwplLat,
      pwplLot: selectedSocketStatus?.pwplLot ?? plantDetail.pwplLot,
    };
  }, [roundedDashboardData, selectedSocketStatus, toFixedTwoNumber]);

  const liveDashboardData = useMemo<PwplDashboardEntity | undefined>(() => {
    if (!roundedDashboardData || !livePlantDetail) return roundedDashboardData;

    return {
      ...roundedDashboardData,
      plantDetail: livePlantDetail,
    };
  }, [roundedDashboardData, livePlantDetail]);

  const STATUS_DATA = useMemo(() => {
    return buildStatusData(liveDashboardData, pwplIds, selectedPlantCombo);
  }, [liveDashboardData, pwplIds, selectedPlantCombo]);

  // src/app/(home)/page.tsx

  const mapPlants: MapPlant[] = useMemo(
    () =>
      selectedPlantCombo.map((v) => {
        const socketStatus = socketStatusMap[v.macAddr];
        const detail = plantDetailMap[v.pwplId];
        const dashboardPlantDetail =
          dashboardData?.plantDetail?.pwplId === v.pwplId ? dashboardData.plantDetail : undefined;

        return {
          pwplId: v.pwplId,
          title: socketStatus?.pwplNm ?? v.pwplNm,
          lat: socketStatus?.pwplLat ?? v.pwplLat,
          lng: socketStatus?.pwplLot ?? v.pwplLot,
          macAddr: v.macAddr,
          topLevel: socketStatus?.topLevel,
          topMessage: socketStatus?.topMessage,
          criticalCount: socketStatus?.criticalCount,
          capacity: toFixedTwoNumber(
            dashboardPlantDetail?.capacityKw ?? socketStatus?.capacityKw ?? detail?.capacity ?? 0,
          ),
          output: toFixedTwoNumber(
            dashboardPlantDetail?.currentPowerKw ??
              socketStatus?.gridPowerW ??
              socketStatus?.currentPowerKw ??
              detail?.output ??
              0,
          ),
          gridPowerW: toFixedTwoNumber(
            dashboardPlantDetail?.currentPowerKw ??
              socketStatus?.gridPowerW ??
              socketStatus?.currentPowerKw ??
              detail?.output ??
              0,
          ),
        };
      }),
    [selectedPlantCombo, socketStatusMap, plantDetailMap, dashboardData, toFixedTwoNumber],
  );

  useEffect(() => {
    if (dashboardData?.plantDetail?.pwplId) {
      setPlantDetailMap((prev) => ({
        ...prev,
        [dashboardData.plantDetail.pwplId]: {
          ...prev[dashboardData.plantDetail.pwplId],
          capacity: toFixedTwoNumber(dashboardData.plantDetail.capacityKw),
          output: toFixedTwoNumber(dashboardData.plantDetail.currentPowerKw),
        },
      }));
    }
  }, [dashboardData, toFixedTwoNumber]);

  useEffect(() => {
    if (selectedPlantCombo.length === 0) {
      return;
    }

    const normalizedLiveMap = normalizeSocketStatusMap(socketStatusMap);
    const nextCacheMap = { ...readSocketCacheMap() };

    selectedPlantCombo.forEach((plant) => {
      const normalizedMacAddr = normalizeMac(plant.macAddr);
      const liveItem = normalizedLiveMap[normalizedMacAddr];

      if (normalizedMacAddr && liveItem) {
        nextCacheMap[normalizedMacAddr] = liveItem;
      }
    });

    writeSocketCacheMap(nextCacheMap);
  }, [socketStatusMap, selectedPlantCombo]);

  return (
    <>
      <div className="title-group">
        <TitleComponent
          title="발전소 현황"
          desc="실시간 전국 발전소별 모니터링 대시보드 화면 입니다"
        />
        <PlantSelector onOpen={() => setModalOpen(true)} />
      </div>

      <TopBoxComponent>
        <StatusContComponent items={STATUS_DATA} />
      </TopBoxComponent>

      <div className="group flex-1">
        <div className="map-group">
          <KakaoMap
            plants={mapPlants}
            selectedPlant={{
              pwplId: selectedPlant.pwplId,
              lat: selectedPlant.lat,
              lng: selectedPlant.lng,
            }}
            onSelect={(plant) => {
              const target = selectedPlantCombo.find((v) => v.pwplId === plant.pwplId);

              if (target) {
                setSelectedPlant((prev) => buildNextSelectedPlant(prev, target));
                setFirstSelectedPwplId(target.pwplId);

                saveSelectedPlants([
                  {
                    pwplId: target.pwplId,
                    macAddr: target.macAddr,
                    pwplNm: target.pwplNm,
                  },
                ]);

                setPwplIds([target.pwplId]);
              }
            }}
          />

          <div className="map-legend">
            <span>시설상태</span>

            <div className="group">
              <span className="dot normal">정상</span>
              <span className="dot checking">경고</span>
              <span className="dot error">오류</span>
              <span className="dot off">오프라인</span>
            </div>
          </div>

          {/* 임시 주석 클러스터 작업되면 그때 작업 
          <Tabs aria-label="맵 유형">
          <TabList aria-label="맵 유형">
          <Tab id="basic">기본</Tab>
          <Tab id="cluster">클러스터</Tab>
          </TabList>

          <TabPanels aria-label="맵 패널">
          <TabPanel id="basic">
          <KakaoMap />

          <div className="map-legend">
          <span>시설상태</span>

          <div className="group">
          <span className="dot normal">정상</span>
          <span className="dot checking">경고</span>
          <span className="dot error">오류</span>
          <span className="dot off">오프라인</span>
          </div>
          </div>
          </TabPanel>

          <TabPanel id="cluster">
          <KakaoMap />
          </TabPanel>
          </TabPanels>
          </Tabs>
          */}
        </div>

        <div className="row-group" style={{ width: 440 }}>
          <TodayPowerGeneration
            chart={roundedDashboardData?.chart ?? []}
            onChangeChartType={(type) => setChartType(type)}
          />

          <WeatherInfoSection data={roundedSelectedPlant} dashboardData={liveDashboardData} />

          <PlantDetailSection
            data={roundedSelectedPlant}
            dashboardData={liveDashboardData}
            socketPower={toFixedTwoNumber(getSocketCurrentPowerKw(selectedSocketStatus) ?? 0)}
            pwplIds={pwplIds}
          />
        </div>
      </div>

      <ModalPlantSelector
        isOpen={modalOpen}
        onOpenChange={setModalOpen}
        selectionMode="multiple"
        onApplySingle={(plant) => {
          const target = plantCombo?.find((v) => v.pwplId === plant.pwplId);

          if (target) {
            setSelectedPlant((prev) => buildNextSelectedPlant(prev, target));
            setFirstSelectedPwplId(target.pwplId);

            saveSelectedPlants([
              {
                pwplId: target.pwplId,
                macAddr: target.macAddr,
                pwplNm: target.pwplNm,
              },
            ]);
          }

          setPwplIds([plant.pwplId]);
        }}
        onApplyMulti={(plants) => {
          const ids = plants.map((v) => v.pwplId);
          setPwplIds(ids);

          saveSelectedPlants(
            plants.map((v) => ({
              pwplId: v.pwplId,
              macAddr: v.macAddr,
              pwplNm: v.pwplNm,
            })),
          );

          if (plants.length > 0) {
            const first = plants[0];
            const target = plantCombo?.find((v) => v.pwplId === first.pwplId);

            if (target) {
              setSelectedPlant((prev) => buildNextSelectedPlant(prev, target));
              setFirstSelectedPwplId(target.pwplId);
            }
          }
        }}
      />
    </>
  );
}
