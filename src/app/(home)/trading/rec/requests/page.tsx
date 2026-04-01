'use client';

import { useMemo, useState, type CSSProperties } from 'react';
import {
  BottomGroupComponent,
  ButtonComponent,
  Cell,
  Column,
  Icons,
  Pagination,
  Row,
  SearchFieldConfig,
  SearchForm,
  Table,
  TableBody,
  TableHeader,
  TableTitleComponent,
  TitleComponent,
} from '@/components';
import {
  recRequestRows,
  recRequestStatusOptions,
  type RecRequestRow,
  type RecRequestStatus,
} from '@/mockup/rec-requests.mock';
import { Tag, TagGroup, TagList } from 'react-aria-components';

const PAGE_SIZE = 20;

type RecRequestSearchState = {
  plant: string;
  requestCode: string;
  status: string;
};

type RecRequestPageState = RecRequestSearchState & {
  page: number;
};

type RecRequestColumn = {
  key: keyof RecRequestRow;
  label: string;
  width: string;
  isRowHeader?: boolean;
};

const initialSearchState: RecRequestSearchState = {
  plant: '',
  requestCode: '',
  status: '',
};

const requestColumns: RecRequestColumn[] = [
  { key: 'requestNo', label: '신청 번호', width: '14%', isRowHeader: true },
  { key: 'plantName', label: '발전소', width: '18%' },
  { key: 'requestedAt', label: '신청일', width: '14%' },
  { key: 'targetMonth', label: '대상 월', width: '12%' },
  { key: 'generationKwh', label: '발전량', width: '16%' },
  { key: 'recAmount', label: 'REC 수량', width: '13%' },
  { key: 'status', label: '상태', width: '13%' },
];

const tableWrapStyle: CSSProperties = {
  width: '100%',
  height: 'calc(100dvh - 500px)',
  overflow: 'auto',
  border: '1px solid #d9dde5',
  background: '#ffffff',
};

const tableStyle: CSSProperties = {
  width: '100%',
  minWidth: '980px',
  tableLayout: 'fixed',
};

const centerCellStyle: CSSProperties = {
  textAlign: 'center',
};

const countAreaStyle: CSSProperties = {
  fontSize: '14px',
  fontWeight: 500,
  color: '#222222',
  lineHeight: 1,
};

const totalCountStyle: CSSProperties = {
  color: '#D70251',
  fontWeight: 700,
};

const tableLabelStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  padding: '6px 12px',
  fontSize: '14px',
  fontWeight: 600,
  color: '#272727',
};

const emptyStateStyle: CSSProperties = {
  padding: '24px 16px',
  color: '#8b8888',
  textAlign: 'center',
  borderTop: '1px solid #e5e7eb',
};

const selectedTagWrapStyle: CSSProperties = {
  padding: '0 12px',
};

const searchConfig: SearchFieldConfig[] = [
  {
    key: 'plant',
    label: '발전소',
    type: 'text',
    placeholder: '발전소 검색',
    width: 220,
  },
  {
    key: 'requestCode',
    label: '신청 코드 번호',
    type: 'text',
    placeholder: '신청 코드 번호',
    width: 220,
  },
  {
    key: 'status',
    label: '상태',
    type: 'select',
    options: recRequestStatusOptions,
    width: 180,
  },
];

export default function RecRequestsPage() {
  const [draftSearch, setDraftSearch] = useState<RecRequestSearchState>(initialSearchState);
  const [queryState, setQueryState] = useState<RecRequestPageState>({
    ...initialSearchState,
    page: 1,
  });

  const filteredRows = useMemo(() => {
    let rows = recRequestRows;

    if (queryState.plant.trim()) {
      const keyword = queryState.plant.trim().toLowerCase();
      rows = rows.filter((row) => row.plantName.toLowerCase().includes(keyword));
    }

    if (queryState.requestCode.trim()) {
      const keyword = queryState.requestCode.trim().toUpperCase();
      rows = rows.filter((row) => row.requestNo.toUpperCase().includes(keyword));
    }

    if (queryState.status) {
      rows = rows.filter((row) => row.status === (queryState.status as RecRequestStatus));
    }

    return rows;
  }, [queryState.plant, queryState.requestCode, queryState.status]);

  const pagedRows = useMemo(() => {
    const start = (queryState.page - 1) * PAGE_SIZE;
    return filteredRows.slice(start, start + PAGE_SIZE);
  }, [filteredRows, queryState.page]);

  const handleSearchChange = (key: string, value: unknown) => {
    setDraftSearch((prev) => ({
      ...prev,
      [key]: String(value ?? ''),
    }));
  };

  const handleSearch = () => {
    setQueryState((prev) => ({
      ...prev,
      ...draftSearch,
      page: 1,
    }));
  };

  const handlePageChange = (page: number) => {
    setQueryState((prev) => ({
      ...prev,
      page,
    }));
  };

  const handleRemovePlantTag = () => {
    setDraftSearch((prev) => ({ ...prev, plant: '' }));
    setQueryState((prev) => ({ ...prev, plant: '', page: 1 }));
  };

  return (
    <>
      <div className="title-group">
        <TitleComponent
          title="전력 거래"
          subTitle="REC 발급 관리"
          thirdTitle="신청 관리"
          desc="REC 신청 등록 및 목록 조회"
        />
      </div>

      <div className="content-group">
        <SearchForm
          config={searchConfig}
          values={draftSearch}
          onChange={handleSearchChange}
          onSearch={handleSearch}
        />

        {queryState.plant ? (
          <div style={selectedTagWrapStyle}>
            <TagGroup className="react-aria-TagGroup del-type" onRemove={handleRemovePlantTag}>
              <TagList>
                <Tag id={queryState.plant}>
                  {queryState.plant}
                  <ButtonComponent
                    variant="none"
                    slot="remove"
                    icon={<Icons iName="del" color="#444242" />}
                  />
                </Tag>
              </TagList>
            </TagGroup>
          </div>
        ) : null}

        <div className="table-group">
          <TableTitleComponent
            leftCont={
              <div style={countAreaStyle}>
                검색 {filteredRows.length} / 전체{' '}
                <span style={totalCountStyle}>{recRequestRows.length}</span>
              </div>
            }
            rightCont={
              <div className="button-group">
                <ButtonComponent
                  variant="excel"
                  icon={<Icons iName="download" size={16} color="#fff" />}
                  onPress={() => undefined}
                >
                  Excel
                </ButtonComponent>
                <ButtonComponent
                  variant="contained"
                  icon={<Icons iName="plus" size={16} color="#fff" />}
                  iconPosition="left"
                  onPress={() => undefined}
                >
                  등록
                </ButtonComponent>
              </div>
            }
          />

          <div style={tableLabelStyle}>
            <Icons iName="menu01" size={18} color="#444242" />
            <span>REC 발급 신청 관리</span>
          </div>

          <div style={tableWrapStyle}>
            <Table aria-label="REC 발급 신청 관리" style={tableStyle}>
              <TableHeader>
                {requestColumns.map((column) => (
                  <Column
                    key={column.key}
                    style={{ width: column.width }}
                    isRowHeader={column.isRowHeader}
                  >
                    {column.label}
                  </Column>
                ))}
              </TableHeader>
              <TableBody>
                {pagedRows.map((row) => (
                  <Row key={row.requestNo}>
                    <Cell style={centerCellStyle}>{row.requestNo}</Cell>
                    <Cell style={centerCellStyle}>{row.plantName}</Cell>
                    <Cell style={centerCellStyle}>{row.requestedAt}</Cell>
                    <Cell style={centerCellStyle}>{row.targetMonth}</Cell>
                    <Cell style={centerCellStyle}>{row.generationKwh}</Cell>
                    <Cell style={centerCellStyle}>{row.recAmount}</Cell>
                    <Cell style={centerCellStyle}>{row.status}</Cell>
                  </Row>
                ))}
              </TableBody>
            </Table>
            {pagedRows.length === 0 ? (
              <div style={emptyStateStyle}>일치하는 DATA가 없습니다</div>
            ) : null}
          </div>
        </div>
      </div>

      <BottomGroupComponent
        centerCont={
          <Pagination
            data={{
              page: queryState.page,
              size: PAGE_SIZE,
              total: filteredRows.length,
            }}
            onChange={handlePageChange}
          />
        }
      />
    </>
  );
}
