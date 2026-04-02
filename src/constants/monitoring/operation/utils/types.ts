import type { MonitorOprateRes } from '@/services/monitoring/oprate/type';

export type MonitoringOpProps = {
  pwplIds: string[];
};

export type GenTableItem = MonitorOprateRes['genTable'][number] & {
  isTotal?: boolean;
};

export type DonutDataItem = {
  name: string;
  value: number;
  color: string;
  rawValue?: number;
  unit?: 'V' | '%' | 'Hz' | 'W' | 'kW' | 'Wh' | 'kWh' | 'W/m²' | '℃';
};

export type RealtimeData = {
  averageVoltage: number;
  gridPowerFactor: number;
  gridFrequencyHz: number;
  gridPowerW: number;
  todayPower: number;
  efficiency: number;
  inverterStatus: string;
  statusConnection: string;
  inverterTotalEnergy: number;
  modulePower: number;
  predictionPowerW: number;
  irradianceWm2: number;
  temperatureC: number;
};

export type RealtimeInverterItem = {
  deviceAddresses: number;
  sourceDeviceAddresses?: number;
  displayName?: string;
  pwplId?: string;
  uuid?: string;
  averageVoltage: number;
  gridPowerFactor: number;
  gridFrequencyHz: number;
  gridPowerW: number;
  todayPower: number;
  efficiency: number;
  inverterStatus: string;
  statusConnection: string;
  inverterTotalEnergy: number;
  modulePower: number;
  predictionPowerW: number;
  irradianceWm2: number;
  temperatureC: number;
  formattedAvgVoltage: number;
};

export type OperationChartSocketItem = {
  targetPwplId: string;
  powerW: number;
  todayPower: number;
  statusConnection: string;
  gridPowerFactor: number;
  gridFrequencyHz: number;
  inverterTotalEnergy: number;
  uuid: string;
  deviceAddresses: number;
  predictionPowerW: number;
  irradianceWm2: number;
  temperatureC: number;
  formattedAvgVoltage: number;
};

export type RealtimeMacMap = Record<string, Record<number, RealtimeInverterItem>>;

export type DashboardSocketPlantStatus = {
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
  averageVoltage?: number;
  gridPowerFactor?: number;
  gridFrequencyHz?: number;
  inverterStatus?: string;
  statusConnection?: string;
  inverterTotalEnergy?: number;
  modulePower?: number;
  irradianceWm2?: number;
  temperatureC?: number;
};

export type PowerDisplay = {
  value: number;
  unit: 'W' | 'kW';
};

export type EnergyDisplay = {
  value: number;
  unit: 'kWh' | 'MWh';
};

export type SavedPlantItem = {
  pwplId: string;
  pwplNm?: string;
  macAddr?: string;
};

export type RestoredSelection = {
  pwplIds: string[];
  plantNames: string[];
  macAddrs: string[];
};
