// services/trading/prices/type.ts

/**
 * SMP 차트 항목 타입
 */
export type SmpChartItem = {
  label: string; // 차트 라벨
  value: number; // 차트 값
};

/**
 * SMP 차트 조회 응답 타입
 * GET /api/trade/smp/chart
 */
export type SmpChartRes = SmpChartItem[];

/**
 * SMP 리스트 항목 타입
 */
export type SmpListItem = {
  tradeDate: string; // 거래일자
  tradeTime: string; // 거래시간
  landForecastDemand: number; // 육지예측수요
  totalForecastDemand: number; // 총예측수요
  smp: number; // SMP
};

/**
 * SMP 리스트 조회 응답 타입
 * GET /api/trade/smp/list
 */
export type SmpListRes = {
  items: SmpListItem[];
  total: number;
  page: number;
  size: number;
};

/**
 * SMP 공통 조회 파라미터
 */
export type SmpParams = {
  tradeDate?: string; // 거래일자 (yyyyMMdd)
  fromDate?: string; // 시작일자 (yyyyMMdd)
  toDate?: string; // 종료일자 (yyyyMMdd)
  page?: number;
  size?: number;
};

/**
 * SMP 요약 조회 응답 타입
 * GET /api/trade/smp/summary
 */
export type SmpSummary = {
  prevTradeDate: string; // 이전 기준일자
  currTradeDate: string; // 현재 기준일자
  prevSmp: number; // 이전 단가
  currSmp: number; // 현재 단가
};

/**
 * REC 요약 조회 응답 타입
 * GET /api/trade/rec/summary
 */
export type RecSummary = {
  prevDate: string; // 이전 기준일자
  currDate: string; // 현재 기준일자
  prevPrice: number; // 이전 단가
  currPrice: number; // 현재 단가
};

/**
 * REC 차트 항목 타입
 * GET /api/trade/rec/chart
 */
export type RecChartItem = {
  label: string; // 차트 라벨
  value: number; // 차트 값 (육지 평균가)
};

export type RecChartRes = RecChartItem[];

/**
 * REC 리스트 항목 타입
 */
export type RecListItem = {
  tradeDate: string; // 거래일자
  landAvgPrc: number; // 육지 평균가
  landHgPrc: number; // 육지 최고가
  landLwPrc: number; // 육지 최저가
  landTrdCnt: number; // 육지 체결건수
  landTrdRecValue: number; // 육지 체결물량
};

/**
 * REC 리스트 조회 응답 타입
 * GET /api/trade/rec/list
 */
export type RecListRes = {
  items: RecListItem[];
  total: number;
  page: number;
  size: number;
};

/**
 * REC 공통 조회 파라미터
 */
export type RecParams = {
  tradeDate?: string; // 거래일자 (yyyyMMdd)
  fromDate?: string; // 시작일자 (yyyyMMdd)
  toDate?: string; // 종료일자 (yyyyMMdd)
  page?: number;
  size?: number;
};
