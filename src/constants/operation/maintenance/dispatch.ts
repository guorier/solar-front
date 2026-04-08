import { SearchFieldConfig } from '@/components';
import { ColDef } from 'ag-grid-community';

// [운영 관리 > 유지보수] 출동 관리 검색 config
export const OPERATION_DISPATCH_SEARCH_CONFIG: SearchFieldConfig[] = [
  {
    key: 'plantName',
    label: '발전소',
    type: 'select',
    placeholder: '선택',
    options: [
      { label: '서울 발전소', value: '1' },
      { label: '인천 발전소', value: '2' },
      { label: '부산 발전소', value: '3' },
    ],
  },
  {
    key: 'managerName',
    label: '담당자',
    type: 'text',
    placeholder: '입력',
  },
  {
    key: 'status',
    label: '상태',
    type: 'select',
    placeholder: '선택',
    options: [
      { label: '진행중', value: '1' },
      { label: '대기', value: '2' },
      { label: '완료', value: '3' },
    ],
  },
  {
    key: 'completedDate',
    label: '완료일',
    type: 'date-range',
    placeholder: '선택',
    gridSize: 4,
  },
];

// [운영 관리 > 유지보수] 출동 관리 목록 테이블 컬럼 정의
export const OPERATION_DISPATCH_COLUMN: ColDef[] = [
  { field: 'workCode', headerName: '작업 코드' },
  { field: 'workName', headerName: '작업명' },
  { field: 'plantName', headerName: '발전소' },
  { field: 'deviceName', headerName: '장치' },
  { field: 'notificationType', headerName: '알림' },
  { field: 'workType', headerName: '작업 유형' },
  { field: 'status', headerName: '상태' },
  { field: 'managerName', headerName: '담당자' },
  { field: 'scheduledAt', headerName: '예정 일시' },
  { field: 'completedAt', headerName: '완료 일시' },
];

// [운영 관리 > 유지보수] 출동 관리 목록 암시 Row Data
export const OPERATION_DISPATCH_ROW_DATA = [
  {
    workCode: 'WK-20260301-001',
    workName: '터빈 점검',
    plantName: '서울 발전소',
    deviceName: '터빈 A1',
    notificationType: 'SMS',
    workType: '정기 점검',
    status: '완료',
    managerName: '김철수',
    scheduledAt: '2026-03-01 09:00',
    completedAt: '2026-03-01 11:30',
  },
  {
    workCode: 'WK-20260302-002',
    workName: '발전기 수리',
    plantName: '부산 발전소',
    deviceName: '발전기 B2',
    notificationType: '이메일',
    workType: '긴급 수리',
    status: '진행중',
    managerName: '이영희',
    scheduledAt: '2026-03-02 13:00',
    completedAt: '',
  },
  {
    workCode: 'WK-20260303-003',
    workName: '냉각 시스템 점검',
    plantName: '인천 발전소',
    deviceName: '냉각기 C3',
    notificationType: '앱 알림',
    workType: '정기 점검',
    status: '대기',
    managerName: '박민수',
    scheduledAt: '2026-03-03 10:00',
    completedAt: '',
  },
];

// [운영 관리 > 유지보수 > 출동관리] 장애 접수 장애 검색 테이블 컬럼 정의
export const OPERATION_ERROR_SEARCH_COLUMN: ColDef[] = [
  { field: 'errorLevel', headerName: '장애 등급' },
  { field: 'errorName', headerName: '장애명' },
  { field: 'errorCode', headerName: '장애 코드' },
  { field: 'deviceName', headerName: '장치 명' },
  { field: 'occurredAt', headerName: '발생 시간' },
];

// [운영 관리 > 유지보수 > 출동관리] 장애 접수 장애 검색 암시 Row Data
export const OPERATION_ERROR_SEARCH_ROW_DATA = [
  {
    errorLevel: 'HIGH',
    errorName: '터빈 과열',
    errorCode: '001',
    deviceName: '터빈 A-1',
    occurredAt: '2026-03-01 09:12:33',
  },
  {
    errorLevel: 'MEDIUM',
    errorName: '발전기 출력 이상',
    errorCode: '002',
    deviceName: '발전기 B-2',
    occurredAt: '2026-03-02 14:45:10',
  },
  {
    errorLevel: 'LOW',
    errorName: '냉각 시스템 경고',
    errorCode: '003',
    deviceName: '냉각장치 C-3',
    occurredAt: '2026-03-03 08:21:55',
  },
];

// [운영 관리 > 유지보수 > 출동관리] 장애 접수 작업 검색 테이블 컬럼 정의
export const OPERATION_TASK_SEARCH_COLUMN: ColDef[] = [
  { field: 'workCode', headerName: '작업 코드' },
  { field: 'workName', headerName: '작업명' },
  { field: 'workType', headerName: '작업 유형' },
  { field: 'status', headerName: '상태' },
  { field: 'managerName', headerName: '담당자' },
];

// [운영 관리 > 유지보수 > 출동관리] 장애 접수 작업 검색 암시 Row Data
export const OPERATION_TASK_SEARCH_ROW_DATA = [
  {
    workCode: 'WK-001',
    workName: '터빈 점검',
    workType: '정기 점검',
    status: '완료',
    managerName: '김철수',
  },
  {
    workCode: 'WK-002',
    workName: '발전기 수리',
    workType: '긴급 수리',
    status: '진행중',
    managerName: '이영희',
  },
  {
    workCode: 'WK-003',
    workName: '냉각 시스템 점검',
    workType: '정기 점검',
    status: '대기',
    managerName: '박민수',
  },
];
