// power/MonitoringPow.tsx
'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ButtonComponent, TitleComponent } from '@/components';
import { ModalPlantSelector } from '@/constants/monitoring/ModalPlantSelector';
import MonitoringPowChart from './components/MonitoringPowChart';
import MonitoringPowTable from './components/MonitoringPowTable';
import { getPowerTrendHistory, PAGE_SIZE, parsePwplIds } from './monitoringPowMock';
import { PowerTrendChartSeries, PowerTrendRow } from './monitoringPowType';
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

type SocketHeader = {
  mac?: string;
  timeStamp?: string;
};

type SocketInverter = {
  deviceAddresses?: number | string;
  gridPowerW?: number | string;
  prevGridPowerW?: number | string;
  dailyTotalPowerW?: number | string;
  irradianceWm2?: number | string;
  solarRadiation?: number | string;
  temperatureC?: number | string;
  inverterTemperature?: number | string;
  formattedEfficiency?: number | string;
  efficiency?: number | string;
  fluctuate?: number | string;
  fluctuateRate?: number | string;
  alrmCode?: string;
};

type SocketPayload = {
  header?: SocketHeader;
  inverter?: SocketInverter;
  targetPwplId?: string;
  pwplId?: string;
  pwplNm?: string;
  plantName?: string;
  timeStampStr?: string;
};

const POLLING_INTERVAL = 60000;
// const POLLING_INTERVAL = 3000;
const REALTIME_SYNC_INTERVAL = 1000;

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

const parseJson = (value: string | null): unknown => {
  if (!value) {
    return null;
  }

  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
};

const getStatus = (alrmCode: string): PowerTrendRow['status'] => {
  return alrmCode === '000000' ? '정상' : '비정상';
};

const getSavedPlantItems = (): SavedPlantItem[] => {
  const parsedPwplIds = parseJson(localStorage.getItem('pwplIds'));

  if (!Array.isArray(parsedPwplIds)) {
    return [];
  }

  return parsedPwplIds.reduce<SavedPlantItem[]>((accumulator, item) => {
    if (typeof item === 'string') {
      return accumulator;
    }

    if (!isObjectRecord(item)) {
      return accumulator;
    }

    const pwplId = typeof item.pwplId === 'string' ? item.pwplId : '';
    const macAddr = typeof item.macAddr === 'string' ? item.macAddr : '';

    if (!pwplId) {
      return accumulator;
    }

    accumulator.push({
      pwplId,
      macAddr,
    });

    return accumulator;
  }, []);
};

const getSelectedMacAddrs = (): string[] => {
  const parsedMacAddrs = parseJson(localStorage.getItem('macAddrs'));

  if (!Array.isArray(parsedMacAddrs)) {
    return [];
  }

  return parsedMacAddrs
    .filter((item): item is string => typeof item === 'string' && item.trim().length > 0)
    .map((item) => item.trim().toUpperCase());
};

const extractSocketPayload = (value: unknown): SocketPayload[] => {
  if (Array.isArray(value)) {
    return value.flatMap((item) => extractSocketPayload(item));
  }

  if (!isObjectRecord(value)) {
    return [];
  }

  const header = isObjectRecord(value.header) ? (value.header as SocketHeader) : undefined;
  const inverter = isObjectRecord(value.inverter) ? (value.inverter as SocketInverter) : undefined;

  if (header?.mac && inverter) {
    return [
      {
        header,
        inverter,
        targetPwplId: typeof value.targetPwplId === 'string' ? value.targetPwplId : undefined,
        pwplId: typeof value.pwplId === 'string' ? value.pwplId : undefined,
        pwplNm: typeof value.pwplNm === 'string' ? value.pwplNm : undefined,
        plantName: typeof value.plantName === 'string' ? value.plantName : undefined,
        timeStampStr: typeof value.timeStampStr === 'string' ? value.timeStampStr : undefined,
      },
    ];
  }

  return Object.values(value).flatMap((item) => extractSocketPayload(item));
};

const buildRealtimeRows = (selectedPwplIds: string[]): PowerTrendRow[] => {
  const selectedMacAddrs = getSelectedMacAddrs();
  const savedPlantItems = getSavedPlantItems();
  const macToPwplIdMap = new Map<string, string>();

  savedPlantItems.forEach((item) => {
    if (item.macAddr) {
      macToPwplIdMap.set(item.macAddr.toUpperCase(), item.pwplId);
    }
  });

  const latestRows = new Map<string, PowerTrendRow>();

  for (let index = 0; index < localStorage.length; index += 1) {
    const storageKey = localStorage.key(index);

    if (!storageKey) {
      continue;
    }

    const parsedValue = parseJson(localStorage.getItem(storageKey));
    const payloads = extractSocketPayload(parsedValue);

    payloads.forEach((payload) => {
      const macAddr = payload.header?.mac?.toUpperCase();

      if (!macAddr) {
        return;
      }

      if (selectedMacAddrs.length > 0 && !selectedMacAddrs.includes(macAddr)) {
        return;
      }

      const plantId =
        payload.targetPwplId ?? payload.pwplId ?? macToPwplIdMap.get(macAddr) ?? macAddr;

      if (selectedPwplIds.length > 0 && !selectedPwplIds.includes(plantId)) {
        return;
      }

      const inverterId = String(payload.inverter?.deviceAddresses ?? macAddr);
      const rowId = `${plantId}__${inverterId}`;
      const currentTime =
        payload.timeStampStr ?? payload.header?.timeStamp ?? latestRows.get(rowId)?.time ?? '';

      const currentRow: PowerTrendRow = {
        id: rowId,
        plantId,
        plantName: payload.pwplNm ?? payload.plantName ?? plantId,
        inverterId,
        inverterName: `${inverterId}호`,
        time: currentTime,
        currentPowerW: toNumber(payload.inverter?.gridPowerW),
        previousPowerW: toNumber(payload.inverter?.prevGridPowerW),
        dayPowerMWh: round(toNumber(payload.inverter?.dailyTotalPowerW) / 1000, 3),
        irradianceWm2: toNumber(
          payload.inverter?.irradianceWm2 ?? payload.inverter?.solarRadiation,
        ),
        temperatureC: toNumber(
          payload.inverter?.temperatureC ?? payload.inverter?.inverterTemperature,
        ),
        inverterEfficiency: String(
          payload.inverter?.formattedEfficiency ?? payload.inverter?.efficiency ?? '',
        ),
        changedPowerW: toNumber(payload.inverter?.fluctuate),
        changeRate: round(toNumber(payload.inverter?.fluctuateRate), 1),
        status: getStatus(String(payload.inverter?.alrmCode ?? '000000')),
      };

      const previousRow = latestRows.get(rowId);

      if (!previousRow || toDateValue(currentRow.time) >= toDateValue(previousRow.time)) {
        latestRows.set(rowId, currentRow);
      }
    });
  }

  return Array.from(latestRows.values()).sort((a, b) => toDateValue(b.time) - toDateValue(a.time));
};

const mergeRowsWithRealtime = (
  apiRows: PowerTrendRow[],
  realtimeRows: PowerTrendRow[],
  page: number,
): PowerTrendRow[] => {
  if (realtimeRows.length === 0) {
    return apiRows;
  }

  const mergedMap = new Map<string, PowerTrendRow>();

  apiRows.forEach((item) => {
    mergedMap.set(item.id, item);
  });

  realtimeRows.forEach((item) => {
    mergedMap.set(item.id, item);
  });

  return Array.from(mergedMap.values())
    .sort((a, b) => toDateValue(b.time) - toDateValue(a.time))
    .slice(0, page * PAGE_SIZE);
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
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(Math.floor(POLLING_INTERVAL / 1000));
  const [refreshMotion, setRefreshMotion] = useState<boolean>(false);
  const pollingTimerRef = useRef<number | null>(null);
  const realtimeSyncTimerRef = useRef<number | null>(null);

  const syncRealtimeRows = useCallback(() => {
    const realtimeRows = buildRealtimeRows(pwplIds);

    if (realtimeRows.length === 0) {
      return;
    }

    setRows((prevRows) => mergeRowsWithRealtime(prevRows, realtimeRows, page));
    setLastUpdatedAt(Date.now());
    setElapsedSeconds(Math.floor(POLLING_INTERVAL / 1000));
  }, [page, pwplIds]);

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

      const realtimeRows = buildRealtimeRows(pwplIds);
      const mergedRows = mergeRowsWithRealtime(response.list, realtimeRows, page);

      setChartData(response.chart);
      setRows(mergedRows);
      setHasMore(response.hasMore);
      setLastUpdatedAt(Date.now());
      setElapsedSeconds(Math.floor(POLLING_INTERVAL / 1000));
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
    const realtimeRows = buildRealtimeRows(pwplIds);

    if (realtimeRows.length === 0) {
      return;
    }

    setRows(realtimeRows);
    setLastUpdatedAt(Date.now());
    setElapsedSeconds(Math.floor(POLLING_INTERVAL / 1000));
  }, [pwplIds]);

  useEffect(() => {
    setPage(1);
  }, [pwplIds]);

  useEffect(() => {
    void loadInitial();
  }, [loadInitial]);

  useEffect(() => {
    if (pwplIds.length === 0) {
      return;
    }

    const startPolling = (): void => {
      if (pollingTimerRef.current) {
        window.clearInterval(pollingTimerRef.current);
      }

      pollingTimerRef.current = window.setInterval(() => {
        void loadInitial();
      }, POLLING_INTERVAL);
    };

    startPolling();

    const handleVisibilityChange = (): void => {
      if (document.visibilityState === 'visible') {
        syncRealtimeRows();
        void loadInitial();
        startPolling();
      }
    };

    window.addEventListener('focus', handleVisibilityChange);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      if (pollingTimerRef.current) {
        window.clearInterval(pollingTimerRef.current);
      }

      window.removeEventListener('focus', handleVisibilityChange);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [loadInitial, pwplIds.length, syncRealtimeRows]);

  useEffect(() => {
    if (realtimeSyncTimerRef.current) {
      window.clearInterval(realtimeSyncTimerRef.current);
    }

    realtimeSyncTimerRef.current = window.setInterval(() => {
      syncRealtimeRows();
    }, REALTIME_SYNC_INTERVAL);

    return () => {
      if (realtimeSyncTimerRef.current) {
        window.clearInterval(realtimeSyncTimerRef.current);
      }
    };
  }, [syncRealtimeRows]);

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
      return `${Math.floor(POLLING_INTERVAL / 1000)}초 후 갱신`;
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
