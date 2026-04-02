// power/components/MonitoringPowChart.tsx
'use client';

import { useEffect, useMemo, useRef } from 'react';
import * as echarts from 'echarts';
import { PowerTrendChartSeries } from '../monitoringPowType';
import './MonitoringPowChart.scss';

type MonitoringPowChartProps = {
  chartData: PowerTrendChartSeries[];
};

type TooltipColorObject = {
  color?: string;
  colorStops?: Array<{
    offset: number;
    color: string;
  }>;
};

type TooltipParam = {
  axisValue: string;
  seriesName: string;
  value: number | null;
  color?: string | TooltipColorObject;
};

const formatChartDateTime = (value: string): string => {
  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})\s(\d{2}):(\d{2}):(\d{2})$/);

  if (!match) {
    return value;
  }

  const [, , month, day, hour, minute] = match;

  return `${month}-${day} ${hour}:${minute}`;
};

const toFixedTwo = (value: number | string | null | undefined): string => {
  const numericValue = Number(value ?? 0);

  if (!Number.isFinite(numericValue)) {
    return '0.00';
  }

  return numericValue.toFixed(2);
};

const formatWatt = (value: number | string): string => {
  const numericValue = typeof value === 'number' ? value : Number(value);

  if (Number.isNaN(numericValue)) {
    return `${value} kW`;
  }

  const kiloWattValue = numericValue / 1000;

  if (Math.abs(numericValue) <= 100) {
    return `${toFixedTwo(kiloWattValue)} kW`;
  }

  if (Number.isInteger(kiloWattValue)) {
    return `${kiloWattValue.toLocaleString()} kW`;
  }

  return `${toFixedTwo(kiloWattValue)} kW`;
};

const getTooltipMarkerColor = (color?: string | TooltipColorObject): string => {
  if (!color) {
    return '#2563eb';
  }

  if (typeof color === 'string') {
    return color;
  }

  if (color.colorStops && color.colorStops.length > 0) {
    return color.colorStops[color.colorStops.length - 1].color;
  }

  if (color.color) {
    return color.color;
  }

  return '#2563eb';
};

export default function MonitoringPowChart({ chartData }: MonitoringPowChartProps) {
  const chartRef = useRef<HTMLDivElement | null>(null);
  const chartInstanceRef = useRef<echarts.ECharts | null>(null);
  const isChartInitializedRef = useRef<boolean>(false);

  const categoryData = useMemo(() => {
    const timeSet = new Set<string>();

    chartData.forEach((series) => {
      series.data.forEach((item) => {
        timeSet.add(item.time);
      });
    });

    return Array.from(timeSet).sort((a, b) => a.localeCompare(b));
  }, [chartData]);

  const legendRowCount = useMemo(() => {
    const count = chartData.length;

    if (count === 0) {
      return 1;
    }

    return Math.ceil(count / 4);
  }, [chartData]);

  const seriesOption = useMemo(() => {
    return chartData.map((series) => {
      const valueMap = new Map(series.data.map((item) => [item.time, item]));

      return {
        name: `${series.plantName} ${series.inverterName}`,
        type: 'line' as const,
        smooth: false,
        showSymbol: true,
        symbol: 'circle',
        symbolSize: 8,
        connectNulls: false,
        lineStyle: {
          width: 2,
        },
        data: categoryData.map((time) => {
          const item = valueMap.get(time);

          if (!item) {
            return {
              value: null,
            };
          }

          return {
            value: item.close,
            itemStyle:
              item.status === '비정상'
                ? {
                    color: '#ef4444',
                    borderColor: '#ef4444',
                    borderWidth: 2,
                  }
                : {
                    color: '#ffffff',
                    borderColor: '#2563eb',
                    borderWidth: 2,
                  },
          };
        }),
      };
    });
  }, [categoryData, chartData]);

  useEffect(() => {
    if (!chartRef.current) {
      return;
    }

    if (!chartInstanceRef.current) {
      chartInstanceRef.current = echarts.init(chartRef.current);
      isChartInitializedRef.current = false;
    }

    const chart = chartInstanceRef.current;
    const legendBottom = 10;
    const legendItemHeight = 14;
    const legendRowGap = 10;
    const legendBlockHeight =
      legendRowCount * legendItemHeight + Math.max(legendRowCount - 1, 0) * legendRowGap;
    const sliderBottom = legendBottom + legendBlockHeight + 16;
    const gridBottom = sliderBottom + 60;

    chart.setOption({
      animation: false,
      tooltip: {
        trigger: 'axis',
        confine: true,
        position: (
          point: number[],
          _params: unknown,
          _dom: HTMLElement,
          _rect: unknown,
          size: { contentSize: number[]; viewSize: number[] },
        ) => {
          const [mouseX, mouseY] = point;
          const [tooltipWidth, tooltipHeight] = size.contentSize;
          const [viewWidth, viewHeight] = size.viewSize;

          let left = mouseX + 12;

          if (left + tooltipWidth > viewWidth) {
            left = viewWidth - tooltipWidth - 8;
          }

          if (left < 8) {
            left = 8;
          }

          let top = mouseY + 12;

          if (top + tooltipHeight > viewHeight) {
            top = viewHeight - tooltipHeight - 8;
          }

          if (top < 8) {
            top = 8;
          }

          return [left, top];
        },
        formatter: (params: TooltipParam[]) => {
          if (!params.length) {
            return '';
          }

          const title = formatChartDateTime(String(params[0].axisValue));
          const items = params
            .map((item) => {
              const markerColor = getTooltipMarkerColor(item.color);
              const marker = `<span style="display:inline-block;margin-right:6px;border-radius:50%;width:10px;height:10px;background:${markerColor};vertical-align:middle;"></span>`;

              if (item.value === null) {
                return `${marker}${item.seriesName}: -`;
              }

              return `${marker}${item.seriesName}: ${formatWatt(item.value)}`;
            })
            .join('<br/>');

          return `${title}<br/>${items}`;
        },
      },
      legend: {
        bottom: legendBottom,
        left: 'center',
        data: chartData.map((series) => `${series.plantName} ${series.inverterName}`),
      },
      grid: {
        left: '6%',
        right: '4%',
        top: 24,
        bottom: gridBottom,
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: categoryData,
        axisLabel: {
          formatter: (value: string | number) => {
            return formatChartDateTime(String(value));
          },
        },
      },
      yAxis: {
        type: 'value',
        scale: true,
        axisLabel: {
          formatter: (value: number) => {
            return formatWatt(value);
          },
        },
      },
      dataZoom: [
        {
          type: 'inside',
          ...(isChartInitializedRef.current ? {} : { start: 50, end: 100 }),
        },
        {
          show: true,
          type: 'slider',
          bottom: sliderBottom,
          ...(isChartInitializedRef.current ? {} : { start: 50, end: 100 }),
          labelFormatter: () => '',
        },
      ],
      series: seriesOption,
    });

    isChartInitializedRef.current = true;

    const handleResize = (): void => {
      chart.resize();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [categoryData, chartData, legendRowCount, seriesOption]);

  useEffect(() => {
    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.dispose();
        chartInstanceRef.current = null;
      }
    };
  }, []);

  return (
    <div className="monitoring-pow-chart">
      <div ref={chartRef} className="monitoring-pow-chart__inner" />
    </div>
  );
}
