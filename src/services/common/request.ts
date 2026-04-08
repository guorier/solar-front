// services/common/code/request.ts
import { plantCommonClient } from '@/lib/http.lib';
import type {
  ComCodeItem,
  ComCodeListReq,
  FileUploadReq,
  FileUploadRes,
  MenuCreateReq,
  MenuDetailRes,
  MenuGroupDetailRes,
  MenuGroupListParams,
  MenuGroupListRes,
  MenuGroupSaveReq,
  MenuListParams,
  MenuListRes,
  MenuTreeRes,
  MenuUpdateReq,
} from './type';

// 공통코드 API
export const getComCodeList = async (params: ComCodeListReq): Promise<ComCodeItem[]> => {
  const res = await plantCommonClient.get<ComCodeItem[]>('/code/list', { params });
  return res.data;
};

// 메뉴 계층형 조회 API
export const getMenuTree = async (): Promise<MenuTreeRes[]> => {
  const { data } = await plantCommonClient.get<MenuTreeRes[]>('/menu/tree');
  return data;
};

// 메뉴 목록 조회 API
export const getMenuList = async (params?: MenuListParams): Promise<MenuListRes> => {
  const { data } = await plantCommonClient.get<MenuListRes>('/menu/list', { params });
  return data;
};

// 메뉴 상세 조회 API
export const getMenuDetail = async (menuCd: string): Promise<MenuDetailRes> => {
  const { data } = await plantCommonClient.get<MenuDetailRes>('/menu/detail', {
    params: { menuCd },
  });
  return data;
};

// 메뉴 등록 API
export const postMenuCreate = async (payload: MenuCreateReq) => {
  const { data } = await plantCommonClient.post('/menu/create', payload);
  return data;
};

// 메뉴 수정 API
export const postMenuUpdate = async (payload: MenuUpdateReq) => {
  const { data } = await plantCommonClient.post('/menu/update', payload);
  return data;
};

// 메뉴 삭제 API
export const postMenuDelete = async (menuCd: string) => {
  const { data } = await plantCommonClient.post('/menu/delete', { menuCd });
  return data;
};

// 메뉴 그룹 권한 목록 조회 API
export const getMenuGroupList = async (params?: MenuGroupListParams): Promise<MenuGroupListRes> => {
  const { data } = await plantCommonClient.get<MenuGroupListRes>('/menu-group/list', { params });
  return data;
};

// 메뉴 그룹 권한 상세 조회 API
export const getMenuGroupDetail = async (groupCd: string): Promise<MenuGroupDetailRes> => {
  const { data } = await plantCommonClient.get<MenuGroupDetailRes>('/menu-group/detail', {
    params: { groupCd },
  });
  return data;
};

// 메뉴 그룹 권한 저장 API
export const postMenuGroupSave = async (payload: MenuGroupSaveReq): Promise<MenuGroupDetailRes> => {
  const { data } = await plantCommonClient.post<MenuGroupDetailRes>('/menu-group/save', payload);
  return data;
};

// 좌측 메뉴 조회 API
export const getAuthMenuTree = async (groupCd: string): Promise<MenuTreeRes[]> => {
  const { data } = await plantCommonClient.get<MenuTreeRes[]>('/auth/menu-tree', {
    params: { groupCd },
  });
  return data;
};

// 파일 업로드 API
export const postFileUpload = async ({ file, ...params }: FileUploadReq): Promise<FileUploadRes> => {
  const formData = new FormData();
  formData.append('file', file);
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      formData.append(key, String(value));
    }
  });
  const { data } = await plantCommonClient.post<FileUploadRes>('/file/upload', formData);
  return data;
};
