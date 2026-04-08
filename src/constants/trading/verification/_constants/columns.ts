import type { CellStyle, ColDef } from 'ag-grid-community';
import type { KepcoListItem, KepcoDayItem } from '@/services/trading/verification/type';

const centerStyle: CellStyle = { textAlign: 'center' };
const rightStyle: CellStyle = { justifyContent: 'flex-end', paddingRight: '20px' };

export const monthlyColumnDefs: ColDef<KepcoListItem>[] = [
  { field: 'vrfyYmText', headerName: '기간', flex: 1, cellStyle: centerStyle },
  { field: 'pwplNm', headerName: '발전소', flex: 1.5, cellStyle: centerStyle },
  {
    field: 'kepcoEgqty',
    headerName: '한전 계량기(kWh)',
    flex: 1.5,
    cellStyle: rightStyle,
    valueFormatter: ({ value }) => value?.toLocaleString('ko-KR') ?? '-',
  },
  {
    field: 'sysEgqty',
    headerName: '시스템 발전량(kWh)',
    flex: 1.5,
    cellStyle: rightStyle,
    valueFormatter: ({ value }) => value?.toLocaleString('ko-KR') ?? '-',
  },
];

export const dayColumnDefs: ColDef<KepcoDayItem>[] = [
  { field: 'dayYmd', headerName: '날짜', flex: 1, cellStyle: centerStyle },
  { field: 'pwplNm', headerName: '발전소', flex: 2, cellStyle: centerStyle },
  {
    field: 'sysEgqty',
    headerName: '시스템 발전량(kWh)',
    flex: 1.5,
    cellStyle: rightStyle,
    valueFormatter: ({ value }) => value?.toLocaleString('ko-KR') ?? '-',
  },
];
