export interface RecStatusMetric {
  label: string;
  value: string;
  helper: string;
  notice?: string;
}

export interface RecStatusRecentIssueRow {
  tradeDate: string;
  plantName: string;
  transactionAmount: string;
  smpUnitPrice: string;
  recUnitPrice: string;
  totalRevenue: string;
}

const plantNames = [
  '와이어블 1호기',
  '와이어블 2호기',
  '해솔 태양광',
  '그린에너지 A동',
  '태양발전소 3호기',
  '서해 솔라팜',
  '남동 에너지센터',
  '한빛 태양광',
];

export const recStatusSummaryMock: RecStatusMetric[] = [
  {
    label: '총 신청 건수',
    value: '8건',
    helper: '전체 발급 신청',
  },
  {
    label: '발급 완료',
    value: '19건',
    helper: '정상 발급 완료',
  },
  {
    label: '처리 대기',
    value: '2건',
    helper: '신청 심사 진행 중',
  },
  {
    label: '누적 발급량',
    value: '191.36',
    helper: 'REC 인증서',
  },
];

export const recStatusMonthlyMock = {
  title: '이번 달 REC 발급 현황(2026년 1월)',
  progressRate: 82,
  metrics: [
    {
      label: '예상 발전량',
      value: '12,000 kWh',
      helper: '',
    },
    {
      label: '예상 REC',
      value: '11 REC',
      helper: '',
    },
    {
      label: '신청 완료',
      value: '0 REC',
      helper: '',
    },
    {
      label: '신청 가능',
      value: '12 REC',
      helper: '',
    },
  ] satisfies RecStatusMetric[],
};

export const recStatusRecentIssuesMock: RecStatusRecentIssueRow[] = Array.from(
  { length: 50 },
  (_, index) => {
    const day = 15 - (index % 15);
    const transactionValue = 980 + index * 17;
    const smpValue = 148 + (index % 4);
    const recValue = 30 + (index % 3);
    const totalRevenueValue = 720000 + transactionValue * (smpValue + recValue);

    return {
      tradeDate: `2025-12-${String(day).padStart(2, '0')}`,
      plantName: plantNames[index % plantNames.length],
      transactionAmount: transactionValue.toLocaleString('ko-KR'),
      smpUnitPrice: `${smpValue}원`,
      recUnitPrice: `${recValue}원`,
      totalRevenue: `${totalRevenueValue.toLocaleString('ko-KR')}원`,
    };
  },
);
