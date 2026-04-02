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

    eventSource.onopen = () => {
      console.log(
        '[DashboardSSE] open — readyState:',
        eventSource.readyState,
        '| url:',
        eventSource.url,
      );
    };

    eventSource.addEventListener('dashboard-connected', (e) => {
      console.log('[DashboardSSE] connected', (e as MessageEvent).data);
    });

    eventSource.addEventListener('dashboard-refresh', (e) => {
      console.log('[DashboardSSE] refresh', (e as MessageEvent).data);
      handleRefresh();
    });

    eventSource.addEventListener('dashboard-ping', (e) => {
      console.log('[DashboardSSE] ping', (e as MessageEvent).data);
    });

    eventSource.onerror = (error) => {
      console.error('[DashboardSSE] error — readyState:', eventSource.readyState, error);
      // readyState: 0=CONNECTING, 1=OPEN, 2=CLOSED
    };

    return () => {
      eventSource.close();
      eventSourceRef.current = null;
    };
  }, [handleRefresh]);
}
