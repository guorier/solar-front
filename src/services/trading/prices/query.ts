// services/trading/prices/query.ts
import { useQuery } from '@tanstack/react-query';
import {
  getSmpChart,
  getSmpList,
  getSmpSummary,
  getRecSummary,
  getRecChart,
  getRecList,
} from './request';
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
export const useGetSmpChart = (params: SmpParams, enabled = true) => {
  return useQuery<SmpChartRes>({
    queryKey: ['smpChart', params],
    queryFn: () => getSmpChart(params),
    enabled,
  });
};

// SMP 리스트 조회
export const useGetSmpList = (params: SmpParams = { page: 1, size: 10 }) => {
  return useQuery<SmpListRes>({
    queryKey: ['smpList', params],
    queryFn: () => getSmpList(params),
    placeholderData: (prev) => prev,
  });
};

// SMP 요약 조회
export const useGetSmpSummary = () => {
  return useQuery<SmpSummary>({
    queryKey: ['smpSummary'],
    queryFn: getSmpSummary,
  });
};

// REC 요약 조회
export const useGetRecSummary = () => {
  return useQuery<RecSummary>({
    queryKey: ['recSummary'],
    queryFn: getRecSummary,
  });
};

// REC 차트 조회
export const useGetRecChart = (params: RecParams, enabled = true) => {
  return useQuery<RecChartRes>({
    queryKey: ['recChart', params],
    queryFn: () => getRecChart(params),
    enabled,
  });
};

// REC 리스트 조회
export const useGetRecList = (params: RecParams = { page: 1, size: 10 }) => {
  return useQuery<RecListRes>({
    queryKey: ['recList', params],
    queryFn: () => getRecList(params),
    placeholderData: (prev) => prev,
  });
};
