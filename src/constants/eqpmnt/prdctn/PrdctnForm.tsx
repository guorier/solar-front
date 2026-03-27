// src/constants/eqpmnt/prdctn/PrdctnForm.tsx
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
import EquipmentTable, {
  type MasterCode,
  type StructState,
  type SolarItemState,
  type ConvertItemState,
} from './components/EquipmentTable';
import ExtraInfoTableBase from '@/constants/eqpmnt/components/ExtraInfoTableBase';

import { useEqpmntFormBase } from '@/constants/eqpmnt/components/useEqpmntFormBase';

import { useGetPlantBaseDetail } from '@/services/plants/query';
import {
  useGetPrdctnDetail,
  usePostPrdctnCreate,
  usePostPrdctnUpdate,
  usePostPrdctnDelete,
} from '@/services/eqpmnt/prdctn/query';
import type {
  PrdctnCreateReq,
  PrdctnUpdateReq,
  PrdctnDeleteReq,
  PrdctnDetailRes,
  PrdctnDetailParams,
  PrdctnClctItemReq,
  PrdctnSlrItemReq,
  PrdctnConvItemReq,
} from '@/services/eqpmnt/prdctn/type';

type ApiErrorBody = { message?: string };
type Mode = 'create' | 'edit';

type PlantFormProps = {
  eqpmntId?: string;
  initialMode: Mode;
};

const trimText = (v: string) => v.trim();

const toTrimmedString = (v: unknown) => {
  if (v === null || v === undefined) return '';
  return trimText(String(v));
};

const STRUCT_KEYS = ['PVE', 'PVA', 'PVM', 'CMB', 'DCD', 'CBL', 'CON', 'INV', 'FIL'] as const;

const createEmptyStructState = (): StructState => ({
  PVE: '',
  PVA: '',
  PVM: '',
  CMB: '',
  DCD: '',
  CBL: '',
  CON: '',
  INV: '',
  FIL: '',
});

const createEmptySolarItem = (): SolarItemState => ({
  value: {
    PVE: '',
    PVA: '',
    PVM: '',
  },
  mkrNm: '',
  mdlNm: '',
  serialNo: '',
  eqpmntKname: '',
});

const createEmptyConvertItem = (): ConvertItemState => ({
  value: {
    INV: '',
    FIL: '',
  },
  mkrNm: '',
  mdlNm: '',
  serialNo: '',
  eqpmntKname: '',
});

const buildClctItemsFromStructList = (
  list: {
    status: 'I' | 'U' | 'D';
    strtsSeq: number;
    value: StructState;
  }[],
): PrdctnClctItemReq[] => {
  return list
    .filter((item) => item.status !== 'D')
    .map((item, index) => ({
      clctSeq: item.strtsSeq > 0 ? item.strtsSeq : index + 1,
      cntnpnlDbc: toTrimmedString(item.value.CMB),
      dcDstrbutnDbc: toTrimmedString(item.value.DCD),
      cable: toTrimmedString(item.value.CBL),
      connctor: toTrimmedString(item.value.CON),
    }));
};

const buildSlrItemsPayload = (items: SolarItemState[]): PrdctnSlrItemReq[] => {
  return items.map((item, index) => ({
    slrSeq: item.slrSeq ?? index + 1,
    mkrNm: toTrimmedString(item.mkrNm),
    mdlNm: toTrimmedString(item.mdlNm),
    serialNo: toTrimmedString(item.serialNo),
    eqpmntKname: toTrimmedString(item.eqpmntKname),
    slrcellDbc: toTrimmedString(item.value.PVE),
    arrayDbc: toTrimmedString(item.value.PVA),
    slrpwrMdulDbc: toTrimmedString(item.value.PVM),
  }));
};

const buildConvItemsPayload = (items: ConvertItemState[]): PrdctnConvItemReq[] => {
  return items.map((item, index) => ({
    convSeq: item.convSeq ?? index + 1,
    mkrNm: toTrimmedString(item.mkrNm),
    mdlNm: toTrimmedString(item.mdlNm),
    serialNo: toTrimmedString(item.serialNo),
    eqpmntKname: toTrimmedString(item.eqpmntKname),
    invtrDbc: toTrimmedString(item.value.INV),
    filtrDbc: toTrimmedString(item.value.FIL),
  }));
};

export default function PlantForm({ eqpmntId, initialMode }: PlantFormProps) {
  const router = useRouter();
  const qc = useQueryClient();
  const [mode] = useState<Mode>(initialMode);
  const SRC_TABLE = 'PRD';

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

  const [form, setForm] = useState<PrdctnCreateReq>({
    pwplId: '',
    mkrNm: '',
    mdlNm: '',
    serialNo: '',
    eqpmntKname: '',
    ip: '',
    macAddr: '',
    lnkgMth: '',
    commProtocol: '',
    eqpmntVer: '',
    eqpmntStts: '',
    instlYmd: '',
    bldrNm: '',
    bldrCnpl: '',
    mngrNm: '',
    mngrCnpl: '',
    optrNm: '',
    optrCnpl: '',
    assoptrNm: '',
    assoptrCnpl: '',
    memo: '',
    rgtrId: '',
    mdfrId: '',
    clctItems: [],
    slrItems: [],
    convItems: [],
  });

  const [solarItems, setSolarItems] = useState<SolarItemState[]>([createEmptySolarItem()]);
  const [convertItems, setConvertItems] = useState<ConvertItemState[]>([createEmptyConvertItem()]);

  const {
    structList,
    setStructList,
    setActiveStructIndex,
    addStructGroup,
    removeStructGroup,
    setStructValue: setStructValueBase,
  } = useEqpmntFormBase<StructState>(mode, createEmptyStructState);

  const validStructKeySet = useMemo(() => new Set<string>(STRUCT_KEYS as unknown as string[]), []);

  const detailParams = useMemo(() => {
    return {
      eqpmntId: toTrimmedString(eqpmntId ?? ''),
    } as PrdctnDetailParams;
  }, [eqpmntId]);

  const detailQuery = useGetPrdctnDetail(detailParams, mode === 'edit' && Boolean(eqpmntId));
  const plantDetailQuery = useGetPlantBaseDetail({ pwplId: plantInfo.pwplId }, !!plantInfo.pwplId);

  const createMutation = usePostPrdctnCreate();
  const updateMutation = usePostPrdctnUpdate();
  const deleteMutation = usePostPrdctnDelete();

  const isLoading =
    (mode === 'edit' ? detailQuery.isFetching : false) ||
    createMutation.isPending ||
    updateMutation.isPending ||
    deleteMutation.isPending;

  const activeStructList = useMemo(() => {
    return structList.filter((item) => item.status !== 'D');
  }, [structList]);

  const commonStructValue = useMemo(() => {
    return activeStructList[0]?.value ?? createEmptyStructState();
  }, [activeStructList]);

  useEffect(() => {
    if (mode !== 'edit') return;
    if (!eqpmntId) return;
    if (!detailQuery.data) return;

    const d = detailQuery.data as PrdctnDetailRes;

    setPlantInfo({
      pwplId: toTrimmedString(d.pwplId),
      pwplNm: toTrimmedString(d.pwplNm),
      lctnZip: toTrimmedString(d.lctnZip),
      roadNmAddr: toTrimmedString(d.roadNmAddr),
      lctnLotnoAddr: toTrimmedString(d.lctnLotnoAddr),
      lctnDtlAddr: toTrimmedString(d.lctnDtlAddr),
      macAddr: toTrimmedString(d.macAddr),
    });

    setForm((prev) => ({
      ...prev,
      pwplId: toTrimmedString(d.pwplId),
      mkrNm: toTrimmedString(d.mkrNm),
      mdlNm: toTrimmedString(d.mdlNm),
      serialNo: toTrimmedString(d.serialNo),
      eqpmntKname: toTrimmedString(d.eqpmntKname),
      ip: toTrimmedString(d.ip),
      macAddr: toTrimmedString(d.macAddr),
      lnkgMth: toTrimmedString(d.lnkgMth),
      commProtocol: toTrimmedString(d.commProtocol),
      eqpmntVer: toTrimmedString(d.eqpmntVer),
      eqpmntStts: toTrimmedString(d.eqpmntStts),
      instlYmd: toTrimmedString(d.instlYmd),
      bldrNm: toTrimmedString(d.bldrNm),
      bldrCnpl: toTrimmedString(d.bldrCnpl),
      mngrNm: toTrimmedString(d.mngrNm),
      mngrCnpl: toTrimmedString(d.mngrCnpl),
      optrNm: toTrimmedString(d.optrNm),
      optrCnpl: toTrimmedString(d.optrCnpl),
      assoptrNm: toTrimmedString(d.assoptrNm),
      assoptrCnpl: toTrimmedString(d.assoptrCnpl),
      memo: toTrimmedString(d.memo),
      rgtrId: toTrimmedString(d.rgtrId),
      mdfrId: toTrimmedString(d.mdfrId),
      clctItems: d.clctItems ?? [],
      slrItems: d.slrItems ?? [],
      convItems: d.convItems ?? [],
    }));

    setStructList(() => {
      const clctItems = d.clctItems ?? [];

      if (clctItems.length === 0) {
        return [
          {
            status: 'I',
            strtsSeq: 0,
            value: createEmptyStructState(),
          },
        ];
      }

      setActiveStructIndex(0);

      return clctItems.map((item) => ({
        status: 'U' as const,
        strtsSeq: Number(item.clctSeq ?? 0),
        value: {
          CMB: toTrimmedString(item.cntnpnlDbc),
          DCD: toTrimmedString(item.dcDstrbutnDbc),
          CBL: toTrimmedString(item.cable),
          CON: toTrimmedString(item.connctor),
          PVE: '',
          PVA: '',
          PVM: '',
          INV: '',
          FIL: '',
        },
      }));
    });

    setSolarItems(() => {
      const nextItems = d.slrItems ?? [];

      if (nextItems.length === 0) {
        return [createEmptySolarItem()];
      }

      return nextItems.map((item) => ({
        slrSeq: Number(item.slrSeq ?? 0),
        value: {
          PVE: toTrimmedString(item.slrcellDbc),
          PVA: toTrimmedString(item.arrayDbc),
          PVM: toTrimmedString(item.slrpwrMdulDbc),
        },
        mkrNm: toTrimmedString(item.mkrNm),
        mdlNm: toTrimmedString(item.mdlNm),
        serialNo: toTrimmedString(item.serialNo),
        eqpmntKname: toTrimmedString(item.eqpmntKname),
      }));
    });

    setConvertItems(() => {
      const nextItems = d.convItems ?? [];

      if (nextItems.length === 0) {
        return [createEmptyConvertItem()];
      }

      return nextItems.map((item) => ({
        convSeq: Number(item.convSeq ?? 0),
        value: {
          INV: toTrimmedString(item.invtrDbc),
          FIL: toTrimmedString(item.filtrDbc),
        },
        mkrNm: toTrimmedString(item.mkrNm),
        mdlNm: toTrimmedString(item.mdlNm),
        serialNo: toTrimmedString(item.serialNo),
        eqpmntKname: toTrimmedString(item.eqpmntKname),
      }));
    });
  }, [mode, eqpmntId, detailQuery.data, setStructList, setActiveStructIndex]);

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
  }, [plantDetailQuery.data]);

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

  const setValue = <K extends keyof PrdctnCreateReq>(key: K, value: PrdctnCreateReq[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const setStructValue = (targetIndex: number, key: MasterCode, value: string) => {
    if (!validStructKeySet.has(String(key))) return;
    setStructValueBase(targetIndex, key, value);
  };

  const onSolarChange = (targetIndex: number, key: 'PVE' | 'PVA' | 'PVM', value: string) => {
    setSolarItems((prev) =>
      prev.map((item, index) =>
        index === targetIndex
          ? {
              ...item,
              value: {
                ...item.value,
                [key]: value,
              },
            }
          : item,
      ),
    );
  };

  const onSolarItemChange = (
    targetIndex: number,
    key: keyof Omit<SolarItemState, 'value' | 'slrSeq'>,
    value: string,
  ) => {
    setSolarItems((prev) =>
      prev.map((item, index) => (index === targetIndex ? { ...item, [key]: value } : item)),
    );
  };

  const onConvertChange = (targetIndex: number, key: 'INV' | 'FIL', value: string) => {
    setConvertItems((prev) =>
      prev.map((item, index) =>
        index === targetIndex
          ? {
              ...item,
              value: {
                ...item.value,
                [key]: value,
              },
            }
          : item,
      ),
    );
  };

  const onConvertItemChange = (
    targetIndex: number,
    key: keyof Omit<ConvertItemState, 'value' | 'convSeq'>,
    value: string,
  ) => {
    setConvertItems((prev) =>
      prev.map((item, index) => (index === targetIndex ? { ...item, [key]: value } : item)),
    );
  };

  const onAddSolar = () => {
    setSolarItems((prev) => [...prev, createEmptySolarItem()]);
  };

  const onRemoveSolar = (targetIndex: number) => {
    setSolarItems((prev) => {
      if (prev.length <= 1) return prev;
      return prev.filter((_, index) => index !== targetIndex);
    });
  };

  const onAddConvert = () => {
    setConvertItems((prev) => [...prev, createEmptyConvertItem()]);
  };

  const onRemoveConvert = (targetIndex: number) => {
    setConvertItems((prev) => {
      if (prev.length <= 1) return prev;
      return prev.filter((_, index) => index !== targetIndex);
    });
  };

  const onGoList = () => {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back();
      return;
    }
    router.replace('/eqpmnt/prdctn');
  };

  const goListAfterSave = () => router.replace('/eqpmnt/prdctn');

  const invalidateListQueries = () => {
    qc.invalidateQueries({
      predicate: (q) => {
        const key = q.queryKey;
        if (!Array.isArray(key) || key.length === 0) return false;
        const head = String(key[0] ?? '');
        return head === 'getPrdctnList' || head === 'getEqpmntList';
      },
    });
  };

  const onSubmit = async () => {
    try {
      if (!toTrimmedString(plantInfo.pwplId)) {
        alert('발전소를 선택하세요.');
        return;
      }

      const baseBody: PrdctnCreateReq = {
        ...form,
        pwplId: toTrimmedString(plantInfo.pwplId),
        mkrNm: toTrimmedString(form.mkrNm),
        mdlNm: toTrimmedString(form.mdlNm),
        serialNo: toTrimmedString(form.serialNo),
        eqpmntKname: toTrimmedString(form.eqpmntKname),
        ip: toTrimmedString(form.ip),
        macAddr: toTrimmedString(form.macAddr),
        lnkgMth: toTrimmedString(form.lnkgMth),
        commProtocol: toTrimmedString(form.commProtocol),
        eqpmntVer: toTrimmedString(form.eqpmntVer),
        eqpmntStts: toTrimmedString(form.eqpmntStts),
        instlYmd: toTrimmedString(form.instlYmd).replace(/-/g, ''),
        bldrNm: toTrimmedString(form.bldrNm),
        bldrCnpl: toTrimmedString(form.bldrCnpl),
        mngrNm: toTrimmedString(form.mngrNm),
        mngrCnpl: toTrimmedString(form.mngrCnpl),
        optrNm: toTrimmedString(form.optrNm),
        optrCnpl: toTrimmedString(form.optrCnpl),
        assoptrNm: toTrimmedString(form.assoptrNm),
        assoptrCnpl: toTrimmedString(form.assoptrCnpl),
        memo: toTrimmedString(form.memo),
        rgtrId: toTrimmedString(form.rgtrId),
        mdfrId: toTrimmedString(form.mdfrId),
        clctItems: buildClctItemsFromStructList(structList),
        slrItems: buildSlrItemsPayload(solarItems),
        convItems: buildConvItemsPayload(convertItems),
      };

      if (mode === 'create') {
        await createMutation.mutateAsync(baseBody);
        invalidateListQueries();
        goListAfterSave();
        return;
      }

      const body: PrdctnUpdateReq = {
        ...baseBody,
        eqpmntId: toTrimmedString(eqpmntId ?? ''),
      };

      await updateMutation.mutateAsync(body);
      invalidateListQueries();
      qc.invalidateQueries({ queryKey: ['getPrdctnDetail', eqpmntId ?? ''] });
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
      const body: PrdctnDeleteReq = { eqpmntId: targetEqpmntId };
      await deleteMutation.mutateAsync(body);
      invalidateListQueries();
      router.replace('/eqpmnt/prdctn');
    } catch (e) {
      const err = e as AxiosError<ApiErrorBody>;
      console.error(err);
    }
  };

  return (
    <>
      <div className="title-group">
        <TitleComponent
          title="현장 설비 정보"
          subTitle="발전 생산 등록"
          desc="발전소 현장 장비 등록 및 관리"
        />
      </div>

      <div className="content-group" style={{ paddingTop: 'var(--spacing-10)' }}>
        <Group className="row-group" style={{ gap: 'var(--spacing-16)' }}>
          <BasicInfoTableBase<PrdctnCreateReq>
            plantInfo={plantInfo}
            setIsPlantModalOpen={setIsPlantModalOpen}
            form={form}
            setValue={setValue}
            disablePlantSearch={mode === 'edit'}
            srcTable={SRC_TABLE}
          />

          <EquipmentTable
            collectList={activeStructList}
            commonValue={commonStructValue}
            solarItems={solarItems}
            convertItems={convertItems}
            onCollectChange={(index: number, key: MasterCode, value: string) => {
              setStructValue(index, key, value);
            }}
            onSolarChange={onSolarChange}
            onSolarItemChange={onSolarItemChange}
            onConvertChange={onConvertChange}
            onConvertItemChange={onConvertItemChange}
            onAddCollect={addStructGroup}
            onRemoveCollect={(index: number) => removeStructGroup(index)}
            onAddSolar={onAddSolar}
            onRemoveSolar={onRemoveSolar}
            onAddConvert={onAddConvert}
            onRemoveConvert={onRemoveConvert}
          />

          <ExtraInfoTableBase<PrdctnCreateReq> form={form} setValue={setValue} />
        </Group>
      </div>

      <BottomGroupComponent
        rightCont={
          <div className="button-group">
            <ButtonComponent
              variant="contained"
              icon={<Icons iName="edit" size={16} color="#fff" />}
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
            instlYmd?: string | null;
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
            instlYmd: toTrimmedString(p.instlYmd ?? prev.instlYmd),
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