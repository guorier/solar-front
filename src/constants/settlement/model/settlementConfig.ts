// src\constants\eqpmnt\strct\config\strct-list.config.ts

import type { SearchFieldConfig } from '@/components';
import type { SearchValues } from './settlementType';

// 초기 검색 값
export const initialSearchValues: SearchValues = {
  plantName: '',
  stType: '',
  date: '',
};

// search
export const searchConfig: SearchFieldConfig[] = [
  {
    key: 'plantName',
    label: '발전소',
    type: 'select',
    options: [
      { label: '와이어블 1호기', value: 'wiable-1' },
      { label: '와이어블 2호기', value: 'wiable-2' },
    ],
  },
  {
    key: 'stType',
    label: '정산 유형',
    type: 'select',
    options: [
      { label: 'RTU 임시 정산', value: 'rtu' },
      { label: 'AMI 정산', value: 'ami' },
    ],
  },
  {
    key: 'date',
    label: '날짜',
    type: 'date',
  },
];