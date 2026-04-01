export type RecRequestStatus = '발급완료' | '승인' | '심사 중';

export interface RecRequestRow {
  requestNo: string;
  plantName: string;
  requestedAt: string;
  targetMonth: string;
  generationKwh: string;
  recAmount: string;
  status: RecRequestStatus;
}

export interface RecRequestOption {
  label: string;
  value: string;
}

export const recRequestPlantOptions: RecRequestOption[] = [
  { label: '전체', value: '' },
  { label: '와이어블 1호기', value: 'wiable-1' },
  { label: '와이어블 2호기', value: 'wiable-2' },
  { label: '와이어블 3호기', value: 'wiable-3' },
  { label: '그린에너지 A호', value: 'green-a' },
  { label: '그린에너지 B호', value: 'green-b' },
  { label: '해솔 태양관', value: 'haesol' },
];

export const recRequestStatusOptions: RecRequestOption[] = [
  { label: '전체', value: '' },
  { label: '발급완료', value: '발급완료' },
  { label: '승인', value: '승인' },
  { label: '심사 중', value: '심사 중' },
];

const otherPlantNames = recRequestPlantOptions
  .filter((option) => option.value && option.value !== 'wiable-1')
  .map((option) => option.label);

const statuses: RecRequestStatus[] = ['발급완료', '승인', '심사 중'];

const firstFiveRows: RecRequestRow[] = Array.from({ length: 5 }, (_, index) => {
  const rowNo = index + 1;
  const requestNumber = `REC${String(rowNo).padStart(3, '0')}`;
  const generation = (32721 + index * 86).toLocaleString('ko-KR');
  const rec = (42.2 + index * 0.9).toFixed(1);

  return {
    requestNo: requestNumber,
    plantName: '와이어블 1호기',
    requestedAt: '2025-12-05',
    targetMonth: '2025-11',
    generationKwh: `${generation} kWh`,
    recAmount: `${rec} REC`,
    status: statuses[index % statuses.length],
  };
});

const otherRows: RecRequestRow[] = Array.from({ length: 70 }, (_, index) => {
  const rowNo = index + 6;
  const requestNumber = `REC${String(rowNo).padStart(3, '0')}`;
  const day = 5 - (index % 5);
  const generation = (28900 + index * 64).toLocaleString('ko-KR');
  const rec = (34.5 + index * 0.47).toFixed(1);

  return {
    requestNo: requestNumber,
    plantName: otherPlantNames[index % otherPlantNames.length],
    requestedAt: `2025-12-${String(day).padStart(2, '0')}`,
    targetMonth: index % 2 === 0 ? '2025-11' : '2025-10',
    generationKwh: `${generation} kWh`,
    recAmount: `${rec} REC`,
    status: statuses[(index + 1) % statuses.length],
  };
});

export const recRequestRows: RecRequestRow[] = [...firstFiveRows, ...otherRows];
