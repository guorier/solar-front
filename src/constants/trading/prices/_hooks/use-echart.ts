import { useEffect, useRef } from 'react';
import type { CSSProperties } from 'react';
import * as echarts from 'echarts';
import type { EChartsOption } from 'echarts';

export const chartWrapStyle: CSSProperties = {
  height: '380px',
  border: '1px solid #d9dde5',
  borderRadius: '12px',
  background: '#ffffff',
  padding: '16px',
};

export function useEChart(ref: React.RefObject<HTMLDivElement | null>, option: EChartsOption) {
  const instanceRef = useRef<echarts.ECharts | null>(null);

  useEffect(() => {
    if (!ref.current) return;
    instanceRef.current?.dispose();
    instanceRef.current = echarts.init(ref.current);
    instanceRef.current.setOption(option);

    const handleResize = () => instanceRef.current?.resize();
    const ro = new ResizeObserver(handleResize);
    ro.observe(ref.current);
    window.addEventListener('resize', handleResize);

    return () => {
      ro.disconnect();
      window.removeEventListener('resize', handleResize);
      instanceRef.current?.dispose();
      instanceRef.current = null;
    };
  }, [option, ref]);
}

export function tooltipFormatter(params: unknown, unit = ' 원') {
  const items = Array.isArray(params) ? params : [params];
  const date =
    items[0] && typeof items[0] === 'object' && 'axisValueLabel' in items[0]
      ? String((items[0] as { axisValueLabel: unknown }).axisValueLabel)
      : '';
  const lines = items.map((p) => {
    if (!p || typeof p !== 'object') return '';
    const name = 'seriesName' in p ? String((p as { seriesName: unknown }).seriesName) : '';
    const val =
      'value' in p && typeof (p as { value: unknown }).value === 'number'
        ? (p as { value: number }).value.toLocaleString()
        : '-';
    const marker =
      'marker' in p && typeof (p as { marker: unknown }).marker === 'string'
        ? (p as { marker: string }).marker
        : '';
    return `${marker}${name}: ${val}${unit}`;
  });
  return [date, ...lines].join('<br/>');
}
