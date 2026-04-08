import { InfoBoxComponent, InfoBoxGroup, TopInfoBoxComponent } from '@/components';
import type { PredictionSummaryRes } from '@/services/trading/forecast/type';

interface SummaryInfoBoxProps {
  summaryData?: PredictionSummaryRes;
}

export function SummaryInfoBox({ summaryData }: SummaryInfoBoxProps) {
  return (
    <TopInfoBoxComponent title="총 예측 발전량 현황" bg="var(--point-orange-5)" color="#A34600">
      <InfoBoxGroup className="row-type">
        <InfoBoxComponent
          icon="solar"
          title="총 예측 발전량"
          count={summaryData ? `${summaryData.totalPredQty.toLocaleString('ko-KR')} kWh` : '-'}
          bg="white"
        />
        <InfoBoxComponent
          icon="energy"
          title="평균 효율"
          count={summaryData ? `${summaryData.avgEfficiency}%` : '-'}
          bg="white"
        />
        <InfoBoxComponent
          icon="energy"
          title="최대 출력 시간"
          count={summaryData ? summaryData.peakTime : '-'}
          bg="white"
        >
          {summaryData ? `${summaryData.peakQty} kWh` : ''}
        </InfoBoxComponent>
        <InfoBoxComponent
          icon="feedback"
          title="예측 신뢰도"
          count={summaryData ? `${summaryData.reliability}%` : '-'}
          bg="white"
        />
        <InfoBoxComponent
          icon="feedback"
          title="평균 오차율"
          count={summaryData ? `${summaryData.avgErrorRate}%` : '-'}
          bg="white"
        />
      </InfoBoxGroup>
    </TopInfoBoxComponent>
  );
}
