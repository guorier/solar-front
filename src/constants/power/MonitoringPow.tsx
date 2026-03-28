// power/MonitoringPow.tsx
'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { ButtonComponent, TitleComponent } from '@/components';
import { ModalPlantSelector } from '@/constants/monitoring/ModalPlantSelector';
import MonitoringPowChart from './components/MonitoringPowChart';
import MonitoringPowTable from './components/MonitoringPowTable';
import { getPowerTrendHistory, PAGE_SIZE, parsePwplIds } from './monitoringPowMock';
import { PowerTrendChartSeries, PowerTrendRow } from './monitoringPowType';
import { useDashboardSocketContext } from '@/providers/DashboardSocketContext';
import { useSearchParams } from 'next/navigation';
import './MonitoringPow.scss';

type MonitoringPowProps = {
  pwplIds: string;
};

type SavedPlantItem = {
  pwplId: string;
  macAddr?: string;
};

type LocalStorageRecord = Record<string, unknown>;

const isObjectRecord = (value: unknown): value is LocalStorageRecord => {
  return typeof value === 'object' && value !== null;
};

const toNumber = (value: unknown): number => {
  const numericValue = Number(value ?? 0);

  if (!Number.isFinite(numericValue)) {
    return 0;
  }

  return numericValue;
};

const round = (value: number, digit: number = 2): number => {
  const factor = 10 ** digit;
  return Math.round(value * factor) / factor;
};

const toDateValue = (value: string): number => {
  if (!value) {
    return 0;
  }

  const parsedTime = new Date(value.replace(' ', 'T')).getTime();

  if (!Number.isFinite(parsedTime)) {
    return 0;
  }

  return parsedTime;
};

const getStatus = (alrmCode: string): PowerTrendRow['status'] => {
  return alrmCode === '000000' ? '정상' : '비정상';
};

// 웹소켓 목록 데이터 포맷 변환
type WebSocketListItem = {
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

const convertWebSocketListToRow = (item: WebSocketListItem): PowerTrendRow | null => {
  const targetPwplId = item.targetPwplId;
  const deviceAddr = item.deviceAddresses;
  const timeStampStr = item.timeStampStr;

  if (!targetPwplId || !deviceAddr || !timeStampStr) {
    return null;
  }

  const rowId = `${targetPwplId}__${deviceAddr}`;

  return {
    id: rowId,
    plantId: targetPwplId,
    plantName: item.pwplNm ?? targetPwplId,
    inverterId: String(deviceAddr),
    inverterName: `${deviceAddr}호`,
    time: timeStampStr,
    currentPowerW: toNumber(item.gridPowerW),
    previousPowerW: toNumber(item.prevGridPowerW),
    dayPowerMWh: round(toNumber(item.dailyTotalPowerW) / 1000, 3),
    irradianceWm2: toNumber(item.irradianceWm2),
    temperatureC: toNumber(item.temperatureC),
    inverterEfficiency: String(item.formattedEfficiency ?? ''),
    changedPowerW: toNumber(item.fluctuate),
    changeRate: round(toNumber(item.fluctuateRate), 1),
    status: getStatus(String(item.alrmCode ?? '000000')),
  };
};

const convertWebSocketListToRows = (data: unknown, selectedPwplIds: string[]): PowerTrendRow[] => {
  if (!Array.isArray(data)) {
    return [];
  }

  const rows: PowerTrendRow[] = [];

  data.forEach((item) => {
    if (!isObjectRecord(item)) {
      return;
    }

    const wsItem = item as WebSocketListItem;

    // 선택된 발전소인 경우만 처리
    if (selectedPwplIds.length > 0 && !selectedPwplIds.includes(wsItem.targetPwplId ?? '')) {
      return;
    }

    const row = convertWebSocketListToRow(wsItem);
    if (row) {
      rows.push(row);
    }
  });

  return rows;
};

// 웹소켓 차트 데이터 포맷 변환
type WebSocketChartItem = {
  gridPowerW?: number;
  fluctuate?: number;
  targetPwplId?: string;
  timeStampStr?: string;
  pwplNm?: string;
};

const convertWebSocketChartData = (
  data: unknown,
  selectedPwplIds: string[],
): PowerTrendChartSeries[] => {
  if (!Array.isArray(data)) {
    return [];
  }

  // targetPwplId별로 그룹화
  const groupedMap = new Map<string, WebSocketChartItem[]>();

  data.forEach((item) => {
    if (!isObjectRecord(item)) {
      return;
    }

    const wsItem = item as WebSocketChartItem;
    const pwplId = wsItem.targetPwplId;

    if (!pwplId) {
      return;
    }

    // 선택된 발전소인 경우만 처리
    if (selectedPwplIds.length > 0 && !selectedPwplIds.includes(pwplId)) {
      return;
    }

    if (!groupedMap.has(pwplId)) {
      groupedMap.set(pwplId, []);
    }

    groupedMap.get(pwplId)!.push(wsItem);
  });

  // 각 발전소별 차트 시리즈 생성
  const chartSeries: PowerTrendChartSeries[] = [];

  groupedMap.forEach((items, pwplId) => {
    const plantName = items[0]?.pwplNm ?? pwplId;
    const chartItems = items
      .map((item) => {
        const timeStr = item.timeStampStr ?? '';
        // console.log(`🔍 항목 변환: timeStampStr="${timeStr}" → time="${timeStr}"`);
        return {
          time: timeStr,
          close: toNumber(item.gridPowerW),
          status: '정상' as const,
        };
      })
      .filter((item) => item.time !== '');

    if (chartItems.length > 0) {
      chartSeries.push({
        plantId: pwplId,
        plantName,
        inverterId: '전체',
        inverterName: '전체 발전량',
        data: chartItems,
      });
    }
  });

  return chartSeries;
};

export default function MonitoringPow({ pwplIds: initialPwplIds }: MonitoringPowProps) {
  const searchParams = useSearchParams();

  const [pwplIds, setPwplIds] = useState<string[]>(parsePwplIds(initialPwplIds));
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [chartData, setChartData] = useState<PowerTrendChartSeries[]>([]);
  const [rows, setRows] = useState<PowerTrendRow[]>([]);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [lastUpdatedAt, setLastUpdatedAt] = useState<number | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(60);
  const [refreshMotion, setRefreshMotion] = useState<boolean>(false);

  // 프로바이더에서 제공하는 웹소켓 데이터
  const { powerTrendListData, powerTrendChartData } = useDashboardSocketContext();

  // 프로바이더의 차트 데이터가 업데이트되면 차트 데이터 업데이트
  const filteredChartData = useMemo(() => {
    if (!Array.isArray(powerTrendChartData) || powerTrendChartData.length === 0) {
      return [];
    }
    
    // 웹소켓에서 받은 차트 데이터를 PowerTrendChartSeries로 변환 (필터링 포함)
    const convertedChartData = convertWebSocketChartData(powerTrendChartData, pwplIds);
    // console.log('🔄 필터링된 차트 데이터:', convertedChartData);
    
    return convertedChartData;
  }, [powerTrendChartData, pwplIds]);

  useEffect(() => {
    if (filteredChartData.length === 0) {
      return;
    }

    // console.log('📊 필터링된 차트 데이터 반영:', filteredChartData);
    
    // 웹소켓 차트 데이터로 업데이트 (기존 데이터와 merge)
    setChartData((prevChartData) => {
      const mergedMap = new Map<string, PowerTrendChartSeries>();
      
      // 기존 차트 데이터 추가
      prevChartData.forEach((series) => {
        const key = `${series.plantId}__${series.inverterId}`;
        mergedMap.set(key, series);
      });
      
      // 웹소켓 데이터로 업데이트 (같은 plant + inverter는 덮어씌움)
      filteredChartData.forEach((series) => {
        const key = `${series.plantId}__${series.inverterId}`;
        mergedMap.set(key, series);
      });
      
      return Array.from(mergedMap.values());
    });
  }, [filteredChartData]);

  // 프로바이더의 Context 데이터가 업데이트되면 rows 업데이트
  useEffect(() => {
    if (!Array.isArray(powerTrendListData) || powerTrendListData.length === 0) {
      return;
    }

    // console.log('📋 Context 추이 목록 데이터 받음:', powerTrendListData, 'pwplIds:', pwplIds);

    // 웹소켓에서 받은 목록 데이터를 행으로 변환
    const wsRows = convertWebSocketListToRows(powerTrendListData, pwplIds);

    if (wsRows.length === 0) {
      return;
    }

    // 기존 행과 웹소켓 행을 병합
    setRows((prevRows) => {
      const mergedMap = new Map<string, PowerTrendRow>();

      // 기존 행 추가
      prevRows.forEach((item) => {
        mergedMap.set(item.id, item);
      });

      // 웹소켓 행으로 업데이트 (최신 데이터)
      wsRows.forEach((item) => {
        mergedMap.set(item.id, item);
      });

      return Array.from(mergedMap.values())
        .sort((a, b) => toDateValue(b.time) - toDateValue(a.time))
        .slice(0, page * PAGE_SIZE);
    });

    setLastUpdatedAt(Date.now());
    setElapsedSeconds(60);
  }, [powerTrendListData, pwplIds, page]);

  const loadInitial = useCallback(async () => {
    if (pwplIds.length === 0) {
      setChartData([]);
      setRows([]);
      setPage(1);
      setHasMore(false);
      return;
    }

    setIsLoading(true);
    setRefreshMotion(true);

    try {
      const response = await getPowerTrendHistory({
        rangeHour: '12',
        pwplIds,
        page,
        size: PAGE_SIZE,
      });

      // 초기 데이터 설정 (웹소켓 수신 전 UI 표시용)
      setChartData(response.chart);
      setRows(response.list);
      setHasMore(response.hasMore);
      setLastUpdatedAt(Date.now());
      setElapsedSeconds(60);
    } finally {
      setIsLoading(false);

      window.setTimeout(() => {
        setRefreshMotion(false);
      }, 900);
    }
  }, [page, pwplIds]);

  useEffect(() => {
    setPwplIds(parsePwplIds(initialPwplIds));
  }, [initialPwplIds]);

  useEffect(() => {
    const savedPwplIds = localStorage.getItem('pwplIds');

    if (!savedPwplIds) {
      return;
    }

    try {
      const parsedPwplIds = JSON.parse(savedPwplIds) as Array<string | SavedPlantItem>;

      if (!Array.isArray(parsedPwplIds) || parsedPwplIds.length === 0) {
        return;
      }

      if (typeof parsedPwplIds[0] === 'string') {
        setPwplIds(parsedPwplIds as string[]);
        return;
      }

      const parsedPlantItems = parsedPwplIds as SavedPlantItem[];
      setPwplIds(parsedPlantItems.map((item) => item.pwplId));
    } catch {
      setPwplIds(parsePwplIds(initialPwplIds));
    }
  }, [initialPwplIds]);

  useEffect(() => {
    const ids = searchParams.get('pwplIds');

    if (ids) {
      setPwplIds(parsePwplIds(ids));
    }
  }, [searchParams]);

  useEffect(() => {
    setPage(1);
  }, [pwplIds]);

  useEffect(() => {
    void loadInitial();
  }, [loadInitial]);

  // 웹소켓이 실시간 데이터를 제공하므로 폴링 제거
  // 초기 로드 후 웹소켓 데이터만 업데이트됨

  useEffect(() => {
    const timer = window.setInterval(() => {
      setElapsedSeconds((prev) => {
        if (prev <= 0) {
          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => {
      window.clearInterval(timer);
    };
  }, [lastUpdatedAt]);

  const handleMore = useCallback(() => {
    setPage((prev) => prev + 1);
  }, []);

  const summaryText = useMemo(() => {
    return `${rows.length}건`;
  }, [rows.length]);

  const liveText = useMemo(() => {
    if (!lastUpdatedAt) {
      return `60초 후 갱신`;
    }

    return `${elapsedSeconds}초 후 갱신`;
  }, [elapsedSeconds, lastUpdatedAt]);

  return (
    <>
      <div className="monitoring-pow-title-group">
        <div className="monitoring-pow-title-wrap" style={{ alignItems: 'flex-end' }}>
          <TitleComponent
            title="발전소 모니터링"
            subTitle={`운영 전력 추이 · ${liveText}`}
            desc="실시간 운영 발전 전력에 대한 추이 변화 확인"
          />
        </div>

        <ButtonComponent onPress={() => setModalOpen(true)}>발전소 선택</ButtonComponent>
      </div>

      <div className={`monitoring-pow ${refreshMotion ? 'is-refreshing' : ''}`}>
        <div className="monitoring-pow-chart-wrap">
          <MonitoringPowChart chartData={chartData} />
        </div>

        <div className="monitoring-pow-table-wrap">
          <MonitoringPowTable
            rows={rows}
            summaryText={summaryText}
            isLoading={isLoading}
            hasMore={hasMore}
            onMore={handleMore}
          />
        </div>
      </div>

      <ModalPlantSelector
        isOpen={modalOpen}
        onOpenChange={setModalOpen}
        selectionMode="multiple"
        onApplySingle={(plant) => {
          localStorage.setItem(
            'pwplIds',
            JSON.stringify([
              {
                pwplId: plant.pwplId,
                macAddr:
                  'macAddr' in plant && typeof plant.macAddr === 'string' ? plant.macAddr : '',
              },
            ]),
          );
          setPwplIds([plant.pwplId]);
        }}
        onApplyMulti={(plants) => {
          const ids = plants.map((item) => item.pwplId);
          localStorage.setItem(
            'pwplIds',
            JSON.stringify(
              plants.map((item) => ({
                pwplId: item.pwplId,
                macAddr: 'macAddr' in item && typeof item.macAddr === 'string' ? item.macAddr : '',
              })),
            ),
          );
          setPwplIds(ids);
        }}
      />
    </>
  );
}
