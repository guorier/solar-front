'use client';

import { PieChartSmComponent } from '@/components';
import type { DonutDataItem } from './types';

export const SidePieChartGroup = ({
  items,
}: {
  items: Array<{
    centerText: string;
    data: DonutDataItem[];
  }>;
}) => {
  return (
    <div className="row-group" style={{ width: 280, alignItems: 'center', padding: '40px 20px',zIndex:10 }}>
      {items.map((item) => (
        <div className="flex-1" key={item.centerText}>
          <PieChartSmComponent centerText={item.centerText} data={item.data} />
        </div>
      ))}
    </div>
  );
};