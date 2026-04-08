import { SearchFieldConfig } from '@/components';

// [공유/협력] 문서 공유 검색 config
export const DOC_SHARE_SEARCH_CONFIG: SearchFieldConfig[] = [
  {
    key: 'title',
    label: '제목',
    type: 'text',
    placeholder: '입력',
  },
  {
    key: 'tag',
    label: '태그',
    type: 'text',
    placeholder: '입력',
  },
  {
    key: 'docType',
    label: '문서 종류',
    type: 'select',
    placeholder: '선택',
    options: [
      { label: '전체', value: '' },
      { label: '운영 매뉴얼', value: '001' },
      { label: '점검 보고서', value: '002' },
      { label: '계약서', value: '003' },
    ],
  },
  {
    key: 'planNm',
    label: '발전소',
    type: 'select',
    placeholder: '검색어 입력',
    options: [
      { label: '발전소 A', value: '001' },
      { label: '발전소 B', value: '002' },
    ],
  },
];
