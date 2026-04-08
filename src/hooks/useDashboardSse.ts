'use client';

import { useCallback, useEffect, useRef } from 'react';

type UseDashboardSseProps = {
  onRefresh: () => void;
};

export function useDashboardSse({ onRefresh }: UseDashboardSseProps) {
  const eventSourceRef = useRef<EventSource | null>(null);
  const onRefreshRef = useRef(onRefresh);

  useEffect(() => {
    onRefreshRef.current = onRefresh;
  }, [onRefresh]);

  const handleRefresh = useCallback(() => {
    console.log('[DashboardSSE] refresh');
    onRefreshRef.current();
  }, []);

  useEffect(() => {
    const eventSource = new EventSource('/plant/api/dashboard/stream', {
      withCredentials: true,
    });

    eventSourceRef.current = eventSource;

    eventSource.addEventListener('dashboard-connected', () => {
      console.log('[DashboardSSE] connected');
    });

    eventSource.addEventListener('dashboard-refresh', handleRefresh);

    eventSource.addEventListener('dashboard-ping', () => {
      console.log('[DashboardSSE] ping');
    });

    eventSource.onerror = (error) => {
      console.error('[DashboardSSE] error', error);
    };

    return () => {
      eventSource.close();
      eventSourceRef.current = null;
    };
  }, [handleRefresh]);
}
