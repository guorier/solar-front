import { SearchFieldConfig } from '@/components';
import { ColDef } from 'ag-grid-community';

// [기록 관리] 검색 config
export const ACCESS_LOGS_SEARCH_CONFIG: SearchFieldConfig[] = [
  {
    key: 'id',
    label: 'ID',
    type: 'text',
    placeholder: '입력',
  },
  {
    key: 'name',
    label: '이름',
    type: 'text',
    placeholder: '입력',
  },
  {
    key: 'date',
    label: '기간',
    type: 'date-range',
    placeholder: '입력',
    gridSize: 4,
  },
  {
    key: 'ip',
    label: 'IP',
    type: 'text',
    placeholder: '입력',
  },
];

// [기록 관리] 접근 기록 테이블 컬럼 정의
export const ACCESS_LOGS_COLUMN: ColDef[] = [
  { field: 'id', headerName: 'ID' },
  { field: 'name', headerName: '이름' },
  { field: 'url', headerName: 'URL' },
  { field: 'ip', headerName: 'IP' },
  { field: 'browser', headerName: 'Web Browser' },
  { field: 'os', headerName: '운영 체제' },
  { field: 'accessedAt', headerName: '접근 일시' },
];

// [기록 관리] 접근 기록 테이블 임시 Row Data
export const ACCESS_LOGS_ROW_DATA = [
  {
    id: 'U001',
    name: '홍길동',
    url: '/dashboard',
    ip: '192.168.0.1',
    browser: 'Chrome',
    os: 'Windows 11',
    accessedAt: '2026-03-30 09:15:23',
  },
  {
    id: 'U002',
    name: '김영희',
    url: '/settings',
    ip: '192.168.0.2',
    browser: 'Safari',
    os: 'macOS',
    accessedAt: '2026-03-30 10:22:11',
  },
  {
    id: 'U003',
    name: '이철수',
    url: '/reports',
    ip: '10.0.0.5',
    browser: 'Edge',
    os: 'Windows 10',
    accessedAt: '2026-03-30 11:05:44',
  },
  {
    id: 'U004',
    name: '박민수',
    url: '/admin',
    ip: '172.16.0.3',
    browser: 'Firefox',
    os: 'Ubuntu',
    accessedAt: '2026-03-30 12:40:19',
  },
  {
    id: 'U005',
    name: '최지은',
    url: '/profile',
    ip: '192.168.1.10',
    browser: 'Chrome',
    os: 'Android',
    accessedAt: '2026-03-30 13:55:02',
  },
];
