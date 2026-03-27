// src/components/currentTime/currentTime.tsx
'use client';

import { useEffect, useState } from 'react';
import { Icons } from '@/components';
import styled from 'styled-components';
import useCurrentTime from './useCurrentTime';

const TimeWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;

  padding: 10px 16px;
  border-radius: 8px;
  background: #f6f6f6;
`;

const TimeGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const Timeicon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
`;

const TimeTextBold = styled.div`
  font-size: var(--font-size-17);
  font-weight: 700;
  color: #444242;
`;

const TimeTextNormal = styled.div`
  font-size: var(--font-size-17);
  font-weight: 500;
  color: #444242;
`;

export function CurrentTime() {
  const [mounted, setMounted] = useState(false);
  const [timeStr, setTimeStr] = useState({ date: '----.--.--', time: '--:--:--' });
  const time = useCurrentTime();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!time) return;

    const year = time.getFullYear();
    const month = String(time.getMonth() + 1).padStart(2, '0');
    const date = String(time.getDate()).padStart(2, '0');
    const hour = String(time.getHours()).padStart(2, '0');
    const minute = String(time.getMinutes()).padStart(2, '0');
    const second = String(time.getSeconds()).padStart(2, '0');

    setTimeStr({
      date: `${year}.${month}.${date}`,
      time: `${hour}:${minute}:${second}`,
    });
  }, [time]);

  if (!mounted) {
    return (
      <TimeWrapper>
        <TimeGroup>
          <Timeicon>
            <Icons iName="calendar" size={16} color="#2B2F33" />
          </Timeicon>
          <TimeTextNormal>----.--.--</TimeTextNormal>
        </TimeGroup>
        <TimeGroup style={{ width: '86px' }}>
          <Timeicon>
            <Icons iName="clock" size={16} color="#2B2F33" />
          </Timeicon>
          <TimeTextBold>--:--:--</TimeTextBold>
        </TimeGroup>
      </TimeWrapper>
    );
  }

  return (
    <TimeWrapper>
      <TimeGroup>
        <Timeicon>
          <Icons iName="calendar" size={16} color="#2B2F33" />
        </Timeicon>
        <TimeTextNormal>{timeStr.date}</TimeTextNormal>
      </TimeGroup>
      <TimeGroup style={{ width: '86px' }}>
        <Timeicon>
          <Icons iName="clock" size={16} color="#2B2F33" />
        </Timeicon>
        <TimeTextBold>{timeStr.time}</TimeTextBold>
      </TimeGroup>
    </TimeWrapper>
  );
}

export default CurrentTime;