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
  const currentTime = useCurrentTime();

  useEffect(() => {
    setMounted(true);
  }, []);

  const year = String(currentTime.getFullYear());
  const month = String(currentTime.getMonth() + 1).padStart(2, '0');
  const date = String(currentTime.getDate()).padStart(2, '0');
  const hours = String(currentTime.getHours()).padStart(2, '0');
  const minutes = String(currentTime.getMinutes()).padStart(2, '0');
  const seconds = String(currentTime.getSeconds()).padStart(2, '0');

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
        <TimeTextNormal>{year}.{month}.{date}</TimeTextNormal>
      </TimeGroup>
      <TimeGroup style={{ width: '86px' }}>
        <Timeicon>
          <Icons iName="clock" size={16} color="#2B2F33" />
        </Timeicon>
        <TimeTextBold>
          {hours}:{minutes}:{seconds}
        </TimeTextBold>
      </TimeGroup>
    </TimeWrapper>
  );
}

export default CurrentTime;