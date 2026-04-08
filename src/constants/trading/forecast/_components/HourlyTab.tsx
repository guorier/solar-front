import type { ColDef } from 'ag-grid-community';
import { AgGridComponent, TableTitleComponent } from '@/components';
import type { PredictionListItem } from '@/services/trading/forecast/type';
import { forecastAlgorithmText } from '@/mockup/forecast.mock';
import { algorithmBoxStyle } from '../_constants/styles';

interface HourlyTabProps {
  listData?: PredictionListItem[];
  columnDefs: ColDef<PredictionListItem>[];
}

export function HourlyTab({ listData, columnDefs }: HourlyTabProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div>
        <TableTitleComponent
          leftCont={
            <div>
              <strong style={{ fontSize: 'var(--font-size-15)' }}>시간대별 상세 예측</strong>
              <span style={{ marginLeft: 8, fontSize: 'var(--font-size)', color: 'var(--gray-70)' }}>
                기상 조건별 발전량 예측, 실측 발전량 및 오차율 분석
              </span>
            </div>
          }
        />
        <div
          style={{
            width: '100%',
            height: 'calc(100dvh - 600px)',
            minHeight: 320,
            border: '1px solid #d9dde5',
            background: '#fff',
          }}
        >
          <AgGridComponent rowData={listData ?? []} columnDefs={columnDefs} />
        </div>
      </div>

      <div style={algorithmBoxStyle}>{forecastAlgorithmText}</div>
    </div>
  );
}
