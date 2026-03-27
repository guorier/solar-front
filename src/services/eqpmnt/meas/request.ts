import { plantClient } from '@/lib/http.lib';

import type {
  MeasDetailParams,
  MeasDetailRes,
  MeasCreateReq,
  MeasCreateRes,
  MeasUpdateReq,
  MeasUpdateRes,
  MeasDeleteReq,
  MeasDeleteRes,
} from './type';


/**
 * 상세 조회
 * GET /api/eqpmnt/meas/detail
 */
export const getMeasDetail = async (params: MeasDetailParams): Promise<MeasDetailRes> => {
  const res = await plantClient.get<MeasDetailRes>('/eqpmnt/meas/detail', { params });

  return res.data;
};

/**
 * 등록
 * POST /api/eqpmnt/meas/create
 */
export const postMeasCreate = async (body: MeasCreateReq): Promise<MeasCreateRes> => {
  const res = await plantClient.post<MeasCreateRes>('/eqpmnt/meas/create', body);

  return res.data;
};

/**
 * 수정
 * POST /api/eqpmnt/meas/update
 */
export const postMeasUpdate = async (body: MeasUpdateReq): Promise<MeasUpdateRes> => {
  const res = await plantClient.post<MeasUpdateRes>('/eqpmnt/meas/update', body);

  return res.data;
};

/**
 * 삭제
 * POST /api/eqpmnt/meas/delete
 */
export const postMeasDelete = async (params: MeasDeleteReq): Promise<MeasDeleteRes> => {
  const res = await plantClient.post<MeasDeleteRes>('/eqpmnt/meas/delete', null, {
    params,
  });

  return res.data;
};