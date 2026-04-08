import type { SearchFieldConfig } from '@/components';

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
      key: 'baseYmd',
      label: '기준일',
      type: 'date',
      gridSize: 2,
    },
  ];
}
