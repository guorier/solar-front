// services/monitoring/power/query.ts
import { useQuery } from '@tanstack/react-query';
import { getMonitorPower } from './request';
import type { GetMonitorPowerParams } from './type';

export const useGetMonitorPower = (params: GetMonitorPowerParams, enabled: boolean = true) => {
  return useQuery({
    queryKey: ['getMonitorPower', params.pwplIds],
    queryFn: () => getMonitorPower(params),
    enabled: enabled && params.pwplIds.length > 0,
    refetchInterval: 60000,
    refetchIntervalInBackground: true,
    staleTime: 0,
    refetchOnMount: 'always',
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });
};