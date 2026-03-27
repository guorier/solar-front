// services/monitoring/power/request.ts
import { plantClient } from '@/lib/http.lib';
import type {
  GetMonitorPowerHexParams,
  GetMonitorPowerHexRes,
  GetMonitorPowerInverterParams,
  GetMonitorPowerInverterRes,
  GetMonitorPowerParams,
  GetMonitorPowerRes,
  GetMonitorPowerWeatherParams,
  GetMonitorPowerWeatherRes,
} from './type';

/**
 * 운영 전력 추이 조회
 * POST /api/monitor/power/list
 */
export const getMonitorPower = async (
  params: GetMonitorPowerParams,
): Promise<GetMonitorPowerRes> => {
  const res = await plantClient.post<GetMonitorPowerRes>('/monitor/power/list', params);

  return res.data;
};

export const getMonitorPowerInverter = async (
  params: GetMonitorPowerInverterParams,
): Promise<GetMonitorPowerInverterRes> => {
  const res = await plantClient.get<GetMonitorPowerInverterRes>('/monitor/power/inverter', {
    params,
  });

  return res.data;
};

export const getMonitorPowerWeather = async (
  params: GetMonitorPowerWeatherParams,
): Promise<GetMonitorPowerWeatherRes> => {
  const res = await plantClient.get<GetMonitorPowerWeatherRes>('/monitor/power/weather', {
    params,
  });

  return res.data;
};

export const getMonitorPowerHex = async (
  params: GetMonitorPowerHexParams,
): Promise<GetMonitorPowerHexRes> => {
  const res = await plantClient.get<GetMonitorPowerHexRes>('/monitor/power/hex', {
    params,
  });

  return res.data;
};
