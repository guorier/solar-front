export interface RecStatusMetric {
  label: string;
  value: string;
  helper: string;
  notice?: string;
}

export interface RecIssueRow {
  id: number;
  targetDate: string;
  plantName: string;
  powerAmount: string;
  recCount: number;
  certStatus: '등록' | '미등록';
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
    label: '인증서 등록완료',
    value: '19건',
    helper: '정상 발급 완료',
  },
  {
    label: 'REC 인증서 누적 등록건수',
    value: '191 REC',
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

export const recStatusRecentIssuesMock: RecIssueRow[] = Array.from(
  { length: 30 },
  (_, index) => {
    const day = 30 - index;
    const powerValue = 980 + index * 17;
    const recCount = 3 + (index % 8);
    const certStatus: '등록' | '미등록' = index % 3 === 0 ? '등록' : '미등록';

    return {
      id: index + 1,
      targetDate: `2025-12-${String(day).padStart(2, '0')}`,
      plantName: plantNames[index % plantNames.length],
      powerAmount: powerValue.toLocaleString('ko-KR'),
      recCount,
      certStatus,
    };
  },
);
