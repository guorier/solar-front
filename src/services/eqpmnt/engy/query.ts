// services/eqpmnt/engy/query.ts
import { useQuery, useMutation } from '@tanstack/react-query';
import { getEngyDetail, postEngyCreate, postEngyUpdate, postEngyDelete } from './request';
import type {
  EngyCreateReq,
  EngyUpdateReq,
  EngyDeleteReq,
  EngyCreateRes,
  EngyUpdateRes,
  EngyDeleteRes,
  EngyDetailParams,
} from './type';

// 에너지저장설비 상세 조회
export const useGetEngyDetail = (params: EngyDetailParams, enabled = true) => {
  const eqpmntId = params.eqpmntId;

  return useQuery({
    queryKey: ['getEngyDetail', eqpmntId],
    queryFn: () => getEngyDetail({ eqpmntId }),
    enabled: enabled && !!eqpmntId,
    staleTime: 60 * 60 * 1000,
  });
};

// 에너지저장설비 등록
export const usePostEngyCreate = () => {
  return useMutation<EngyCreateRes, Error, EngyCreateReq>({
    mutationKey: ['postEngyCreate'],
    mutationFn: (body) => postEngyCreate(body),
  });
};

// 에너지저장설비 수정
export const usePostEngyUpdate = () => {
  return useMutation<EngyUpdateRes, Error, EngyUpdateReq>({
    mutationKey: ['postEngyUpdate'],
    mutationFn: (body) => postEngyUpdate(body),
  });
};

// 에너지저장설비 삭제
export const usePostEngyDelete = () => {
  return useMutation<EngyDeleteRes, Error, EngyDeleteReq>({
    mutationKey: ['postEngyDelete'],
    mutationFn: (body) => postEngyDelete(body),
  });
};
