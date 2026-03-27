// services/monitoring/power/type.ts
export type GetMonitorPowerParams = {
  pwplIds: string[];
};

export type GetMonitorPowerItem = {
  deviceAddresses: number;
  equipmentType: string;
  gridPowerW: number;
  prevGridPowerW: number;
  dailyTotalPowerW: number;
  fluctuate: number;
  fluctuateRate: number;
  targetPwplId: string;
  timeStampStr: string;
  alrmCode: string;
  formattedEfficiency: number;
  pwplNm: string;
  irradianceWm2: number;
  temperatureC: number;
};

export type GetMonitorPowerRes = GetMonitorPowerItem[];

export type GetMonitorPowerInverterParams = {
  pwplId: string;
};

export type GetMonitorPowerInverterItem = {
  pwplId: string;
  pwplNm: string;
  eventRegDt: string;
  macAddr: string | null;
  gridPowerW: string | null;
  gridFrequencyHz: string | null;
  gridPowerFactor: string | null;
  inverterTempC: string | null;
  inverterTotalEnergy: string | null;
  inverterInsulationKohm: string | null;
  inverterStatus: string | null;
  deviceAddr: string | null;
  protocolVersion: string | null;
  powerOutageStatus: string | null;
  hex: string | null;
};

export type GetMonitorPowerInverterRes = GetMonitorPowerInverterItem[];

export type GetMonitorPowerWeatherParams = {
  pwplId: string;
};

export type GetMonitorPowerWeatherItem = {
  pwplId: string;
  pwplNm: string;
  macAddr: string | null;
  deviceAddr: string | null;
  eventRegDt: string;
  temperatureC: string | null;
  irradianceWm2: string | null;
  commModel: string | null;
  equipmentCode: string | null;
  protocolVersion: string | null;
  powerOutageStatus: string | null;
  panelTemperatureC: string | null;
};

export type GetMonitorPowerWeatherRes = GetMonitorPowerWeatherItem[];

export type GetMonitorPowerHexParams = {
  pwplId: string;
};

export type GetMonitorPowerHexItem = {
  pwplId: string;
  pwplNm: string;
  eventRegDt: string;
  macAddr: string | null;
  gridPowerW: string | null;
  gridFrequencyHz: string | null;
  gridPowerFactor: string | null;
  inverterTempC: string | null;
  inverterTotalEnergy: string | null;
  inverterInsulationKohm: string | null;
  inverterStatus: string | null;
  deviceAddr: string | null;
  protocolVersion: string | null;
  powerOutageStatus: string | null;
  hex: string | null;
};

export type GetMonitorPowerHexRes = GetMonitorPowerHexItem[];
