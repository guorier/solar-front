import { useState, useEffect } from 'react';

export default function useCurrentTime() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    // 1초마다 OS의 정확한 현재 시간을 가져와서 업데이트
    // 브라우저가 인터벌을 지연시키더라도, 실행될 때마다 실제 시간을 렌더링하므로 오차가 누적되지 않음
    const timerId = setInterval(() => {
      setTime(new Date());
    }, 1000);

    // [핵심] 사용자가 다른 탭에 있다가 시계 탭으로 돌아왔을 때 즉시 시간을 동기화
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        setTime(new Date());
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    // 컴포넌트 언마운트 시 클린업
    return () => {
      clearInterval(timerId);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return time;
}
