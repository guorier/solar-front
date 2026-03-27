// services/plant/base/request.ts
import { plantClient } from '@/lib/http.lib';
import {
  PlantBaseListParams,
  PlantBaseListRes,
  PlantBaseCreateReq,
  PlantBaseCreateRes,
  PlantBaseDetailParams,
  PlantBaseDetailRes,
  PlantBaseUpdateReq,
  PlantBaseUpdateRes,
  PlantBaseDeleteReq,
  PlantBaseDeleteRes,
  PlantBaseComboRes,
  PlantEqpmntPop,
  PlantEqpmntPopParams,
} from './type';

// 발전소 목록api
export const getPlantBaseList = async (
  params: PlantBaseListParams = { page: 1, size: 10 },
): Promise<PlantBaseListRes> => {
  const res = await plantClient.get<PlantBaseListRes>('/plant/base/list', { params });
  return res.data;
};

// 발전소 등록api
export const postPlantBaseCreate = async (
  body: PlantBaseCreateReq,
): Promise<PlantBaseCreateRes> => {
  const res = await plantClient.post<PlantBaseCreateRes>('/plant/base/create', body);
  return res.data;
};

// 발전소 상세 조회 api
export const getPlantBaseDetail = async (
  params: PlantBaseDetailParams,
): Promise<PlantBaseDetailRes> => {
  const res = await plantClient.get<PlantBaseDetailRes>('/plant/base/detail', { params });
  return res.data;
};

// 발전소 수정 api
export const postPlantBaseUpdate = async (
  body: PlantBaseUpdateReq,
): Promise<PlantBaseUpdateRes> => {
  const res = await plantClient.post<PlantBaseUpdateRes>('/plant/base/update', body);
  return res.data;
};

// 발전소 삭제 api
/**
 * 발전소 기본정보 삭제
 * POST /api/plant/base/delete?pwplId={pwplId}
 */
export const postPlantBaseDelete = async (
  body: PlantBaseDeleteReq,
): Promise<PlantBaseDeleteRes> => {
  const res = await plantClient.post<PlantBaseDeleteRes>('/plant/base/delete', undefined, {
    params: {
      pwplId: body.pwplId,
    },
  });
  return res.data;
};

// ✅ 발전소 기본정보 검색 (pwplNm 기준)
export const getPlantBaseSearchList = async (pwplNm: string, page: number, size: number) => {
  const { data } = await plantClient.get('/plant/base/list', {
    params: {
      pwplNm,
      page,
      size,
    },
  });

  return data;
};

/**
 * 발전소 콤보 조회
 * GET /api/plant/base/combo
 */
export const getPlantBaseCombo = async (): Promise<PlantBaseComboRes> => {
  const res = await plantClient.get<PlantBaseComboRes>('/plant/base/combo');
  return res.data;
};

export const getPlantEqpmntPop = async (
  params: PlantEqpmntPopParams,
): Promise<PlantEqpmntPop[]> => {
  const response = await plantClient.get('/plant/base/eqpmntpop', {
    params,
  });

  return response.data as PlantEqpmntPop[];
};
