// services/trading/verification/type.ts

// 월간 시스템 발전량 조회 파라미터
export interface KepcoSystemParams {
  pwplId: string;
  vrfyYm: string;
  kepcoEgqty?: number;
}

// 월간 시스템 발전량 응답
export interface KepcoSystemRes {
  pwplId: string;
  vrfyYm: string;
  sysEgqty: number;
}

// 한전 검증 저장 요청
export interface KepcoSaveReq {
  pwplId: string;
  vrfyYm: string;
  kepcoEgqty: number;
  userId: string;
}

// 한전 검증 저장 응답
export interface KepcoSaveRes {
  vrfyId: number;
  pwplId: string;
  vrfyYm: string;
  kepcoEgqty: number;
  sysEgqty: number;
  diffEgqty: number;
  diffRate: number;
}

// 월말 한전 검증 목록 조회 파라미터
export interface KepcoListParams {
  pwplId: string;
  page: number;
  size: number;
}

// 월말 한전 검증 목록 항목
export interface KepcoListItem {
  vrfyId: number;
  vrfyYmText: string;
  pwplId: string;
  pwplNm: string;
  kepcoEgqty: number;
  sysEgqty: number;
  diffEgqty: number;
  diffRate: number;
  regDt: string;
  rgtrId: string;
}

// 월말 한전 검증 목록 응답
export interface KepcoListRes {
  totalCount: number | null;
  items: KepcoListItem[];
}

// 일별 발전량 목록 조회 파라미터
export interface KepcoDayListParams {
  pwplId: string;
  vrfyYm: string;
  page: number;
  size: number;
}

// 일별 발전량 항목
export interface KepcoDayItem {
  dayYmd: string;
  pwplNm: string;
  sysEgqty: number;
}

// 일별 발전량 목록 응답
export interface KepcoDayListRes {
  totalCount: number | null;
  items: KepcoDayItem[];
}
