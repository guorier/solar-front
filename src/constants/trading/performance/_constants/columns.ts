import type { CellStyle, ColDef } from 'ag-grid-community';
import type { TradeStatusListItem } from '@/services/trading/performance/type';
import { formatNumber } from '../_utils/format';

const rightAlignCellStyle: CellStyle = {
  justifyContent: 'flex-end',
  textAlign: 'right',
};

export const tradeColumnDefs: ColDef<TradeStatusListItem>[] = [
  { field: 'tradeDate', headerName: '거래 일', width: 140 },
  {
    field: 'pwplNm',
    headerName: '발전소/기지국',
    minWidth: 220,
    flex: 1.3,
  },
  {
    field: 'tradeQty',
    headerName: '거래량(kWh)',
    minWidth: 150,
    flex: 1,
    cellStyle: rightAlignCellStyle,
    valueFormatter: ({ value }) => `${formatNumber(Number(value ?? 0))} kWh`,
  },
  {
    field: 'smpPrice',
    headerName: 'SMP 단가',
    minWidth: 140,
    flex: 1,
    cellStyle: rightAlignCellStyle,
    valueFormatter: ({ value }) => `${formatNumber(Number(value ?? 0))} 원`,
  },
  {
    field: 'recPrice',
    headerName: 'REC 단가',
    minWidth: 140,
    flex: 1,
    cellStyle: rightAlignCellStyle,
    valueFormatter: ({ value }) => `${formatNumber(Number(value ?? 0))} 원`,
  },
  {
    field: 'totalAmount',
    headerName: '총 수익',
    minWidth: 180,
    flex: 1.1,
    cellStyle: rightAlignCellStyle,
    valueFormatter: ({ value }) => `${formatNumber(Number(value ?? 0))}`,
  },
];
