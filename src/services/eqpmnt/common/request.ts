// src/services/eqpmnt/common/request.ts

import type { EquipKind, EquipListParams, EquipListRes } from './type';
import { plantClient } from '@/lib/http.lib';
/**
 * 공통 장비 목록 조회
 * - endpoint: /api/eqpmnt/{kind}/list
 * - 프로젝트의 기존 apiClient/axios 래퍼가 있으면 거기에 맞춰 교체
 */
export async function getEqpmntList(kind: EquipKind, params: EquipListParams): Promise<EquipListRes> {
  const q = new URLSearchParams({
    page: String(params.page),
    size: String(params.size),
  }).toString();

  const res = await plantClient.get<Record<string, unknown>>(`/eqpmnt/${kind}/list?${q}`);

  const obj = (res.data ?? {}) as Record<string, unknown>;
  const total = Number(obj.total ?? 0);
  const items = (obj.items ?? []) as unknown[];

  return {
    total: Number.isNaN(total) ? 0 : total,
    items: items.filter(Boolean) as Record<string, unknown>[],
  };
}