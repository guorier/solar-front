// services/trading/forecast/request.ts
import { tradeClient } from '@/lib/http.lib';
import type {
  PredictionParams,
  PredictionTrendItem,
  PredictionChartItem,
  PredictionAccuracyRes,
  PredictionSummaryRes,
  PredictionListItem,
} from './type';

// 시간대별 발전량 예측 추이 조회
export const getPredictionTrend = async (
  params: PredictionParams,
): Promise<PredictionTrendItem[]> => {
  const res = await tradeClient.get<PredictionTrendItem[]>('/trade/prediction/trend', { params });
  return res.data;
};

// 예측 vs 실측 발전량 비교 차트 조회
export const getPredictionChart = async (
  params: PredictionParams,
): Promise<PredictionChartItem[]> => {
  const res = await tradeClient.get<PredictionChartItem[]>('/trade/prediction/chart', { params });
  return res.data;
};

// 발전량 예측 정확도 조회
export const getPredictionAccuracy = async (
  params: PredictionParams,
): Promise<PredictionAccuracyRes> => {
  const res = await tradeClient.get<PredictionAccuracyRes>('/trade/prediction/accuracy', {
    params,
  });
  return res.data;
};

// 발전량 예측 요약 조회
export const getPredictionSummary = async (
  params: PredictionParams,
): Promise<PredictionSummaryRes> => {
  const res = await tradeClient.get<PredictionSummaryRes>('/trade/prediction/summary', { params });
  return res.data;
};

// 시간대별 발전량 예측 목록 조회
export const getPredictionList = async (
  params: PredictionParams,
): Promise<PredictionListItem[]> => {
  const res = await tradeClient.get<PredictionListItem[]>('/trade/prediction/list', { params });
  return res.data;
};
