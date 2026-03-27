// src/services/dashboard/type.ts

export type PwplDashboardSummary = {
  totalPlantCount: number;
  totalCapacityKw: number;
  currentPowerKw: number;
  avgOperationRate: number;
  todayGenerationMwh: number;
  yesterdayGenerationMwh: number;
};

export type PwplDashboardChartItem = {
  label: string;
  value: number;
};

export type PwplDashboardWeatherInfo = {
  temperatureC: number;
  humidity: number;
  windSpeed: number;
  irradianceWm2: number;
  pm10: number;
  pm25: number;
};

export type PwplDashboardPlantDetail = {
  pwplId: string;
  pwplNm: string;
  capacityKw: number;
  currentPowerKw: number;
  todayGenerationMwh: number;
  operationRate: number;
  areaNm: string;
  pwplLat: number;
  pwplLot: number;
};

export type PwplDashboardEntity = {
  summary: PwplDashboardSummary;
  chart: PwplDashboardChartItem[];
  weatherInfo: PwplDashboardWeatherInfo;
  plantDetail: PwplDashboardPlantDetail;
  occurredAt: string;
};

export type PwplDashboardSelectReq = {
  pwplIds: string[];
  chartType: 'TIME' | 'DAY';
  weatherPwplId?: string;
  detailPwplId?: string;
};
