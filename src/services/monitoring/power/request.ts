// services/monitoring/power/request.ts
import { plantClient } from '@/lib/http.lib';
import type { GetMonitorPowerParams, GetMonitorPowerRes } from './type';

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