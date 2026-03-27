import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getMeasDetail, postMeasCreate, postMeasUpdate, postMeasDelete } from './request';

import type {
  MeasDetailParams,
  MeasCreateReq,
  MeasCreateRes,
  MeasUpdateReq,
  MeasUpdateRes,
  MeasDeleteReq,
  MeasDeleteRes,
  MeasDetailRes,
} from './type';

/**
 * 환경계측설비 등록
 */
export const usePostMeasCreate = () => {
  const qc = useQueryClient();

  return useMutation<MeasCreateRes, Error, MeasCreateReq>({
    mutationFn: postMeasCreate,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['getMeasList'] });
    },
  });
};

/**
 * 환경계측설비 수정
 */
export const usePostMeasUpdate = () => {
  const qc = useQueryClient();

  return useMutation<MeasUpdateRes, Error, MeasUpdateReq>({
    mutationFn: postMeasUpdate,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['getMeasList'] });
    },
  });
};

/**
 * 환경계측설비 삭제
 */
export const usePostMeasDelete = () => {
  const qc = useQueryClient();

  return useMutation<MeasDeleteRes, Error, MeasDeleteReq>({
    mutationFn: postMeasDelete,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['getMeasList'] });
    },
  });
};

/**
 * 환경계측설비 상세 조회
 */
export const useGetMeasDetail = (params: MeasDetailParams, enabled = true) => {
  return useQuery<MeasDetailRes, Error>({
    queryKey: ['getMeasDetail', params.eqpmntId],
    queryFn: () => getMeasDetail(params),
    enabled: enabled && !!params.eqpmntId,
  });
};
