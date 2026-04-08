// services/trading/forecast/type.ts

export type PredictionParams = {
  pwplId?: string;
  baseYmd?: string; // yyyyMMdd
};

/**
 * GET /api/trade/prediction/trend
 * 시간대별 발전량 예측 추이
 */
export type PredictionTrendItem = {
  time: string;
  predGenerationKwh: number;
  irradianceWm2: number;
};

/**
 * GET /api/trade/prediction/chart
 * 예측 vs 실측 발전량 비교 차트
 */
export type PredictionChartItem = {
  time: string;
  predGenerationKwh: number;
  realGenerationKwh: number;
};

/**
 * GET /api/trade/prediction/accuracy
 * 발전량 예측 정확도
 */
export type PredictionAccuracyRes = {
  maxOverErrorKwh: number;
  maxUnderErrorKwh: number;
  accuracy: number;
};

/**
 * GET /api/trade/prediction/summary
 * 발전량 예측 요약
 */
export type PredictionSummaryRes = {
  totalPredQty: number;
  avgEfficiency: number;
  peakTime: string;
  peakQty: number;
  reliability: number;
  avgErrorRate: number;
};

/**
 * GET /api/trade/prediction/list
 * 시간대별 발전량 예측 목록
 */
export type PredictionListItem = {
  timeHhmi: string;
  rowStatus: string;
  predIrradianceWm2: number | null;
  realIrradianceWm2: number | null;
  temperatureC: number | null;
  predGenerationKwh: number;
  realGenerationKwh: number;
  errorKwh: number | null;
  errorRate: number | null;
  efficiency: number | null;
  reliability: number | null;
};
