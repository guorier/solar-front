'use client';

import React, { useEffect, useMemo, useRef } from 'react';
import * as echarts from 'echarts';
import type { EChartsOption } from 'echarts';

interface DataPoint {
  time: string;
  value: number;
  timestamp?: string;
}

interface ChartItem {
  label: string;
  value: number;
  timestamp?: string;
}

export interface LineChartSeries {
  name: string;
  data: DataPoint[];
}

interface LineChartProps {
  data?: DataPoint[];
  chart?: ChartItem[];
  series?: LineChartSeries[];
}

const CHART_COLORS = ['#D70251', '#FF7A00', '#1C7ED6', '#2F9E44', '#7B61FF', '#C2255C'];
const UNKNOWN_TIME_ORDER = Number.MAX_SAFE_INTEGER;

const formatPowerValue = (value: number): string => {
  if (!Number.isFinite(value)) {
    return '0.00 kW';
  }

  return `${value.toFixed(2)} kW`;
};

const parseTimestamp = (value?: string): number | null => {
  if (!value) {
    return null;
  }

  const parsed = new Date(value.replace(' ', 'T')).getTime();
  return Number.isFinite(parsed) ? parsed : null;
};

const getSingleAreaColor = () =>
  new echarts.graphic.LinearGradient(0, 0, 0, 1, [
    { offset: 0, color: 'rgb(228, 70, 49)' },
    { offset: 0.45, color: 'rgb(241, 162, 152)' },
    { offset: 1, color: 'rgba(255, 255, 255, 0)' },
  ]);

export function LineChartComponent({ data, chart, series }: LineChartProps) {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.ECharts | null>(null);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);

  const chartData = useMemo<DataPoint[]>(() => {
    if (chart && chart.length > 0) {
      return chart.map((item) => ({
        time: item.label,
        value: item.value,
        timestamp: item.timestamp,
      }));
    }

    if (data) {
      return data;
    }

    return [];
  }, [chart, data]);

  const normalizedSeries = useMemo<LineChartSeries[]>(() => {
    if (series && series.length > 0) {
      return series;
    }

    if (chartData.length > 0) {
      return [
        {
          name: 'Value',
          data: chartData,
        },
      ];
    }

    return [];
  }, [chartData, series]);

  const xAxisLabels = useMemo(() => {
    const labelOrderMap = new Map<string, { sortKey: number; order: number }>();
    let order = 0;

    normalizedSeries.forEach((seriesItem) => {
      seriesItem.data.forEach((point) => {
        const parsedTimestamp = parseTimestamp(point.timestamp);
        const nextOrder = order;
        order += 1;

        const existing = labelOrderMap.get(point.time);

        if (!existing) {
          labelOrderMap.set(point.time, {
            sortKey: parsedTimestamp ?? UNKNOWN_TIME_ORDER,
            order: nextOrder,
          });
          return;
        }

        if (parsedTimestamp !== null && existing.sortKey === UNKNOWN_TIME_ORDER) {
          labelOrderMap.set(point.time, {
            sortKey: parsedTimestamp,
            order: existing.order,
          });
          return;
        }

        if (parsedTimestamp !== null && parsedTimestamp < existing.sortKey) {
          labelOrderMap.set(point.time, {
            sortKey: parsedTimestamp,
            order: existing.order,
          });
        }
      });
    });

    return Array.from(labelOrderMap.entries())
      .sort((a, b) => {
        const aOrder = a[1];
        const bOrder = b[1];
        const aHasTime = aOrder.sortKey !== UNKNOWN_TIME_ORDER;
        const bHasTime = bOrder.sortKey !== UNKNOWN_TIME_ORDER;

        if (aHasTime && bHasTime) {
          return aOrder.sortKey - bOrder.sortKey;
        }

        if (aHasTime !== bHasTime) {
          return aHasTime ? -1 : 1;
        }

        return aOrder.order - bOrder.order;
      })
      .map(([label]) => label);
  }, [normalizedSeries]);

  const isMultiSeries = normalizedSeries.length > 1;

  const option: EChartsOption = useMemo(() => {
    return {
      backgroundColor: 'transparent',
      color: CHART_COLORS,
      grid: {
        top: isMultiSeries ? '24%' : '15%',
        bottom: '15%',
        left: '3%',
        right: '3%',
        containLabel: false,
      },
      legend: isMultiSeries
        ? {
            top: 0,
            left: 0,
            right: 0,
            type: 'scroll',
            itemWidth: 10,
            itemHeight: 10,
            textStyle: {
              color: '#615E83',
              fontSize: 11,
            },
          }
        : undefined,
      tooltip: {
        trigger: 'axis',
        show: true,
        formatter: (params) => {
          const tooltipItems = Array.isArray(params) ? params : [params];

          if (tooltipItems.length === 0) {
            return '';
          }

          const firstItem = tooltipItems[0];
          const axisValueLabel =
            firstItem && typeof firstItem === 'object' && 'axisValueLabel' in firstItem
              ? typeof firstItem.axisValueLabel === 'string'
                ? firstItem.axisValueLabel
                : ''
              : '';

          const firstRawValue =
            firstItem && typeof firstItem === 'object'
              ? 'data' in firstItem && typeof firstItem.data === 'number'
                ? firstItem.data
                : 'value' in firstItem && typeof firstItem.value === 'number'
                  ? firstItem.value
                  : null
              : null;

          const lines = tooltipItems
            .map((item) => {
              if (!item || typeof item !== 'object') {
                return '';
              }

              const rawValue =
                'data' in item && typeof item.data === 'number'
                  ? item.data
                  : 'value' in item && typeof item.value === 'number'
                    ? item.value
                    : null;

              if (rawValue === null || !Number.isFinite(rawValue)) {
                return '';
              }

              const marker =
                'marker' in item && typeof item.marker === 'string' ? item.marker : '';
              const seriesName =
                'seriesName' in item && typeof item.seriesName === 'string'
                  ? item.seriesName
                  : '';

              return `${marker}${seriesName ? `${seriesName}: ` : ''}${formatPowerValue(rawValue)}`;
            })
            .filter(Boolean);

          if (tooltipItems.length === 1 && firstRawValue !== null) {
            return `${axisValueLabel}: ${formatPowerValue(firstRawValue)}`;
          }

          return [`${axisValueLabel}:`, ...lines].join('<br/>');
        },
        axisPointer: {
          type: 'line',
          lineStyle: {
            color: '#9291A5',
            type: 'dashed',
            width: 1,
          },
        },
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        textStyle: { color: '#333' },
      },
      xAxis: {
        type: 'category',
        data: xAxisLabels,
        boundaryGap: false,
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: {
          color: '#615E83',
          fontSize: 11,
          margin: 15,
          interval: 0,
          hideOverlap: false,
        },
        splitLine: {
          show: true,
          lineStyle: {
            color: '#EDF2F7',
            type: 'dashed',
          },
        },
      },
      yAxis: {
        type: 'value',
        show: false,
      },
      series: normalizedSeries.map((seriesItem, index) => {
        const pointMap = new Map<string, number>();

        seriesItem.data.forEach((point) => {
          pointMap.set(point.time, point.value);
        });

        const color = CHART_COLORS[index % CHART_COLORS.length];

        return {
          name: seriesItem.name,
          type: 'line',
          data: xAxisLabels.map((label) => pointMap.get(label) ?? null),
          smooth: 0.35,
          connectNulls: false,
          showSymbol: true,
          showAllSymbol: true,
          emphasis: {
            scale: true,
            itemStyle: {
              color: '#FFFFFF',
              borderColor: color,
              borderWidth: 2,
              shadowBlur: 8,
              shadowColor: 'rgba(0, 0, 0, 0.2)',
            },
          },
          symbol: 'circle',
          symbolSize: isMultiSeries ? 8 : 10,
          lineStyle: {
            width: isMultiSeries ? 2 : 1,
            color,
          },
          itemStyle: {
            color: '#FFFFFF',
            borderColor: color,
            borderWidth: 2,
          },
          areaStyle: isMultiSeries ? undefined : { color: getSingleAreaColor() },
        };
      }),
    };
  }, [isMultiSeries, normalizedSeries, xAxisLabels]);

  useEffect(() => {
    if (!chartRef.current) return;

    if (!chartInstance.current) {
      chartInstance.current = echarts.init(chartRef.current);
    }

    chartInstance.current.setOption(option);

    const handleResize = () => {
      requestAnimationFrame(() => {
        chartInstance.current?.resize();
      });
    };

    resizeObserverRef.current = new ResizeObserver(handleResize);

    let element: HTMLDivElement | null = chartRef.current;

    for (let i = 0; i < 5 && element; i += 1) {
      resizeObserverRef.current.observe(element);
      element = element.parentElement as HTMLDivElement | null;
    }

    const windowResizeHandler = () => handleResize();
    window.addEventListener('resize', windowResizeHandler);

    return () => {
      if (resizeObserverRef.current) resizeObserverRef.current.disconnect();
      window.removeEventListener('resize', windowResizeHandler);
      chartInstance.current?.dispose();
      chartInstance.current = null;
    };
  }, [option]);

  return (
    <div style={{ width: '100%', height: '100%', minHeight: 0 }}>
      <div ref={chartRef} style={{ width: '100%', height: '100%' }} />
    </div>
  );
}
