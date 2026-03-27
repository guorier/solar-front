// src/constants/eqpmnt/meas/MeasForm.tsx
'use client';

import React from 'react';

import EquipmentTable, { type MasterCode, type StructState } from './components/EquipmentTable';
import EqpmntCommonForm from '@/constants/eqpmnt/components/EqpmntCommonForm';

import {
  useGetMeasDetail,
  usePostMeasCreate,
  usePostMeasUpdate,
  usePostMeasDelete,
} from '@/services/eqpmnt/meas/query';
import type {
  MeasCreateReq,
  MeasUpdateReq,
  MeasDeleteReq,
  MeasDetailRes,
  MeasDetailParams,
} from '@/services/eqpmnt/meas/type';
import type { PlantInfoState } from '@/constants/eqpmnt/components/BasicInfoTableBase';

type Mode = 'create' | 'edit';

type MeasFormProps = {
  eqpmntId?: string;
  initialMode: Mode;
};

const trimText = (v: string) => v.trim();

const toTrimmedString = (v: unknown) => {
  if (v === null || v === undefined) return '';
  return trimText(String(v));
};

const STRUCT_KEYS = ['IDS', 'TPS', 'HDS', 'WDS', 'PRE', 'ATM', 'SLS', 'WTS'] as const;

const createEmptyStructState = (): StructState => ({
  IDS: '',
  TPS: '',
  HDS: '',
  WDS: '',
  PRE: '',
  ATM: '',
  SLS: '',
  WTS: '',
});

const mapStructStateToPayload = (item: {
  status: 'I' | 'U' | 'D';
  strtsSeq: number;
  value: StructState;
}) => {
  const base = {
    status: item.status,
    instlYmd: '        ',
    srqtyMeter: toTrimmedString(item.value.IDS),
    tpMeter: toTrimmedString(item.value.TPS),
    humMeter: toTrimmedString(item.value.HDS),
    wspdMeter: toTrimmedString(item.value.WDS),
    prcpMeter: toTrimmedString(item.value.PRE),
    airqultyMeter: toTrimmedString(item.value.ATM),
    wtherObsrvnEqpmnt: toTrimmedString(item.value.WTS),
    pollutionMete: toTrimmedString(item.value.SLS),
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
        IDS: toTrimmedString(sAny.srqtyMeter),
        TPS: toTrimmedString(sAny.tpMeter),
        HDS: toTrimmedString(sAny.humMeter),
        WDS: toTrimmedString(sAny.wspdMeter),
        PRE: toTrimmedString(sAny.prcpMeter),
        ATM: toTrimmedString(sAny.airqultyMeter),
        SLS: toTrimmedString(sAny.pollutionMete),
        WTS: toTrimmedString(sAny.wtherObsrvnEqpmnt),
      },
    });
  });

  return [...groups].sort((a, b) => a.strtsSeq - b.strtsSeq);
};

const initialForm: MeasCreateReq = {
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
}): MeasDetailParams => {
  const pwplId = toTrimmedString(plantInfo.pwplId);
  const fallback = toTrimmedString(eqpmntId ?? '');
  const base = { eqpmntId: fallback };

  if (pwplId) {
    return { ...base, pwplId } as unknown as MeasDetailParams;
  }

  return base as unknown as MeasDetailParams;
};

export default function MeasForm({ eqpmntId, initialMode }: MeasFormProps) {
  return (
    <EqpmntCommonForm<
      MeasCreateReq,
      MeasUpdateReq,
      MeasDeleteReq,
      MeasDetailParams,
      MeasDetailRes,
      MasterCode,
      StructState
    >
      eqpmntId={eqpmntId}
      initialMode={initialMode}
      srcTable="MEA"
      listPath="/eqpmnt/meas"
      title="현장 설비 정보"
      subTitle="환경계측 설비 등록"
      desc="환경계측 장비 등록 및 관리"
      detailQueryKey="getMeasDetail"
      listInvalidateHead="getMeasList"
      structKeys={STRUCT_KEYS}
      initialForm={initialForm}
      createEmptyStructState={createEmptyStructState}
      mapStructStateToPayload={mapStructStateToPayload}
      buildStructGroupsFromDetail={buildStructGroupsFromDetail}
      createDetailParams={createDetailParams}
      useDetail={useGetMeasDetail}
      useCreate={usePostMeasCreate}
      useUpdate={usePostMeasUpdate}
      useDelete={usePostMeasDelete}
      buildUpdateBody={(baseBody, targetEqpmntId) => {
        const body: MeasUpdateReq = {
          ...baseBody,
          eqpmntId: toTrimmedString(targetEqpmntId ?? baseBody.eqpmntId),
        };
        return body;
      }}
      buildDeleteBody={(targetEqpmntId) => {
        const body: MeasDeleteReq = { eqpmntId: targetEqpmntId };
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