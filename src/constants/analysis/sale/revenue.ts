import { ColDef, ValueFormatterParams } from 'ag-grid-community';

const formatNumber = (params: ValueFormatterParams) => {
  if (params.value == null || params.value === '') return '-';
  return Number(params.value).toLocaleString() + '원';
};

const formatPercent = (params: ValueFormatterParams) => {
  if (params.value == null || params.value === '') return '-';
  return `${Number(params.value).toLocaleString()}%`;
};

// [분석 관리 > 판매 분석] 수익 발전소 테이블 컬럼 정의
export const REVENUE_PLANT_COLUMN: ColDef[] = [
  { field: 'rank', headerName: '순위', flex: 0.4 },
  { field: 'plantName', headerName: '발전소', flex: 1.2 },
  {
    field: 'netProfit',
    headerName: '순이익',
    flex: 1.3,
    valueFormatter: formatNumber,
  },
  {
    field: 'profitMargin',
    headerName: '순이익율',
    flex: 1,
    valueFormatter: formatPercent,
  },
  {
    field: 'contractCount',
    headerName: '계약 건',
    flex: 0.9,
    valueFormatter: (params: ValueFormatterParams) => params.value + '건',
  },
  {
    field: 'growthRate',
    headerName: '성장율',
    flex: 1,
    valueFormatter: formatPercent,
  },
];

// [분석 관리] 수익 발전소 암시 Row Data
export const REVENUE_PLANT_ROW_DATA = [
  {
    rank: 1,
    plantName: '서울 태양광 발전소',
    netProfit: 120000000,
    profitMargin: 18.5,
    contractCount: 24,
    growthRate: 12.3,
  },
  {
    rank: 2,
    plantName: '부산 풍력 발전소',
    netProfit: 98000000,
    profitMargin: 15.2,
    contractCount: 18,
    growthRate: 9.7,
  },
  {
    rank: 3,
    plantName: '대전 복합 발전소',
    netProfit: 87000000,
    profitMargin: 13.8,
    contractCount: 15,
    growthRate: 7.1,
  },
  {
    rank: 4,
    plantName: '광주 태양광 발전소',
    netProfit: 76000000,
    profitMargin: 11.4,
    contractCount: 12,
    growthRate: 5.6,
  },
];

// [분석 관리 > 판매 분석] 수익 계약 테이블 컬럼 정의
export const REVENUE_CONTRACT_COLUMN: ColDef[] = [
  { field: 'rank', headerName: '순위', flex: 0.5 },
  { field: 'contractId', headerName: '계약번호', flex: 1.2 },
  { field: 'plantName', headerName: '발전소', flex: 1.4 },
  { field: 'contractType', headerName: '유형', flex: 0.9 },
  {
    field: 'revenue',
    headerName: '매출액',
    flex: 1.4,
    valueFormatter: formatNumber,
  },
  {
    field: 'netProfit',
    headerName: '순이익',
    flex: 1.4,
    valueFormatter: formatNumber,
  },
  {
    field: 'profitMargin',
    headerName: '순이익율',
    flex: 1,
    valueFormatter: formatPercent,
  },
  { field: 'contractPeriod', headerName: '계약기간', flex: 1.3 },
];

// [분석 관리 > 판매 분석] 수익 계약 임시 데이터
export const REVENUE_CONTRACT_DATA = [
  {
    rank: 1,
    contractId: 'RC-2024-001',
    plantName: '서울 태양광 발전소',
    contractType: 'PPA',
    revenue: 500000000,
    netProfit: 120000000,
    profitMargin: 24.0,
    contractPeriod: '2024-01 ~ 2026-12',
  },
  {
    rank: 2,
    contractId: 'RC-2024-002',
    plantName: '부산 풍력 발전소',
    contractType: 'REC',
    revenue: 420000000,
    netProfit: 98000000,
    profitMargin: 23.3,
    contractPeriod: '2023-06 ~ 2025-06',
  },
  {
    rank: 3,
    contractId: 'RC-2024-003',
    plantName: '대전 복합 발전소',
    contractType: 'PPA',
    revenue: 380000000,
    netProfit: 87000000,
    profitMargin: 22.9,
    contractPeriod: '2022-03 ~ 2025-03',
  },
  {
    rank: 4,
    contractId: 'RC-2024-004',
    plantName: '광주 태양광 발전소',
    contractType: 'REC',
    revenue: 310000000,
    netProfit: 76000000,
    profitMargin: 24.5,
    contractPeriod: '2024-05 ~ 2027-05',
  },
];
