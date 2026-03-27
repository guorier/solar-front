// src/constants/eqpmnt/intrcon/IntrconForm.tsx
'use client';

import React from 'react';

import EquipmentTable, { type MasterCode, type StructState } from './components/EquipmentTable';
import EqpmntCommonForm from '@/constants/eqpmnt/components/EqpmntCommonForm';

import {
  useGetIntrconDetail,
  usePostIntrconCreate,
  usePostIntrconUpdate,
  usePostIntrconDelete,
} from '@/services/eqpmnt/intrcon/query';
import type {
  IntrconCreateReq,
  IntrconUpdateReq,
  IntrconDeleteReq,
  IntrconDetailRes,
  IntrconDetailParams,
} from '@/services/eqpmnt/intrcon/type';

import type { PlantInfoState } from '@/constants/eqpmnt/components/BasicInfoTableBase';

type Mode = 'create' | 'edit';

type IntrconFormProps = {
  eqpmntId?: string;
  initialMode: Mode;
};

const trimText = (v: string) => v.trim();

const toTrimmedString = (v: unknown) => {
  if (v === null || v === undefined) return '';
  return trimText(String(v));
};

const STRUCT_KEYS = ['PRR', 'IFP', 'PWT', 'HVS', 'LVS', 'CCB', 'PWM', 'PQM', 'RTC', 'HAF'] as const;

const createEmptyStructState = (): StructState => ({
  PRR: '',
  IFP: '',
  PWT: '',
  HVS: '',
  LVS: '',
  CCB: '',
  PWM: '',
  PQM: '',
  RTC: '',
  HAF: '',
});

const mapStructStateToPayload = (item: {
  status: 'I' | 'U' | 'D';
  strtsSeq: number;
  value: StructState;
}) => {
  const base = {
    status: item.status,
    instlYmd: '',
    prtcRelay: toTrimmedString(item.value.PRR),
    ifPrtcEqpmnt: toTrimmedString(item.value.IFP),
    trnsfrm: toTrimmedString(item.value.PWT),
    hvSwchGear: toTrimmedString(item.value.HVS),
    lvSwchGear: toTrimmedString(item.value.LVS),
    crsnggat: toTrimmedString(item.value.CCB),
    elpwrMeter: toTrimmedString(item.value.PWM),
    elpwrQltyMeter: toTrimmedString(item.value.PQM),
    invldElpwrCmpnstr: toTrimmedString(item.value.RTC),
    emifilter: toTrimmedString(item.value.HAF),
  };

  if (item.status === 'I') {
    return base;
  }

  return {
    ...base,
    strtsSeq: item.strtsSeq,
  };
};

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
        PRR: toTrimmedString(sAny.prtcRelay),
        IFP: toTrimmedString(sAny.ifPrtcEqpmnt),
        PWT: toTrimmedString(sAny.trnsfrm),
        HVS: toTrimmedString(sAny.hvSwchGear),
        LVS: toTrimmedString(sAny.lvSwchGear),
        CCB: toTrimmedString(sAny.crsnggat),
        PWM: toTrimmedString(sAny.elpwrMeter),
        PQM: toTrimmedString(sAny.elpwrQltyMeter),
        RTC: toTrimmedString(sAny.invldElpwrCmpnstr),
        HAF: toTrimmedString(sAny.emifilter),
      },
    });
  });

  return [...groups].sort((a, b) => a.strtsSeq - b.strtsSeq);
};

const initialForm: IntrconCreateReq = {
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
}): IntrconDetailParams => {
  const pwplId = toTrimmedString(plantInfo.pwplId);
  const fallback = toTrimmedString(eqpmntId ?? '');
  const base = { eqpmntId: fallback };

  if (pwplId) {
    return { ...base, pwplId } as unknown as IntrconDetailParams;
  }

  return base as unknown as IntrconDetailParams;
};

export default function IntrconForm({ eqpmntId, initialMode }: IntrconFormProps) {
  return (
    <EqpmntCommonForm<
      IntrconCreateReq,
      IntrconUpdateReq,
      IntrconDeleteReq,
      IntrconDetailParams,
      IntrconDetailRes,
      MasterCode,
      StructState
    >
      eqpmntId={eqpmntId}
      initialMode={initialMode}
      srcTable="INT"
      listPath="/eqpmnt/intrcon"
      title="현장 설비 정보"
      subTitle="계통연계설비 등록"
      desc="발전소 현장 장비 등록 및 관리"
      detailQueryKey="getIntrconDetail"
      listInvalidateHead={'getIntrconList'}
      structKeys={STRUCT_KEYS}
      initialForm={initialForm}
      createEmptyStructState={createEmptyStructState}
      mapStructStateToPayload={mapStructStateToPayload}
      buildStructGroupsFromDetail={buildStructGroupsFromDetail}
      createDetailParams={createDetailParams}
      useDetail={useGetIntrconDetail}
      useCreate={usePostIntrconCreate}
      useUpdate={usePostIntrconUpdate}
      useDelete={usePostIntrconDelete}
      buildUpdateBody={(baseBody, targetEqpmntId) => {
        const body: IntrconUpdateReq = {
          ...baseBody,
          eqpmntId: toTrimmedString(targetEqpmntId ?? baseBody.eqpmntId),
        };
        return body;
      }}
      buildDeleteBody={(targetEqpmntId) => {
        const body: IntrconDeleteReq = { eqpmntId: targetEqpmntId };
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