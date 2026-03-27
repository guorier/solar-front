// equipment/strct/query.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getStrctList,
  getStrctDetail,
  postStrctCreate,
  postStrctUpdate,
  postStrctDelete,
} from './request';
import type {
  StrctCreateReq,
  StrctCreateRes,
  StrctDetailParams,
  StrctListParams,
  StrctUpdateReq,
  StrctUpdateRes,
  StrctDeleteReq,
  StrctDeleteRes,
} from './type';

/**
 * 발전소구조설비 목록 조회 Query
 */
export const useGetStrctList = (params: StrctListParams) => {
  const page = params.page ?? 1;
  const size = params.size ?? 10;

  return useQuery({
    queryKey: ['getStrctList', page, size],
    queryFn: () => getStrctList({ page, size }),
    staleTime: 60 * 60 * 1000,
  });
};

/**
 * 발전소구조설비 상세 조회 Query
 */
export const useGetStrctDetail = (params: StrctDetailParams, enabled = true) => {
  return useQuery({
    queryKey: ['getStrctDetail', params.eqpmntId],
    queryFn: () => getStrctDetail(params),
    staleTime: 60 * 60 * 1000,
    enabled: enabled && !!params.eqpmntId,
  });
};

/**
 * 발전소구조설비 등록 Mutation
 */
export const usePostStrctCreate = () => {
  const qc = useQueryClient();

  return useMutation<StrctCreateRes, Error, StrctCreateReq>({
    mutationFn: postStrctCreate,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['getStrctList'] });
    },
  });
};

/**
 * 발전소구조설비 수정 Mutation
 */
export const usePostStrctUpdate = () => {
  const qc = useQueryClient();

  return useMutation<StrctUpdateRes, Error, StrctUpdateReq>({
    mutationFn: postStrctUpdate,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['getStrctList'] });
    },
  });
};

/**
 * 발전소구조설비 삭제 Mutation
 */
export const usePostStrctDelete = () => {
  const qc = useQueryClient();

  return useMutation<StrctDeleteRes, Error, StrctDeleteReq>({
    mutationFn: postStrctDelete,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['getStrctList'] });
    },
  });
};
