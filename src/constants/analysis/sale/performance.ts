import { ColDef, ValueFormatterParams } from 'ag-grid-community';

const formatNumber = (params: ValueFormatterParams) => {
  if (params.value == null || params.value === '') return '-';
  return Number(params.value).toLocaleString() + '원';
};

// [분석 관리 > 판매 분석] 월별 상세 성과 테이블 컬럼 정의
export const PERFORMANCE_COLUMN: ColDef[] = [
  { field: 'yearMonth', headerName: '년/월' },
  { field: 'smpRevenue', headerName: 'SMP 매출', valueFormatter: formatNumber },
  { field: 'recRevenue', headerName: 'REC 매출', valueFormatter: formatNumber },
  { field: 'totalRevenue', headerName: '총 매출', valueFormatter: formatNumber },
  {
    field: 'smpPrice',
    headerName: 'SMP 단가',
    valueFormatter: (params: ValueFormatterParams) => params.value + '원 / kWh',
  },
  {
    field: 'recPrice',
    headerName: 'REC 단가',
    valueFormatter: (params: ValueFormatterParams) => params.value + '원 / REC',
  },
  { field: 'cumulativeRevenue', headerName: '누적 매출', valueFormatter: formatNumber },
];

// [분석 관리] 월별 상세 성과 암시 Row Data
export const PERFORMANCE_ROW_DATA = [
  {
    yearMonth: '2024-01',
    smpRevenue: 120000000,
    recRevenue: 80000000,
    totalRevenue: 200000000,
    smpPrice: 120,
    recPrice: 80,
    cumulativeRevenue: 200000000,
  },
  {
    yearMonth: '2024-02',
    smpRevenue: 140000000,
    recRevenue: 90000000,
    totalRevenue: 230000000,
    smpPrice: 125,
    recPrice: 82,
    cumulativeRevenue: 430000000,
  },
  {
    yearMonth: '2024-03',
    smpRevenue: 130000000,
    recRevenue: 85000000,
    totalRevenue: 215000000,
    smpPrice: 123,
    recPrice: 81,
    cumulativeRevenue: 645000000,
  },
  {
    yearMonth: '2024-04',
    smpRevenue: 150000000,
    recRevenue: 95000000,
    totalRevenue: 245000000,
    smpPrice: 128,
    recPrice: 85,
    cumulativeRevenue: 890000000,
  },
  {
    yearMonth: '2024-05',
    smpRevenue: 160000000,
    recRevenue: 100000000,
    totalRevenue: 260000000,
    smpPrice: 130,
    recPrice: 87,
    cumulativeRevenue: 1150000000,
  },
];
