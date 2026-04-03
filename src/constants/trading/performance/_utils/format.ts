export function formatNumber(value: number) {
  return value.toLocaleString('ko-KR');
}

export function toApiDate(date: string) {
  return date.replace(/-/g, '');
}
