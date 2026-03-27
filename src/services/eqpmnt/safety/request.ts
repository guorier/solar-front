// src/services/eqpmnt/safety/request.ts

import { plantClient } from '@/lib/http.lib';
import type {
  SafetyDetailParams,
  SafetyDetailRes,
  SafetyCreateReq,
  SafetyCreateRes,
  SafetyUpdateReq,
  SafetyUpdateRes,
  SafetyDeleteReq,
  SafetyDeleteRes,
} from './type';

// 보안방재설비 상세 조회 api
export const getSafetyDetail = async (params: SafetyDetailParams): Promise<SafetyDetailRes> => {
  const res = await plantClient.get<SafetyDetailRes>('/eqpmnt/safety/detail', { params });

  return res.data;
};

// 보안방재설비 등록 api
export const postSafetyCreate = async (body: SafetyCreateReq): Promise<SafetyCreateRes> => {
  const res = await plantClient.post<SafetyCreateRes>('/eqpmnt/safety/create', body);

  return res.data;
};

// 보안방재설비 수정 api
export const postSafetyUpdate = async (body: SafetyUpdateReq): Promise<SafetyUpdateRes> => {
  const res = await plantClient.post<SafetyUpdateRes>('/eqpmnt/safety/update', body);

  return res.data;
};

/**
 * 보안방재설비 삭제
 * POST /eqpmnt/safety/delete?eqpmntId=XXX
 */
export const postSafetyDelete = async (params: SafetyDeleteReq): Promise<SafetyDeleteRes> => {
  const res = await plantClient.post<SafetyDeleteRes>('/eqpmnt/safety/delete', null, {
    params,
  });

  return res.data;
};
