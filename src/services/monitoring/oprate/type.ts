/**
 * 운영 모니터링 조회 파라미터
 * POST /api/monitor/oprate/select
 */
export interface MonitorOprateParams {
  pwplIds: string[];
}

export interface WeatherSummary {
  temperatureC: number;
  humidity: number;
  windSpeed: number;
  irradianceWm2: number;
  pm10: number;
  pm25: number;
}

export interface PlantSummary {
  currentPowerKw: number;
  capacityKw: number;
  operationRate: number;
  normalEquip: number;
  totalEquip: number;
  avgEfficiency: number;
}

export interface EquipStatus {
  total: number;
  normal: number;
  checking: number;
  error: number;
}

export interface GenGauge {
  lastMonthMwh: number;
  thisMonthMwh: number;
  yesterdayMwh: number;
  currentMwh: number;
}

export interface GenTableItem {
  label: string;
  genTimeH: number;
  genMwh: number;
  invMwh: number;
  acdcRate: number;
  co2Tco2: number;
}

export interface PerformanceItem {
  label: string;
  value: number;
}

export interface MonitorOprateRes {
  occurredAt: string | null;
  weatherSummary: WeatherSummary;
  plantSummary: PlantSummary;
  equipStatus: EquipStatus;
  genGauge: GenGauge;
  genTable: GenTableItem[];
  performance: PerformanceItem[];
}