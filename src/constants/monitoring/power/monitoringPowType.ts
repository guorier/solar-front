// power/monitoringPowType.ts
export type TrendRange = '12' | '24' | '48';

export type PowerStatus = '정상' | '비정상';

export type PowerTrendChartItem = {
  time: string;
  close: number;
  status: PowerStatus;
};

export type PowerTrendChartSeries = {
  plantId: string;
  plantName: string;
  inverterId: string;
  inverterName: string;
  data: PowerTrendChartItem[];
};

export type PowerTrendRow = {
  id: string;
  plantId: string;
  plantName: string;
  inverterId: string;
  inverterName: string;
  time: string;
  currentPowerW: number;
  previousPowerW: number;
  dayPowerMWh: number;
  irradianceWm2: number;
  temperatureC: number;
  inverterEfficiency: string;
  changedPowerW: number;
  changeRate: number;
  status: PowerStatus;
};

export type PowerTrendLogRow = {
  id: string;
  plantId: string;
  plantName: string;
  inverterId: string;
  inverterName: string;
  time: string;
  logLevel: 'INFO' | 'WARN' | 'ERROR';
  message: string;
  currentPowerW: number;
  previousPowerW: number;
  changedPowerW: number;
  changeRate: number;
  temperatureC: number;
};

export type PowerTrendResponse = {
  chart: PowerTrendChartSeries[];
  list: PowerTrendRow[];
  hasMore: boolean;
};

export type PowerTrendParams = {
  rangeHour: TrendRange;
  pwplIds: string[];
  page: number;
  size: number;
};