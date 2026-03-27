// src/constants/eqpmnt/common/model/EquipListType.ts

/**
 * 리스트 화면 row 타입(ag-grid에 그대로 들어감)
 */
export type EquipListResponse = {
  number: number;
  eqpmntId: string;

  equipName: string;
  plantName: string;
  manufacturer: string;
  equipModel: string;

  macAddr: string;
  ip: string;

  lnkgMthNm: string;
  eqpmntSttsNm: string;

  regisDate: string;
};

/**
 * 검색 폼 값
 */
export type SearchValues = {
  equipName: string;
  plantName: string;
  manufacturer: string;
};

/**
 * 우측 옵션(표시개수 등)
 */
export type RightValues = {
  showNumber: string;
};