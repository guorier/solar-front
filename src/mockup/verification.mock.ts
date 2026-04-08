export type VerificationStatus = '정상' | '오류';

export interface MonthlyVerificationRow {
  period: string;
  plantName: string;
  kepcoMeterKwh: number;
  systemGenKwh: number;
  diffKwh: number;
  diffRate: number;
  status: VerificationStatus;
  inputDate: string;
  inputPerson: string;
}

export interface DailyVerificationRow {
  date: string;
  plantName: string;
  systemGenKwh: number;
  measuredGenKwh: number;
  diffKwh: number;
  diffRate: number;
  status: VerificationStatus;
}

export const monthlyVerificationRows: MonthlyVerificationRow[] = [
  {
    period: '2025-11',
    plantName: '와이어블 1호기',
    kepcoMeterKwh: 10250,
    systemGenKwh: 10180,
    diffKwh: 70,
    diffRate: 0.68,
    status: '정상',
    inputDate: '2025-11-30',
    inputPerson: '관리자',
  },
  {
    period: '2025-10',
    plantName: '와이어블 1호기',
    kepcoMeterKwh: 9950,
    systemGenKwh: 10020,
    diffKwh: -70,
    diffRate: -0.7,
    status: '정상',
    inputDate: '2025-10-31',
    inputPerson: '관리자',
  },
  {
    period: '2025-09',
    plantName: '와이어블 1호기',
    kepcoMeterKwh: 10850,
    systemGenKwh: 10720,
    diffKwh: 130,
    diffRate: 1.21,
    status: '정상',
    inputDate: '2025-09-30',
    inputPerson: '관리자',
  },
  {
    period: '2025-08',
    plantName: '와이어블 1호기',
    kepcoMeterKwh: 8750,
    systemGenKwh: 9050,
    diffKwh: -300,
    diffRate: -3.31,
    status: '오류',
    inputDate: '2025-08-31',
    inputPerson: '관리자',
  },
  {
    period: '2025-07',
    plantName: '와이어블 1호기',
    kepcoMeterKwh: 11200,
    systemGenKwh: 11150,
    diffKwh: 50,
    diffRate: 0.44,
    status: '정상',
    inputDate: '2025-07-31',
    inputPerson: '관리자',
  },
  {
    period: '2025-06',
    plantName: '와이어블 1호기',
    kepcoMeterKwh: 10600,
    systemGenKwh: 10580,
    diffKwh: 20,
    diffRate: 0.18,
    status: '정상',
    inputDate: '2025-06-30',
    inputPerson: '관리자',
  },
];

const dailyDiffs = [0, -5, 3, -8, 2, 1, -2, 4, -1, 0, 5, -3, 6, -4, 2, -1, 3, 0, -5, 2, 1, -6, 4, -2, 0, 3, -1, 5, -3, 2];

export const dailyVerificationRows: DailyVerificationRow[] = Array.from({ length: 30 }, (_, i) => {
  const day = i + 1;
  const systemKwh = 320 + (i % 7) * 12 + (i % 3) * 8;
  const diff = dailyDiffs[i] ?? 0;
  const measuredKwh = systemKwh + diff;
  const diffRate = parseFloat(((diff / systemKwh) * 100).toFixed(2));
  return {
    date: `2025-11-${String(day).padStart(2, '0')}`,
    plantName: '와이어블 1호기',
    systemGenKwh: systemKwh,
    measuredGenKwh: measuredKwh,
    diffKwh: diff,
    diffRate,
    status: Math.abs(diffRate) < 3 ? '정상' : '오류',
  };
});
