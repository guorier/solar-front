// src/constants/eqpmnt/common/model/equipListMapper.ts

import type { EquipListResponse } from './EquipListType';
import { formatYmdHm } from '@/utils';

function toStr(v: unknown): string {
  if (v === null || v === undefined) return '';
  if (typeof v === 'string') return v;
  if (typeof v === 'number') return String(v);
  if (typeof v === 'boolean') return String(v);
  return '';
}

function toFormattedDate(v: unknown): string {
  if (v === null || v === undefined) return '';

  if (typeof v === 'number') {
    return formatYmdHm(new Date(v).toISOString());
  }

  if (typeof v === 'string') {
    const trimmed = v.trim();
    if (!trimmed) return '';
    return formatYmdHm(trimmed);
  }

  if (v instanceof Date) {
    return formatYmdHm(v.toISOString());
  }

  return '';
}

/**
 * raw item -> EquipListResponse 로 매핑
 * - swagger별 필드명이 조금씩 달라도 여기서 흡수
 */
export function toEquipListRow(
  item: Record<string, unknown>,
  idx: number,
  page: number,
  size: number,
  plantMap: Record<string, string>,
): EquipListResponse {
  const eqpmntId = toStr(item.eqpmntId ?? item.id ?? '').trim();
  const pwplId = toStr(item.pwplId ?? '').trim();

  const mkrNm = toStr(item.manufacturer ?? item.mkrNm ?? '').trim();
  const mdlNm = toStr(item.equipModel ?? item.mdlNm ?? '').trim();
  const equipName = toStr(item.equipName ?? item.eqpmntKname ?? item.eqpmntNm ?? '').trim();

  const macAddr = toStr(item.macAddr ?? '').trim();
  const ip = toStr(item.ip ?? '').trim();

  const lnkgMthNm = toStr(item.lnkgMthNm ?? item.lnkgMth ?? '').trim();
  const eqpmntSttsNm = toStr(item.eqpmntSttsNm ?? item.eqpmntStts ?? '').trim();

  const rawRegDate = item.regisDate ?? item.regDt ?? item.regDtm;
  const regisDate = toFormattedDate(rawRegDate);

  const plantName = (plantMap[pwplId] ?? pwplId).trim();

  return {
    number: (page - 1) * size + (idx + 1),
    eqpmntId,

    equipName,
    plantName,
    manufacturer: mkrNm,
    equipModel: mdlNm,

    macAddr,
    ip,

    lnkgMthNm,
    eqpmntSttsNm,

    regisDate,
  };
}