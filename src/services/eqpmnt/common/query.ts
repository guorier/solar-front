// src/services/eqpmnt/common/query.ts

import { useQuery } from '@tanstack/react-query';
import { getEqpmntList } from './request';
import type { EquipKind, EquipListParams, EquipListRes } from './type';

export function useGetEqpmntList(kind: EquipKind, params: EquipListParams) {
  return useQuery<EquipListRes>({
    queryKey: ['eqpmnt', kind, 'list', params.page, params.size],
    queryFn: () => getEqpmntList(kind, params),
    placeholderData: (prev) => prev,

    // ✅ 리스트 화면 재진입/포커스 시 최신으로 다시 가져오게
    staleTime: 0,
    refetchOnMount: 'always',
    refetchOnWindowFocus: true,
  });
}