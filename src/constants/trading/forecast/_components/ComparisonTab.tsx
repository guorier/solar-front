import ReactECharts from 'echarts-for-react';
import type { EChartsOption } from 'echarts';
import type { PredictionAccuracyRes } from '@/services/trading/forecast/type';
import {
  chartSectionStyle,
  chartSubStyle,
  chartTitleStyle,
  statsBadgeStyle,
  statsValueStyle,
} from '../_constants/styles';

interface ComparisonTabProps {
  accuracyData?: PredictionAccuracyRes;
  comparisonChartOption: EChartsOption;
  irradianceChartOption: EChartsOption;
}

const chartLegendStyle = {
  textAlign: 'center' as const,
  fontSize: 'var(--font-size)',
  color: 'var(--gray-60)',
  marginTop: 4,
};

export function ComparisonTab({
  accuracyData,
  comparisonChartOption,
  irradianceChartOption,
}: ComparisonTabProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* 통계 요약 행 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, justifyContent: 'flex-end' }}>
        <div style={statsBadgeStyle}>
          <span>최대 과대예측</span>
          <span style={statsValueStyle('#5B8FF9')}>
            {accuracyData ? `${accuracyData.maxOverErrorKwh}kWh` : '-'}
          </span>
        </div>
        <div style={statsBadgeStyle}>
          <span>최대 과소예측</span>
          <span style={statsValueStyle('#5AD8A6')}>
            {accuracyData ? `+${accuracyData.maxUnderErrorKwh}kWh` : '-'}
          </span>
        </div>
        <div style={statsBadgeStyle}>
          <span>예측 정확도</span>
          <span style={statsValueStyle('var(--point-orange-30)')}>
            {accuracyData ? `${accuracyData.accuracy}%` : '-'}
          </span>
        </div>
      </div>

      {/* 차트 1: 예측 vs 실측 */}
      <div style={chartSectionStyle}>
        <p style={chartTitleStyle}>예측 vs 실측 발전량 비교</p>
        <p style={chartSubStyle}>실시간 예측 정확도 분석</p>
        <ReactECharts option={comparisonChartOption} style={{ width: '100%', height: 360 }} />
        <p style={chartLegendStyle}>- 실측 발전량(kWh) / = 예측 발전량(kWh)</p>
      </div>

      {/* 차트 2: 시간대별 발전량 예측 (일사량) */}
      <div style={chartSectionStyle}>
        <p style={chartTitleStyle}>시간대별 발전량 예측</p>
        <p style={chartSubStyle}>일사량과 예측 발전량 추이 (기상조건 반영)</p>
        <ReactECharts option={irradianceChartOption} style={{ width: '100%', height: 360 }} />
        <p style={chartLegendStyle}>- 예측 발전량(kWh) / = 일사량(W/m²)</p>
      </div>
    </div>
  );
}
