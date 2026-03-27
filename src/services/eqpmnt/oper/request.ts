// services/eqpmnt/oper/request.ts
import { plantClient } from '@/lib/http.lib';
import type {
  OperDetailParams,
  OperDetailRes,
  OperCreateReq,
  OperCreateRes,
  OperUpdateReq,
  OperUpdateRes,
  OperDeleteReq,
  OperDeleteRes,
} from './type';

// 상세조회
export const getOperDetail = async (params: OperDetailParams): Promise<OperDetailRes> => {
  const res = await plantClient.get<OperDetailRes>('/eqpmnt/oper/detail', { params });

  return res.data;
};

// 등록
export const postOperCreate = async (body: OperCreateReq): Promise<OperCreateRes> => {
  const res = await plantClient.post<OperCreateRes>('/eqpmnt/oper/create', body);

  return res.data;
};

// 수정
export const postOperUpdate = async (body: OperUpdateReq): Promise<OperUpdateRes> => {
  const res = await plantClient.post<OperUpdateRes>('/eqpmnt/oper/update', body);

  return res.data;
};

// 삭제
export const postOperDelete = async (params: OperDeleteReq): Promise<OperDeleteRes> => {
  const res = await plantClient.post<OperDeleteRes>('/eqpmnt/oper/delete', null, {
    params,
  });

  return res.data;
};
