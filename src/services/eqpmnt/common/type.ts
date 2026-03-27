// src/services/eqpmnt/common/type.ts

/**
 * 공통 장비 목록 조회 파라미터
 */
export type EquipListParams = {
  page: number;
  size: number;
};

/**
 * 장비 종류
 */
export type EquipKind = 'strct' | 'prdctn' | 'intrcon' | 'engy' | 'meas' | 'safety' | 'oper';

/**
 * 공통 장비 목록 raw item
 * - swagger가 조금씩 달라도 mapper에서 안전하게 문자열로 변환해서 씀
 */
export type EquipListItemRaw = Record<string, unknown>;

/**
 * 공통 장비 목록 응답
 */
export type EquipListRes = {
  total: number;
  items: EquipListItemRaw[];
};