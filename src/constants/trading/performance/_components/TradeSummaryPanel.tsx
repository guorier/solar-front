import { InfoBoxComponent, InfoBoxGroup, TopInfoBoxComponent } from '@/components';
import type { TradeSummaryRes } from '@/services/trading/performance/type';
import { formatNumber } from '../_utils/format';

interface TradeSummaryPanelProps {
  summary?: TradeSummaryRes;
}

const panelGridStyle = {
  display: 'flex',
  gap: 16,
} as const;

export function TradeSummaryPanel({ summary }: TradeSummaryPanelProps) {
  return (
    <div style={panelGridStyle}>
      <TopInfoBoxComponent
        title="금일 거래 현황"
        bg="var(--point-orange-5)"
        color="#A34600"
        totalLabel="금일 총 예상 수익"
        totalValue={`${formatNumber(summary?.todayTotalAmount ?? 0)} 원`}
        style={{ flex: 1 }}
      >
        <InfoBoxGroup className="row-type">
          <InfoBoxComponent
            icon="energy"
            title="SMP 거래 수량"
            count={summary?.todaySmpQty ?? 0}
            unit="kWh"
            bg="white"
          />
          <InfoBoxComponent
            icon="amount"
            title="SMP 예상 매출"
            count={summary?.todaySmpAmount ?? 0}
            unit="원"
            bg="white"
          />
          <InfoBoxComponent
            icon="energy"
            title="REC 거래 수량"
            count={summary?.todayRecQty ?? 0}
            unit="REC"
            bg="white"
          />
          <InfoBoxComponent
            icon="amount"
            title="REC 예상 매출"
            count={summary?.todayRecAmount ?? 0}
            unit="원"
            bg="white"
          />
        </InfoBoxGroup>
      </TopInfoBoxComponent>

      <TopInfoBoxComponent
        title="누적 거래 실적"
        bg="var(--point-orange-5)"
        color="#A34600"
        totalLabel="누적 총 수익"
        totalValue={`${formatNumber(summary?.accTotalAmount ?? 0)} 원`}
        style={{ flex: 1 }}
      >
        <InfoBoxGroup className="row-type">
          <InfoBoxComponent
            icon="energy"
            title="누적 SMP 거래량"
            count={summary?.accSmpQty ?? 0}
            unit="kWh"
            bg="white"
          />
          <InfoBoxComponent
            icon="amount"
            title="누적 SMP 매출"
            count={summary?.accSmpAmount ?? 0}
            unit="원"
            bg="white"
          />
          <InfoBoxComponent
            icon="energy"
            title="누적 REC 거래량"
            count={summary?.accRecQty ?? 0}
            unit="REC"
            bg="white"
          />
          <InfoBoxComponent
            icon="amount"
            title="누적 REC 매출"
            count={summary?.accRecAmount ?? 0}
            unit="원"
            bg="white"
          />
        </InfoBoxGroup>
      </TopInfoBoxComponent>
    </div>
  );
}
