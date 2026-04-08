// src\constants\eqpmnt\strct\config\strct-list.config.ts

import type { SearchFieldConfig } from '@/components';
import type { SearchValues } from '../model/settlementType';

// 초기 검색 값
export const initialSearchValues: SearchValues = {
  plantName: '',
  stType: '',
  date: '',
};

// search
export function createSearchConfig(onSearchClick: () => void): SearchFieldConfig[] {
  return [
    {
      key: 'plantNm',
      label: '발전소',
      type: 'search-text',
      placeholder: '발전소를 선택해 주세요',
      readOnly: true,
      searchText: '검색',
      gridSize: 2,
      onSearchClick,
    },
    {
      key: 'stType',
      label: '정산 유형',
      type: 'select',
      options: [
        { label: 'RTU 임시 정산', value: 'rtu' },
        { label: 'AMI 정산', value: 'ami' },
      ],
      gridSize: 2,
    },
    {
      key: 'date',
      label: '날짜',
      type: 'date',
      gridSize: 2,
    },
  ];
}
