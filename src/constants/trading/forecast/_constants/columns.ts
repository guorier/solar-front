import type { CellStyle, ColDef } from 'ag-grid-community';
import type { PredictionListItem } from '@/services/trading/forecast/type';

const centerStyle: CellStyle = { textAlign: 'center' };

const fmt = (v: number | null | undefined, suffix = '') => (v == null ? '-' : `${v}${suffix}`);

export const columnDefs: ColDef<PredictionListItem>[] = [
  { field: 'timeHhmi', headerName: '시간', flex: 0.8, cellStyle: centerStyle },
  { field: 'rowStatus', headerName: '상태', flex: 0.8, cellStyle: centerStyle },
  {
    field: 'predIrradianceWm2',
    headerName: '예측 일사량(W/m²)',
    flex: 1.2,
    cellStyle: centerStyle,
    valueFormatter: ({ value }) => fmt(value),
  },
  {
    field: 'realIrradianceWm2',
    headerName: '실측 일사량(W/m²)',
    flex: 1.2,
    cellStyle: centerStyle,
    valueFormatter: ({ value }) => fmt(value),
  },
  {
    field: 'temperatureC',
    headerName: '기온(°C)',
    flex: 0.8,
    cellStyle: centerStyle,
    valueFormatter: ({ value }) => fmt(value),
  },
  {
    field: 'predGenerationKwh',
    headerName: '예측 발전량(kWh)',
    flex: 1.2,
    cellStyle: centerStyle,
  },
  {
    field: 'realGenerationKwh',
    headerName: '실측 발전량(kWh)',
    flex: 1.2,
    cellStyle: centerStyle,
  },
  {
    field: 'errorKwh',
    headerName: '오차(kWh)',
    flex: 0.9,
    cellStyle: centerStyle,
    valueFormatter: ({ value }) => fmt(value),
  },
  {
    field: 'errorRate',
    headerName: '오차율(%)',
    flex: 0.9,
    cellStyle: centerStyle,
    valueFormatter: ({ value }) => fmt(value),
  },
  {
    field: 'efficiency',
    headerName: '효율(%)',
    flex: 0.8,
    cellStyle: centerStyle,
    valueFormatter: ({ value }) => fmt(value),
  },
  {
    field: 'reliability',
    headerName: '신뢰도(%)',
    flex: 0.9,
    cellStyle: centerStyle,
    valueFormatter: ({ value }) => fmt(value),
  },
];
