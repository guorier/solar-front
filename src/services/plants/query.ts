// services/plant/base/query.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getPlantBaseList,
  postPlantBaseCreate,
  getPlantBaseDetail,
  postPlantBaseUpdate,
  postPlantBaseDelete,
  getPlantBaseSearchList,
  getPlantBaseCombo,
  getPlantEqpmntPop,
} from './request';
import type {
  PlantBaseListParams,
  PlantBaseCreateReq,
  PlantBaseCreateRes,
  PlantBaseDetailParams,
  PlantBaseDetailRes,
  PlantBaseUpdateReq,
  PlantBaseUpdateRes,
  PlantBaseDeleteReq,
  PlantBaseDeleteRes,
  PlantBaseListRes,
  PlantBaseComboRes,
  PlantEqpmntPopParams,
} from './type';

// 발전소 목록
export const useGetPlantBaseList = (params: PlantBaseListParams = { page: 1, size: 10 }) => {
  const page = params.page ?? 1;
  const size = params.size ?? 10;

  return useQuery({
    queryKey: ['getPlantBaseList', page, size],
    queryFn: () => getPlantBaseList({ page, size }),
    staleTime: 60 * 60 * 1000,
  });
};

// 발전소 등록
export const usePostPlantBaseCreate = () => {
  return useMutation<PlantBaseCreateRes, Error, PlantBaseCreateReq>({
    mutationKey: ['postPlantBaseCreate'],
    mutationFn: (body) => postPlantBaseCreate(body),
  });
};

// 발전소 상세 조회
export const useGetPlantBaseDetail = (params: PlantBaseDetailParams, enabled = true) => {
  return useQuery<PlantBaseDetailRes>({
    queryKey: ['plantBaseDetail', params.pwplId],
    queryFn: () => getPlantBaseDetail(params),
    enabled,
  });
};

// 발전소 수정 (PUT)
export const usePostPlantBaseUpdate = () => {
  return useMutation<PlantBaseUpdateRes, Error, PlantBaseUpdateReq>({
    mutationKey: ['postPlantBaseUpdate'],
    mutationFn: (body) => postPlantBaseUpdate(body),
  });
};

/**
 * 발전소 삭제 (POST)
 */
export const usePostPlantBaseDelete = () => {
  const qc = useQueryClient();

  return useMutation<PlantBaseDeleteRes, Error, PlantBaseDeleteReq>({
    mutationFn: postPlantBaseDelete,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['getPlantBaseList'] });
    },
  });
};

// ✅ 발전소 검색 전용
export const useGetPlantBaseSearchList = (
  pwplNm: string,
  page: number,
  size: number,
  enabled: boolean,
) => {
  return useQuery<PlantBaseListRes>({
    queryKey: ['plantBaseSearch', pwplNm, page, size],
    queryFn: () => getPlantBaseSearchList(pwplNm, page, size),
    enabled,
    placeholderData: (prev) => prev,
  });
};

export const useGetPlantBaseCombo = () => {
  return useQuery<PlantBaseComboRes>({
    queryKey: ['plantBaseCombo'],
    queryFn: getPlantBaseCombo,
  });
};

export const useGetPlantEqpmntPop = (params: PlantEqpmntPopParams, enabled: boolean) => {
  return useQuery({
    queryKey: ['plant-eqpmnt-pop', params],
    queryFn: () => getPlantEqpmntPop(params),
    enabled,
  });
};
