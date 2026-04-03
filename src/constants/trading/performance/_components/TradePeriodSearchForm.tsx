import { InfoBoxComponent, InfoBoxGroup, SearchForm } from '@/components';
import type { SearchFieldConfig } from '@/components';
import type { TradePeriodSummaryRes } from '@/services/trading/performance/type';

interface TradePeriodSearchFormProps {
  config: SearchFieldConfig[];
  values: Record<string, unknown>;
  onChange: (key: string, value: unknown) => void;
  onSearch: () => void;
  periodSummary?: TradePeriodSummaryRes;
}

export function TradePeriodSearchForm({
  config,
  values,
  onChange,
  onSearch,
  periodSummary,
}: TradePeriodSearchFormProps) {
  return (
    <SearchForm config={config} values={values} onChange={onChange} onSearch={onSearch}>
      <InfoBoxGroup className="row-type">
        <InfoBoxComponent
          icon="energy"
          title="총 거래량"
          count={periodSummary?.totalQty ?? 0}
          unit="kWh"
          bg="white"
        />
        <InfoBoxComponent
          icon="energy"
          title="총 수익"
          count={periodSummary?.totalAmount ?? 0}
          unit="원"
          bg="white"
        />
        <InfoBoxComponent
          icon="energy"
          title="평균 SMP 단가"
          count={periodSummary?.avgSmpPrice ?? 0}
          unit="원"
          bg="white"
        />
        <InfoBoxComponent
          icon="energy"
          title="평균 REC 단가"
          count={periodSummary?.avgRecPrice ?? 0}
          unit="원"
          bg="white"
        />
      </InfoBoxGroup>
    </SearchForm>
  );
}
