// src/constants/eqpmnt/oper/OperForm.tsx
'use client';

import React from 'react';

import EquipmentTable, { type MasterCode, type StructState } from './components/EquipmentTable';
import EqpmntCommonForm from '@/constants/eqpmnt/components/EqpmntCommonForm';

import {
  useGetOperDetail,
  usePostOperCreate,
  usePostOperUpdate,
  usePostOperDelete,
} from '@/services/eqpmnt/oper/query';
import type {
  OperCreateReq,
  OperUpdateReq,
  OperDeleteReq,
  OperDetailRes,
  OperDetailParams,
} from '@/services/eqpmnt/oper/type';
import type { PlantInfoState } from '@/constants/eqpmnt/components/BasicInfoTableBase';

type Mode = 'create' | 'edit';

type OperFormProps = {
  eqpmntId?: string;
  initialMode: Mode;
};

const trimText = (v: string) => v.trim();

const toTrimmedString = (v: unknown) => {
  if (v === null || v === undefined) return '';
  return trimText(String(v));
};

const STRUCT_KEYS = [
  'RTU',
  'CTD',
  'GAT',
  'HMI',
  'INS',
  'ICF',
  'RCA',
  'SRC',
  'OPS',
  'DTS',
  'MGS',
  'UPS',
  'PWS',
  'TMS',
  'LCC',
  'RMC',
  'MTN',
  'RMA',
  'OPM',
] as const;

const createEmptyStructState = (): StructState => ({
  RTU: '',
  CTD: '',
  GAT: '',
  HMI: '',
  INS: '',
  ICF: '',
  RCA: '',
  SRC: '',
  OPS: '',
  DTS: '',
  MGS: '',
  UPS: '',
  PWS: '',
  TMS: '',
  LCC: '',
  RMC: '',
  MTN: '',
  RMA: '',
  OPM: '',
});

const mapStructStateToPayload = (item: {
  status: 'I' | 'U' | 'D';
  strtsSeq: number;
  value: StructState;
}) => {
  const base = {
    status: item.status,
    instlYmd: '        ',
    rmotTrmnlDbc: toTrimmedString(item.value.RTU),
    ctrlDbc: toTrimmedString(item.value.CTD),
    gatewy: toTrimmedString(item.value.GAT),
    operIfDbc: toTrimmedString(item.value.HMI),
    chckDbc: toTrimmedString(item.value.INS),
    prmsCommDbc: toTrimmedString(item.value.ICF),
    rmotCommDbc: toTrimmedString(item.value.RCA),
    jbsrsCommDbc: toTrimmedString(item.value.SRC),
    operSrvrDbc: toTrimmedString(item.value.OPS),
    dataSrvrDbc: toTrimmedString(item.value.DTS),
    mngSrvrDbc: toTrimmedString(item.value.MGS),
    unpwPowrDbc: toTrimmedString(item.value.UPS),
    powrSplyDbc: toTrimmedString(item.value.PWS),
    hrSyncDbc: toTrimmedString(item.value.TMS),
    lcalCtrlDbc: toTrimmedString(item.value.LCC),
    rmotCtrlDbc: toTrimmedString(item.value.RMC),
    mntnCntn: toTrimmedString(item.value.MTN),
    rmotCntnDbc: toTrimmedString(item.value.RMA),
    operMeasDbc: toTrimmedString(item.value.OPM),
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
        RTU: toTrimmedString(sAny.rmotTrmnlDbc),
        CTD: toTrimmedString(sAny.ctrlDbc),
        GAT: toTrimmedString(sAny.gatewy),
        HMI: toTrimmedString(sAny.operIfDbc),
        INS: toTrimmedString(sAny.chckDbc),
        ICF: toTrimmedString(sAny.prmsCommDbc),
        RCA: toTrimmedString(sAny.rmotCommDbc),
        SRC: toTrimmedString(sAny.jbsrsCommDbc),
        OPS: toTrimmedString(sAny.operSrvrDbc),
        DTS: toTrimmedString(sAny.dataSrvrDbc),
        MGS: toTrimmedString(sAny.mngSrvrDbc),
        UPS: toTrimmedString(sAny.unpwPowrDbc),
        PWS: toTrimmedString(sAny.powrSplyDbc),
        TMS: toTrimmedString(sAny.hrSyncDbc),
        LCC: toTrimmedString(sAny.lcalCtrlDbc),
        RMC: toTrimmedString(sAny.rmotCtrlDbc),
        MTN: toTrimmedString(sAny.mntnCntn),
        RMA: toTrimmedString(sAny.rmotCntnDbc),
        OPM: toTrimmedString(sAny.operMeasDbc),
      },
    });
  });

  return [...groups].sort((a, b) => a.strtsSeq - b.strtsSeq);
};

const initialForm: OperCreateReq = {
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
}): OperDetailParams => {
  const pwplId = toTrimmedString(plantInfo.pwplId);
  const fallback = toTrimmedString(eqpmntId ?? '');
  const base = { eqpmntId: fallback };

  if (pwplId) {
    return { ...base, pwplId } as unknown as OperDetailParams;
  }

  return base as unknown as OperDetailParams;
};

export default function OperForm({ eqpmntId, initialMode }: OperFormProps) {
  return (
    <EqpmntCommonForm<
      OperCreateReq,
      OperUpdateReq,
      OperDeleteReq,
      OperDetailParams,
      OperDetailRes,
      MasterCode,
      StructState
    >
      eqpmntId={eqpmntId}
      initialMode={initialMode}
      srcTable="OPE"
      listPath="/eqpmnt/oper"
      title="현장 설비 정보"
      subTitle="운영 관리 등록"
      desc="발전소 현장 장비 등록 및 관리"
      detailQueryKey="getOperDetail"
      listInvalidateHead="getOperList"
      structKeys={STRUCT_KEYS}
      initialForm={initialForm}
      createEmptyStructState={createEmptyStructState}
      mapStructStateToPayload={mapStructStateToPayload}
      buildStructGroupsFromDetail={buildStructGroupsFromDetail}
      createDetailParams={createDetailParams}
      useDetail={useGetOperDetail}
      useCreate={usePostOperCreate}
      useUpdate={usePostOperUpdate}
      useDelete={usePostOperDelete}
      buildUpdateBody={(baseBody, targetEqpmntId) => {
        const body: OperUpdateReq = {
          ...baseBody,
          eqpmntId: toTrimmedString(targetEqpmntId ?? baseBody.eqpmntId),
        };
        return body;
      }}
      buildDeleteBody={(targetEqpmntId) => {
        const body: OperDeleteReq = { eqpmntId: targetEqpmntId };
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
