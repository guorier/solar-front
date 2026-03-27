// src/constants/eqpmnt/common/equipListConfig.ts

import type { SearchValues, RightValues } from './EquipListType';
import type { SearchFieldConfig } from '@/components';

export const initialSearchValues: SearchValues = {
  equipName: '',
  plantName: '',
  manufacturer: '',
};

export const initialRightValues: RightValues = {
  showNumber: '20',
};

// ✅ readonly(as const) 제거 + SearchFieldConfig[]로 명시
export const searchConfig: SearchFieldConfig[] = [
  {
    key: 'equipName',
    label: '장비 명',
    type: 'text',
    placeholder: '장비 명',
  },
  {
    key: 'plantName',
    label: '발전소',
    type: 'text',
    placeholder: '발전소',
  },
  {
    key: 'manufacturer',
    label: '제조사',
    type: 'text',
    placeholder: '제조사',
  },
];

export const equipRightConfig: (SearchFieldConfig | SearchFieldConfig[])[] = [
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