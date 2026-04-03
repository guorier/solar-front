// services/trading/performance/type.ts

export type TradeStatusParams = {
  pwplId?: string;
  fromDate?: string; // yyyyMMdd
  toDate?: string; // yyyyMMdd
  page?: number;
  size?: number;
};

/**
 * GET /api/trade/status/summary
 * 금일 거래 현황 + 누적 거래 실적
 */
export type TradeSummaryRes = {
  todayTotalAmount: number;
  todaySmpQty: number;
  todaySmpAmount: number;
  todayRecQty: number;
  todayRecAmount: number;
  accTotalAmount: number;
  accSmpQty: number;
  accSmpAmount: number;
  accRecQty: number;
  accRecAmount: number;
  currentSmp: number;
};

/**
 * GET /api/trade/status/period-summary
 * 기간 조회 요약
 */
export type TradePeriodSummaryRes = {
  totalQty: number | null;
  totalAmount: number | null;
  avgSmpPrice: number | null;
  avgRecPrice: number | null;
};

/**
 * GET /api/trade/status/list
 * 거래 목록 아이템
 */
export type TradeStatusListItem = {
  tradeDate: string;
  pwplNm: string;
  tradeQty: number;
  smpPrice: number;
  recPrice: number;
  totalAmount: number;
};

export type TradeStatusListRes = {
  items: TradeStatusListItem[];
  total: number;
  page: number;
  size: number;
};
