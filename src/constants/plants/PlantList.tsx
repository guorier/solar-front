'use client';

import {
  AgGridComponent,
  ButtonComponent,
  Icons,
  type SearchFieldConfig,
  SearchFields,
  TableTitleComponent,
  TitleComponent,
  BottomGroupComponent,
  TopInfoBoxComponent,
  InfoBoxGroup,
  InfoBoxComponent,
  Pagination,
} from '@/components';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

import { getComCodeList } from '@/services/common/request';
import { getPlantBaseList } from '@/services/plants/request';
import type { ComCodeItem } from '@/services/common/type';
import type { PlantBase, PlantBaseListRes } from '@/services/plants/type';
import { formatYmdHm } from '@/utils';

import type { ColDef, RowClickedEvent } from 'ag-grid-community';
import type { iName } from '@/components/icon/Icons';

// 타입 정의(퍼블 코드 유지)
interface infoListResponse {
  [key: string]: string;
  plantName: string;
  plantType: string;
  plantStatus: string;
  designCapacity: string;
  installCapacity: string;
  plantLoc: string;
  owner: string;
  opCompany: string;
  opDate: string;
  regisDate: string;
  pwplId: string;
}

const isOperating = (p: PlantBase) => (p.pwplSttsCd ?? '').trim() === '001';
const isConstructing = (p: PlantBase) => (p.pwplSttsCd ?? '').trim() === '002';

const formatKw = (v: number | null | undefined) => (v === null || v === undefined ? '-' : `${v}kW`);
const formatMw = (totalKw: number) => `${Math.floor((totalKw / 1000) * 10) / 10} MW`;

const formatLocation = (road?: string | null, jibun?: string | null) =>
  road?.trim() ? road : jibun?.trim() ? jibun : '-';

// ✅ 추가: YYYYMMDD -> YYYY-MM-DD
const formatYmdHyphen = (v?: string | null) => {
  const s = (v ?? '').trim();
  if (!s) return '-';
  const digits = s.replace(/\D/g, '');
  if (digits.length !== 8) return s;
  return `${digits.slice(0, 4)}-${digits.slice(4, 6)}-${digits.slice(6, 8)}`;
};

type ListState = {
  page: number;
  size: number;
  values: Record<string, string>;
  draftValues: Record<string, string>;
  scrollY: number;
  updatedAt: number;
};

const LIST_STATE_KEY = 'info:list-state:v1';
const LIST_STATE_TTL_MS = 6 * 60 * 60 * 1000;

const loadListState = (): ListState | null => {
  if (typeof window === 'undefined') return null;
  try {
    const raw = sessionStorage.getItem(LIST_STATE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as ListState;
    if (!parsed?.updatedAt) return null;
    if (Date.now() - parsed.updatedAt > LIST_STATE_TTL_MS) return null;
    return parsed;
  } catch {
    return null;
  }
};

const saveListState = (state: ListState) => {
  if (typeof window === 'undefined') return;
  sessionStorage.setItem(LIST_STATE_KEY, JSON.stringify(state));
};

const getNavigationType = (): 'navigate' | 'reload' | 'back_forward' | 'prerender' | 'unknown' => {
  if (typeof window === 'undefined') return 'unknown';

  const nav = performance.getEntriesByType('navigation')[0] as
    | PerformanceNavigationTiming
    | undefined;

  const type = nav?.type;

  if (type === 'navigate') return 'navigate';
  if (type === 'reload') return 'reload';
  if (type === 'back_forward') return 'back_forward';
  if (type === 'prerender') return 'prerender';

  return 'unknown';
};
export default function PlantList() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const size = 10;
  const [total, setTotal] = useState(0);

  const [data, setData] = useState<PlantBaseListRes | null>(null);

  // ✅ 퍼블 코드: 임시 데이터 제거, 검색 UI는 SearchFields 유지
  const [values, setValues] = useState<Record<string, string>>({});
  const [draftValues, setDraftValues] = useState<Record<string, string>>({});

  // ✅ 코드명(콤코드) 로딩: PlantCreateForm과 동일하게 P01(유형), P02(상태)
  const [typeCodes, setTypeCodes] = useState<ComCodeItem[]>([]);
  const [statusCodes, setStatusCodes] = useState<ComCodeItem[]>([]);

  const didRestoreRef = useRef(false);

  const handleChange = (key: string, value: unknown) => {
    setDraftValues((prev) => ({
      ...prev,
      [key]: value === null || value === undefined ? '' : String(value),
    }));
  };

  const handleSearch = () => {
    setValues((prev) => ({ ...prev, ...draftValues }));
    setPage(1);
  };

  const qStatus = useMemo(() => values.statusType ?? '', [values.statusType]);
  const qType = useMemo(() => values.plantType ?? '', [values.plantType]);
  const qName = useMemo(() => values.deviceName ?? '', [values.deviceName]);

  const fetchList = async () => {
    setLoading(true);
    try {
      const res = await getPlantBaseList({ page, size });
      setData(res);
      setTotal(Number(res.total ?? 0));
    } catch {
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  const normalize = (list: ComCodeItem[]) =>
    list
      .map((x) => ({
        ...x,
        comSubCd: x.comSubCd?.trim(),
        comSubCdNm: x.comSubCdNm?.trim(),
        sortSeq: x.sortSeq?.trim(),
      }))
      .sort((a, b) => Number(a.sortSeq) - Number(b.sortSeq));

  const loadTypeCodes = async () => {
    if (typeCodes.length) return;
    setTypeCodes(normalize(await getComCodeList({ comMastrCd: 'P01' })));
  };

  const loadStatusCodes = async () => {
    if (statusCodes.length) return;
    setStatusCodes(normalize(await getComCodeList({ comMastrCd: 'P02' })));
  };

  const persistNow = () => {
    saveListState({
      page,
      size,
      values,
      draftValues,
      scrollY: typeof window !== 'undefined' ? window.scrollY : 0,
      updatedAt: Date.now(),
    });
  };

  // ✅ 최초 진입 시 복원
  useEffect(() => {
    const navType = getNavigationType();

    if (navType === 'navigate') {
      sessionStorage.removeItem(LIST_STATE_KEY);
      return;
    }

    const saved = loadListState();
    if (!saved) return;

    didRestoreRef.current = true;
    setPage(saved.page ?? 1);
    setValues(saved.values ?? {});
    setDraftValues(saved.draftValues ?? saved.values ?? {});

    requestAnimationFrame(() => {
      window.scrollTo(0, typeof saved.scrollY === 'number' ? saved.scrollY : 0);
    });
  }, []);

  useEffect(() => {
    fetchList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  // ✅ 최초 1회 콤코드 미리 로드(검색 셀렉트에서 이름으로 보이게)
  useEffect(() => {
    loadTypeCodes();
    loadStatusCodes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ✅ 상태 변경 시 저장(복원 직후 1회도 저장)
  useEffect(() => {
    if (didRestoreRef.current) {
      didRestoreRef.current = false;
      persistNow();
      return;
    }
    persistNow();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, values, draftValues]);

  // API 코드: 프론트 임시 필터 유지
  const filtered = useMemo(() => {
    const items = data?.items ?? [];
    return items.filter((p) => {
      if (qStatus && (p.pwplSttsCd ?? '') !== qStatus) return false;
      if (qType && (p.pwplTypeCd ?? '') !== qType) return false;
      if (qName && !p.pwplNm.toLowerCase().includes(qName.toLowerCase())) return false;
      return true;
    });
  }, [data, qStatus, qType, qName]);

  const summary = useMemo(() => {
    const items = filtered;
    const totalCount = items.length;
    const operating = items.filter(isOperating).length;
    const constructing = items.filter(isConstructing).length;

    const totalInstlKw = items.reduce((acc, p) => acc + (p.instlCpct ?? 0), 0); // 설치 용량 합산
    const totalDesignKw = items.reduce((acc, p) => acc + (p.designCpct ?? 0), 0); // 설계 용량 합산

    return { totalCount, operating, constructing, totalInstlKw, totalDesignKw };
  }, [filtered]);

  const infoRightConfig: (SearchFieldConfig | SearchFieldConfig[])[] = [
    {
      key: 'statusType',
      type: 'select',
      placeholder: '상태 선택',
      options: [
        { label: '전체', value: '' },
        ...statusCodes.map((c) => ({
          label: c.comSubCdNm ?? c.comSubCd ?? '',
          value: c.comSubCd ?? '',
        })),
      ],
      width: 160,
    },
    {
      key: 'plantType',
      type: 'select',
      options: [
        { label: '전체', value: '' },
        ...typeCodes.map((c) => ({
          label: c.comSubCdNm ?? c.comSubCd ?? '',
          value: c.comSubCd ?? '',
        })),
      ],
      width: 160,
    },
    {
      key: 'deviceName',
      type: 'search-text',
      placeholder: '발전소 이름',
      options: [],
      onSearchClick: () => handleSearch(),
      searchText: '검색',
    },
  ];

  const onCreate = () => {
    persistNow();
    router.push('/info/regis-info');
  };

  const onRowClick = (pwplId: string) => {
    persistNow();
    router.push(`/info/${encodeURIComponent(pwplId)}`);
  };

  // ✅ 타입 추가: icon이 string으로 추론되지 않게 iName으로 고정
  type PlantSummaryItem = {
    icon: iName;
    title: string;
    count: number | string;
    totalCount?: number | string;
    unit: string;
  };

  const PLANT_SUMMARY_DATA: PlantSummaryItem[] = [
    {
      icon: 'factory',
      title: '총 발전소',
      count: summary.totalCount,
      unit: '개소',
    },
    { icon: 'factory', title: '운영 발전소', count: summary.operating, unit: '개소' },
    {
      icon: 'battery',
      title: '총 설치 용량',
      count: formatMw(summary.totalInstlKw), // instlCpct 합산
      totalCount: formatMw(summary.totalDesignKw), // designCpct 합산
      unit: 'MW',
    },
    { icon: 'feedback', title: '건설 중', count: summary.constructing, unit: '개소' },
  ];

  // 퍼블 코드: 그리드 컬럼 유지
  const gridOptions: { columnDefs: ColDef<infoListResponse>[] } = {
    columnDefs: [
      { field: 'plantName', headerName: '발전소', flex: 1 },
      { field: 'plantType', headerName: '유형', width: 160 },
      { field: 'plantStatus', headerName: '상태', width: 160 },
      { field: 'designCapacity', headerName: '설계 용량', width: 160, cellStyle: { justifyContent: 'flex-end', paddingRight: '16px' } },
      { field: 'installCapacity', headerName: '설치 용량', width: 160, cellStyle: { justifyContent: 'flex-end', paddingRight: '16px' } },
      { field: 'plantLoc', headerName: '위치', width: 400 },
      { field: 'owner', headerName: '소유자', width: 100 },
      { field: 'opCompany', headerName: '운영 회사', width: 200 },
      { field: 'opDate', headerName: '상업 운전일', width: 200 },
      { field: 'regisDate', headerName: '등록일', width: 200 },
    ],
  };

  // ✅ rowData에 pwplId를 직접 넣어서 onRowClicked에서 역매핑 제거
  const infoList = useMemo<infoListResponse[]>(
    () =>
      filtered.map((p) => ({
        pwplId: p.pwplId,
        plantName: p.pwplNm ?? '-',
        plantType: p.pwplTypeNm ?? '-',
        plantStatus: p.pwplSttsNm ?? '-',
        designCapacity: formatKw(p.designCpct ?? null),
        installCapacity: formatKw(p.instlCpct ?? null),
        plantLoc: formatLocation(p.roadNmAddr ?? null, p.lctnLotnoAddr ?? null),
        owner: p.ownrNm ?? '-',
        opCompany: p.operCoNm ?? '-',
        opDate: formatYmdHyphen(p.cmrcoprYmd),
        regisDate: formatYmdHm(p.regDt),
      })),
    [filtered],
  );

  return (
    <>
      <div className="title-group">
        <TitleComponent title="발전소 기초정보" desc="발전소별 기본 정보 및 설치 현황 관리" />
      </div>

      <div className="content-group">
        <TopInfoBoxComponent title="발전소 요약정보" bg="var(--point-orange-5)" color="#A34600">
          <InfoBoxGroup className="row-type">
            {PLANT_SUMMARY_DATA.map((item, idx) => (
              <InfoBoxComponent key={`summary-${idx}`} bg="white" {...item} />
            ))}
          </InfoBoxGroup>
        </TopInfoBoxComponent>
        <div className="table-group">
          <TableTitleComponent
            rightCont={
              <SearchFields config={infoRightConfig} values={draftValues} onChange={handleChange} />
            }
          />

          <AgGridComponent
            rowData={infoList}
            columnDefs={gridOptions.columnDefs}
            loading={loading}
            onRowClicked={(e: RowClickedEvent<infoListResponse>) => {
              const row = e.data;
              if (!row) return;
              onRowClick(row.pwplId);
            }}
          />
        </div>
      </div>

      <BottomGroupComponent
        leftCont={
          <Pagination
            data={{
              page,
              size,
              total,
            }}
            onChange={(p: number) => setPage(p)}
          />
        }
        rightCont={
          <div className="button-group">
            <ButtonComponent
              variant="contained"
              icon={<Icons iName="plus" size={16} color="#fff" />}
              onClick={onCreate}
            >
              등록
            </ButtonComponent>
          </div>
        }
      />
    </>
  );
}
