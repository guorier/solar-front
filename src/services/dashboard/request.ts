// src/services/dashboard/request.ts
import { plantClient } from '@/lib/http.lib';
import type { PwplDashboardEntity, PwplDashboardSelectReq } from './type';

export const postDashboardSelect = async (
  body: PwplDashboardSelectReq,
): Promise<PwplDashboardEntity> => {
  const { data } = await plantClient.post<PwplDashboardEntity>('/dashboard/select', body);

  return data;
};
