// src/services/dashboard/type.ts

export type PwplDashboardSummary = {
  totalPlantCount: number;
  totalCapacityKw: number;
  currentPowerKw: number;
  avgOperationRate: number;
  todayGenerationKwh: number;
  yesterdayGenerationKwh: number;
  todayGenerationTime: number;
  yesterdayGenerationTime: number;
  currentGenerationAmount: number;
  yesterdayGenerationAmount: number;
  totalGenerationKwh: number;
};

export type PwplDashboardChartItem = {
  label: string;
  value: number;
};

export type PwplDashboardWeatherInfo = {
  pwplNm?: string;
  temperatureC: number;
  humidity: number;
  windSpeed: number;
  irradianceWm2: number;
  predcIrradianceWm2?: number;
  irradianceKwhM2?: number;
  predcOtpt?: number;
  predcEgqty?: number;
  pm10: number;
  pm25: number;
  sunrise?: string;
  sunset?: string;
  pr?: number;
};

export type PwplDashboardPlantDetail = {
  pwplId: string;
  pwplNm: string;
  capacityKw: number;
  currentPowerKw: number;
  todayGenerationKwh: number;
  operationRate: number;
  areaNm: string;
  pwplLat: number;
  pwplLot: number;
  occurredAt?: string;
};

export type PwplDashboardEntity = {
  summary: PwplDashboardSummary;
  chart: PwplDashboardChartItem[];
  weatherInfo: PwplDashboardWeatherInfo;
  plantDetail: PwplDashboardPlantDetail;
};

export type PwplDashboardSelectReq = {
  pwplIds: string[];
  chartType: 'TIME' | 'DAY';
  weatherPwplId?: string;
  detailPwplId?: string;
};
