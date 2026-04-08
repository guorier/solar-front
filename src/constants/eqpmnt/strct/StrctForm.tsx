// src/constants/eqpmnt/strct/StrctForm.tsx
'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { AxiosError } from 'axios';

import { ButtonComponent, Icons, TitleComponent, BottomGroupComponent } from '@/components';
import { ModalPlantSearch } from '@/constants/eqpmnt/components/ModalPlantSearch';
import { Group } from 'react-aria-components';

import type { PlantEqpmntPop } from '@/services/plants/type';

import BasicInfoTableBase, {
  type PlantInfoState,
} from '@/constants/eqpmnt/components/BasicInfoTableBase';
import EquipmentTable, { type MasterCode, type StructState } from './components/EquipmentTable';
import ExtraInfoTableBase from '@/constants/eqpmnt/components/ExtraInfoTableBase';

// 공통 hook 추가
import { useEqpmntFormBase } from '@/constants/eqpmnt/components/useEqpmntFormBase';

import { useGetPlantBaseDetail } from '@/services/plants/query';
import {
  useGetStrctDetail,
  usePostStrctCreate,
  usePostStrctUpdate,
  usePostStrctDelete,
} from '@/services/eqpmnt/strct/query';
import type {
  StrctCreateReq,
  StrctUpdateReq,
  StrctDeleteReq,
  StrctDetailRes,
  StrctDetailParams,
} from '@/services/eqpmnt/strct/type';

/* =======================================================================================
 * 타입/상수
 * ======================================================================================= */
type ApiErrorBody = { message?: string };
type Mode = 'create' | 'edit';

type StrctFormProps = {
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
const STRUCT_KEYS = [
  'BUI',
  'MOU',
  'FOU',
  'ANC',
  'BRE',
  'LIG',
  'EME',
  'ELR',
  'CTL',
  'TRA',
  'DIF',
] as const;

const createEmptyStructState = (): StructState => ({
  BUI: '',
  MOU: '',
  FOU: '',
  ANC: '',
  BRE: '',
  LIG: '',
  EME: '',
  ELR: '',
  CTL: '',
  TRA: '',
  DIF: '',
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
    archMainfrm: toTrimmedString(item.value.BUI),
    mdulEqpm: toTrimmedString(item.value.MOU),
    bscsStrts: toTrimmedString(item.value.FOU),
    sbsdDbc: toTrimmedString(item.value.ANC),
    crsnggatDbc: toTrimmedString(item.value.BRE),
    lightngDbc: toTrimmedString(item.value.LIG),
    emgncyPowrDbc: toTrimmedString(item.value.EME),
    elcegrm: toTrimmedString(item.value.ELR),
    centrlCtrlrm: toTrimmedString(item.value.CTL),
    trckr: toTrimmedString(item.value.TRA),
    enexdor: toTrimmedString(item.value.DIF),
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
        BUI: toTrimmedString(sAny.archMainfrm),
        MOU: toTrimmedString(sAny.mdulEqpm),
        FOU: toTrimmedString(sAny.bscsStrts),
        ANC: toTrimmedString(sAny.sbsdDbc),
        BRE: toTrimmedString(sAny.crsnggatDbc),
        LIG: toTrimmedString(sAny.lightngDbc),
        EME: toTrimmedString(sAny.emgncyPowrDbc),
        ELR: toTrimmedString(sAny.elcegrm),
        CTL: toTrimmedString(sAny.centrlCtrlrm),
        TRA: toTrimmedString(sAny.trckr),
        DIF: toTrimmedString(sAny.enexdor),
      },
    });
  });

  return [...groups].sort((a, b) => a.strtsSeq - b.strtsSeq);
};

export default function InfoPage({ eqpmntId, initialMode }: StrctFormProps) {
  /* =====================================================================================
   * 1️⃣ 기본 훅
   * ===================================================================================== */
  const router = useRouter();
  const qc = useQueryClient();
  const [mode] = useState<Mode>(initialMode);
  const SRC_TABLE = 'STR';

  /* =====================================================================================
   * 2️⃣ 상태 관리
   * ===================================================================================== */
  const [isPlantModalOpen, setIsPlantModalOpen] = useState(false);

  const [plantInfo, setPlantInfo] = useState<PlantInfoState>({
    pwplId: '',
    pwplNm: '',
    lctnZip: '',
    roadNmAddr: '',
    lctnLotnoAddr: '',
    lctnDtlAddr: '',
    macAddr: '',
  });

  const [form, setForm] = useState<StrctCreateReq>({
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
  });

  /* =====================================================================================
   * 3️⃣ 데이터 관련 훅
   * ===================================================================================== */
  // 공통 hook 사용
  const {
    structList,
    setStructList,
    // activeStructIndex,
    setActiveStructIndex,
    addStructGroup,
    removeStructGroup,
    setStructValue: setStructValueBase,
    buildStructs: buildStructsBase,
  } = useEqpmntFormBase<StructState>(mode, createEmptyStructState);

  const validStructKeySet = useMemo(() => new Set<string>(STRUCT_KEYS as unknown as string[]), []);

  const detailParams = useMemo(() => {
    const pwplId = toTrimmedString(plantInfo.pwplId);
    const fallback = toTrimmedString(eqpmntId ?? '');
    const base = { eqpmntId: fallback };

    if (pwplId) {
      return { ...base, pwplId } as unknown as StrctDetailParams;
    }
    return base as unknown as StrctDetailParams;
  }, [plantInfo.pwplId, eqpmntId]);

  const detailQuery = useGetStrctDetail(detailParams, mode === 'edit' && Boolean(eqpmntId));
  const plantDetailQuery = useGetPlantBaseDetail({ pwplId: plantInfo.pwplId }, !!plantInfo.pwplId);

  const createMutation = usePostStrctCreate();
  const updateMutation = usePostStrctUpdate();
  const deleteMutation = usePostStrctDelete();

  const isLoading =
    (mode === 'edit' ? detailQuery.isFetching : false) ||
    createMutation.isPending ||
    updateMutation.isPending ||
    deleteMutation.isPending;

  /* =====================================================================================
   * 4️⃣ 사이드이펙트
   * ===================================================================================== */
  useEffect(() => {
    if (mode !== 'edit') return;
    if (!eqpmntId && !plantInfo.pwplId) return;
    if (!detailQuery.data) return;

    const d = detailQuery.data as unknown as StrctDetailRes;
    const dAny = d as Record<string, unknown>;

    setPlantInfo({
      pwplId: toTrimmedString(dAny.pwplId),
      pwplNm: toTrimmedString(dAny.pwplNm),
      lctnZip: toTrimmedString(dAny.lctnZip),
      roadNmAddr: toTrimmedString(dAny.roadNmAddr),
      lctnLotnoAddr: toTrimmedString(dAny.lctnLotnoAddr),
      lctnDtlAddr: toTrimmedString(dAny.lctnDtlAddr),
      macAddr: toTrimmedString(dAny.macAddr),
    });

    setForm((prev) => ({
      ...prev,
      eqpmntId: toTrimmedString(dAny.eqpmntId ?? prev.eqpmntId),
      pwplId: toTrimmedString(dAny.pwplId ?? prev.pwplId),
      mkrNm: (dAny.mkrNm as string | undefined) ?? prev.mkrNm,
      mdlNm: (dAny.mdlNm as string | undefined) ?? prev.mdlNm,
      serialNo: (dAny.serialNo as string | undefined) ?? prev.serialNo,
      eqpmntKname: (dAny.eqpmntKname as string | undefined) ?? prev.eqpmntKname,
      ip: (dAny.ip as string | undefined) ?? prev.ip,
      macAddr: (dAny.macAddr as string | undefined) ?? prev.macAddr,
      lnkgMth: toTrimmedString(dAny.lnkgMth ?? prev.lnkgMth),
      commProtocol: toTrimmedString(dAny.commProtocol ?? prev.commProtocol),
      eqpmntVer: toTrimmedString(dAny.eqpmntVer ?? prev.eqpmntVer),
      eqpmntStts: toTrimmedString(dAny.eqpmntStts ?? prev.eqpmntStts),
      bldrNm: (dAny.bldrNm as string | undefined) ?? prev.bldrNm,
      bldrCnpl: (dAny.bldrCnpl as string | undefined) ?? prev.bldrCnpl,
      mngrNm: (dAny.mngrNm as string | undefined) ?? prev.mngrNm,
      mngrCnpl: (dAny.mngrCnpl as string | undefined) ?? prev.mngrCnpl,
      optrNm: (dAny.optrNm as string | undefined) ?? prev.optrNm,
      optrCnpl: (dAny.optrCnpl as string | undefined) ?? prev.optrCnpl,
      assoptrNm: (dAny.assoptrNm as string | undefined) ?? prev.assoptrNm,
      assoptrCnpl: (dAny.assoptrCnpl as string | undefined) ?? prev.assoptrCnpl,
      memo: (dAny.memo as string | undefined) ?? prev.memo,
      delYn: (dAny.delYn as string | undefined) ?? prev.delYn,
      rgtrId: (dAny.rgtrId as string | undefined) ?? prev.rgtrId,
      regDt: (dAny.regDt as string | undefined) ?? prev.regDt,
      mdfrId: (dAny.mdfrId as string | undefined) ?? prev.mdfrId,
      mdfcnDt: (dAny.mdfcnDt as string | undefined) ?? prev.mdfcnDt,
      structs: ((dAny.structures as unknown) ?? prev.structs) as StrctCreateReq['structs'],
    }));

    setStructList((prev) => {
      const nextList = [...prev];
      const groups = buildStructGroupsFromDetail(dAny.structures);
      if (groups.length === 0) return nextList;

      setActiveStructIndex(0);

      return groups.map((g) => {
        return {
          status: 'U',
          strtsSeq: g.strtsSeq,
          value: g.value,
        };
      });
    });
  }, [mode, eqpmntId, plantInfo.pwplId, detailQuery.data, setStructList, setActiveStructIndex]);

  useEffect(() => {
    if (!plantDetailQuery.data) return;
    const p = plantDetailQuery.data;
    setPlantInfo((prev) => ({
      ...prev,
      pwplNm: p.pwplNm ?? '',
      lctnZip: p.lctnZip ?? '',
      roadNmAddr: p.roadNmAddr ?? '',
      lctnLotnoAddr: p.lctnLotnoAddr ?? '',
      lctnDtlAddr: p.lctnDtlAddr ?? '',
    }));
  }, [plantDetailQuery.data, plantInfo.pwplId]);

  useEffect(() => {
    setForm((prev) => {
      const nextPwplId = toTrimmedString(plantInfo.pwplId);
      const nextMac = toTrimmedString(plantInfo.macAddr);

      if (prev.pwplId === nextPwplId && prev.macAddr === nextMac) {
        return prev;
      }

      return {
        ...prev,
        pwplId: nextPwplId,
        macAddr: nextMac,
      };
    });
  }, [plantInfo.pwplId, plantInfo.macAddr]);

  /* =====================================================================================
   * 5️⃣ 핸들러
   * ===================================================================================== */
  const setValue = <K extends keyof StrctCreateReq>(key: K, value: StrctCreateReq[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const setStructValue = (targetIndex: number, key: MasterCode, value: string) => {
    if (!validStructKeySet.has(String(key))) return;
    setStructValueBase(targetIndex, key, value);
  };

  const buildStructs = () => buildStructsBase(mapStructStateToPayload) as StrctCreateReq['structs'];

  const onGoList = () => {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back();
      return;
    }
    router.replace('/eqpmnt/strct');
  };

  const goListAfterSave = () => router.replace('/eqpmnt/strct');

  const invalidateListQueries = () => {
    qc.invalidateQueries({
      predicate: (q) => {
        const key = q.queryKey;
        if (!Array.isArray(key) || key.length === 0) return false;
        const head = String(key[0] ?? '');
        return head === 'getStrctList';
      },
    });
  };

  const onSubmit = async () => {
    try {
      if (!toTrimmedString(plantInfo.pwplId)) {
        alert('발전소를 선택하세요.');
        return;
      }
      const baseBody: StrctCreateReq = {
        ...form,
        eqpmntId: toTrimmedString(eqpmntId ?? form.eqpmntId),
        pwplId: toTrimmedString(plantInfo.pwplId),
        macAddr: toTrimmedString(form.macAddr),
        lnkgMth: toTrimmedString(form.lnkgMth),
        commProtocol: toTrimmedString(form.commProtocol),
        eqpmntVer: toTrimmedString(form.eqpmntVer),
        eqpmntStts: toTrimmedString(form.eqpmntStts),
        structs: buildStructs(),
      };

      if (mode === 'create') {
        await createMutation.mutateAsync(baseBody);
        invalidateListQueries();
        goListAfterSave();
        return;
      }

      const body: StrctUpdateReq = {
        ...baseBody,
        eqpmntId: toTrimmedString(eqpmntId ?? baseBody.eqpmntId),
      };

      await updateMutation.mutateAsync(body);
      invalidateListQueries();
      qc.invalidateQueries({ queryKey: ['getStrctDetail', eqpmntId ?? ''] });
      goListAfterSave();
    } catch (e) {
      const err = e as AxiosError<ApiErrorBody>;
      console.error(err);
    }
  };

  const onDelete = async () => {
    if (mode === 'create') return;
    const targetEqpmntId = eqpmntId ?? '';
    if (!targetEqpmntId) return;

    try {
      const body: StrctDeleteReq = { eqpmntId: targetEqpmntId };
      await deleteMutation.mutateAsync(body);
      invalidateListQueries();
      router.replace('/eqpmnt/strct');
    } catch (e) {
      const err = e as AxiosError<ApiErrorBody>;
      console.error(err);
    }
  };

  /* =====================================================================================
   * ---- JSX ----
   * ===================================================================================== */
  return (
    <>
      <div className="title-group">
        <TitleComponent
          title="현장 설비 정보"
          subTitle="발전 구조 등록"
          desc="발전소 현장 장비 등록 및 관리"
        />
      </div>

      <div className="content-group" style={{ paddingTop: 'var(--spacing-10)' }}>
        <Group className="row-group" style={{ gap: 'var(--spacing-16)' }}>
          <BasicInfoTableBase<StrctCreateReq>
            plantInfo={plantInfo}
            setIsPlantModalOpen={setIsPlantModalOpen}
            form={form}
            setValue={setValue}
            disablePlantSearch={mode === 'edit'}
            srcTable={SRC_TABLE}
          />

          {structList
            .filter((item) => item.status !== 'D')
            .map((item, index) => (
              <div key={`${item.status}-${index}`} role="presentation">
                <EquipmentTable
                  value={item.value}
                  onChange={(key: MasterCode, value: string) => {
                    setStructValue(index, key, value);
                  }}
                  onAdd={addStructGroup}
                  onRemove={() => removeStructGroup(index)}
                  count={index}
                />
              </div>
            ))}

          <ExtraInfoTableBase<StrctCreateReq> form={form} setValue={setValue} />
        </Group>
      </div>

      <BottomGroupComponent
        rightCont={
          <div className="button-group">
            <ButtonComponent
              variant="contained"
              icon={<Icons iName={mode === 'create' ? 'plus' : 'edit'} size={16} color="#fff" />}
              onPress={onSubmit}
              isDisabled={mode === 'create' ? createMutation.isPending : updateMutation.isPending}
            >
              {mode === 'create' ? '등록' : '수정'}
            </ButtonComponent>

            <ButtonComponent
              variant="delete"
              icon={<Icons iName="delete" size={16} color="#fff" />}
              onPress={onDelete}
              isDisabled={mode === 'create' || deleteMutation.isPending}
            >
              삭제
            </ButtonComponent>

            <ButtonComponent
              variant="outlined"
              icon={<Icons iName="list" size={16} color="#8B8888" />}
              onPress={onGoList}
              isDisabled={isLoading}
            >
              목록
            </ButtonComponent>
          </div>
        }
      />

      <ModalPlantSearch
        isOpen={isPlantModalOpen}
        onOpenChange={setIsPlantModalOpen}
        srcTable={SRC_TABLE}
        onApply={(plant: PlantEqpmntPop) => {
          const p = plant as {
            pwplId: string;
            pwplNm: string;
            lctnZip?: string | null;
            roadNmAddr?: string | null;
            lctnLotnoAddr?: string | null;
            lctnDtlAddr?: string | null;
            macAddr?: string | null;
            mkrNm?: string | null;
            mdlNm?: string | null;
            serialNo?: string | null;
            eqpmntKname?: string | null;
            ip?: string | null;
            lnkgMth?: string | null;
            commProtocol?: string | null;
            eqpmntStts?: string | null;
            eqpmntVer?: string | null;
            bldrNm?: string | null;
            bldrCnpl?: string | null;
            mngrNm?: string | null;
            mngrCnpl?: string | null;
            optrNm?: string | null;
            optrCnpl?: string | null;
            assoptrNm?: string | null;
            assoptrCnpl?: string | null;
            memo?: string | null;
          };

          setPlantInfo({
            pwplId: toTrimmedString(p.pwplId),
            pwplNm: toTrimmedString(p.pwplNm),
            lctnZip: toTrimmedString(p.lctnZip),
            roadNmAddr: toTrimmedString(p.roadNmAddr),
            lctnLotnoAddr: toTrimmedString(p.lctnLotnoAddr),
            lctnDtlAddr: toTrimmedString(p.lctnDtlAddr),
            macAddr: toTrimmedString(p.macAddr),
          });

          setForm((prev) => ({
            ...prev,
            pwplId: toTrimmedString(p.pwplId),
            macAddr: toTrimmedString(p.macAddr),
            mkrNm: toTrimmedString(p.mkrNm ?? prev.mkrNm),
            mdlNm: toTrimmedString(p.mdlNm ?? prev.mdlNm),
            serialNo: toTrimmedString(p.serialNo ?? prev.serialNo),
            eqpmntKname: toTrimmedString(p.eqpmntKname ?? prev.eqpmntKname),
            ip: toTrimmedString(p.ip ?? prev.ip),
            lnkgMth: toTrimmedString(p.lnkgMth ?? prev.lnkgMth),
            commProtocol: toTrimmedString(p.commProtocol ?? prev.commProtocol),
            eqpmntStts: toTrimmedString(p.eqpmntStts ?? prev.eqpmntStts),
            eqpmntVer: toTrimmedString(p.eqpmntVer ?? prev.eqpmntVer),
            bldrNm: toTrimmedString(p.bldrNm ?? prev.bldrNm),
            bldrCnpl: toTrimmedString(p.bldrCnpl ?? prev.bldrCnpl),
            mngrNm: toTrimmedString(p.mngrNm ?? prev.mngrNm),
            mngrCnpl: toTrimmedString(p.mngrCnpl ?? prev.mngrCnpl),
            optrNm: toTrimmedString(p.optrNm ?? prev.optrNm),
            optrCnpl: toTrimmedString(p.optrCnpl ?? prev.optrCnpl),
            assoptrNm: toTrimmedString(p.assoptrNm ?? prev.assoptrNm),
            assoptrCnpl: toTrimmedString(p.assoptrCnpl ?? prev.assoptrCnpl),
            memo: toTrimmedString(p.memo ?? prev.memo),
          }));
        }}
      />
    </>
  );
}
