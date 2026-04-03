// services/trading/performance/query.ts
import { useQuery } from '@tanstack/react-query';
import { getTradeSummary, getTradePeriodSummary, getTradeStatusList } from './request';
import type {
  TradeStatusParams,
  TradeSummaryRes,
  TradePeriodSummaryRes,
  TradeStatusListRes,
} from './type';

// 금일 거래 현황 + 누적 거래 실적
export const useGetTradeSummary = (params: TradeStatusParams, enabled = true) => {
  return useQuery<TradeSummaryRes>({
    queryKey: ['tradeSummary', params],
    queryFn: () => getTradeSummary(params),
    enabled,
  });
};

// 기간 조회 요약
export const useGetTradePeriodSummary = (params: TradeStatusParams, enabled = true) => {
  return useQuery<TradePeriodSummaryRes>({
    queryKey: ['tradePeriodSummary', params],
    queryFn: () => getTradePeriodSummary(params),
    enabled,
  });
};

// 거래 목록
export const useGetTradeStatusList = (
  params: TradeStatusParams = { page: 1, size: 20 },
  enabled = true,
) => {
  return useQuery<TradeStatusListRes>({
    queryKey: ['tradeStatusList', params],
    queryFn: () => getTradeStatusList(params),
    placeholderData: (prev) => prev,
    enabled,
  });
};
