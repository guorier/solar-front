// services/trading/prices/request.ts
import { tradeClient } from '@/lib/http.lib';
import type {
  SmpChartRes,
  SmpListRes,
  SmpParams,
  SmpSummary,
  RecSummary,
  RecChartRes,
  RecListRes,
  RecParams,
} from './type';

// SMP 차트 조회
export const getSmpChart = async (params: SmpParams): Promise<SmpChartRes> => {
  const res = await tradeClient.get<SmpChartRes>('/trade/smp/chart', { params });
  return res.data;
};

// SMP 리스트 조회
export const getSmpList = async (
  params: SmpParams = { page: 1, size: 10 },
): Promise<SmpListRes> => {
  const res = await tradeClient.get<SmpListRes>('/trade/smp/list', { params });
  return res.data;
};

// SMP 요약 조회
export const getSmpSummary = async (): Promise<SmpSummary> => {
  const res = await tradeClient.get<SmpSummary>('/trade/smp/summary');
  return res.data;
};

// REC 요약 조회
export const getRecSummary = async (): Promise<RecSummary> => {
  const res = await tradeClient.get<RecSummary>('/trade/rec/summary');
  return res.data;
};

// REC 차트 조회
export const getRecChart = async (params: RecParams): Promise<RecChartRes> => {
  const res = await tradeClient.get<RecChartRes>('/trade/rec/chart', { params });
  return res.data;
};

// REC 리스트 조회
export const getRecList = async (
  params: RecParams = { page: 1, size: 10 },
): Promise<RecListRes> => {
  const res = await tradeClient.get<RecListRes>('/trade/rec/list', { params });
  return res.data;
};
