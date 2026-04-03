import type { ColDef } from 'ag-grid-community';

export const smpColumnDefs: ColDef[] = [
  { field: 'tradeDate', headerName: '거래일자', width: 130, sortable: true },
  { field: 'tradeTime', headerName: '시간', width: 120, sortable: true },
  {
    field: 'landForecastDemand',
    headerName: '육지 예측 수요',
    flex: 1,
    sortable: true,
    valueFormatter: (p) =>
      p.value != null ? `${Number(p.value).toLocaleString('ko-KR')} MW` : '-',
  },
  {
    field: 'totalForecastDemand',
    headerName: '총 예측 수요',
    flex: 1,
    sortable: true,
    valueFormatter: (p) =>
      p.value != null ? `${Number(p.value).toLocaleString('ko-KR')} MW` : '-',
  },
  {
    field: 'smp',
    headerName: 'SMP (원/kWh)',
    flex: 1,
    sortable: true,
    valueFormatter: (p) => (p.value != null ? Number(p.value).toFixed(2) : '-'),
  },
];

export const recColumnDefs: ColDef[] = [
  { field: 'tradeDate', headerName: '거래일자', width: 130, sortable: true },
  {
    field: 'landAvgPrc',
    headerName: '육지 평균가 (원/REC)',
    flex: 1,
    sortable: true,
    valueFormatter: (p) => (p.value != null ? Number(p.value).toLocaleString('ko-KR') : '-'),
  },
  {
    field: 'landHgPrc',
    headerName: '육지 최고가 (원/REC)',
    flex: 1,
    sortable: true,
    valueFormatter: (p) => (p.value != null ? Number(p.value).toLocaleString('ko-KR') : '-'),
  },
  {
    field: 'landLwPrc',
    headerName: '육지 최저가 (원/REC)',
    flex: 1,
    sortable: true,
    valueFormatter: (p) => (p.value != null ? Number(p.value).toLocaleString('ko-KR') : '-'),
  },
  {
    field: 'landTrdCnt',
    headerName: '체결건수',
    flex: 1,
    sortable: true,
    valueFormatter: (p) => (p.value != null ? Number(p.value).toLocaleString('ko-KR') : '-'),
  },
  {
    field: 'landTrdRecValue',
    headerName: '체결물량',
    flex: 1,
    sortable: true,
    valueFormatter: (p) => (p.value != null ? Number(p.value).toLocaleString('ko-KR') : '-'),
  },
];
