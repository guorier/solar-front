// src/services/dashboard/query.ts

import { useQuery } from '@tanstack/react-query';
import { postDashboardSelect } from './request';
import type { PwplDashboardSelectReq } from './type';

export const DASHBOARD_SELECT_POLLING_MS = 5 * 60 * 1000;

export const usePostDashboardSelect = (body: PwplDashboardSelectReq) => {
  return useQuery({
    queryKey: ['dashboard', body.pwplIds, body.chartType, body.weatherPwplId, body.detailPwplId],
    queryFn: () => postDashboardSelect(body),
    enabled: body.pwplIds.length > 0,
    refetchInterval: body.pwplIds.length > 0 ? DASHBOARD_SELECT_POLLING_MS : false,
    refetchIntervalInBackground: true,
  });
};
