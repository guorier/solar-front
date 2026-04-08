import { useMemo } from 'react';
import type { EChartsOption } from 'echarts';
import type {
  PredictionChartItem,
  PredictionTrendItem,
} from '@/services/trading/forecast/type';

export function useForecastCharts(
  chartData: PredictionChartItem[] | undefined,
  trendData: PredictionTrendItem[] | undefined,
) {
  const comparisonSource = useMemo(
    () =>
      (chartData ?? []).map((d) => ({
        time: d.time,
        forecast: d.predGenerationKwh,
        actual: d.realGenerationKwh,
      })),
    [chartData],
  );

  const irradianceSource = useMemo(
    () =>
      (trendData ?? []).map((d) => ({
        time: d.time,
        forecast: d.predGenerationKwh,
        irradiance: d.irradianceWm2,
      })),
    [trendData],
  );

  const comparisonChartOption: EChartsOption = useMemo(
    () => ({
      tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
      legend: { bottom: 0 },
      grid: { top: '8%', left: '1%', right: '1%', bottom: '14%', containLabel: true },
      dataset: { dimensions: ['time', 'forecast', 'actual'], source: comparisonSource },
      xAxis: { type: 'category', axisLabel: { fontSize: 12 } },
      yAxis: { type: 'value', name: '발전량 (kWh)', nameTextStyle: { fontSize: 11 } },
      series: [
        {
          name: '예측 발전량',
          type: 'bar',
          encode: { x: 'time', y: 'forecast' },
          barMaxWidth: 40,
          itemStyle: { color: '#5B8FF9' },
        },
        {
          name: '실측 발전량',
          type: 'bar',
          encode: { x: 'time', y: 'actual' },
          barMaxWidth: 40,
          itemStyle: { color: '#5AD8A6' },
        },
      ],
    }),
    [comparisonSource],
  );

  const irradianceChartOption: EChartsOption = useMemo(
    () => ({
      tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
      legend: { bottom: 0 },
      grid: { top: '8%', left: '1%', right: '4%', bottom: '14%', containLabel: true },
      dataset: { dimensions: ['time', 'forecast', 'irradiance'], source: irradianceSource },
      xAxis: { type: 'category', axisLabel: { fontSize: 12 } },
      yAxis: [
        {
          type: 'value',
          name: '발전량 (kWh)',
          nameTextStyle: { fontSize: 11 },
          position: 'left',
        },
        {
          type: 'value',
          name: '일사량 (W/m²)',
          nameTextStyle: { fontSize: 11 },
          position: 'right',
        },
      ],
      series: [
        {
          name: '예측 발전량',
          type: 'bar',
          encode: { x: 'time', y: 'forecast' },
          yAxisIndex: 0,
          barMaxWidth: 40,
          itemStyle: { color: '#5B8FF9' },
        },
        {
          name: '일사량',
          type: 'line',
          encode: { x: 'time', y: 'irradiance' },
          yAxisIndex: 1,
          smooth: true,
          lineStyle: { color: '#F6BD16', width: 2 },
          itemStyle: { color: '#F6BD16' },
          symbol: 'circle',
          symbolSize: 6,
        },
      ],
    }),
    [irradianceSource],
  );

  return { comparisonChartOption, irradianceChartOption };
}
