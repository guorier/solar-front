// services/trading/verification/request.ts
import { tradeClient } from '@/lib/http.lib';
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
export const getKepcoSystem = async (params: KepcoSystemParams): Promise<KepcoSystemRes> => {
  const res = await tradeClient.get<KepcoSystemRes>('/oprt/kepco/system', { params });
  return res.data;
};

// 월말 한전 검증 저장
export const saveKepco = async (body: KepcoSaveReq): Promise<KepcoSaveRes> => {
  const res = await tradeClient.post<KepcoSaveRes>('/oprt/kepco', body);
  return res.data;
};

// 월말 한전 검증 목록 조회
export const getKepcoList = async (params: KepcoListParams): Promise<KepcoListRes> => {
  const res = await tradeClient.get<KepcoListRes>('/oprt/kepco/list', { params });
  return res.data;
};

// 일별 발전량 목록 조회
export const getKepcoDayList = async (params: KepcoDayListParams): Promise<KepcoDayListRes> => {
  const res = await tradeClient.get<KepcoDayListRes>('/oprt/kepco/day-list', { params });
  return res.data;
};
