'use client';

import {
  AgGridComponent,
  BottomGroupComponent,
  ButtonComponent,
  Icons,
  Pagination,
  SearchForm,
  Select,
  SelectItem,
  TableTitleComponent,
  TitleComponent,
} from '@/components';
import {
  INITIAL_SEARCH_VALUES,
  MENU_GROUP_COLUMN,
  MENU_GROUP_SEARCH_CONFIG,
} from '@/constants/setting/menu';
import { useGetComCodeList, useGetMenuGroupList } from '@/services/common/query';
import { MenuGroupDetailRes, MenuGroupListParams } from '@/services/common/type';
import { formatYmdHm } from '@/utils';
import { makeOptions } from '@/utils/makeOptions';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useMemo, useState, useEffect, Suspense } from 'react';

const DEFAULT_PARAMS: MenuGroupListParams = {
  ...INITIAL_SEARCH_VALUES,
  page: 1,
  size: 20,
};

const STORAGE_KEY = 'menu-authority-search-state';
const PATH_KEY = 'menu-authority-path';

// 검색 상태를 sessionStorage에 저장
const saveSearchState = (values: MenuGroupListParams) => {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(values));
};

// sessionStorage에 저장된 검색 상태 조회
const getSavedSearchState = () => {
  const saved = sessionStorage.getItem(STORAGE_KEY);
  return saved ? (JSON.parse(saved) as MenuGroupListParams) : null;
};

function MenuAuthorityPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const page = Number(searchParams.get('page')) || 1;
  const size = Number(searchParams.get('size')) || 20;

  const [searchValues, setSearchValues] = useState<MenuGroupListParams>(INITIAL_SEARCH_VALUES);
  const [appliedSearchValues, setAppliedSearchValues] =
    useState<MenuGroupListParams>(INITIAL_SEARCH_VALUES);

  useEffect(() => {
    // 메뉴 이동 여부 (다른 메뉴에서 진입 시 검색 상태 초기화 목적)
    const isMenuNavigation = sessionStorage.getItem('MENU_NAVIGATION');

    // 이전 페이지 경로
    const prevPath = sessionStorage.getItem(PATH_KEY);

    // 브라우저 navigation 타입 확인 (reload / navigate / back_forward)
    const navEntries = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[];
    const navType = navEntries?.[0]?.type;

    // 메뉴 이동 시 검색 상태 초기화
    if (isMenuNavigation === 'Y') {
      sessionStorage.removeItem('MENU_NAVIGATION');
      sessionStorage.removeItem(STORAGE_KEY);
    }

    // 다른 페이지에서 해당 페이지로 새로 이동한 경우 검색 상태 초기화
    if (prevPath && prevPath !== pathname && navType === 'navigate') {
      sessionStorage.removeItem(STORAGE_KEY);
    }

    // 현재 경로 저장 (다음 이동 시 이전 경로 비교용)
    sessionStorage.setItem(PATH_KEY, pathname);

    // 저장된 검색 상태가 있으면 검색 조건 복원
    const saved = getSavedSearchState();
    if (saved) {
      setSearchValues(saved);
      setAppliedSearchValues(saved);
    }
  }, [pathname]);

  // 권한 종류 목록 (공통코드)
  const { data: accessLevelCodeList } = useGetComCodeList({ comMastrCd: 'A01' }, true);
  // 권한 등급 목록 (공콩코드)
  const { data: grdCodeList } = useGetComCodeList({ comMastrCd: 'A04' }, true);

  // 전체 메뉴 권한 total 값을 받아오기 위함 (Response에서 total 값만 사용)
  const { data: allMenuGroup } = useGetMenuGroupList(DEFAULT_PARAMS);
  // 검색 값에 따른 메뉴 권한 목록 조회 (실질적으로 테이블에 표출되는 값)
  const { data: filteredMenuGroup } = useGetMenuGroupList({ ...appliedSearchValues, page, size });

  // 페이지네이션 데이터
  const pageData = {
    page: filteredMenuGroup?.page ?? 1,
    size: filteredMenuGroup?.size ?? 20,
    total: filteredMenuGroup?.total ?? 0,
  };

  // options 구조에 맞게 변환
  const accessLevelOptions = makeOptions(accessLevelCodeList);
  const grdOptions = makeOptions(grdCodeList);

  // searchConfig Options 삽입
  const searchConfig = useMemo(() => {
    return MENU_GROUP_SEARCH_CONFIG.map((field) => {
      if (field.key === 'accessLevelCd') return { ...field, options: accessLevelOptions };
      if (field.key === 'grdCd') return { ...field, options: grdOptions };

      return field;
    });
  }, [accessLevelOptions, grdOptions]);

  // 메뉴 권한 목록 테이블 Data
  const rowData = useMemo(() => {
    return (
      filteredMenuGroup?.items.map((group: MenuGroupDetailRes) => ({
        ...group,
        useYn: group.useYn === 'Y' ? '사용' : '정지',
        regDt: formatYmdHm(group.regDt) ?? '-',
        mdfrId: group.mdfrId ?? '-',
        mdfcnDt: formatYmdHm(group.mdfcnDt) ?? '-',
      })) ?? []
    );
  }, [filteredMenuGroup]);

  // 페이지네이션 쿼리스트링 업데이트 핸들러
  const updatePaginationParams = (nextPage: number, nextSize: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', String(nextPage));
    params.set('size', String(nextSize));
    router.replace(`?${params.toString()}`);
  };

  // 검색 폼 입력 값 변경 핸들러
  const handleSearchChange = (key: string, value: unknown) => {
    setSearchValues((prev) => ({ ...prev, [key]: String(value ?? '') }));
  };

  // 검색 핸들러
  const handleSearch = () => {
    setAppliedSearchValues(searchValues);
    saveSearchState(searchValues);
    updatePaginationParams(1, size);
  };

  // 페이지 사이즈 변경 핸들러
  const handleSizeChange = (key: React.Key | null) => {
    updatePaginationParams(1, Number(key));
  };

  // 테이블 행 클릭 핸들러
  const handleRowClick = (e: { data?: { groupCd?: string } }) => {
    const groupCd = e?.data?.groupCd;
    if (!groupCd) return;

    saveSearchState(appliedSearchValues);
    router.push(`/setting/menu/menu-transfer?groupCd=${encodeURIComponent(groupCd)}`);
  };

  // 등록 페이지 이동 핸들러
  const handleCreate = () => {
    saveSearchState(appliedSearchValues);
    router.push('/setting/menu/menu-transfer');
  };

  return (
    <>
      <div className="title-group">
        <TitleComponent title="설정 관리" subTitle="메뉴 관리" desc="메뉴 권한 목록 조회" />
      </div>

      <div className="content-group" style={{ paddingTop: 'var(--spacing-10)' }}>
        <SearchForm
          config={searchConfig}
          values={searchValues}
          onChange={handleSearchChange}
          onSearch={handleSearch}
        />
        <TableTitleComponent
          leftCont={
            <h3>
              검색 {filteredMenuGroup?.total ?? '-'} / 전체 {allMenuGroup?.total ?? '-'}
            </h3>
          }
          rightCont={
            <Select value={size} onChange={handleSizeChange} aria-label="보기 선택">
              <SelectItem id={20}>20개씩 보기</SelectItem>
              <SelectItem id={30}>30개씩 보기</SelectItem>
              <SelectItem id={40}>40개씩 보기</SelectItem>
              <SelectItem id={50}>50개씩 보기</SelectItem>
            </Select>
          }
        />
        <AgGridComponent
          rowData={rowData}
          columnDefs={MENU_GROUP_COLUMN}
          onRowClicked={handleRowClick}
        />
      </div>

      <BottomGroupComponent
        leftCont={<Pagination data={pageData} />}
        rightCont={
          <div className="button-group">
            <ButtonComponent
              variant="contained"
              icon={<Icons iName="plus" size={16} color="#fff" />}
              onClick={handleCreate}
            >
              등록
            </ButtonComponent>
          </div>
        }
      />
    </>
  );
}

export default function MenuAuthorityPage() {
  return (
    <Suspense fallback={null}>
      <MenuAuthorityPageInner />
    </Suspense>
  );
}
