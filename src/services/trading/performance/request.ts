// services/trading/performance/request.ts
import { tradeClient } from '@/lib/http.lib';
import type {
  TradeStatusParams,
  TradeSummaryRes,
  TradePeriodSummaryRes,
  TradeStatusListRes,
} from './type';

// 금일 거래 현황 + 누적 거래 실적 조회
export const getTradeSummary = async (params: TradeStatusParams): Promise<TradeSummaryRes> => {
  const res = await tradeClient.get<TradeSummaryRes>('/trade/status/summary', { params });
  return res.data;
};

// 기간 조회 요약
export const getTradePeriodSummary = async (
  params: TradeStatusParams,
): Promise<TradePeriodSummaryRes> => {
  const res = await tradeClient.get<TradePeriodSummaryRes>('/trade/status/period-summary', {
    params,
  });
  return res.data;
};

// 거래 목록 조회
export const getTradeStatusList = async (
  params: TradeStatusParams,
): Promise<TradeStatusListRes> => {
  const res = await tradeClient.get<TradeStatusListRes>('/trade/status/list', { params });
  return res.data;
};
