// equipment/strct/request.ts

import { plantClient } from '@/lib/http.lib';
import type {
  StrctListParams,
  StrctListRes,
  StrctDetailParams,
  StrctDetailRes,
  StrctCreateReq,
  StrctCreateRes,
  StrctUpdateReq,
  StrctUpdateRes,
  StrctDeleteReq,
  StrctDeleteRes,
} from './type';

/**
 * 발전소구조설비 목록 조회
 * GET /api/eqpmnt/strct/list
 */
export const getStrctList = async (params: StrctListParams): Promise<StrctListRes> => {
  const res = await plantClient.get<StrctListRes>('/eqpmnt/strct/list', { params });
  return res.data;
};

/**
 * 발전소구조설비 상세 조회
 * GET /api/eqpmnt/strct/detail
 */
export const getStrctDetail = async (params: StrctDetailParams): Promise<StrctDetailRes> => {
  const res = await plantClient.get<StrctDetailRes>('/eqpmnt/strct/detail', { params });
  return res.data;
};

/**
 * 발전소구조설비 등록
 * POST /api/eqpmnt/strct/create
 */
export const postStrctCreate = async (body: StrctCreateReq): Promise<StrctCreateRes> => {
  const res = await plantClient.post<StrctCreateRes>('/eqpmnt/strct/create', body);
  return res.data;
};

/**
 * 발전소구조설비 수정
 * POST /api/eqpmnt/strct/update
 */
export const postStrctUpdate = async (body: StrctUpdateReq): Promise<StrctUpdateRes> => {
  const res = await plantClient.post<StrctUpdateRes>('/eqpmnt/strct/update', body);
  return res.data;
};

/**
 * 발전소구조설비 삭제
 * POST /api/eqpmnt/strct/delete
 */
export const postStrctDelete = async (params: StrctDeleteReq): Promise<StrctDeleteRes> => {
  const res = await plantClient.post<StrctDeleteRes>('/eqpmnt/strct/delete', null, {
    params, // ✅ query parameter 전달
  });

  return res.data;
};
