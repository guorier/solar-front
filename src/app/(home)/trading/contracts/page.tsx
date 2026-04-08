'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { CellStyle, ColDef } from 'ag-grid-community';
import {
  AgGridComponent,
  BottomGroupComponent,
  ButtonComponent,
  CountArea,
  Icons,
  InfoBoxComponent,
  InfoBoxGroup,
  Pagination,
  SearchFieldConfig,
  SearchForm,
  TableTitleComponent,
  TitleComponent,
  TopInfoBoxComponent,
} from '@/components';
import {
  contractRows,
  contractStatusOptions,
  contractSummary,
  type ContractRow,
} from '@/mockup/contracts.mock';

const PAGE_SIZE = 20;

type SearchState = {
  plant: string;
  contractNo: string;
  status: string;
  tradePeriod: { start?: string; end?: string };
};

const initialSearch: SearchState = {
  plant: '',
  contractNo: '',
  status: '',
  tradePeriod: {},
};

const searchConfig: SearchFieldConfig[] = [
  { key: 'plant', label: '발전소', type: 'text', placeholder: '발전소', gridSize: 2 },
  { key: 'contractNo', label: '계약번호', type: 'text', placeholder: '계약번호', gridSize: 2 },
  { key: 'status', label: '상태', type: 'select', options: contractStatusOptions, gridSize: 2 },
  { key: 'tradePeriod', label: '거래 기간', type: 'date-range', gridSize: 4 },
];

const centerCellStyle: CellStyle = { textAlign: 'center' };

const columnDefs: ColDef<ContractRow>[] = [
  { field: 'tradeNo', headerName: '거래 번호', flex: 1.4, cellStyle: centerCellStyle },
  { field: 'plant', headerName: '발전소', flex: 1.8, cellStyle: centerCellStyle },
  { field: 'counterparty', headerName: '거래처', flex: 1.8, cellStyle: centerCellStyle },
  { field: 'contractQty', headerName: '계약 용량', flex: 1.2, cellStyle: centerCellStyle },
  { field: 'contractPeriod', headerName: '계약 기간', flex: 2.4, cellStyle: centerCellStyle },
  { field: 'settlementType', headerName: '정산 유형', flex: 1.4, cellStyle: centerCellStyle },
  { field: 'status', headerName: '상태', flex: 1.2, cellStyle: centerCellStyle },
];

export default function ContractsPage() {
  const router = useRouter();
  const [draft, setDraft] = useState<Record<string, unknown>>(initialSearch);
  const [query, setQuery] = useState<SearchState & { page: number }>({ ...initialSearch, page: 1 });

  const filtered = useMemo(() => {
    let rows = contractRows;
    if (query.plant.trim()) {
      rows = rows.filter((r) => r.plant.includes(query.plant.trim()));
    }
    if (query.contractNo.trim()) {
      rows = rows.filter((r) =>
        r.tradeNo.toUpperCase().includes(query.contractNo.trim().toUpperCase()),
      );
    }
    if (query.status) {
      rows = rows.filter((r) => r.status === query.status);
    }
    if (query.tradePeriod.start) {
      rows = rows.filter((r) => r.contractPeriod >= query.tradePeriod.start!);
    }
    if (query.tradePeriod.end) {
      rows = rows.filter((r) => r.contractPeriod.split(' ~ ')[1] <= query.tradePeriod.end!);
    }
    return rows;
  }, [query]);

  const paged = useMemo(() => {
    const start = (query.page - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, query.page]);

  return (
    <>
      <div className="title-group">
        <TitleComponent
          title="전력 거래"
          subTitle="계약 관리"
          desc="전력 거래 계약 등록 및 현황 조회"
        />
      </div>

      <TopInfoBoxComponent title="계약 현황" bg="var(--point-orange-5)" color="#A34600">
        <InfoBoxGroup className="row-type">
          <InfoBoxComponent
            icon="feedback"
            title="활성 계약"
            count={`총 ${contractSummary.activeCount}건`}
            bg="white"
          >
            누적 활성 계약 수
          </InfoBoxComponent>
          <InfoBoxComponent
            icon="feedback"
            title="총 약정 용량"
            count={contractSummary.totalQty}
            bg="white"
          >
            총 계약 용량 합계
          </InfoBoxComponent>
          <InfoBoxComponent
            icon="feedback"
            title="직접 PPA"
            count={`${contractSummary.directPpaCount} 건`}
            bg="white"
          >
            직접 PPA 계약 수
          </InfoBoxComponent>
          <InfoBoxComponent
            icon="feedback"
            title="한전/증권거래"
            count={`${contractSummary.kepcoBrokerCount} 건`}
            bg="white"
          >
            한전/증권 거래 수
          </InfoBoxComponent>
        </InfoBoxGroup>
      </TopInfoBoxComponent>

      <div className="content-group">
        <SearchForm
          config={searchConfig}
          values={draft}
          onChange={(key, val) => setDraft((prev) => ({ ...prev, [key]: val }))}
          onSearch={() =>
            setQuery({
              plant: (draft.plant as string) || '',
              contractNo: (draft.contractNo as string) || '',
              status: (draft.status as string) || '',
              tradePeriod: (draft.tradePeriod as { start?: string; end?: string }) || {},
              page: 1,
            })
          }
        />

        <div className="table-group">
          <TableTitleComponent
            leftCont={<CountArea search={filtered.length} total={contractRows.length} />}
          />

          <div
            style={{
              width: '100%',
              height: 'calc(100dvh - 520px)',
              overflow: 'auto',
              border: '1px solid #d9dde5',
              background: '#fff',
            }}
          >
            <AgGridComponent
              rowData={paged}
              columnDefs={columnDefs}
              onRowClicked={(e) => {
                if (e.data) router.push(`/trading/contracts/register?id=${e.data.tradeNo}`);
              }}
            />
          </div>
        </div>
      </div>

      <BottomGroupComponent
        leftCont={
          <Pagination
            data={{ page: query.page, size: PAGE_SIZE, total: filtered.length }}
            onChange={(page) => setQuery((prev) => ({ ...prev, page }))}
          />
        }
        rightCont={
          <ButtonComponent
            variant="contained"
            icon={<Icons iName="plus" size={16} color="#fff" />}
            onPress={() => router.push('/trading/contracts/create')}
          >
            등록
          </ButtonComponent>
        }
      />
    </>
  );
}
