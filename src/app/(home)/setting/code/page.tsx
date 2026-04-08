'use client';

import {
  AgGridComponent,
  BottomGroupComponent,
  ButtonComponent,
  Icons,
  SearchForm,
  TableTitleComponent,
  TitleComponent,
} from '@/components';
import {
  CODE_SEARCH_CONFIG,
  MASTER_CODE_COLUMN,
  MASTER_CODE_ROW_DATA,
  SUB_CODE_COLUMN,
  SUB_CODE_ROW_DATA,
} from '@/constants/setting/code';
import { useState } from 'react';
import { Group } from 'react-aria-components';
import {
  CodeCreateFormModal,
  CodeDownloadModal,
  CodeEditFormModal,
  CodeUploadModal,
} from './_components';

const INITIAL_SEARCH_VALUES = {
  codeNm: '',
  code: '',
};

type ModalType = 'upload' | 'download' | 'create' | 'edit' | null;

export default function CodePage() {
  const [searchValues, setSearchValues] = useState(INITIAL_SEARCH_VALUES);
  const [appliedSearchValues, setAppliedSearchValues] = useState(INITIAL_SEARCH_VALUES);

  const [openModal, setOpenModal] = useState<ModalType>(null);

  // 검색 폼 입력 값 변경 핸들러
  const handleSearchChange = (key: string, value: unknown) => {
    console.log('값 변경: ', key, value);
    setSearchValues((prev) => ({ ...prev, [key]: value }));
  };

  // 검색 핸들러
  const handleSearch = () => {
    console.log('검색 !');
    setAppliedSearchValues(searchValues);
  };

  // 공통 모달 열기
  const handleOpenModal = (type: ModalType) => {
    setOpenModal(type);
  };

  // 공통 모달 닫기
  const handleCloseModal = () => {
    setOpenModal(null);
  };

  // 테이블 행 클릭 핸들러
  const handleRowClick = (e: { data?: { code?: string } }) => {
    setOpenModal('edit');

    const code = e?.data?.code;
    if (!code) return;

    console.log(code);
  };

  console.log(appliedSearchValues);

  return (
    <>
      <div className="title-group">
        <TitleComponent
          title="설정 관리"
          subTitle="코드 관리"
          desc="코드를 등록 및 수정 관리할 수 있고 코드 다운로드와 업로드 기능을 제공"
        />
      </div>

      <div className="content-group" style={{ paddingTop: 'var(--spacing-10)' }}>
        <Group style={{ gap: 'var(--spacing-10)' }}>
          <div className="content-group">
            <TableTitleComponent leftCont={<h2>마스터 코드</h2>} />
            <SearchForm
              config={CODE_SEARCH_CONFIG}
              values={searchValues}
              onChange={handleSearchChange}
              onSearch={handleSearch}
            />
            <AgGridComponent
              rowData={MASTER_CODE_ROW_DATA}
              columnDefs={MASTER_CODE_COLUMN}
              onRowClicked={handleRowClick}
            />
          </div>

          <div className="content-group">
            <TableTitleComponent leftCont={<h2>서브 코드</h2>} />
            <SearchForm
              config={CODE_SEARCH_CONFIG}
              values={searchValues}
              onChange={handleSearchChange}
              onSearch={handleSearch}
            />
            <AgGridComponent
              rowData={SUB_CODE_ROW_DATA}
              columnDefs={SUB_CODE_COLUMN}
              onRowClicked={handleRowClick}
            />
          </div>
        </Group>
      </div>

      <BottomGroupComponent
        rightCont={
          <div className="button-group">
            <ButtonComponent
              variant="excel"
              icon={<Icons iName="save" size={16} color="#fff" />}
              onClick={() => handleOpenModal('upload')}
            >
              업로드
            </ButtonComponent>
            <ButtonComponent
              variant="excel"
              icon={<Icons iName="download" size={16} color="#fff" />}
              onClick={() => handleOpenModal('download')}
            >
              다운로드
            </ButtonComponent>
            <ButtonComponent
              variant="contained"
              icon={<Icons iName="plus" size={16} color="#fff" />}
              onClick={() => handleOpenModal('create')}
            >
              추가
            </ButtonComponent>
          </div>
        }
      />

      <CodeUploadModal isOpen={openModal === 'upload'} onOpen={handleCloseModal} />
      <CodeDownloadModal isOpen={openModal === 'download'} onOpen={handleCloseModal} />
      <CodeCreateFormModal isOpen={openModal === 'create'} onOpen={handleCloseModal} />
      <CodeEditFormModal isOpen={openModal === 'edit'} onOpen={handleCloseModal} />
    </>
  );
}
