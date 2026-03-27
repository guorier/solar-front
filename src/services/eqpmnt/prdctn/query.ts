// src/services/eqpmnt/prdctn/query.ts

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getPrdctnDetail, postPrdctnCreate, postPrdctnDelete, postPrdctnUpdate } from './request';
import type {
  PrdctnCreateReq,
  PrdctnCreateRes,
  PrdctnDeleteReq,
  PrdctnDeleteRes,
  PrdctnDetailParams,
  PrdctnDetailRes,
  PrdctnUpdateReq,
  PrdctnUpdateRes,
} from './type';

/**
 * 발전생산설비 등록 Mutation
 */
export const usePostPrdctnCreate = () => {
  const qc = useQueryClient();

  return useMutation<PrdctnCreateRes, Error, PrdctnCreateReq>({
    mutationFn: postPrdctnCreate,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['getPrdctnList'] });
    },
  });
};

/**
 * 발전생산설비 수정 Mutation
 */
export const usePostPrdctnUpdate = () => {
  const qc = useQueryClient();

  return useMutation<PrdctnUpdateRes, Error, PrdctnUpdateReq>({
    mutationFn: postPrdctnUpdate,
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: ['getPrdctnList'] });
      qc.invalidateQueries({ queryKey: ['getPrdctnDetail', variables.eqpmntId] });
    },
  });
};

/**
 * 발전생산설비 삭제 Mutation
 */
export const usePostPrdctnDelete = () => {
  const qc = useQueryClient();

  return useMutation<PrdctnDeleteRes, Error, PrdctnDeleteReq>({
    mutationFn: postPrdctnDelete,
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: ['getPrdctnList'] });
      qc.invalidateQueries({ queryKey: ['getPrdctnDetail', variables.eqpmntId] });
    },
  });
};

/**
 * 발전생산설비 상세 조회 Query
 */
export const useGetPrdctnDetail = (params: PrdctnDetailParams, enabled = true) => {
  return useQuery<PrdctnDetailRes, Error>({
    queryKey: ['getPrdctnDetail', params.eqpmntId],
    queryFn: () => getPrdctnDetail(params),
    enabled: enabled && !!params.eqpmntId,
  });
};
