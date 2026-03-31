'use client';

import { useState, useEffect } from 'react';
import { Icons } from '@/components';

interface PollingCountdownProps {
  intervalMs: number;
  lastUpdatedAt: number;
}

export function PollingCountdown({ intervalMs, lastUpdatedAt }: PollingCountdownProps) {
  const [remaining, setRemaining] = useState(intervalMs);

  useEffect(() => {
    const tick = () => {
      const elapsed = Date.now() - lastUpdatedAt;
      setRemaining(Math.max(0, intervalMs - elapsed));
    };

    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [intervalMs, lastUpdatedAt]);

  const minutes = Math.floor(remaining / 60000);
  const seconds = Math.floor((remaining % 60000) / 1000);

  return (
    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
      <Icons iName="refresh" size={16} />
      <span style={{ fontSize: 'var(--font-size-17)', width: '50px' }}>
        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </span>
    </div>
  );
}
