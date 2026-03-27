// services/eqpmnt/intrcon/request.ts
import { plantClient } from '@/lib/http.lib';
import type {
  IntrconDetailParams,
  IntrconDetailRes,
  IntrconCreateReq,
  IntrconCreateRes,
  IntrconUpdateReq,
  IntrconUpdateRes,
  IntrconDeleteReq,
  IntrconDeleteRes,
} from './type';

// 계통연계설비 상세 조회 api
export const getIntrconDetail = async (params: IntrconDetailParams): Promise<IntrconDetailRes> => {
  const res = await plantClient.get<IntrconDetailRes>('/eqpmnt/intrcon/detail', { params });
  return res.data;
};

// 계통연계설비 등록api
export const postIntrconCreate = async (body: IntrconCreateReq): Promise<IntrconCreateRes> => {
  const res = await plantClient.post<IntrconCreateRes>('/eqpmnt/intrcon/create', body);
  return res.data;
};

// 계통연계설비 수정 api
export const postIntrconUpdate = async (body: IntrconUpdateReq): Promise<IntrconUpdateRes> => {
  const res = await plantClient.post<IntrconUpdateRes>('/eqpmnt/intrcon/update', body);
  return res.data;
};

// 계통연계설비 삭제 api
export const postIntrconDelete = async (params: IntrconDeleteReq): Promise<IntrconDeleteRes> => {
  const res = await plantClient.post<IntrconDeleteRes>('/eqpmnt/intrcon/delete', null, {
    params, // ✅ query parameter 전달
  });

  return res.data;
};
