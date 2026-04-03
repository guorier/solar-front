// src/constants/eqpmnt/common/EquipList.tsx
'use client';

import {
  AgGridComponent,
  ButtonComponent,
  Icons,
  SearchFields,
  TableTitleComponent,
  TitleComponent,
  BottomGroupComponent,
  Pagination,
  SearchForm,
  CountArea,
} from '@/components';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import type { ColDef, RowClickedEvent } from 'ag-grid-community';

import { useGetEqpmntList } from '@/services/eqpmnt/common/query';
import type { EquipKind } from '@/services/eqpmnt/common/type';

// 공통코드 API
import { getPlantBaseList } from '@/services/plants/request';
import type { PlantBaseListRes, PlantBase } from '@/services/plants/type';

// ✅ types
import type {
  EquipListResponse,
  SearchValues,
  RightValues,
} from '@/constants/eqpmnt/common/EquipListType';
// ✅ config
import {
  initialRightValues,
  initialSearchValues,
  searchConfig,
  equipRightConfig,
} from '@/constants/eqpmnt/common/equipListConfig';
// ✅ utils/mapper
import { toEquipListRow } from '@/constants/eqpmnt/common/equipListMapper';

const titleMap: Record<EquipKind, { subTitle: string; desc: string }> = {
  strct: { subTitle: '발전 구조', desc: '발전소 현장 장비 등록 및 관리' },
  prdctn: { subTitle: '발전 생산', desc: '발전소 현장 장비 등록 및 관리' },
  intrcon: { subTitle: '계통 연계', desc: '발전소 현장 장비 등록 및 관리' },
  engy: { subTitle: '에너지 저장', desc: '발전소 현장 장비 등록 및 관리' },
  meas: { subTitle: '환경 계측', desc: '발전소 현장 장비 등록 및 관리' },
  safety: { subTitle: '보안 방재', desc: '발전소 현장 장비 등록 및 관리' },
  oper: { subTitle: '운영 관리', desc: '발전소 현장 장비 등록 및 관리' },
};

export type EquipListProps = {
  kind: EquipKind;
};

const PATH_KEY = 'equip-list-path';
const ALL_LIST_SIZE = 10000;

export default function EquipList({ kind }: EquipListProps) {
  // 1️⃣ 기본 훅
  const router = useRouter();
  const pathname = usePathname();

  const storageKey = `equip-list-state-${kind}`;

  // 2️⃣ 상태 관리
  const [searchValues, setSearchValues] = useState<SearchValues>(initialSearchValues);
  const [appliedSearchValues, setAppliedSearchValues] = useState<SearchValues>(initialSearchValues);

  const [values, setValues] = useState<RightValues>(initialRightValues);

  const [page, setPage] = useState<number>(1);
  const [size, setSize] = useState<number>(20);

  const [plantMap, setPlantMap] = useState<Record<string, string>>({});

  // 3️⃣ 데이터 관련 훅
  useEffect(() => {
    const isMenuNavigation = sessionStorage.getItem('MENU_NAVIGATION');

    if (isMenuNavigation === 'Y') {
      sessionStorage.removeItem('MENU_NAVIGATION');
      sessionStorage.removeItem(storageKey);
    }

    const prevPath = sessionStorage.getItem(PATH_KEY);

    const navEntries = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[];
    const navType = navEntries?.[0]?.type;

    if (prevPath && prevPath !== pathname && navType === 'navigate') {
      sessionStorage.removeItem(storageKey);
    }

    sessionStorage.setItem(PATH_KEY, pathname);

    if (navType === 'reload' || navType === 'back_forward') {
      const raw = sessionStorage.getItem(storageKey);

      if (raw) {
        try {
          const parsed = JSON.parse(raw) as {
            page: number;
            size: number;
            searchValues: SearchValues;
            appliedSearchValues: SearchValues;
            values: RightValues;
          };

          setPage(parsed.page || 1);
          setSize(parsed.size || 20);
          setSearchValues(parsed.searchValues);
          setAppliedSearchValues(parsed.appliedSearchValues);
          setValues(parsed.values ?? initialRightValues);
        } catch (error) {
          console.error(error);
        }
      }
    }

    if (navType === 'navigate') {
      const raw = sessionStorage.getItem(storageKey);

      if (raw) {
        try {
          const parsed = JSON.parse(raw) as {
            page: number;
            size: number;
            searchValues: SearchValues;
            appliedSearchValues: SearchValues;
            values: RightValues;
          };

          setPage(parsed.page || 1);
          setSize(parsed.size || 20);
          setSearchValues(parsed.searchValues);
          setAppliedSearchValues(parsed.appliedSearchValues);
          setValues(parsed.values ?? initialRightValues);
        } catch (error) {
          console.error(error);
        }
      }
    }
  }, [pathname, storageKey]);

  const saveListState = () => {
    const payload = {
      page,
      size,
      searchValues,
      appliedSearchValues,
      values,
    };

    sessionStorage.setItem(storageKey, JSON.stringify(payload));
  };

  useEffect(() => {
    const showNumber = values.showNumber;

    if (showNumber) {
      const nextSize = Number(showNumber);
      if (!Number.isNaN(nextSize) && nextSize > 0 && nextSize !== size) {
        setSize(nextSize);
        setPage(1);
      }
    }
  }, [values.showNumber, size]);

  const { data, isFetching } = useGetEqpmntList(kind, {
    page: page || 1,
    size: size || 20,
  });

  // 4️⃣ 사이드이펙트
  const { data: allData, isFetching: isAllFetching } = useGetEqpmntList(kind, {
    page: 1,
    size: ALL_LIST_SIZE,
  });

  useEffect(() => {
    const loadPlantMap = async () => {
      try {
        const nextMap: Record<string, string> = {};

        let curPage = 1;
        const curSize = 100;

        while (true) {
          const res: PlantBaseListRes = await getPlantBaseList({
            page: curPage,
            size: curSize,
          });

          const items: PlantBase[] = res.items ?? [];

          items.forEach((p) => {
            const id = (p.pwplId ?? '').trim();
            if (!id) return;
            nextMap[id] = (p.pwplNm ?? '').trim() || id;
          });

          const total = Number(res.total ?? 0);

          if (items.length < curSize) break;
          if (total && curPage * curSize >= total) break;

          curPage += 1;
        }

        setPlantMap(nextMap);
      } catch (e) {
        console.error(e);
      }
    };

    loadPlantMap();
  }, []);

  // 5️⃣ 핸들러
  const handleSearchChange = (key: string, value: unknown) => {
    setSearchValues((prev) => {
      if (key in prev) {
        return { ...prev, [key]: String(value ?? '') } as SearchValues;
      }
      return prev;
    });
  };

  // 검색 버튼 기준 적용
  const handleSearch = () => {
    setAppliedSearchValues(searchValues);
    setPage(1);
  };

  const handleChange = (key: string, value: unknown) => {
    const next = String(value ?? '');
    setValues((prev) => ({ ...prev, [key]: next }) as RightValues);

    if (key === 'showNumber') {
      const nextSize = Number(next);
      if (!Number.isNaN(nextSize) && nextSize > 0) {
        setSize(nextSize);
        setPage(1);
      }
    }
  };

  const handleCreateMove = () => {
    saveListState();
    router.push(`/eqpmnt/${kind}/create`);
  };

  const onRowClick = (eqpmntId: string) => {
    if (!eqpmntId) return;

    saveListState();

    router.push(`/eqpmnt/${kind}/${encodeURIComponent(eqpmntId)}`);
  };

  // ag-grid
  const columnDefs: ColDef[] = [
    { field: 'number', headerName: 'No.', width: 80 },
    { field: 'equipName', headerName: '장비 명', flex: 1 },
    { field: 'plantName', headerName: '발전소', width: 300 },
    { field: 'manufacturer', headerName: '제조사', width: 200 },
    { field: 'equipModel', headerName: '모델', width: 300 },
    { field: 'macAddr', headerName: 'MAC', width: 300 },
    { field: 'ip', headerName: 'IP', width: 300 },
    { field: 'lnkgMthNm', headerName: '연결방식', width: 100 },
    { field: 'eqpmntSttsNm', headerName: '상태', width: 100 },
    { field: 'regisDate', headerName: '등록일', width: 200 },
  ];

  const isSearchApplied = useMemo(() => {
    return Object.values(appliedSearchValues).some((value) => String(value ?? '').trim() !== '');
  }, [appliedSearchValues]);

  const allRowList = useMemo<EquipListResponse[]>(() => {
    const items = allData?.items ?? [];
    return items.map((item, idx) => toEquipListRow(item, idx, 1, ALL_LIST_SIZE, plantMap));
  }, [allData?.items, plantMap]);

  const pagedRowList = useMemo<EquipListResponse[]>(() => {
    const items = data?.items ?? [];
    return items.map((item, idx) => toEquipListRow(item, idx, page, size, plantMap));
  }, [data?.items, page, size, plantMap]);

  const filteredAllList = useMemo<EquipListResponse[]>(() => {
    const qEquipName = (appliedSearchValues.equipName ?? '').trim().toLowerCase();
    const qPlantName = (appliedSearchValues.plantName ?? '').trim().toLowerCase();
    const qManufacturer = (appliedSearchValues.manufacturer ?? '').trim().toLowerCase();

    return allRowList.filter((row) => {
      if (qEquipName && !row.equipName.toLowerCase().includes(qEquipName)) return false;
      if (qPlantName && !row.plantName.toLowerCase().includes(qPlantName)) return false;
      if (qManufacturer && !row.manufacturer.toLowerCase().includes(qManufacturer)) return false;
      return true;
    });
  }, [
    allRowList,
    appliedSearchValues.equipName,
    appliedSearchValues.plantName,
    appliedSearchValues.manufacturer,
  ]);

  const filteredTotal = isSearchApplied ? filteredAllList.length : (data?.total ?? 0);
  const totalCount = allData?.total ?? data?.total ?? 0;
  const searchCount = isSearchApplied ? filteredAllList.length : totalCount;

  const pagedFilteredList = useMemo<EquipListResponse[]>(() => {
    if (!isSearchApplied) {
      return pagedRowList;
    }

    const startIndex = (page - 1) * size;
    const endIndex = startIndex + size;

    return filteredAllList.slice(startIndex, endIndex);
  }, [isSearchApplied, pagedRowList, filteredAllList, page, size]);

  const mappedList = useMemo<EquipListResponse[]>(() => {
    const total = filteredTotal;

    return pagedFilteredList.map((row, idx) => ({
      ...row,
      number: total - ((page - 1) * size + idx),
    }));
  }, [pagedFilteredList, filteredTotal, page, size]);

  const meta = titleMap[kind];

  // ---- JSX ----
  return (
    <>
      <div className="title-group">
        <TitleComponent title="현장 설비 정보" subTitle={meta.subTitle} desc={meta.desc} />
      </div>

      <div className="content-group">
        <SearchForm
          config={searchConfig}
          values={searchValues}
          onChange={handleSearchChange}
          onSearch={handleSearch}
        />

        <div className="table-group">
          <TableTitleComponent
            leftCont={<CountArea search={searchCount} total={totalCount} />}
            // leftCont={
            //   <div style={countAreaStyle}>
            //     검색 {searchCount ?? '-'} / 전체{' '}
            //     <span style={totalCountStyle}>{totalCount ?? '-'}</span>
            //   </div>
            // }
            rightCont={
              <SearchFields config={equipRightConfig} values={values} onChange={handleChange} />
            }
          />
          <AgGridComponent
            rowData={mappedList}
            columnDefs={columnDefs}
            loading={isFetching || isAllFetching}
            onRowClicked={(e: RowClickedEvent) => {
              const row = e.data as EquipListResponse | undefined;
              if (!row) return;
              onRowClick(row.eqpmntId);
            }}
          />
        </div>
      </div>

      <BottomGroupComponent
        leftCont={
          <Pagination
            data={{ page, size, total: filteredTotal }}
            onChange={(p: number) => setPage(p)}
          />
        }
        rightCont={
          <div className="button-group">
            <ButtonComponent
              variant="contained"
              icon={<Icons iName="edit" size={16} color="#fff" />}
              onPress={handleCreateMove}
            >
              등록
            </ButtonComponent>
            <ButtonComponent
              variant="excel"
              icon={<Icons iName="download" size={16} color="#fff" />}
            >
              엑셀 다운로드
            </ButtonComponent>
          </div>
        }
      />
    </>
  );
}
