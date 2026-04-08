// services/trading/forecast/query.ts
import { useQuery } from '@tanstack/react-query';
import {
  getPredictionTrend,
  getPredictionChart,
  getPredictionAccuracy,
  getPredictionSummary,
  getPredictionList,
} from './request';
import type {
  PredictionParams,
  PredictionTrendItem,
  PredictionChartItem,
  PredictionAccuracyRes,
  PredictionSummaryRes,
  PredictionListItem,
} from './type';

// 시간대별 발전량 예측 추이
export const useGetPredictionTrend = (params: PredictionParams, enabled = true) => {
  return useQuery<PredictionTrendItem[]>({
    queryKey: ['predictionTrend', params],
    queryFn: () => getPredictionTrend(params),
    enabled,
  });
};

// 예측 vs 실측 발전량 비교 차트
export const useGetPredictionChart = (params: PredictionParams, enabled = true) => {
  return useQuery<PredictionChartItem[]>({
    queryKey: ['predictionChart', params],
    queryFn: () => getPredictionChart(params),
    enabled,
  });
};

// 발전량 예측 정확도
export const useGetPredictionAccuracy = (params: PredictionParams, enabled = true) => {
  return useQuery<PredictionAccuracyRes>({
    queryKey: ['predictionAccuracy', params],
    queryFn: () => getPredictionAccuracy(params),
    enabled,
  });
};

// 발전량 예측 요약
export const useGetPredictionSummary = (params: PredictionParams, enabled = true) => {
  return useQuery<PredictionSummaryRes>({
    queryKey: ['predictionSummary', params],
    queryFn: () => getPredictionSummary(params),
    enabled,
  });
};

// 시간대별 발전량 예측 목록
export const useGetPredictionList = (params: PredictionParams, enabled = true) => {
  return useQuery<PredictionListItem[]>({
    queryKey: ['predictionList', params],
    queryFn: () => getPredictionList(params),
    enabled,
  });
};
