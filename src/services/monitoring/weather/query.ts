// src/services/monitoring/weather/query.ts
import { useQuery } from '@tanstack/react-query';
import { getMonitorWeather } from './request';
import { MonitorWeatherParams } from './type';

export const useGetMonitorWeather = (params: MonitorWeatherParams, enabled: boolean = true) => {
  return useQuery({
    queryKey: ['monitor', 'weather', params.pwplId],
    queryFn: () => getMonitorWeather(params),
    enabled: enabled && Boolean(params.pwplId),
  });
};
