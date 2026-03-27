// src/components/currentTime/useCurrentTime.ts
import { useState, useEffect } from 'react';

type TimeNowResponse = {
  datetime?: string;
  unixtime?: number;
  timezone?: string;
};

export default function useCurrentTime() {
  const [time, setTime] = useState<Date | null>(null);

  useEffect(() => {
    let timerId: ReturnType<typeof setInterval> | null = null;
    let timeOffset = 0;

    const fetchServerTime = async () => {
      try {
        const res = await fetch('https://time.now/developer/api/timezone/Asia/Seoul');
        const data: TimeNowResponse = await res.json();

        if (typeof data.unixtime === 'number') {
          timeOffset = data.unixtime * 1000 - Date.now();
        } else if (typeof data.datetime === 'string') {
          timeOffset = new Date(data.datetime).getTime() - Date.now();
        }
      } catch {
        console.warn('서버 시간 동기화 실패, 로컬 시간을 사용합니다.');
        timeOffset = 0;
      } finally {
        setTime(new Date(Date.now() + timeOffset));

        timerId = setInterval(() => {
          setTime(new Date(Date.now() + timeOffset));
        }, 1000);
      }
    };

    fetchServerTime();

    const syncOnVisible = () => {
      if (!document.hidden) {
        setTime(new Date(Date.now() + timeOffset));
      }
    };

    document.addEventListener('visibilitychange', syncOnVisible);

    return () => {
      if (timerId) clearInterval(timerId);
      document.removeEventListener('visibilitychange', syncOnVisible);
    };
  }, []);

  return time;
}
