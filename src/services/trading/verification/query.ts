// services/trading/verification/query.ts
import { useQuery, useMutation } from '@tanstack/react-query';
import { getKepcoSystem, saveKepco, getKepcoList, getKepcoDayList } from './request';
import type {
  KepcoSystemParams,
  KepcoSystemRes,
  KepcoSaveReq,
  KepcoSaveRes,
  KepcoListParams,
  KepcoListRes,
  KepcoDayListParams,
  KepcoDayListRes,
} from './type';

// 월간 시스템 발전량 조회
export const useGetKepcoSystem = (params: KepcoSystemParams, enabled = true) => {
  return useQuery<KepcoSystemRes>({
    queryKey: ['kepcoSystem', params],
    queryFn: () => getKepcoSystem(params),
    enabled,
  });
};

// 월말 한전 검증 저장
export const useSaveKepco = () => {
  return useMutation<KepcoSaveRes, Error, KepcoSaveReq>({
    mutationFn: saveKepco,
  });
};

// 월말 한전 검증 목록 조회
export const useGetKepcoList = (params: KepcoListParams, enabled = true) => {
  return useQuery<KepcoListRes>({
    queryKey: ['kepcoList', params],
    queryFn: () => getKepcoList(params),
    enabled,
  });
};

// 일별 발전량 목록 조회
export const useGetKepcoDayList = (params: KepcoDayListParams, enabled = true) => {
  return useQuery<KepcoDayListRes>({
    queryKey: ['kepcoDayList', params],
    queryFn: () => getKepcoDayList(params),
    enabled,
  });
};
