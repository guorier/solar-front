'use client';

import {
  BottomGroupComponent,
  ButtonComponent,
  Icons,
  Pagination,
  SearchForm,
  TableTitleComponent,
  TitleComponent,
} from '@/components';
import { Group, Tag, TagGroup, TagList } from 'react-aria-components';
import styled from 'styled-components';
import { ListCard, ListCardItem } from '../_components/listCard';
import { useState } from 'react';
import { DOC_SHARE_SEARCH_CONFIG } from '@/constants/cooperation/docShare';
import DocUploadModal from './_components/docUpload';

const StyledTagList = styled(TagList)`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--spacing-6);
`;

const StyledTag = styled(Tag)`
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-4);
  padding: var(--spacing-2) var(--spacing-6);
  border-radius: 999px;
  border: 1px solid var(--border-color);
  background: #ffffff;
  font-size: 14px;
  font-weight: 500;
  box-shadow: 0 1px 3px rgba(15, 23, 42, 0.04);
`;

const ListWrap = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: var(--radius);
  border: 1px solid var(--border-color);
  background: var(--gray-A100);
  height: 800px;
  min-height: 0;
`;

const ListBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-10);
  padding: var(--spacing-15);
  flex: 1;
  min-height: 0;
  overflow-y: auto;
`;

const INITIAL_SEARCH_VALUES = {
  title: '',
  tag: '',
  docType: '',
  plantNm: '',
};

const LIST: ListCardItem[] = Array.from({ length: 8 }, () => ({
  title: '와이어블 1호기 운영 매뉴얼',
  desc: '와이어블 1호기 태양광 발전소 운영 매뉴얼 최신 버전으로...',
  rightSection: (
    <>
      <ButtonComponent
        height={32}
        minWidth={32}
        variant="outlined"
        icon={<Icons iName="download" size={18} />}
      />
      <ButtonComponent variant="none" icon={<Icons iName="delete" size={20} />} />
    </>
  ),
  bottomSection: (
    <>
      <Group style={{ alignItems: 'center', gap: 'var(--spacing-6)' }}>
        <TagGroup aria-label="검색 단어">
          <StyledTagList>
            <StyledTag>태양광</StyledTag>
            <StyledTag>재생에너지</StyledTag>
          </StyledTagList>
        </TagGroup>
        |
        <TagGroup aria-label="문서 종류">
          <StyledTagList>
            <StyledTag>점검 보고서</StyledTag>
            <StyledTag>와이어블 1호기</StyledTag>
          </StyledTagList>
        </TagGroup>
      </Group>
      <Group style={{ alignItems: 'center', gap: 'var(--spacing-6)' }}>
        <p>2025-11-22 홍길순</p>
        <p>2.24MB</p>
        <p>다운로드 22회</p>
      </Group>
    </>
  ),
}));

export default function DocSharePage() {
  const [searchValues, setSearchValues] = useState(INITIAL_SEARCH_VALUES);
  const [appliedSearchValues, setAppliedSearchValues] = useState(INITIAL_SEARCH_VALUES);

  const [isUploadOpen, setIsUploadOpen] = useState<boolean>(false);

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

  console.log(appliedSearchValues);

  return (
    <>
      <div className="title-group">
        <TitleComponent title="공유/협력" subTitle="문서 공유" desc="각종 문서 파일 공유 시스템" />
      </div>

      <div className="content-group" style={{ paddingTop: 'var(--spacing-10)' }}>
        <SearchForm
          config={DOC_SHARE_SEARCH_CONFIG}
          values={searchValues}
          onChange={handleSearchChange}
          onSearch={handleSearch}
        />

        <TableTitleComponent leftCont={<h3>문서 목록 12/52</h3>} />

        <ListWrap>
          <ListBody>
            {LIST.map((item, idx) => (
              <ListCard key={`${item.title}-${idx}`} {...item} />
            ))}
          </ListBody>
        </ListWrap>
      </div>

      <BottomGroupComponent
        leftCont={<Pagination data={pageData} />}
        rightCont={<ButtonComponent onClick={() => setIsUploadOpen(true)}>추가</ButtonComponent>}
      />

      <DocUploadModal isOpen={isUploadOpen} onOpen={() => setIsUploadOpen((prev) => !prev)} />
    </>
  );
}
