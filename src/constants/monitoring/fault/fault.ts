import { SearchFieldConfig } from '@/components';
import { formatYmdHm } from '@/utils';
import { ColDef, ValueFormatterParams } from 'ag-grid-community';

// 장애 상태 Mapping
export const FAULT_STATUS_MAPPING: Record<string, string> = {
  1: '🚨발생',
  2: '💡인지',
  3: '⛔해지',
};

// 장애 등급별 색상 처리
const getAlarmGradeStyle = (grade?: string) => {
  switch (grade) {
    case 'CRITICAL':
      return { color: 'var(--critical)', fontWeight: 600 };
    case 'MAJOR':
      return { color: 'var(--major)', fontWeight: 600 };
    case 'MINOR':
      return { color: 'var(--minor)', fontWeight: 600 };
    case 'WARNING':
      return { color: 'var(--warning)', fontWeight: 600 };
    default:
      return null;
  }
};

// [발전소 모니터링 > 장애 모니터링] 장애 모니터링 발전소 선택 컬럼 정의
export const PLANT_SELECT_COLUMN: ColDef[] = [
  {
    field: 'pwplNm',
    headerName: '발전소 명',
    flex: 1,
  },
];

// [발전소 모니터링 > 장애 모니터링] 장애 모니터링 테이블 컬럼 정의
export const FAULT_MONITORING_COLUMN: ColDef[] = [
  {
    field: 'pbptSe',
    headerName: '상태',
    flex: 0.7,
    valueFormatter: (params: ValueFormatterParams) => FAULT_STATUS_MAPPING[params.value],
  },
  { field: 'pwplNm', headerName: '발전소명', flex: 1.4 },
  {
    field: 'alrmGrd',
    headerName: '장애 등급',
    flex: 1,
    valueFormatter: (params: ValueFormatterParams) =>
      params.value?.charAt(0).toUpperCase() + params.value?.slice(1).toLowerCase(),
    cellStyle: (params) => getAlarmGradeStyle(params.value),
  },
  { field: 'alrmCd', headerName: '장애 코드', flex: 1 },
  {
    field: 'eventRegDt',
    headerName: '발생 시간',
    flex: 1.6,
    valueFormatter: (params: ValueFormatterParams) => formatYmdHm(params.value),
    sortable: true,
    sort: 'desc',
  },
  { field: 'expln', headerName: '알림', flex: 1.6 },
  { field: 'mkrNm', headerName: '제조사', flex: 1 },
  { field: 'roadNmAddr', headerName: '주소', flex: 2 },
  { field: 'memo', headerName: '메모', flex: 1.4 },
];

// [발전소 모니터링 > 장애 모니터링] 장애 모니터링 왼쪽 영역 검색 config
export const FAULT_LEFT_CONFIG: (SearchFieldConfig | SearchFieldConfig[])[] = [
  {
    key: 'plantName',
    label: '발전소 선택',
    type: 'select',
    options: [
      { label: '발전소 A', value: 'a' },
      { label: '발전소 B', value: 'b' },
    ],
    width: 220,
  },
];

// [발전소 모니터링 > 장애 모니터링] 장애 모니터링 오른쪽 영역 검색 config
export const FAULT_RIGHT_CONFIG: (SearchFieldConfig | SearchFieldConfig[])[] = [
  {
    key: 'deviceType',
    label: '장비 구분',
    type: 'select',
    options: [
      { label: '발전소 A', value: 'a' },
      { label: '발전소 B', value: 'b' },
    ],
    width: 160,
  },
  {
    key: 'deviceName',
    type: 'select',
    label: '장비',
    options: [
      { label: '발전소 A', value: 'a' },
      { label: '발전소 B', value: 'b' },
    ],
    width: 160,
  },
];
