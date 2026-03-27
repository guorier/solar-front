// services/monitoring/power/query.ts
import { useQuery } from '@tanstack/react-query';
import {
  getMonitorPower,
  getMonitorPowerHex,
  getMonitorPowerInverter,
  getMonitorPowerWeather,
} from './request';
import type {
  GetMonitorPowerHexParams,
  GetMonitorPowerInverterParams,
  GetMonitorPowerParams,
  GetMonitorPowerWeatherParams,
} from './type';

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

export const useGetMonitorPowerInverter = (
  params: GetMonitorPowerInverterParams,
  enabled: boolean = true,
) => {
  return useQuery({
    queryKey: ['getMonitorPowerInverter', params.pwplId],
    queryFn: () => getMonitorPowerInverter(params),
    enabled: enabled && Boolean(params.pwplId),
  });
};

export const useGetMonitorPowerWeather = (
  params: GetMonitorPowerWeatherParams,
  enabled: boolean = true,
) => {
  return useQuery({
    queryKey: ['getMonitorPowerWeather', params.pwplId],
    queryFn: () => getMonitorPowerWeather(params),
    enabled: enabled && Boolean(params.pwplId),
  });
};

export const useGetMonitorPowerHex = (
  params: GetMonitorPowerHexParams,
  enabled: boolean = true,
) => {
  return useQuery({
    queryKey: ['getMonitorPowerHex', params.pwplId],
    queryFn: () => getMonitorPowerHex(params),
    enabled: enabled && Boolean(params.pwplId),
  });
};
