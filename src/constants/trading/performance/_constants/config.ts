import type { SearchFieldConfig } from '@/components';

export function formatApiDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}${m}${d}`;
}

export function getDefaultDates() {
  const today = new Date();
  const thirtyDaysAgo = new Date(today);
  thirtyDaysAgo.setDate(today.getDate() - 29);
  return { fromDate: formatApiDate(thirtyDaysAgo), toDate: formatApiDate(today) };
}

export const searchConfig: SearchFieldConfig[] = [
  { key: 'fromDate', label: '거래 시작일', type: 'date' },
  { key: 'toDate', label: '거래 종료일', type: 'date' },
];

export const showNumberConfig: (SearchFieldConfig | SearchFieldConfig[])[] = [
  {
    key: 'showNumber',
    type: 'select',
    options: [
      { label: '20개씩 보기', value: '20' },
      { label: '40개씩 보기', value: '40' },
      { label: '60개씩 보기', value: '60' },
    ],
  },
];
