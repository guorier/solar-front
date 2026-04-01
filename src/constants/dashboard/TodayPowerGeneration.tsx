// src\constants\dashboard\TodayPowerGeneration.tsx
'use client';

import { InfoGroupComponent, LineChartComponent } from '@/components';
import type { PwplDashboardChartItem } from '@/services/dashboard/type';

// API 배열의 마지막 항목을 현재 시간 기준으로 삼아 과거 1시간치(13포인트) 슬라이싱
const filterLastHour = (chart: PwplDashboardChartItem[]): PwplDashboardChartItem[] => {
  return chart.slice(-13);
};

export function TodayPowerGeneration({ chart }: { chart: PwplDashboardChartItem[] }) {
  const filtered = filterLastHour(chart);
  const isEmpty = filtered.length === 0;

  return (
    <InfoGroupComponent flex={1} minHeight={247} title="실시간 출력량">
      {isEmpty ? (
        <div
          style={{
            height: 200,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: '600',
            fontSize: 'var(--font-size-14)',
            color: 'var(--gray-500)',
          }}
        >
          표시할 출력량 데이터가 없습니다
        </div>
      ) : (
        <LineChartComponent chart={filtered} />
      )}
    </InfoGroupComponent>
  );
}
