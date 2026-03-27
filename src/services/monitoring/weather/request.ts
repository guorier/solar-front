// src/services/monitoring/weather/request.ts
import { plantClient } from '@/lib/http.lib';
import type { MonitorWeatherParams, MonitorWeatherRes } from './type';

/**
 * 발전소 날씨 조회
 * GET /api/weather/select
 */
export const getMonitorWeather = async (
  params: MonitorWeatherParams,
): Promise<MonitorWeatherRes> => {
  const res = await plantClient.get<MonitorWeatherRes>('/weather/select', {
    params,
  });

  return res.data;
};