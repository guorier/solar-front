import { ColDef } from 'ag-grid-community';

// [운영관리 > 유지보수] 현황 목록 테이블 컬럼 정의
export const OPERATION_STATUS_COLUMN: ColDef[] = [
  { field: 'plantName', headerName: '발전소' },
  { field: 'operationRate', headerName: '가동률' },
  { field: 'alarmCount', headerName: '알림' },
  { field: 'dispatchCount', headerName: '출동' },
  { field: 'energyLoss', headerName: '에너지 손실(kWh)' },
];

// [운영관리 > 유지보수] 현황 목록 임시 데이터
export const OPERATION_STATUS_ROW_DATA = [
  {
    plantName: '서울 발전소',
    operationRate: 92.5,
    alarmCount: 3,
    dispatchCount: 1,
    energyLoss: 120.5,
  },
  {
    plantName: '부산 발전소',
    operationRate: 88.2,
    alarmCount: 5,
    dispatchCount: 2,
    energyLoss: 245.8,
  },
  {
    plantName: '인천 발전소',
    operationRate: 95.1,
    alarmCount: 1,
    dispatchCount: 0,
    energyLoss: 60.3,
  },
];
