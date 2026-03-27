// services/common/code/query.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getAuthMenuTree,
  getComCodeList,
  getMenuDetail,
  getMenuGroupDetail,
  getMenuGroupList,
  getMenuList,
  getMenuTree,
  postMenuCreate,
  postMenuDelete,
  postMenuGroupSave,
  postMenuUpdate,
} from './request';
import type {
  ComCodeListReq,
  ComCodeItem,
  MenuListParams,
  MenuCreateReq,
  MenuUpdateReq,
  MenuTreeRes,
  MenuGroupListParams,
  MenuGroupSaveReq,
} from './type';

// 공통 코드
export const useGetComCodeList = (params: ComCodeListReq, enabled = false) => {
  return useQuery<ComCodeItem[]>({
    queryKey: ['getComCodeList', params.comMastrCd],
    queryFn: () => getComCodeList(params),
    enabled,
  });
};

// 메뉴 목록 파라미터 기본 값 정의
const DEFAULT_MENU_LIST_PARAMS = {
  page: 1,
  size: 10,
  menuNm: '',
};

// 메뉴 계층형 조회
export const useGetMenuTree = () => {
  return useQuery<MenuTreeRes[]>({
    queryKey: ['menu', 'tree'],
    queryFn: () => getMenuTree(),
    staleTime: 60 * 60 * 1000,
  });
};

// 메뉴 목록 조회
export const useGetMenuList = (params?: MenuListParams) => {
  const normalizedParams = {
    ...DEFAULT_MENU_LIST_PARAMS,
    ...params,
  };

  return useQuery({
    queryKey: ['menu', 'list', normalizedParams],
    queryFn: () => getMenuList(normalizedParams),
    staleTime: 60 * 60 * 1000,
  });
};

// 메뉴 상세 조회
export const useGetMenuDetail = (menuCd: string) => {
  return useQuery({
    queryKey: ['menu', 'detail', menuCd],
    queryFn: () => getMenuDetail(menuCd),
    enabled: !!menuCd,
  });
};

// 메뉴 등록
export const usePostMenuCreate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['menu', 'create'],
    mutationFn: (payload: MenuCreateReq) => postMenuCreate(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menu'] });
    },
  });
};

// 메뉴 수정
export const usePostMenuUpdate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['menu', 'update'],
    mutationFn: (payload: MenuUpdateReq) => postMenuUpdate(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menu'] });
      queryClient.invalidateQueries({ queryKey: ['auth-menu'] });
    },
  });
};

// 메뉴 삭제
export const usePostMenuDelete = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['menu', 'delete'],
    mutationFn: (menuCd: string) => postMenuDelete(menuCd),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menu'] });
      queryClient.invalidateQueries({ queryKey: ['auth-menu'] });
    },
  });
};

// 메뉴 그룹 권한 목록 조회
export const useGetMenuGroupList = (params?: MenuGroupListParams) => {
  return useQuery({
    queryKey: ['menu-group', 'list', params],
    queryFn: () => getMenuGroupList(params),
    staleTime: 60 * 60 * 1000,
  });
};

// 메뉴 그룹 권한 상세 조회
export const useGetMenuGroupDetail = (groupCd: string) => {
  return useQuery({
    queryKey: ['menu-group', 'detail', groupCd],
    queryFn: () => getMenuGroupDetail(groupCd),
    enabled: !!groupCd,
  });
};

// 메뉴 그룹 권한 저장
export const usePostMenuGroupSave = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['menu-group', 'save'],
    mutationFn: (payload: MenuGroupSaveReq) => postMenuGroupSave(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menu-group'] });
      queryClient.invalidateQueries({ queryKey: ['auth-menu'] });
    },
  });
};

// 좌측 메뉴 조회
export const useGetAuthMenuTree = (groupCd: string) => {
  return useQuery({
    queryKey: ['auth-menu', groupCd],
    queryFn: () => getAuthMenuTree(groupCd),
    enabled: !!groupCd,
  });
};
