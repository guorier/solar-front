// src/services/eqpmnt/safety/query.ts

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getSafetyDetail, postSafetyCreate, postSafetyUpdate, postSafetyDelete } from './request';

import type {
  SafetyCreateReq,
  SafetyCreateRes,
  SafetyUpdateReq,
  SafetyUpdateRes,
  SafetyDeleteReq,
  SafetyDeleteRes,
  SafetyDetailParams,
  SafetyDetailRes,
} from './type';

/**
 * 보안방재설비 등록
 */
export const usePostSafetyCreate = () => {
  const qc = useQueryClient();

  return useMutation<SafetyCreateRes, Error, SafetyCreateReq>({
    mutationFn: postSafetyCreate,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['getSafetyDetail'] });
    },
  });
};

/**
 * 보안방재설비 수정
 */
export const usePostSafetyUpdate = () => {
  const qc = useQueryClient();

  return useMutation<SafetyUpdateRes, Error, SafetyUpdateReq>({
    mutationFn: postSafetyUpdate,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['getSafetyDetail'] });
    },
  });
};

/**
 * 보안방재설비 삭제 (쿼리 파라미터)
 */
export const usePostSafetyDelete = () => {
  const qc = useQueryClient();

  return useMutation<SafetyDeleteRes, Error, SafetyDeleteReq>({
    mutationFn: postSafetyDelete,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['getSafetyDetail'] });
    },
  });
};

/**
 * 보안방재설비 상세 조회
 */
export const useGetSafetyDetail = (params: SafetyDetailParams, enabled = true) => {
  return useQuery<SafetyDetailRes, Error>({
    queryKey: ['getSafetyDetail', params.eqpmntId],
    queryFn: () => getSafetyDetail(params),
    enabled: enabled && !!params.eqpmntId,
  });
};