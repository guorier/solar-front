import { ComCodeItem } from '@/services/common/type';

type SelectOption = {
  label: string;
  value: string;
};

export const makeOptions = (codes?: ComCodeItem[]): SelectOption[] => {
  if (!codes) return [];

  return codes.map((code) => ({
    label: code.comSubCdNm,
    value: code.comSubCd,
  }));
};
