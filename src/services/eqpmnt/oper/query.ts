// services/eqpmnt/oper/query.ts
import { useQuery, useMutation } from '@tanstack/react-query';
import {
  getOperDetail,
  postOperCreate,
  postOperUpdate,
  postOperDelete,
} from './request';

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
export const useGetOperDetail = (
  params: OperDetailParams,
  enabled = true,
) => {
  return useQuery<OperDetailRes>({
    queryKey: ['operDetail', params.eqpmntId],
    queryFn: () => getOperDetail(params),
    enabled,
  });
};

// 등록
export const usePostOperCreate = () => {
  return useMutation<OperCreateRes, Error, OperCreateReq>({
    mutationKey: ['postOperCreate'],
    mutationFn: postOperCreate,
  });
};

// 수정
export const usePostOperUpdate = () => {
  return useMutation<OperUpdateRes, Error, OperUpdateReq>({
    mutationKey: ['postOperUpdate'],
    mutationFn: postOperUpdate,
  });
};

// 삭제
export const usePostOperDelete = () => {
  return useMutation<OperDeleteRes, Error, OperDeleteReq>({
    mutationFn: postOperDelete,
  });
};