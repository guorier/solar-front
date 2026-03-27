// src/constants/eqpmnt/safety/SafetyForm.tsx
'use client';

import React from 'react';

import EquipmentTable, { type MasterCode, type StructState } from './components/EquipmentTable';
import EqpmntCommonForm from '@/constants/eqpmnt/components/EqpmntCommonForm';

import {
  useGetSafetyDetail,
  usePostSafetyCreate,
  usePostSafetyUpdate,
  usePostSafetyDelete,
} from '@/services/eqpmnt/safety/query';
import type {
  SafetyCreateReq,
  SafetyUpdateReq,
  SafetyDeleteReq,
  SafetyDetailRes,
  SafetyDetailParams,
} from '@/services/eqpmnt/safety/type';
import type { PlantInfoState } from '@/constants/eqpmnt/components/BasicInfoTableBase';

type Mode = 'create' | 'edit';

type SafetyFormProps = {
  eqpmntId?: string;
  initialMode: Mode;
};

/* =======================================================================================
 * 유틸
 * ======================================================================================= */
const trimText = (v: string) => v.trim();

const toTrimmedString = (v: unknown) => {
  if (v === null || v === undefined) return '';
  return trimText(String(v));
};

/* =======================================================================================
 * 구조물 키 / 초기값
 * ======================================================================================= */
const STRUCT_KEYS = ['VDS', 'ITD', 'ACC', 'ALD', 'FDT', 'FSP', 'WDT', 'EMD', 'SGP', 'LTP'] as const;

const createEmptyStructState = (): StructState => ({
  VDS: '',
  ITD: '',
  ACC: '',
  ALD: '',
  FDT: '',
  FSP: '',
  WDT: '',
  EMD: '',
  SGP: '',
  LTP: '',
});

/* =======================================================================================
 * payload 변환
 * ======================================================================================= */
const mapStructStateToPayload = (item: {
  status: 'I' | 'U' | 'D';
  strtsSeq: number;
  value: StructState;
}) => {
  const base = {
    status: item.status,
    instlYmd: '',
    vdoSurvlnDbc: toTrimmedString(item.value.VDS), // 영상감시장치
    intrsnDtctnDbc: toTrimmedString(item.value.ITD), // 침입감시장치
    enexCntrlDbc: toTrimmedString(item.value.ACC), // 출입통제장치
    alarmDbc: toTrimmedString(item.value.ALD), // 경보장치
    fireSurvlnDbc: toTrimmedString(item.value.FDT), // 화재감시장치
    firsupDbc: toTrimmedString(item.value.FSP), // 소방설비
    flodngDtctnDbc: toTrimmedString(item.value.WDT), // 침수감시장치
    emgncyDbc: toTrimmedString(item.value.EMD), // 비상설비
    surgePrtcEqpmnt: toTrimmedString(item.value.SGP), // 서지보호장치
    lgthprtEqpm: toTrimmedString(item.value.LTP), // 피뢰설비
  };

  if (item.status === 'I') {
    return base;
  }

  return {
    ...base,
    strtsSeq: item.strtsSeq,
  };
};

/* =======================================================================================
 * 상세조회
 * ======================================================================================= */
const buildStructGroupsFromDetail = (raw: unknown) => {
  const list = (raw as unknown[]) ?? [];
  const groups: { strtsSeq: number; value: StructState }[] = [];

  list.forEach((s) => {
    const sAny = s as Record<string, unknown>;
    const seq = Number(sAny.strtsSeq ?? 0);
    if (seq < 0) return;

    groups.push({
      strtsSeq: seq,
      value: {
        VDS: toTrimmedString(sAny.vdoSurvlnDbc),
        ITD: toTrimmedString(sAny.intrsnDtctnDbc),
        ACC: toTrimmedString(sAny.enexCntrlDbc),
        ALD: toTrimmedString(sAny.alarmDbc),
        FDT: toTrimmedString(sAny.fireSurvlnDbc),
        FSP: toTrimmedString(sAny.firsupDbc),
        WDT: toTrimmedString(sAny.flodngDtctnDbc),
        EMD: toTrimmedString(sAny.emgncyDbc),
        SGP: toTrimmedString(sAny.surgePrtcEqpmnt),
        LTP: toTrimmedString(sAny.lgthprtEqpm),
      },
    });
  });

  return [...groups].sort((a, b) => a.strtsSeq - b.strtsSeq);
};

const initialForm: SafetyCreateReq = {
    eqpmntId: '',
    pwplId: '',
    mkrNm: '',
    mdlNm: '',
    serialNo: '',
    eqpmntKname: '',
    ip: '',
    macAddr: '',
    lnkgMth: '',
    commProtocol: '',
    eqpmntStts: '',
    eqpmntVer: '',
    bldrNm: '',
    bldrCnpl: '',
    mngrNm: '',
    mngrCnpl: '',
    optrNm: '',
    optrCnpl: '',
    assoptrNm: '',
    assoptrCnpl: '',
    memo: '',
    delYn: 'N',
    rgtrId: '',
    regDt: '',
    mdfrId: '',
    mdfcnDt: '',
    structs: [],
};

const createDetailParams = ({
  plantInfo,
  eqpmntId,
}: {
  plantInfo: PlantInfoState;
  eqpmntId?: string;
}): SafetyDetailParams => {
    const pwplId = toTrimmedString(plantInfo.pwplId);
    const fallback = toTrimmedString(eqpmntId ?? '');
    const base = { eqpmntId: fallback };

    if (pwplId) {
      return { ...base, pwplId } as unknown as SafetyDetailParams;
    }

    return base as unknown as SafetyDetailParams;
};

export default function SafetyForm({ eqpmntId, initialMode }: SafetyFormProps) {
  return (
    <EqpmntCommonForm<
      SafetyCreateReq,
      SafetyUpdateReq,
      SafetyDeleteReq,
      SafetyDetailParams,
      SafetyDetailRes,
      MasterCode,
      StructState
    >
      eqpmntId={eqpmntId}
      initialMode={initialMode}
      srcTable="SAF"
      listPath="/eqpmnt/safety"
          title="현장 설비 정보"
          subTitle="보안·방재설비 등록"
          desc="발전소 현장 장비 등록 및 관리"
      detailQueryKey="getSafetyDetail"
      listInvalidateHead="getSafetyList"
      structKeys={STRUCT_KEYS}
      initialForm={initialForm}
      createEmptyStructState={createEmptyStructState}
      mapStructStateToPayload={mapStructStateToPayload}
      buildStructGroupsFromDetail={buildStructGroupsFromDetail}
      createDetailParams={createDetailParams}
      useDetail={useGetSafetyDetail}
      useCreate={usePostSafetyCreate}
      useUpdate={usePostSafetyUpdate}
      useDelete={usePostSafetyDelete}
      buildUpdateBody={(baseBody, targetEqpmntId) => {
        const body: SafetyUpdateReq = {
          ...baseBody,
          eqpmntId: toTrimmedString(targetEqpmntId ?? baseBody.eqpmntId),
        };
        return body;
      }}
      buildDeleteBody={(targetEqpmntId) => {
        const body: SafetyDeleteReq = { eqpmntId: targetEqpmntId };
        return body;
      }}
      renderStructTable={({ item, index, setStructValue, addStructGroup, removeStructGroup }) => {
        return (
                <EquipmentTable
                  value={item.value}
                  onChange={(key: MasterCode, value: string) => {
                    setStructValue(index, key, value);
                  }}
                  onAdd={addStructGroup}
                  onRemove={() => removeStructGroup(index)}
                  count={index}
                />
        );
        }}
      />
  );
}