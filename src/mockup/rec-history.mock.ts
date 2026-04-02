export interface RecHistoryRow {
  requestNo: string;
  plantName: string;
  targetMonth: string;
  generationKwh: string;
  recAmount: string;
  approvedAt: string;
  issuedAt: string;
}

export interface RecHistorySummaryItem {
  label: string;
  value: string;
}

export const recHistorySummaryItems: RecHistorySummaryItem[] = [
  { label: '총 신청 건수', value: '81 건' },
  { label: '총 발급량', value: '118.2 REC' },
  { label: '총 발전량', value: '981,821 kWh' },
];

const plantNames = [
  '와이어블 1호기',
  '와이어블 2호기',
  '와이어블 3호기',
  '그린에너지 A호',
  '해솔 태양광',
];

const firstRows: RecHistoryRow[] = [
  {
    requestNo: 'REC-3909843',
    plantName: '와이어블 1호기',
    targetMonth: '2025-11',
    generationKwh: '36,200 kWh',
    recAmount: '35.9 REC',
    approvedAt: '2025-12-20',
    issuedAt: '2025-12-22',
  },
  {
    requestNo: 'REC-840932',
    plantName: '와이어블 2호기',
    targetMonth: '2025-11',
    generationKwh: '38,200 kWh',
    recAmount: '38.1 REC',
    approvedAt: '2025-12-20',
    issuedAt: '2025-12-22',
  },
  {
    requestNo: 'REC-390928',
    plantName: '와이어블 1호기',
    targetMonth: '2025-10',
    generationKwh: '35,100 kWh',
    recAmount: '34.8 REC',
    approvedAt: '2025-11-18',
    issuedAt: '2025-11-20',
  },
];

const otherRows: RecHistoryRow[] = Array.from({ length: 72 }, (_, index) => {
  const plant = plantNames[(index + 2) % plantNames.length];
  const targetMonths = ['2025-09', '2025-10', '2025-11'];
  const targetMonth = targetMonths[index % 3];
  const generation = (34000 + index * 80).toLocaleString('ko-KR');
  const rec = (33.5 + index * 0.12).toFixed(1);
  const approveMonths = ['2025-10', '2025-11', '2025-12'];
  const approveMonthStr = approveMonths[index % 3];
  const approveDay = 10 + (index % 15);
  const issueDay = Math.min(approveDay + 2, 28);

  return {
    requestNo: `REC-${String(800000 - index * 8000)}`,
    plantName: plant,
    targetMonth,
    generationKwh: `${generation} kWh`,
    recAmount: `${rec} REC`,
    approvedAt: `${approveMonthStr}-${String(approveDay).padStart(2, '0')}`,
    issuedAt: `${approveMonthStr}-${String(issueDay).padStart(2, '0')}`,
  };
});

export const recHistoryRows: RecHistoryRow[] = [...firstRows, ...otherRows];
