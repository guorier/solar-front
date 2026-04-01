// src\constants\dashboard\TodayPowerGeneration.tsx
'use client';

import { InfoGroupComponent, LineChartComponent } from '@/components';
import type { PwplDashboardChartItem } from '@/services/dashboard/type';

const filterLastHour = (chart: PwplDashboardChartItem[]): PwplDashboardChartItem[] => {
  const now = new Date();
  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  const cutoffMinutes = nowMinutes - 60;

  return chart.filter((item) => {
    const [h, m] = item.label.split(':').map(Number);
    if (isNaN(h) || isNaN(m)) return false;
    const itemMinutes = h * 60 + m;

    if (cutoffMinutes < 0) {
      // 자정 넘어가는 경우 (예: 현재 00:30 → cutoff 23:30)
      return itemMinutes >= cutoffMinutes + 1440 || itemMinutes <= nowMinutes;
    }
    return itemMinutes >= cutoffMinutes && itemMinutes <= nowMinutes;
  });
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
