// services/eqpmnt/intrcon/query.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getIntrconDetail,
  postIntrconCreate,
  postIntrconUpdate,
  postIntrconDelete,
} from './request';
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

// 계통연계설비 등록
export const usePostIntrconCreate = () => {
  return useMutation<IntrconCreateRes, Error, IntrconCreateReq>({
    mutationKey: ['postIntrconCreate'],
    mutationFn: (body) => postIntrconCreate(body),
  });
};

// 계통연계설비 상세 조회
export const useGetIntrconDetail = (params: IntrconDetailParams, enabled = true) => {
  return useQuery<IntrconDetailRes>({
    queryKey: ['intrconDetail', params.eqpmntId],
    queryFn: () => getIntrconDetail(params),
    enabled,
  });
};

// 계통연계설비 수정
export const usePostIntrconUpdate = () => {
  return useMutation<IntrconUpdateRes, Error, IntrconUpdateReq>({
    mutationKey: ['postIntrconUpdate'],
    mutationFn: (body) => postIntrconUpdate(body),
  });
};

/**
 * 계통연계설비 삭제 (POST)
 */
export const usePostIntrconDelete = () => {
  const qc = useQueryClient();

  return useMutation<IntrconDeleteRes, Error, IntrconDeleteReq>({
    mutationFn: postIntrconDelete,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['getIntrconList'] });
    },
  });
};