import { useSearchParams } from 'next/navigation';
import { MONITORING_OPERATION_SOCKET_CACHE_KEY, PIE_COLORS } from './constants';
import type {
  DashboardSocketPlantStatus,
  EnergyDisplay,
  OperationChartSocketItem,
  PowerDisplay,
  RealtimeData,
  RealtimeInverterItem,
  RealtimeMacMap,
  RestoredSelection,
  SavedPlantItem,
} from './types';

export const safeToFixed = (value: number | string | null | undefined, digits: number) => {
  const num = Number(value ?? 0);
  return Number((Number.isFinite(num) ? num : 0).toFixed(digits));
};

export const toChartValue = (value: number) => (value > 0 ? safeToFixed(value, 2) : 0.0001);

export const normalizeMac = (value: string | null | undefined) =>
  String(value ?? '')
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '');

export const getProgressPercent = (value: number, max: number) =>
  Math.min(safeToFixed((Math.max(value, 0) / max) * 100, 2), 100);

export const formatPowerDisplay = (value: number | null | undefined): PowerDisplay => {
  const safeValue = value ?? 0;

  if (safeValue >= 1000) {
    return {
      value: safeToFixed(safeValue / 1000, 2),
      unit: 'kW',
    };
  }

  return {
    value: safeToFixed(safeValue, 2),
    unit: 'W',
  };
};

export const formatEnergyDisplay = (value: number | null | undefined): EnergyDisplay => {
  const safeValue = value ?? 0;

  if (safeValue >= 1000) {
    return {
      value: safeToFixed(safeValue / 1000, 2),
      unit: 'MWh',
    };
  }

  return {
    value: safeToFixed(safeValue, 2),
    unit: 'kWh',
  };
};

export const getInverterColor = (deviceAddresses: number) =>
  PIE_COLORS[(Math.max(deviceAddresses, 1) - 1) % PIE_COLORS.length];

export const getSocketCurrentPowerW = (socketStatus?: DashboardSocketPlantStatus): number => {
  if (!socketStatus) return 0;

  if (typeof socketStatus.gridPowerW === 'number') {
    return socketStatus.gridPowerW;
  }

  if (typeof socketStatus.powerKw === 'number') {
    return socketStatus.powerKw * 1000;
  }

  if (typeof socketStatus.currentPowerKw === 'number') {
    return socketStatus.currentPowerKw * 1000;
  }

  return 0;
};

export const getSocketTodayGeneration = (socketStatus?: DashboardSocketPlantStatus): number => {
  if (!socketStatus) return 0;

  if (typeof socketStatus.todayGenerationKwh === 'number') {
    return socketStatus.todayGenerationKwh;
  }

  if (typeof socketStatus.todayGenerationMwh === 'number') {
    return socketStatus.todayGenerationMwh * 1000;
  }

  return 0;
};

export const normalizeSocketStatusMap = (
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

export const readSocketCacheMap = (): Record<string, DashboardSocketPlantStatus> => {
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

export const writeSocketCacheMap = (cacheMap: Record<string, DashboardSocketPlantStatus>) => {
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

export const mergeSocketStatusMapWithCache = (
  liveMap: Record<string, DashboardSocketPlantStatus>,
  cacheMap: Record<string, DashboardSocketPlantStatus>,
  selectedMacAddrs: string[],
): Record<string, DashboardSocketPlantStatus> => {
  const normalizedLiveMap = normalizeSocketStatusMap(liveMap);
  const normalizedCacheMap = normalizeSocketStatusMap(cacheMap);

  return selectedMacAddrs.reduce<Record<string, DashboardSocketPlantStatus>>((acc, macAddr) => {
    const normalizedMacAddr = normalizeMac(macAddr);

    if (!normalizedMacAddr) {
      return acc;
    }

    const liveItem = normalizedLiveMap[normalizedMacAddr];
    const cacheItem = normalizedCacheMap[normalizedMacAddr];

    if (liveItem) {
      acc[normalizedMacAddr] = liveItem;
      return acc;
    }

    if (cacheItem) {
      acc[normalizedMacAddr] = cacheItem;
    }

    return acc;
  }, {});
};

export const buildRealtimeMapFromSocketStatus = (
  socketStatusMap: Record<string, DashboardSocketPlantStatus>,
  selectedMacAddrs: string[],
): RealtimeMacMap => {
  const normalizedSocketStatusMap = normalizeSocketStatusMap(socketStatusMap);

  return selectedMacAddrs.reduce<RealtimeMacMap>((acc, macAddr, index) => {
    const normalizedMacAddr = normalizeMac(macAddr);
    const current = normalizedSocketStatusMap[normalizedMacAddr];

    if (!current) {
      return acc;
    }

    acc[normalizedMacAddr] = {
      1: {
        deviceAddresses: index + 1,
        averageVoltage: safeToFixed(current.averageVoltage, 2),
        gridPowerFactor: safeToFixed(current.gridPowerFactor, 2),
        gridFrequencyHz: safeToFixed(current.gridFrequencyHz, 2),
        gridPowerW: safeToFixed(getSocketCurrentPowerW(current), 2),
        todayPower: safeToFixed(getSocketTodayGeneration(current), 2),
        efficiency: 0,
        inverterStatus: current.topLevel ?? current.inverterStatus ?? '',
        statusConnection: current.statusConnection ?? '0',
        inverterTotalEnergy: safeToFixed(current.inverterTotalEnergy, 2),
        modulePower: safeToFixed(current.modulePower ?? getSocketCurrentPowerW(current), 2),
        predictionPowerW: safeToFixed(current.modulePower ?? getSocketCurrentPowerW(current), 2),
        irradianceWm2: safeToFixed(current.irradianceWm2, 2),
        temperatureC: safeToFixed(current.temperatureC, 2),
        formattedAvgVoltage: 0,
      },
    };

    return acc;
  }, {});
};

export const buildSelectedInverterMap = (
  next: RealtimeMacMap,
  selectedMacAddrs: string[],
): Record<number, RealtimeInverterItem> => {
  return selectedMacAddrs.reduce<Record<number, RealtimeInverterItem>>(
    (acc, selectedMac, macIndex) => {
      const normalizedMac = normalizeMac(selectedMac);
      const currentMap = next[normalizedMac] ?? {};

      Object.values(currentMap).forEach((item, itemIndex) => {
        const deviceAddress = macIndex * 100 + itemIndex + 1;

        acc[deviceAddress] = {
          ...item,
          deviceAddresses: deviceAddress,
          sourceDeviceAddresses: item.deviceAddresses,
          displayName: `인버터 ${item.deviceAddresses}`,
        };
      });

      return acc;
    },
    {},
  );
};

export const buildOperationSocketInverterMap = (
  operationChartDataMap: Record<string, OperationChartSocketItem[]>,
  selectedPwplIds: string[],
  selectedPlantNames: string[],
): Record<number, RealtimeInverterItem> => {
  const multiplePlants = selectedPwplIds.length > 1;

  return selectedPwplIds.reduce<Record<number, RealtimeInverterItem>>((acc, pwplId, plantIndex) => {
    const plantName = selectedPlantNames[plantIndex] ?? pwplId;
    const inverterItems = operationChartDataMap[pwplId] ?? [];

    inverterItems
      .slice()
      .sort((a, b) => a.deviceAddresses - b.deviceAddresses)
      .forEach((item, inverterIndex) => {
        const sourceDeviceAddress = item.deviceAddresses || inverterIndex + 1;
        const uniqueDeviceAddress = plantIndex * 1000 + sourceDeviceAddress;
        const displayName = multiplePlants
          ? `${plantName} 인버터 ${sourceDeviceAddress}`
          : `인버터 ${sourceDeviceAddress}`;

        acc[uniqueDeviceAddress] = {
          deviceAddresses: uniqueDeviceAddress,
          sourceDeviceAddresses: sourceDeviceAddress,
          displayName,
          pwplId,
          uuid: item.uuid,
          averageVoltage: safeToFixed(item.formattedAvgVoltage, 2),
          formattedAvgVoltage: safeToFixed(item.formattedAvgVoltage, 2),
          gridPowerFactor: safeToFixed(item.gridPowerFactor, 2),
          gridFrequencyHz: safeToFixed(item.gridFrequencyHz, 2),
          gridPowerW: safeToFixed(item.powerW, 2),
          todayPower: safeToFixed(item.todayPower, 2),
          efficiency: safeToFixed(item.statusConnection, 2),
          inverterStatus: '',
          statusConnection: String(item.statusConnection),
          inverterTotalEnergy: safeToFixed(item.inverterTotalEnergy, 2),
          modulePower: safeToFixed(item.predictionPowerW, 2),
          predictionPowerW: safeToFixed(item.predictionPowerW, 2),
          irradianceWm2: safeToFixed(item.irradianceWm2, 2),
          temperatureC: safeToFixed(item.temperatureC, 2),
        };
      });

    return acc;
  }, {});
};

export const aggregateRealtimeData = (
  inverterMap: Record<number, RealtimeInverterItem>,
): RealtimeData => {
  const values = Object.values(inverterMap);

  if (values.length === 0) {
    return {
      averageVoltage: 0,
      gridPowerFactor: 0,
      gridFrequencyHz: 0,
      gridPowerW: 0,
      todayPower: 0,
      efficiency: 0,
      inverterStatus: '',
      statusConnection: '',
      inverterTotalEnergy: 0,
      modulePower: 0,
      predictionPowerW: 0,
      irradianceWm2: 0,
      temperatureC: 0,
    };
  }

  const count = values.length;
  const lastItem = [...values].sort((a, b) => a.deviceAddresses - b.deviceAddresses)[count - 1];

  return {
    averageVoltage: safeToFixed(
      values.reduce((sum, item) => sum + item.averageVoltage, 0) / count,
      2,
    ),
    gridPowerFactor: safeToFixed(
      values.reduce((sum, item) => sum + item.gridPowerFactor, 0) / count,
      2,
    ),
    gridFrequencyHz: safeToFixed(
      values.reduce((sum, item) => sum + item.gridFrequencyHz, 0) / count,
      2,
    ),
    gridPowerW: safeToFixed(
      values.reduce((sum, item) => sum + item.gridPowerW, 0),
      2,
    ),
    todayPower: safeToFixed(
      values.reduce((sum, item) => sum + item.todayPower, 0),
      2,
    ),
    efficiency: safeToFixed(values.reduce((sum, item) => sum + item.efficiency, 0) / count, 2),
    inverterStatus: lastItem.inverterStatus,
    statusConnection: lastItem.statusConnection,
    inverterTotalEnergy: safeToFixed(
      values.reduce((sum, item) => sum + item.inverterTotalEnergy, 0),
      2,
    ),
    modulePower: safeToFixed(
      values.reduce((sum, item) => sum + item.modulePower, 0),
      2,
    ),
    predictionPowerW: safeToFixed(
      values.reduce((sum, item) => sum + item.predictionPowerW, 0),
      2,
    ),
    irradianceWm2: safeToFixed(
      values.reduce((sum, item) => sum + item.irradianceWm2, 0) / count,
      2,
    ),
    temperatureC: safeToFixed(values.reduce((sum, item) => sum + item.temperatureC, 0) / count, 2),
  };
};

export const getRestoredSelection = (
  searchParams: ReturnType<typeof useSearchParams>,
  initialPwplIds: string[],
): RestoredSelection => {
  const paramPwplIds = searchParams.get('pwplIds');
  const paramPwplNms = searchParams.get('pwplNms');
  const paramMacAddrs = searchParams.get('macAddrs');

  if (paramPwplIds || paramPwplNms || paramMacAddrs) {
    return {
      pwplIds: (paramPwplIds ?? '')
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean),
      plantNames: (paramPwplNms ?? '')
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean),
      macAddrs: (paramMacAddrs ?? '')
        .split(',')
        .map((item) => normalizeMac(item))
        .filter(Boolean),
    };
  }

  if (typeof window === 'undefined') {
    return {
      pwplIds: initialPwplIds,
      plantNames: [],
      macAddrs: [],
    };
  }

  const savedPwplIds = localStorage.getItem('pwplIds');
  const savedPlantNames = localStorage.getItem('pwplNms');
  const savedMacAddrs = localStorage.getItem('macAddrs');

  let nextPwplIds: string[] = initialPwplIds;
  let nextPlantNames: string[] = [];
  let nextMacAddrs: string[] = [];

  if (savedPwplIds) {
    try {
      const parsedPwplIds = JSON.parse(savedPwplIds) as Array<string | SavedPlantItem>;

      if (Array.isArray(parsedPwplIds) && parsedPwplIds.length > 0) {
        if (typeof parsedPwplIds[0] === 'string') {
          nextPwplIds = parsedPwplIds as string[];
        } else {
          const parsedPlantItems = parsedPwplIds as SavedPlantItem[];
          nextPwplIds = parsedPlantItems.map((item) => item.pwplId);

          // 객체 안의 값 우선 사용 (별도 키보다 항상 우선)
          const itemNames = parsedPlantItems.map((item) => item.pwplNm ?? '').filter(Boolean);
          const itemMacs = parsedPlantItems
            .map((item) => normalizeMac(item.macAddr))
            .filter(Boolean);

          if (itemNames.length > 0) nextPlantNames = itemNames;
          if (itemMacs.length > 0) nextMacAddrs = itemMacs;
        }
      }
    } catch {
      nextPwplIds = initialPwplIds;
    }
  }

  if (savedPlantNames) {
    try {
      nextPlantNames = (JSON.parse(savedPlantNames) as string[]).filter(Boolean);
    } catch {
      nextPlantNames = [];
    }
  }

  if (savedMacAddrs) {
    try {
      nextMacAddrs = (JSON.parse(savedMacAddrs) as string[])
        .map((item) => normalizeMac(item))
        .filter(Boolean);
    } catch {
      nextMacAddrs = [];
    }
  }

  return {
    pwplIds: nextPwplIds,
    plantNames: nextPlantNames,
    macAddrs: nextMacAddrs,
  };
};
