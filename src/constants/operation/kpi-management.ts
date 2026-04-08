import { ColDef } from 'ag-grid-community';

// [운영 관리] 발전 장비 성능 지표 테이블 컬럼 정의
export const OPERATION_KPI_MANAGEMENT_COLUMN: ColDef[] = [
  { field: 'equipment', headerName: '장비' },
  { field: 'powerPlant', headerName: '발전소' },
  { field: 'kpiName', headerName: '지표 이름' },
  { field: 'formula', headerName: '계산식' },
  { field: 'currentValue', headerName: '현재 값' },
  { field: 'status', headerName: '상태' },
  { field: 'threshold', headerName: '임계 값' },
  { field: 'condition', headerName: '조건' },
  { field: 'updatedAt', headerName: '수정일' },
];

// [운영 관리] 발전 장비 성능 지표 암시 Row Data
export const OPERATION_KPI_MANAGEMENT_ROW_DATA = [
  {
    equipment: '터빈 A1',
    powerPlant: '서울 발전소',
    kpiName: '출력 효율',
    formula: '(출력 / 입력) * 100',
    currentValue: '92%',
    status: '정상',
    threshold: '85%',
    condition: '85% 이상',
    updatedAt: '2026-03-01 11:30',
  },
  {
    equipment: '발전기 B2',
    powerPlant: '부산 발전소',
    kpiName: '온도',
    formula: '센서 측정값',
    currentValue: '78°C',
    status: '주의',
    threshold: '75°C',
    condition: '75°C 이하',
    updatedAt: '2026-03-02 13:30',
  },
  {
    equipment: '냉각기 C3',
    powerPlant: '인천 발전소',
    kpiName: '냉각 효율',
    formula: '(냉각량 / 소비전력)',
    currentValue: '1.2',
    status: '정상',
    threshold: '1.0',
    condition: '1.0 이상',
    updatedAt: '2026-03-03 10:30',
  },
];
