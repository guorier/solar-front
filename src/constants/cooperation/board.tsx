import { SearchFieldConfig } from '@/components';
import { ColDef, ICellRendererParams } from 'ag-grid-community';

// [공유/협력] 게시판 검색 config
export const BOARD_SEARCH_CONFIG: SearchFieldConfig[] = [
  {
    key: 'title',
    label: '제목',
    type: 'text',
    placeholder: '입력',
    gridSize: 3,
  },
  {
    key: 'description',
    label: '내용',
    type: 'text',
    placeholder: '입력',
    gridSize: 4,
  },
  {
    key: 'category',
    label: '카테고리',
    type: 'select',
    placeholder: '선택',
    options: [
      { label: '전체', value: '' },
      { label: '공지사항', value: '001' },
      { label: '자유게시판', value: '002' },
      { label: '유지보수', value: '003' },
    ],
  },
];

export type BoardRow = {
  isPinned: boolean;
  postNumber: string;
  category: string;
  title: string;
  author: string;
  views: number;
  file: string;
  likes: number;
  createdAt: string;
};

type BoardColumnProps = {
  onTogglePinned: (row: BoardRow) => void;
};

// [공유/협력] 게시판 테이블 컬럼 정의
export const getBoardColumns = ({ onTogglePinned }: BoardColumnProps): ColDef<BoardRow>[] => [
  {
    field: 'isPinned',
    headerName: '고정',
    width: 80,
    sortable: true,
    sort: 'desc',
    cellRenderer: (params: ICellRendererParams<BoardRow, boolean>) => {
      if (!params.data) return '';

      return (
        <span
          style={{
            cursor: 'pointer',
            fontSize: '16px',
            opacity: params.value ? 1 : 0,
          }}
          onClick={(e) => {
            e.stopPropagation();
            onTogglePinned(params.data!);
          }}
          title={params.value ? '고정 해제' : '고정'}
        >
          📌
        </span>
      );
    },
  },
  { field: 'postNumber', width: 80, headerName: '번호' },
  { field: 'category', headerName: '카테고리' },
  { field: 'title', headerName: '제목' },
  { field: 'author', headerName: '작성자' },
  { field: 'views', headerName: '조회' },
  { field: 'file', headerName: '파일' },
  { field: 'likes', headerName: '좋아요' },
  { field: 'createdAt', headerName: '작성일' },
];

// [공유/협력] 게시판 암시 Row Data
export const BOARD_ROW_DATA = [
  {
    isPinned: false,
    postNumber: '1',
    category: '공지',
    title: '터빈 A1 점검 일정 안내 [2]',
    author: '관리자',
    views: 120,
    file: '점검계획서.pdf',
    likes: 15,
    createdAt: '2026-03-01 11:30',
  },
  {
    isPinned: false,
    postNumber: '2',
    category: '협업',
    title: '발전기 B2 온도 이상 공유 [12]',
    author: '홍길동',
    views: 85,
    file: '온도데이터.xlsx',
    likes: 8,
    createdAt: '2026-03-02 13:30',
  },
  {
    isPinned: true,
    postNumber: '3',
    category: '자료',
    title: '냉각기 C3 효율 분석 자료 [7]',
    author: '이영희',
    views: 64,
    file: '효율분석.pdf',
    likes: 5,
    createdAt: '2026-03-03 10:30',
  },
];
