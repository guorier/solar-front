// power/monitoringPowMock.ts
import { getMonitorPower } from '@/services/monitoring/power/request';
import type { GetMonitorPowerItem, GetMonitorPowerParams } from '@/services/monitoring/power/type';
import {
  PowerTrendChartItem,
  PowerTrendChartSeries,
  PowerTrendLogRow,
  PowerTrendParams,
  PowerTrendResponse,
  PowerTrendRow,
  PowerStatus,
} from './monitoringPowType';

export const PAGE_SIZE = 20;

const round = (value: number, digit: number = 2): number => {
  const factor = 10 ** digit;
  return Math.round(value * factor) / factor;
};

export const parsePwplIds = (value: string): string[] => {
  if (!value.trim()) {
    return [];
  }

  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
};

const toDate = (value: string): Date => {
  return new Date(value.replace(' ', 'T'));
};

const makeRowId = (plantId: string, inverterId: string): string => {
  return `${plantId}__${inverterId}`;
};

const parseRowId = (id: string): { plantId: string; inverterId: string } => {
  const [plantId, inverterId] = id.split('__');

  return {
    plantId,
    inverterId,
  };
};

export const formatInverterName = (value: number | string | null | undefined): string => {
  const stringValue = String(value ?? '').trim();

  if (!stringValue) {
    return '-';
  }

  return stringValue;
};

const getStatus = (alrmCode: string): PowerStatus => {
  return alrmCode === '000000' ? '정상' : '비정상';
};

const getLogLevel = (alrmCode: string): PowerTrendLogRow['logLevel'] => {
  if (alrmCode === '000000') {
    return 'INFO';
  }

  if (alrmCode.startsWith('13')) {
    return 'ERROR';
  }

  return 'WARN';
};

const getLogMessage = (alrmCode: string): string => {
  if (alrmCode === '000000') {
    return '정상 수집';
  }

  if (alrmCode === '130310') {
    return '인버터 통신 이상';
  }

  if (alrmCode === '130311') {
    return '인버터 상태 이상';
  }

  return `알람 코드 ${alrmCode}`;
};

const fetchPowerListByPwplId = async (pwplId: string): Promise<GetMonitorPowerItem[]> => {
  const params: GetMonitorPowerParams = {
    pwplIds: [pwplId],
  };

  return getMonitorPower(params);
};

const fetchPowerList = async (pwplIds: string[]): Promise<GetMonitorPowerItem[]> => {
  if (pwplIds.length === 0) {
    return [];
  }

  const params: GetMonitorPowerParams = {
    pwplIds,
  };

  return getMonitorPower(params);
};

const sortDesc = (items: GetMonitorPowerItem[]): GetMonitorPowerItem[] => {
  return [...items].sort(
    (a, b) => toDate(b.timeStampStr).getTime() - toDate(a.timeStampStr).getTime(),
  );
};

const sortAsc = (items: GetMonitorPowerItem[]): GetMonitorPowerItem[] => {
  return [...items].sort(
    (a, b) => toDate(a.timeStampStr).getTime() - toDate(b.timeStampStr).getTime(),
  );
};

const mapToRows = (items: GetMonitorPowerItem[]): PowerTrendRow[] => {
  const latestMap = new Map<string, GetMonitorPowerItem>();

  sortDesc(items).forEach((item) => {
    const inverterId = String(item.deviceAddresses);
    const rowId = makeRowId(item.targetPwplId, inverterId);

    if (!latestMap.has(rowId)) {
      latestMap.set(rowId, item);
    }
  });

  return Array.from(latestMap.values()).map((item) => {
    const inverterId = String(item.deviceAddresses);

    return {
      id: makeRowId(item.targetPwplId, inverterId),
      plantId: item.targetPwplId,
      plantName: item.pwplNm ?? item.targetPwplId,
      inverterId,
      inverterName: formatInverterName(item.deviceAddresses),
      time: item.timeStampStr,
      currentPowerW: item.gridPowerW,
      previousPowerW: item.prevGridPowerW,
      dayPowerMWh: round(item.dailyTotalPowerW / 1000, 3),
      irradianceWm2: item.irradianceWm2 ?? 0,
      temperatureC: item.temperatureC ?? 0,
      inverterEfficiency: String(item.formattedEfficiency ?? ''),
      changedPowerW: item.fluctuate,
      changeRate: round(item.fluctuateRate, 1),
      status: getStatus(item.alrmCode),
    };
  });
};

const mapToChart = (items: GetMonitorPowerItem[]): PowerTrendChartSeries[] => {
  const grouped = new Map<string, GetMonitorPowerItem[]>();

  sortAsc(items).forEach((item) => {
    const inverterId = String(item.deviceAddresses);
    const rowId = makeRowId(item.targetPwplId, inverterId);
    const bucket = grouped.get(rowId) ?? [];

    bucket.push(item);
    grouped.set(rowId, bucket);
  });

  return Array.from(grouped.values()).map((bucket) => {
    const latest = bucket[bucket.length - 1];
    const inverterId = String(latest.deviceAddresses);
    const data: PowerTrendChartItem[] = bucket.map((item) => ({
      time: item.timeStampStr,
      close: item.gridPowerW,
      status: getStatus(item.alrmCode),
    }));

    return {
      plantId: latest.targetPwplId,
      plantName: latest.pwplNm ?? latest.targetPwplId,
      inverterId,
      inverterName: formatInverterName(latest.deviceAddresses),
      data,
    };
  });
};

// 🔥 realtime localStorage
const getRealtimeMap = () => {
  try {
    const raw = localStorage.getItem('monitoringPower');
    if (!raw) return new Map();

    const parsed = JSON.parse(raw) as GetMonitorPowerItem[];

    const map = new Map<string, GetMonitorPowerItem>();

    parsed.forEach((item) => {
      const key = `${item.targetPwplId}__${item.deviceAddresses}`;
      map.set(key, item);
    });

    return map;
  } catch {
    return new Map();
  }
};
export const getPowerTrendHistory = async (
  params: PowerTrendParams,
): Promise<PowerTrendResponse> => {
  const apiItems = await fetchPowerList(params.pwplIds);

  const rows = mapToRows(apiItems);
  const chart = mapToChart(apiItems);

  // 🔥 추가 시작
  const realtimeMap = getRealtimeMap();

  const mergedRows = rows.map((row) => {
    const realtime = realtimeMap.get(row.id);
    if (!realtime) return row;

    return {
      ...row,
      currentPowerW: realtime.gridPowerW,
      previousPowerW: realtime.prevGridPowerW,
      changedPowerW: realtime.fluctuate,
      changeRate: round(realtime.fluctuateRate, 1),
    };
  });

  const mergedChart = chart.map((series) => {
    const key = `${series.plantId}__${series.inverterId}`;
    const realtime = realtimeMap.get(key);

    if (!realtime) return series;

    const last = series.data[series.data.length - 1];

    return {
      ...series,
      data: [
        ...series.data.slice(0, -1),
        {
          ...last,
          close: realtime.gridPowerW,
        },
      ],
    };
  });
  // 🔥 추가 끝

  const sortedRows = [...mergedRows].sort(
    (a, b) => toDate(b.time).getTime() - toDate(a.time).getTime(),
  );

  const visibleRows = sortedRows.slice(0, params.page * params.size);

  return {
    chart: mergedChart,
    list: visibleRows,
    hasMore: sortedRows.length > params.page * params.size,
  };
};

export const getPowerTrendLogList = async (id: string): Promise<PowerTrendLogRow[]> => {
  const { plantId, inverterId } = parseRowId(id);
  const apiItems = await fetchPowerListByPwplId(plantId);

  return sortDesc(apiItems)
    .filter((item) => String(item.deviceAddresses) === inverterId)
    .map((item, index) => ({
      id: `${id}-${index + 1}`,
      plantId: item.targetPwplId,
      plantName: item.pwplNm ?? item.targetPwplId,
      inverterId: String(item.deviceAddresses),
      inverterName: formatInverterName(item.deviceAddresses),
      time: item.timeStampStr,
      logLevel: getLogLevel(item.alrmCode),
      message: getLogMessage(item.alrmCode),
      currentPowerW: item.gridPowerW,
      previousPowerW: item.prevGridPowerW,
      changedPowerW: item.fluctuate,
      changeRate: round(item.fluctuateRate, 1),
      temperatureC: 0,
    }));
};
