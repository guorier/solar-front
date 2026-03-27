// services/eqpmnt/engy/request.ts
import { plantClient } from '@/lib/http.lib';
import type {
  EngyCreateReq,
  EngyUpdateReq,
  EngyDeleteReq,
  EngyCreateRes,
  EngyUpdateRes,
  EngyDeleteRes,
  EngyDetailParams,
  EngyDetailRes,
} from './type';

// 에너지저장설비 등록
export const postEngyCreate = async (body: EngyCreateReq): Promise<EngyCreateRes> => {
  const res = await plantClient.post<EngyCreateRes>('/eqpmnt/engy/create', body);
  return res.data;
};

// 에너지저장설비 수정
export const postEngyUpdate = async (body: EngyUpdateReq): Promise<EngyUpdateRes> => {
  const res = await plantClient.post<EngyUpdateRes>('/eqpmnt/engy/update', body);
  return res.data;
};

// 에너지저장설비 삭제
export const postEngyDelete = async (params: EngyDeleteReq): Promise<EngyDeleteRes> => {
  const res = await plantClient.post<EngyDeleteRes>('/eqpmnt/engy/delete', null, {
    params,
  });

  return res.data;
};

// 에너지저장설비 상세 조회
export const getEngyDetail = async (params: EngyDetailParams): Promise<EngyDetailRes> => {
  const res = await plantClient.get<EngyDetailRes>('/eqpmnt/engy/detail', { params });
  return res.data;
};
