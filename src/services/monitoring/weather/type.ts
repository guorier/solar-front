// src/services/monitoring/weather/type.ts
export type MonitorWeatherParams = {
  pwplId: string;
};

export type MonitorWeatherRes = {
  pwplId: string;
  pwplNm: string;
  nx: number;
  ny: number;
  lat: number;
  lon: number;
  stationName: string;
  instlCpct: number;
  pr: number;
  grdnt: number;
  az: number;
  tmpr: string;
  hmdt: string;
  wndSpd: string;
  pm10: string;
  pm25: string;
};