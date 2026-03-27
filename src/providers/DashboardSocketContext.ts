'use client';

import { createContext, useContext } from 'react';
import type { useDashboardSocket } from '@/hooks/useDashboardSocket';

type DashboardSocketMap = ReturnType<typeof useDashboardSocket>;

export const DashboardSocketContext = createContext<DashboardSocketMap>({} as DashboardSocketMap);

export function useDashboardSocketContext() {
  return useContext(DashboardSocketContext);
}
