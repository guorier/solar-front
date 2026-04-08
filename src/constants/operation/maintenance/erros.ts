import { ColDef } from 'ag-grid-community';

// [운영관리 > 유지보수] 오류 모니터링 목록 테이블 컬럼 정의
export const OPERATION_ERRORS_COLUMN: ColDef[] = [
  { field: 'timestamp', headerName: '시간' },
  { field: 'plantName', headerName: '발전소' },
  { field: 'equipmentName', headerName: '장비' },
  { field: 'alarmName', headerName: '알람명' },
  { field: 'errorLevel', headerName: '장애 등급' },
  { field: 'status', headerName: '상태' },
  { field: 'managerName', headerName: '담당자' },
];

// [운영관리 > 유지보수] 오류 모니터링 목록 임시 데이터
export const OPERATION_ERRORS_ROW_DATA = [
  {
    timestamp: '2026-03-01 09:12:33',
    plantName: '서울 발전소',
    equipmentName: '터빈 A-1',
    alarmName: '과열 경고',
    errorLevel: 'HIGH',
    status: '진행중',
    managerName: '김철수',
  },
  {
    timestamp: '2026-03-02 14:45:10',
    plantName: '부산 발전소',
    equipmentName: '발전기 B-2',
    alarmName: '출력 이상',
    errorLevel: 'MEDIUM',
    status: '대기',
    managerName: '이영희',
  },
  {
    timestamp: '2026-03-03 08:21:55',
    plantName: '인천 발전소',
    equipmentName: '냉각장치 C-3',
    alarmName: '온도 상승',
    errorLevel: 'LOW',
    status: '완료',
    managerName: '박민수',
  },
];
