// services/common/code/type.ts

/**
 * 공통코드 항목 타입
 */
export type ComCodeItem = {
  comMastrCd: string;
  comMastrCdNm: string;
  comSubCd: string;
  comSubCdNm: string;
  cdExpln: string | null;
  sortSeq: string;
};

/**
 * 공통코드 조회 요청 파라미터
 */
export type ComCodeListReq = {
  comMastrCd: string;
};

/**
 * 메뉴 계층형 Response 타입
 */
export type MenuTreeRes = {
  menuCd: string;
  menuNm: string;
  upMenuCd: string;
  depthCd: number;
  path: string;
  seCd: string;
  menuTypeCd: string;
  sortSeq: number;
  hasChild: boolean;
  children: [];
};

/**
 * 메뉴 목록 파라미터
 */
export type MenuListParams = {
  menuNm?: string;
  page?: number;
  size?: number;
};

/**
 * 메뉴 상세 Response 타입
 */
export type MenuDetailRes = {
  menuCd: string;
  menuNm: string;
  upMenuCd: string;
  depthCd: number;
  path: string;
  seCd: string;
  seCdNm: string;
  menuTypeCd: string;
  menuTypeCdNm: string;
  sortSeq: number;
  expln: string;
  displyYn: 'Y' | 'N';
  useYn: 'Y' | 'N';
  rgtrId: string;
  regDt: string;
  mdfrId: string;
  mdfcnDt: string;
};

/**
 * 메뉴 목록 Response 타입
 */
export type MenuListRes = {
  items: MenuDetailRes[];
  total: number;
  page: number;
  size: number;
};

/**
 * 메뉴 등록 Request 타입
 */
export type MenuCreateReq = {
  rgtrId: string;
  menuNm: string;
  upMenuCd?: string | null;
  path?: string | null;
  seCd: string;
  menuTypeCd?: string | null;
  sortSeq?: number | null;
  expln?: string | null;
  useYn?: 'Y' | 'N';
};

/**
 * 메뉴 수정 Request 타입
 */
export type MenuUpdateReq = Omit<MenuCreateReq, 'menuNm' | 'seCd' | 'rgtrId'> & {
  menuCd: string;
  menuNm?: string;
  seCd?: string;
  mdfrId?: string;
};

/**
 * 메뉴 그룹 권한 상세 menuItems 타입
 */
export type MenuItems = {
  menuCd: string;
  menuNm: string;
  depthCd: number;
  path: string;
  sortSeq: number;
};

/**
 * 메뉴 그룹 권한 상세 Response 타입
 */
export type MenuGroupDetailRes = {
  groupCd: string;
  groupNm: string;
  accessLevelCd: string;
  accessLevelNm: string;
  grdCd: string;
  grdNm: string;
  useYn: string;
  rgtrId: string;
  regDt: string;
  mdfrId: string;
  mdfcnDt: string;
  menuItems: { menuCd: string; menuNm: string; depthCd: number; path: string; sortSeq: number }[];
};

/**
 * 메뉴 그룹 권한 목록 파라미터
 */
export type MenuGroupListParams = {
  groupCd?: string;
  keyword?: string;
  accessLevelCd?: string;
  grdCd?: string;
  useYn?: string;
  page?: number;
  size?: number;
};

/**
 * 메뉴 그룹 권한 목록 Response 타입
 */
export type MenuGroupListRes = {
  items: MenuGroupDetailRes[];
  total: number;
  page: number;
  size: number;
};

/**
 * 메뉴 그룹 권한 저장 Request 타입
 */
export type MenuGroupSaveReq = {
  useYn: string;
  rgtrId: string;
  mdfrId?: string;
  groupCd?: string;
  groupNm: string;
  accessLevelCd: string;
  grdCd: string;
  menuCds: string[];
};
