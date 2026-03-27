// src/services/eqpmnt/prdctn/request.ts

import { plantClient } from '@/lib/http.lib';
import type {
  PrdctnCreateReq,
  PrdctnCreateRes,
  PrdctnDetailParams,
  PrdctnDetailRes,
  PrdctnUpdateReq,
  PrdctnUpdateRes,
  PrdctnDeleteReq,
  PrdctnDeleteRes,
} from './type';

/**
 * 발전생산설비 상세 조회
 * GET /api/eqpmnt/prdctn/detail
 */
export const getPrdctnDetail = async (params: PrdctnDetailParams): Promise<PrdctnDetailRes> => {
  const res = await plantClient.get<PrdctnDetailRes>('/eqpmnt/prdctn/detail', { params });
  return res.data;
};

/**
 * 발전생산설비 등록
 * POST /api/eqpmnt/prdctn/create
 */
export const postPrdctnCreate = async (body: PrdctnCreateReq): Promise<PrdctnCreateRes> => {
  const res = await plantClient.post<PrdctnCreateRes>('/eqpmnt/prdctn/create', body);
  return res.data;
};

/**
 * 발전생산설비 수정
 * POST /api/eqpmnt/prdctn/update
 */
export const postPrdctnUpdate = async (body: PrdctnUpdateReq): Promise<PrdctnUpdateRes> => {
  const res = await plantClient.post<PrdctnUpdateRes>('/eqpmnt/prdctn/update', body);
  return res.data;
};

/**
 * 발전생산설비 삭제
 * POST /api/eqpmnt/prdctn/delete
 */
export const postPrdctnDelete = async (params: PrdctnDeleteReq): Promise<PrdctnDeleteRes> => {
  const res = await plantClient.post<PrdctnDeleteRes>('/eqpmnt/prdctn/delete', null, {
    params, // ✅ query parameter 전달
  });

  return res.data;
};
