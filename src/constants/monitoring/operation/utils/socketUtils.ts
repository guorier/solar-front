import { MONITORING_OPERATION_SOCKET_CACHE_KEY, PIE_COLORS } from './constants';
import { safeToFixed } from './utils';
import type {
  DashboardSocketPlantStatus,
  OperationChartSocketItem,
  RealtimeData,
  RealtimeInverterItem,
  RealtimeMacMap,
} from './types';

export const normalizeMac = (value: string | null | undefined) =>
  String(value ?? '')
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '');

export const getInverterColor = (deviceAddresses: number) =>
  PIE_COLORS[(Math.max(deviceAddresses, 1) - 1) % PIE_COLORS.length];

export const normalizeSocketStatusMap = (
  socketStatusMap: Record<string, DashboardSocketPlantStatus>,
): Record<string, DashboardSocketPlantStatus> => {
  return Object.entries(socketStatusMap).reduce<Record<string, DashboardSocketPlantStatus>>(
    (acc, [key, value]) => {
      const normalizedKey = normalizeMac(key);
      if (normalizedKey) acc[normalizedKey] = value;
      return acc;
    },
    {},
  );
};

export const getSocketCurrentPowerW = (socketStatus?: DashboardSocketPlantStatus): number => {
  if (!socketStatus) return 0;
  if (typeof socketStatus.gridPowerW === 'number') return socketStatus.gridPowerW;
  if (typeof socketStatus.powerKw === 'number') return socketStatus.powerKw * 1000;
  if (typeof socketStatus.currentPowerKw === 'number') return socketStatus.currentPowerKw * 1000;
  return 0;
};

export const getSocketTodayGeneration = (socketStatus?: DashboardSocketPlantStatus): number => {
  if (!socketStatus) return 0;
  if (typeof socketStatus.todayGenerationKwh === 'number') return socketStatus.todayGenerationKwh;
  if (typeof socketStatus.todayGenerationMwh === 'number')
    return socketStatus.todayGenerationMwh * 1000;
  return 0;
};

export const readSocketCacheMap = (): Record<string, DashboardSocketPlantStatus> => {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(MONITORING_OPERATION_SOCKET_CACHE_KEY);
    if (!raw) return {};
    return normalizeSocketStatusMap(JSON.parse(raw) as Record<string, DashboardSocketPlantStatus>);
  } catch {
    return {};
  }
};

export const writeSocketCacheMap = (cacheMap: Record<string, DashboardSocketPlantStatus>) => {
  if (typeof window === 'undefined') return;
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
    if (!normalizedMacAddr) return acc;
    const liveItem = normalizedLiveMap[normalizedMacAddr];
    const cacheItem = normalizedCacheMap[normalizedMacAddr];
    if (liveItem) acc[normalizedMacAddr] = liveItem;
    else if (cacheItem) acc[normalizedMacAddr] = cacheItem;
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
    if (!current) return acc;

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
    averageVoltage: safeToFixed(values.reduce((s, i) => s + i.averageVoltage, 0) / count, 2),
    gridPowerFactor: safeToFixed(values.reduce((s, i) => s + i.gridPowerFactor, 0) / count, 2),
    gridFrequencyHz: safeToFixed(values.reduce((s, i) => s + i.gridFrequencyHz, 0) / count, 2),
    gridPowerW: safeToFixed(
      values.reduce((s, i) => s + i.gridPowerW, 0),
      2,
    ),
    todayPower: safeToFixed(
      values.reduce((s, i) => s + i.todayPower, 0),
      2,
    ),
    efficiency: safeToFixed(values.reduce((s, i) => s + i.efficiency, 0) / count, 2),
    inverterStatus: lastItem.inverterStatus,
    statusConnection: lastItem.statusConnection,
    inverterTotalEnergy: safeToFixed(
      values.reduce((s, i) => s + i.inverterTotalEnergy, 0),
      2,
    ),
    modulePower: safeToFixed(
      values.reduce((s, i) => s + i.modulePower, 0),
      2,
    ),
    predictionPowerW: safeToFixed(
      values.reduce((s, i) => s + i.predictionPowerW, 0),
      2,
    ),
    irradianceWm2: safeToFixed(values.reduce((s, i) => s + i.irradianceWm2, 0) / count, 2),
    temperatureC: safeToFixed(values.reduce((s, i) => s + i.temperatureC, 0) / count, 2),
  };
};
