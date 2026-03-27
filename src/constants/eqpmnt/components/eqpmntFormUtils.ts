export const trimText = (v: string) => v.trim();

export const toTrimmedString = (v: unknown) => {
  if (v === null || v === undefined) return '';
  return trimText(String(v));
};