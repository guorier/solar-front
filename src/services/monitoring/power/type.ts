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
