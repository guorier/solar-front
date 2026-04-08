'use client';

import {
  AgGridComponent,
  BottomGroupComponent,
  ButtonComponent,
  Pagination,
  SearchForm,
  Select,
  SelectItem,
  TableTitleComponent,
  TitleComponent,
} from '@/components';
import {
  getBoardColumns,
  BOARD_ROW_DATA,
  BOARD_SEARCH_CONFIG,
  BoardRow,
} from '@/constants/cooperation/board';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { Group } from 'react-aria-components';
import { CellClickedEvent } from 'ag-grid-community';

const INITIAL_SEARCH_VALUES = {
  title: '',
  description: '',
  category: '',
};

// 게시글 목록 정렬 (현재는 최신순 기준)
const sortBoardData = (data: BoardRow[]) => {
  return [...data].sort((a, b) => {
    if (a.isPinned !== b.isPinned) {
      return Number(b.isPinned) - Number(a.isPinned);
    }
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
};

export default function BoardPage() {
  const router = useRouter();

  const [searchValues, setSearchValues] = useState(INITIAL_SEARCH_VALUES);
  const [appliedSearchValues, setAppliedSearchValues] = useState(INITIAL_SEARCH_VALUES);
  const [rowData, setRowData] = useState<BoardRow[]>(sortBoardData(BOARD_ROW_DATA));

  const pageData = {
    page: 1,
    size: 20,
    total: 0,
  };

  // 검색 폼 입력 값 변경 핸들러
  const handleSearchChange = (key: string, value: unknown) => {
    console.log('search Form 값 변경 중', key, value);

    setSearchValues((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // 검색 핸들러
  const handleSearch = () => {
    console.log('검색!');
    setAppliedSearchValues(searchValues);
  };

  // 테이블 행 클릭 핸들러 (상세 페이지 이동 및 수정)
  const handleCellClick = (e: CellClickedEvent<BoardRow>) => {
    if (e.colDef?.field === 'isPinned') return;

    const postNumber = e.data?.postNumber;
    if (!postNumber) return;

    router.push(`/cooperation/board/${postNumber}`);
  };

  // 고정 핀 토글 핸들러
  const handleTogglePinned = (targetRow: BoardRow) => {
    setRowData((prev) =>
      sortBoardData(
        prev.map((row) =>
          row.postNumber === targetRow.postNumber ? { ...row, isPinned: !row.isPinned } : row,
        ),
      ),
    );
  };

  const columnDefs = useMemo(() => getBoardColumns({ onTogglePinned: handleTogglePinned }), []);

  console.log(appliedSearchValues);

  return (
    <>
      <div className="title-group">
        <TitleComponent
          title="공유/협력"
          subTitle="게시판"
          desc="발전소 운영 정보를 공유하고 소통"
        />
      </div>

      <div className="content-group" style={{ paddingTop: 'var(--spacing-10)' }}>
        <SearchForm
          config={BOARD_SEARCH_CONFIG}
          values={searchValues}
          onChange={handleSearchChange}
          onSearch={handleSearch}
        />

        <TableTitleComponent
          leftCont={<h3>검색 결과 12/52</h3>}
          rightCont={
            <Group>
              <Select defaultValue={20} aria-label="보기 선택">
                <SelectItem id={20}>20개씩 보기</SelectItem>
                <SelectItem id={30}>30개씩 보기</SelectItem>
                <SelectItem id={40}>40개씩 보기</SelectItem>
                <SelectItem id={50}>50개씩 보기</SelectItem>
              </Select>
              <Select defaultValue="001" aria-label="정렬 방식 선택">
                <SelectItem id="001">최신순</SelectItem>
                <SelectItem id="002">조회순</SelectItem>
                <SelectItem id="003">좋아요</SelectItem>
              </Select>
            </Group>
          }
        />

        <AgGridComponent
          rowData={rowData}
          columnDefs={columnDefs}
          onCellClicked={handleCellClick}
        />
      </div>

      <BottomGroupComponent
        leftCont={<Pagination data={pageData} />}
        rightCont={
          <ButtonComponent
            variant="contained"
            onClick={() => router.push('/cooperation/board/create')}
          >
            글쓰기
          </ButtonComponent>
        }
      />
    </>
  );
}
