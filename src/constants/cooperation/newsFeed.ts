import { SearchFieldConfig } from '@/components';

// [공유/협력] 뉴스 피드 검색 config
export const NEWS_FEED_SEARCH_CONFIG: SearchFieldConfig[] = [
  {
    key: 'source',
    label: '출처 항목',
    type: 'select',
    placeholder: '선택',
    options: [
      { label: '국내 기사', value: '001' },
      { label: '해외 기사', value: '002' },
    ],
  },
  {
    key: 'category',
    label: '기사 카테고리',
    type: 'select',
    placeholder: '선택',
    options: [
      { label: '정책', value: '001' },
      { label: '시장', value: '002' },
      { label: '글로벌', value: '003' },
      { label: '기술', value: '004' },
      { label: '금융', value: '005' },
      { label: '환경', value: '006' },
      { label: '안전', value: '007' },
    ],
  },
  {
    key: 'word',
    label: '검색 단어',
    type: 'select',
    placeholder: '선택',
    options: [
      { label: '태양광', value: '태양광' },
      { label: '재생에너지', value: '재생에너지' },
    ],
  },
  {
    key: 'keyword',
    label: '검색어',
    type: 'text',
    placeholder: '검색어 입력',
    gridSize: 4,
  },
];
