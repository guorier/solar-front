import { SearchFieldConfig } from '@/components';
import { ColDef } from 'ag-grid-community';

// [코드 관리] 검색 config
export const CODE_SEARCH_CONFIG: SearchFieldConfig[] = [
  {
    key: 'codeNm',
    label: '코드 이름',
    type: 'text',
    placeholder: '입력',
    gridSize: 5,
  },
  {
    key: 'code',
    label: '코드',
    type: 'text',
    placeholder: '입력',
    gridSize: 5,
  },
];

// [코드 관리] 마스터 코드 목록 테이블 컬럼 정의
export const MASTER_CODE_COLUMN: ColDef[] = [
  { field: 'codeNm', headerName: '코드 이름' },
  { field: 'code', headerName: '코드' },
  { field: 'status', headerName: '상태' },
  { field: 'regDt', headerName: '등록 일시' },
];

// [코드 관리] 서브 코드 목록 테이블 컬럼 정의
export const SUB_CODE_COLUMN: ColDef[] = [
  { field: 'masterCd', headerName: '마스터 코드' },
  { field: 'code', headerName: '코드' },
  { field: 'codeNm', headerName: '코드명' },
  { field: 'sort', headerName: '정렬' },
  { field: 'status', headerName: '상태' },
  { field: 'regDt', headerName: '등록 일시' },
];

// 마스터 코드 임시 데이터
export const MASTER_CODE_ROW_DATA = [
  {
    codeNm: '사용자 상태',
    code: 'USER_STATUS',
    status: 'Y',
    regDt: '2026-03-30 10:00:00',
  },
  {
    codeNm: '상품 상태',
    code: 'PRODUCT_STATUS',
    status: 'Y',
    regDt: '2026-03-29 14:20:00',
  },
  {
    codeNm: '주문 상태',
    code: 'ORDER_STATUS',
    status: 'N',
    regDt: '2026-03-28 09:15:00',
  },
];

// 서브 코드 임시 데이터
export const SUB_CODE_ROW_DATA = [
  {
    masterCd: 'USER_STATUS',
    code: 'ACTIVE',
    codeNm: '활성',
    sort: 1,
    status: 'Y',
    regDt: '2026-03-30 10:10:00',
  },
  {
    masterCd: 'USER_STATUS',
    code: 'INACTIVE',
    codeNm: '비활성',
    sort: 2,
    status: 'Y',
    regDt: '2026-03-30 10:11:00',
  },
  {
    masterCd: 'PRODUCT_STATUS',
    code: 'SALE',
    codeNm: '판매중',
    sort: 1,
    status: 'Y',
    regDt: '2026-03-29 14:25:00',
  },
  {
    masterCd: 'PRODUCT_STATUS',
    code: 'STOP',
    codeNm: '판매중지',
    sort: 2,
    status: 'N',
    regDt: '2026-03-29 14:26:00',
  },
  {
    masterCd: 'ORDER_STATUS',
    code: 'READY',
    codeNm: '주문대기',
    sort: 1,
    status: 'Y',
    regDt: '2026-03-28 09:20:00',
  },
  {
    masterCd: 'ORDER_STATUS',
    code: 'COMPLETE',
    codeNm: '주문완료',
    sort: 2,
    status: 'Y',
    regDt: '2026-03-28 09:21:00',
  },
];
