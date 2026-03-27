// src/constants/eqpmnt/engy/EngyForm.tsx
'use client';

import React from 'react';

import EquipmentTable, { type MasterCode, type StructState } from './components/EquipmentTable';
import EqpmntCommonForm from '@/constants/eqpmnt/components/EqpmntCommonForm';

import {
  useGetEngyDetail,
  usePostEngyCreate,
  usePostEngyUpdate,
  usePostEngyDelete,
} from '@/services/eqpmnt/engy/query';
import type {
  EngyCreateReq,
  EngyUpdateReq,
  EngyDeleteReq,
  EngyDetailRes,
  EngyDetailParams,
} from '@/services/eqpmnt/engy/type';
import type { PlantInfoState } from '@/constants/eqpmnt/components/BasicInfoTableBase';

/* =======================================================================================
 * 타입/상수
 * ======================================================================================= */
type Mode = 'create' | 'edit';

type EngyFormProps = {
  eqpmntId?: string;
  initialMode: Mode;
};

/* =======================================================================================
 * 유틸
 * ======================================================================================= */
// 공백제거
const trimText = (v: string) => v.trim();

const toTrimmedString = (v: unknown) => {
  if (v === null || v === undefined) return '';
  return trimText(String(v));
};

/* =======================================================================================
 * 구조물 키 / 초기값
 * ======================================================================================= */
const STRUCT_KEYS = [
  'BTC',
  'BTM',
  'BTR',
  'TMM',
  'BMS',
  'FPT',
  'GDT',
  'ESP',
  'EST',
  'ESS',
  'EMS',
  'PCS',
] as const;

const createEmptyStructState = (): StructState => ({
  BTC: '',
  BTM: '',
  BTR: '',
  TMM: '',
  BMS: '',
  FPT: '',
  GDT: '',
  ESP: '',
  EST: '',
  ESS: '',
  EMS: '',
  PCS: '',
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
    instlYmd: '        ',
    bttrycell: toTrimmedString(item.value.BTC),
    bttrymdul: toTrimmedString(item.value.BTM),
    bttryrack: toTrimmedString(item.value.BTR),
    heatmngSys: toTrimmedString(item.value.TMM),
    bttryMngDbc: toTrimmedString(item.value.BMS),
    frftgDbc: toTrimmedString(item.value.FPT),
    gasDtctnDbc: toTrimmedString(item.value.GDT),
    essPrtcDbc: toTrimmedString(item.value.ESP),
    essTrnsfrm: toTrimmedString(item.value.EST),
    essSwchGear: toTrimmedString(item.value.ESS),
    enrgyMngDbc: toTrimmedString(item.value.EMS),
    elpwrTrsfDbc: toTrimmedString(item.value.PCS),
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
        BTC: toTrimmedString(sAny.bttrycell),
        BTM: toTrimmedString(sAny.bttrymdul),
        BTR: toTrimmedString(sAny.bttryrack),
        TMM: toTrimmedString(sAny.heatmngSys),
        BMS: toTrimmedString(sAny.bttryMngDbc),
        FPT: toTrimmedString(sAny.frftgDbc),
        GDT: toTrimmedString(sAny.gasDtctnDbc),
        ESP: toTrimmedString(sAny.essPrtcDbc),
        EST: toTrimmedString(sAny.essTrnsfrm),
        ESS: toTrimmedString(sAny.essSwchGear),
        EMS: toTrimmedString(sAny.enrgyMngDbc),
        PCS: toTrimmedString(sAny.elpwrTrsfDbc),
      },
    });
  });

  return [...groups].sort((a, b) => a.strtsSeq - b.strtsSeq);
};

const initialForm: EngyCreateReq = {
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
}): EngyDetailParams => {
  const pwplId = toTrimmedString(plantInfo.pwplId);
  const fallback = toTrimmedString(eqpmntId ?? '');
  const base = { eqpmntId: fallback };

  if (pwplId) {
    return { ...base, pwplId } as unknown as EngyDetailParams;
  }

  return base as unknown as EngyDetailParams;
};

export default function EngyForm({ eqpmntId, initialMode }: EngyFormProps) {
  return (
    <EqpmntCommonForm<
      EngyCreateReq,
      EngyUpdateReq,
      EngyDeleteReq,
      EngyDetailParams,
      EngyDetailRes,
      MasterCode,
      StructState
    >
      eqpmntId={eqpmntId}
      initialMode={initialMode}
      srcTable="ENG"
      listPath="/eqpmnt/engy"
      title="현장 설비 정보"
      subTitle="에너지설비 등록"
      desc="발전소 현장 장비 등록 및 관리"
      detailQueryKey="getEngyDetail"
      listInvalidateHead="getEqpmntList"
      structKeys={STRUCT_KEYS}
      initialForm={initialForm}
      createEmptyStructState={createEmptyStructState}
      mapStructStateToPayload={mapStructStateToPayload}
      buildStructGroupsFromDetail={buildStructGroupsFromDetail}
      createDetailParams={createDetailParams}
      useDetail={useGetEngyDetail}
      useCreate={usePostEngyCreate}
      useUpdate={usePostEngyUpdate}
      useDelete={usePostEngyDelete}
      buildUpdateBody={(baseBody, targetEqpmntId) => {
        const body: EngyUpdateReq = {
          ...baseBody,
          eqpmntId: toTrimmedString(targetEqpmntId ?? baseBody.eqpmntId),
        };
        return body;
      }}
      buildDeleteBody={(targetEqpmntId) => {
        const body: EngyDeleteReq = { eqpmntId: targetEqpmntId };
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