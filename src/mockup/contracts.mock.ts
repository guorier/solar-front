export type ContractStatus = '계약 대기' | '계약 체결' | '계약 헤지' | '계약 만료';
export type ContractType = '직접 PPA' | '한전 거래' | '중개거래' | '지체소비';
export type SettlementType = 'SMP 연동형' | '고정 단가' | 'SMP 연동';

export interface ContractRow {
  tradeNo: string;
  plant: string;
  counterparty: string;
  contractQty: string;
  contractPeriod: string;
  settlementType: SettlementType;
  status: ContractStatus;
}

export const contractStatusOptions = [
  { label: '전체', value: '' },
  { label: '계약 대기', value: '계약 대기' },
  { label: '계약 체결', value: '계약 체결' },
  { label: '계약 헤지', value: '계약 헤지' },
  { label: '계약 만료', value: '계약 만료' },
];

export const contractTypeOptions = [
  { id: 'direct', label: '직접 PPA' },
  { id: 'kepco', label: '한전 거래' },
  { id: 'broker', label: '중개거래' },
  { id: 'self', label: '지체소비' },
];

export const settlementTypeOptions = [
  { id: 'smp', label: 'SMP 연동형' },
  { id: 'fixed', label: '고정 단가' },
];

export const tradeStatusOptions = [
  { id: 'wait', label: '계약 대기' },
  { id: 'signed', label: '계약 체결' },
  { id: 'hedge', label: '계약 헤지' },
  { id: 'expired', label: '계약 만료' },
];

export const contractSummary = {
  activeCount: 3,
  totalQty: '163,219 kW',
  directPpaCount: 5,
  kepcoBrokerCount: 2,
};

const baseRows: ContractRow[] = [
  {
    tradeNo: 'LTC-217833',
    plant: '와이어블 1호기',
    counterparty: 'XX 전자',
    contractQty: '100kW',
    contractPeriod: '2025-12-01 ~ 2026-12-01',
    settlementType: 'SMP 연동형',
    status: '계약 대기',
  },
  {
    tradeNo: 'LTC-398323',
    plant: '와이어블 2호기',
    counterparty: 'XX 시스템',
    contractQty: '300kW',
    contractPeriod: '2026-01-01 ~ 2026-12-31',
    settlementType: '고정 단가',
    status: '계약 체결',
  },
  {
    tradeNo: 'LTC-938223',
    plant: '와이어블 3호기',
    counterparty: 'ㄷㄷㄷ 시스템',
    contractQty: '500kW',
    contractPeriod: '2026-01-01 ~ 2026-12-31',
    settlementType: 'SMP 연동',
    status: '계약 헤지',
  },
  {
    tradeNo: 'LTC-1298712',
    plant: '와이어블 1호기',
    counterparty: 'XX 전자',
    contractQty: '100kW',
    contractPeriod: '2023-12-01 ~ 2024-12-01',
    settlementType: 'SMP 연동형',
    status: '계약 만료',
  },
];

const plants = ['와이어블 1호기', '와이어블 2호기', '와이어블 3호기', '솔라 팜 A', '그린 파워 1'];
const counterparties = ['XX 전자', 'XX 시스템', 'YY 에너지', 'ZZ 파워', 'ABC 기업'];
const statuses: ContractStatus[] = ['계약 대기', '계약 체결', '계약 헤지', '계약 만료'];
const settlementTypes: SettlementType[] = ['SMP 연동형', '고정 단가', 'SMP 연동'];

const extraRows: ContractRow[] = Array.from({ length: 71 }, (_, i) => {
  const tradeNo = `LTC-${String(100000 + (i + baseRows.length) * 13337).slice(0, 7)}`;
  const startYear = 2024 + Math.floor(i / 24);
  const startMonth = ((i % 12) + 1).toString().padStart(2, '0');
  const endMonth = (((i + 6) % 12) + 1).toString().padStart(2, '0');
  const endYear = endMonth < startMonth ? startYear + 1 : startYear;
  const qty = 100 + (i % 10) * 50;
  return {
    tradeNo,
    plant: plants[i % plants.length],
    counterparty: counterparties[i % counterparties.length],
    contractQty: `${qty}kW`,
    contractPeriod: `${startYear}-${startMonth}-01 ~ ${endYear}-${endMonth}-01`,
    settlementType: settlementTypes[i % settlementTypes.length],
    status: statuses[i % statuses.length],
  };
});

export const contractRows: ContractRow[] = [...baseRows, ...extraRows];

export function findContractDetail(tradeNo: string): ContractRow | null {
  return contractRows.find((r) => r.tradeNo === tradeNo) ?? null;
}
