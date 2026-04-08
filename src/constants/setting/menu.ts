import { SearchFieldConfig } from '@/components';
import { MenuGroupListParams } from '@/services/common/type';
import { ColDef } from 'ag-grid-community';

// 메뉴 그룹 권한 검색 기본 값
export const INITIAL_SEARCH_VALUES: MenuGroupListParams = {
  groupCd: '',
  keyword: '',
  accessLevelCd: '',
  grdCd: '',
  useYn: '',
};

// 메뉴 그룹 권한 검색 config
export const MENU_GROUP_SEARCH_CONFIG: SearchFieldConfig[] = [
  {
    key: 'keyword',
    label: '메뉴 권한 이름',
    type: 'text',
    placeholder: '입력',
  },
  {
    key: 'accessLevelCd',
    label: '권한 종류',
    type: 'select',
    placeholder: '선택',
    options: [],
  },
  {
    key: 'grdCd',
    label: '권한 등급',
    type: 'select',
    placeholder: '선택',
    options: [],
  },
  {
    key: 'useYn',
    label: '상태',
    type: 'select',
    placeholder: '선택',
    options: [
      { label: '사용', value: 'Y' },
      { label: '정지', value: 'N' },
    ],
  },
];

// 메뉴 그룹 권한 목록 테이블 컬럼 정의
export const MENU_GROUP_COLUMN: ColDef[] = [
  { field: 'groupNm', headerName: '메뉴 권한 이름' },
  { field: 'accessLevelNm', headerName: '계정 권한 종류' },
  { field: 'grdNm', headerName: '계정 권한 등급' },
  { field: 'useYn', headerName: '상태' },
  { field: 'rgtrId', headerName: '등록 ID' },
  { field: 'regDt', headerName: '등록일시' },
  { field: 'mdfrId', headerName: '수정 ID' },
  { field: 'mdfcnDt', headerName: '수정일시' },
];

// 메뉴 그룹 권한 저장 테이블 컬럼 정의
export const MENU_GROUP_SAVE_COLUMN: ColDef[] = [
  {
    headerName: '선택',
    checkboxSelection: true,
    width: 200,
  },
  { field: 'menuNm', headerName: '메뉴 이름', flex: 1 },
  { field: 'depthCd', headerName: '깊이', flex: 1 },
  { field: 'path', headerName: '메뉴 URL', flex: 2 },
];
