import { SearchFieldConfig } from '@/components';
import { ColDef } from 'ag-grid-community';

// [운영 관리 > 유지보수] 정비 이력 검색 config
export const OPERATION_HISTORY_SEARCH_CONFIG: SearchFieldConfig[] = [
  {
    key: 'plantName',
    label: '발전소',
    type: 'select',
    placeholder: '선택',
    required: true,
    options: [
      { label: '서울 발전소', value: '1' },
      { label: '인천 발전소', value: '2' },
      { label: '부산 발전소', value: '3' },
    ],
  },
  {
    key: 'worker',
    label: '작업자',
    type: 'text',
    placeholder: '입력',
  },
  {
    key: 'taskType',
    label: '작업 유형',
    type: 'select',
    placeholder: '선택',
    options: [
      { label: '단순 점검', value: '1' },
      { label: '정기 점검', value: '2' },
      { label: '장애 점검', value: '3' },
    ],
  },
  {
    key: 'completedDate',
    label: '완료일',
    type: 'date-range',
    placeholder: '선택',
    required: true,
    gridSize: 4,
  },
];

// [운영관리 > 유지보수] 정비 이력 테이블 컬럼 정의
export const OPERATION_HISTORY_COLUMN: ColDef[] = [
  { field: 'plantName', headerName: '발전소' },
  { field: 'taskName', headerName: '작업 명' },
  { field: 'taskCode', headerName: '작업 코드' },
  { field: 'taskType', headerName: '작업 유형' },
  { field: 'worker', headerName: '작업자' },
  { field: 'completedDate', headerName: '작업 완료일' },
];

// [운영관리 > 유지보수] 정비 이력 임시 데이터
export const OPERATION_HISTORY_ROW_DATA = [
  {
    plantName: '서울 발전소',
    taskName: '터빈 점검',
    taskCode: 'T-001',
    taskType: '정기 점검',
    worker: '김철수',
    completedDate: '2026-03-20',
  },
  {
    plantName: '부산 발전소',
    taskName: '배관 수리',
    taskCode: 'P-023',
    taskType: '긴급 수리',
    worker: '이영희',
    completedDate: '2026-03-22',
  },
  {
    plantName: '인천 발전소',
    taskName: '발전기 교체',
    taskCode: 'G-110',
    taskType: '설비 교체',
    worker: '박민수',
    completedDate: '2026-03-25',
  },
];
