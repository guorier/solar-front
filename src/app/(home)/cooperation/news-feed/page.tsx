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
import { NEWS_FEED_SEARCH_CONFIG } from '@/constants/cooperation/newsFeed';
import { useState } from 'react';
import { Group, Tag, TagGroup, TagList, useListData } from 'react-aria-components';
import styled from 'styled-components';
import { ListCard, ListCardItem } from '../_components/listCard';
import AddSearchValueModal from './_components/addSearchValue';

const FilterSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-10);
`;

const KeywordPanel = styled(Group)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--spacing-12);
  padding: var(--spacing-6) var(--spacing-15);
  border-top: 1px solid var(--border-color);
  border-bottom: 1px solid var(--border-color);
`;

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

const TagText = styled.span`
  display: inline-flex;
  align-items: center;
  color: inherit;
  white-space: nowrap;
`;

const TagGroupWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-8);
`;

const ListWrap = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: var(--radius);
  border: 1px solid var(--border-color);
  background: var(--gray-A100);
  height: 720px;
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
  source: '',
  category: '',
  word: '',
  keyword: '',
};

const LIST: ListCardItem[] = Array.from({ length: 8 }, () => ({
  id: 'news',
  title: '2025년 태양광 발전 보급 목표 상향 조정, 정부 REC 가중치 확대 검토',
  desc: '산업통상자원부는 2025년 신재생에너지 보급 목표를 상향 조정하고, 태양광 발전에 대한 REC 가중치를 현행 0.7에서 1.0으로 확대하는 방안을 검토 중이다.',
  rightSection: (
    <>
      <ButtonComponent style={{ cursor: 'default' }} height={32} variant="outlined">
        국내
      </ButtonComponent>
      <ButtonComponent height={32}>원문보기</ButtonComponent>
    </>
  ),
  bottomSection: (
    <TagGroup aria-label="검색 단어">
      <StyledTagList>
        <StyledTag>태양광</StyledTag>
        <StyledTag>재생에너지</StyledTag>
      </StyledTagList>
    </TagGroup>
  ),
}));

export default function NewsFeedPage() {
  const [searchValues, setSearchValues] = useState(INITIAL_SEARCH_VALUES);
  const [appliedSearchValues, setAppliedSearchValues] = useState(INITIAL_SEARCH_VALUES);

  const [isSearchAddOpen, setIsSearchAddOpen] = useState<boolean>(false);

  const pageData = {
    page: 1,
    size: 20,
    total: 0,
  };

  const TAG_LIST = useListData({
    initialItems: [
      { id: 1, name: '태양광' },
      { id: 2, name: '재생에너지' },
    ],
  });

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
        <TitleComponent
          title="공유/협력"
          subTitle="뉴스 피드"
          desc="뉴스 피드 및 문서 공유 시스템"
        />
      </div>

      <div className="content-group" style={{ paddingTop: 'var(--spacing-10)' }}>
        <FilterSection>
          <KeywordPanel>
            <TagGroupWrapper>
              <h3
                style={{
                  paddingRight: 'var(--spacing-10)',
                  borderRight: ' 1px solid var(--border-color)',
                }}
              >
                검색 단어
              </h3>

              <TagGroup
                aria-label="검색 단어"
                onRemove={(keys) => {
                  console.log('removed:', [...keys]);
                  TAG_LIST.remove(...Array.from(keys));
                }}
              >
                <StyledTagList>
                  {TAG_LIST.items.map((item) => (
                    <StyledTag key={item.id} id={item.id} textValue={item.name}>
                      <TagText>{item.name}</TagText>
                      <ButtonComponent
                        variant="none"
                        slot="remove"
                        aria-label={`${item.name} 삭제`}
                        icon={<Icons iName="del" />}
                      />
                    </StyledTag>
                  ))}
                </StyledTagList>
                {!TAG_LIST.items.length && <div>검색 단어 없음</div>}
              </TagGroup>
            </TagGroupWrapper>

            <ButtonComponent variant="contained" onClick={() => setIsSearchAddOpen(true)}>
              추가
            </ButtonComponent>
          </KeywordPanel>

          <SearchForm
            config={NEWS_FEED_SEARCH_CONFIG}
            values={searchValues}
            onChange={handleSearchChange}
            onSearch={handleSearch}
          />
        </FilterSection>

        <TableTitleComponent leftCont={<h3>뉴스 목록 12/52</h3>} />

        <ListWrap>
          <ListBody>
            {LIST.map((item, idx) => (
              <ListCard key={`${item.title}-${idx}`} {...item} />
            ))}
          </ListBody>
        </ListWrap>
      </div>

      <BottomGroupComponent leftCont={<Pagination data={pageData} />} />

      <AddSearchValueModal
        isOpen={isSearchAddOpen}
        onOpen={() => setIsSearchAddOpen((prev) => !prev)}
      />
    </>
  );
}
