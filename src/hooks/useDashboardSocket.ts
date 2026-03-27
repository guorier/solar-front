'use client';

import { useState } from 'react';
import { useRealtimeSocket } from '@/hooks/useRealtimeSocket';

type InverterErrors = {
  topLevel?: 'NORMAL' | 'MAJOR' | 'CRITICAL';
  topMessage?: string;
  criticalCount?: number;
};

type SocketMessage = {
  header?: {
    mac?: string;
  };
  inverter?: {
    gridPowerW?: number;
    inverterErrors?: InverterErrors;
  };
};

export function useDashboardSocket(mac: string | string[] | undefined) {
  const [socketStatusMap, setSocketStatusMap] = useState<
    Record<
      string,
      {
        topLevel?: 'NORMAL' | 'MAJOR' | 'CRITICAL';
        topMessage?: string;
        criticalCount?: number;
        powerKw?: number;
      }
    >
  >({});

  useRealtimeSocket({
    mac,
    onMessage: (json) => {
      const data = json as SocketMessage;

      const powerKw = Number(((data.inverter?.gridPowerW ?? 0) / 1000).toFixed(1));
      const macKey = data.header?.mac;

      if (!macKey) return;

      setSocketStatusMap((prev) => ({
        ...prev,
        [macKey]: {
          topLevel: data.inverter?.inverterErrors?.topLevel,
          topMessage: data.inverter?.inverterErrors?.topMessage,
          criticalCount: data.inverter?.inverterErrors?.criticalCount,
          powerKw,
        },
      }));
    },
  });

  return socketStatusMap;
}