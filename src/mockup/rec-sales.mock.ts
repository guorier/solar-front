export type RecSalesStatus = '진행 중' | '완료 됨' | '대기';

export interface RecSalesContractRow {
  contractNo: string;
  contractName: string;
  buyer: string;
  contractPeriod: string;
  monthlyQty: string;
  unitPrice: string;
  executionPeriod: string;
  status: RecSalesStatus;
}

export interface RecSalesSummaryItem {
  label: string;
  value: string;
  helper: string;
}

export const recSalesSummary: RecSalesSummaryItem[] = [
  { label: '총 판매액', value: '82,912,900 원', helper: '누적 판매 금액' },
  { label: '장기 계약', value: '80,012,000 원', helper: '장기 계약 누적 금액' },
  { label: '현물 시장', value: '8,912,900 원', helper: '현물 시장 누적 금액' },
  { label: '순수익', value: '89,912,900 원', helper: '수수료 제외' },
];

export const recSalesBuyerOptions = [
  { label: '전체', value: '' },
  { label: 'SK E&S', value: 'SK E&S' },
  { label: '한국 전력 공사', value: '한국 전력 공사' },
  { label: '한국수력원자력', value: '한국수력원자력' },
  { label: 'GS에너지', value: 'GS에너지' },
  { label: '포스코에너지', value: '포스코에너지' },
];

export const recSalesStatusOptions = [
  { label: '전체', value: '' },
  { label: '진행 중', value: '진행 중' },
  { label: '완료 됨', value: '완료 됨' },
  { label: '대기', value: '대기' },
];

const statuses: RecSalesStatus[] = ['진행 중', '완료 됨', '대기'];
const buyers = ['SK E&S', '한국 전력 공사', '한국수력원자력', 'GS에너지', '포스코에너지'];
const contractNames = [
  '한국전력 장기계약 2025K',
  'E&S 장기계약 2025',
  '수력원자력 REC 공급계약',
  'GS에너지 장기계약 A',
  '포스코 REC 공급 2025',
];

const baseRows: RecSalesContractRow[] = [
  {
    contractNo: 'LTC-217833',
    contractName: '한국전력 장기계약 2025K',
    buyer: 'SK E&S',
    contractPeriod: '2025-01-01 ~2025-02-01',
    monthlyQty: '100 ERC',
    unitPrice: '45,000 원',
    executionPeriod: '1 개월',
    status: '진행 중',
  },
  {
    contractNo: 'LTC-398323',
    contractName: 'E&S 장기계약 2025',
    buyer: '한국 전력 공사',
    contractPeriod: '2025-01-01 ~2025-02-01',
    monthlyQty: '80 ERC',
    unitPrice: '44,000 원',
    executionPeriod: '12 개월',
    status: '완료 됨',
  },
  {
    contractNo: 'LTC-938223',
    contractName: '수력원자력 REC 공급계약',
    buyer: '한국수력원자력',
    contractPeriod: '2025-03-01 ~2025-12-01',
    monthlyQty: '120 ERC',
    unitPrice: '46,500 원',
    executionPeriod: '9 개월',
    status: '진행 중',
  },
];

const extraRows: RecSalesContractRow[] = Array.from({ length: 22 }, (_, i) => {
  const idx = i + baseRows.length;
  const contractNo = `LTC-${String(100000 + idx * 7919).slice(0, 6)}`;
  const month = ((i % 12) + 1).toString().padStart(2, '0');
  const endMonth = (((i + 3) % 12) + 1).toString().padStart(2, '0');
  return {
    contractNo,
    contractName: contractNames[i % contractNames.length],
    buyer: buyers[i % buyers.length],
    contractPeriod: `2025-${month}-01 ~2025-${endMonth}-01`,
    monthlyQty: `${50 + (i % 10) * 15} ERC`,
    unitPrice: `${(40000 + (i % 8) * 1000).toLocaleString()} 원`,
    executionPeriod: `${(i % 11) + 1} 개월`,
    status: statuses[i % statuses.length],
  };
});

export const recSalesContractRows: RecSalesContractRow[] = [...baseRows, ...extraRows];

// ──────────────────────────────────────────
// 현물 시장 거래 관리
// ──────────────────────────────────────────

export interface RecSalesSpotRow {
  tradeNo: string;
  tradeDate: string;
  buyer: string;
  saleQty: string;
  settlePrice: string;
  commission: string;
  netProfit: string;
  status: RecSalesStatus;
}

const spotBuyers = ['SK E&S', '한국 전력 공사', '한국수력원자력', 'GS에너지', '포스코에너지'];
const spotStatuses: RecSalesStatus[] = ['진행 중', '완료 됨', '대기'];

const baseSpotRows: RecSalesSpotRow[] = [
  {
    tradeNo: 'LTC-217833',
    tradeDate: '2025-12-12',
    buyer: 'SK E&S',
    saleQty: '50 REC',
    settlePrice: '45,000',
    commission: '15,000 원',
    netProfit: '12,028,000',
    status: '진행 중',
  },
  {
    tradeNo: 'LTC-398323',
    tradeDate: '2025-12-11',
    buyer: '한국 전력 공사',
    saleQty: '30 REC',
    settlePrice: '44,000',
    commission: '44,000 원',
    netProfit: '1,292,000',
    status: '완료 됨',
  },
  {
    tradeNo: 'LTC-938223',
    tradeDate: '2025-12-10',
    buyer: '한국수력원자력',
    saleQty: '80 REC',
    settlePrice: '46,500',
    commission: '32,000 원',
    netProfit: '3,688,000',
    status: '진행 중',
  },
];

const extraSpotRows: RecSalesSpotRow[] = Array.from({ length: 15 }, (_, i) => {
  const idx = i + baseSpotRows.length;
  const tradeNo = `LTC-${String(200000 + idx * 3713).slice(0, 6)}`;
  const day = ((i % 28) + 1).toString().padStart(2, '0');
  const qty = 20 + (i % 10) * 10;
  const price = 40000 + (i % 8) * 1000;
  const commission = 10000 + i * 500;
  const netProfit = qty * price - commission;
  return {
    tradeNo,
    tradeDate: `2025-12-${day}`,
    buyer: spotBuyers[i % spotBuyers.length],
    saleQty: `${qty} REC`,
    settlePrice: price.toLocaleString('ko-KR'),
    commission: `${commission.toLocaleString('ko-KR')} 원`,
    netProfit: netProfit.toLocaleString('ko-KR'),
    status: spotStatuses[i % spotStatuses.length],
  };
});

export const recSalesSpotRows: RecSalesSpotRow[] = [...baseSpotRows, ...extraSpotRows];
