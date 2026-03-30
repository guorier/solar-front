// src\constants\dashboard\TodayPowerGeneration.tsx
'use client';

import { InfoGroupComponent, LineChartComponent } from '@/components';
import type { PwplDashboardChartItem } from '@/services/dashboard/type';

export function TodayPowerGeneration({
  chart,
}: {
  chart: PwplDashboardChartItem[];
}) {
  const isEmpty = !chart || chart.length === 0;

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
        <LineChartComponent chart={chart} />
      )}
    </InfoGroupComponent>
  );
}
