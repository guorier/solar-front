// src/constants/eqpmnt/components/EqpmntCommonForm.tsx
'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { AxiosError } from 'axios';
import { Group } from 'react-aria-components';

import { ButtonComponent, Icons, TitleComponent, BottomGroupComponent } from '@/components';
import { ModalPlantSearch } from '@/constants/eqpmnt/components/ModalPlantSearch';
import BasicInfoTableBase, {
  type PlantInfoState,
} from '@/constants/eqpmnt/components/BasicInfoTableBase';
import ExtraInfoTableBase from '@/constants/eqpmnt/components/ExtraInfoTableBase';
import { useEqpmntFormBase } from '@/constants/eqpmnt/components/useEqpmntFormBase';
import { useGetPlantBaseDetail } from '@/services/plants/query';
import type { PlantEqpmntPop } from '@/services/plants/type';

type ApiErrorBody = { message?: string };
type Mode = 'create' | 'edit';
type StructStatus = 'I' | 'U' | 'D';

type CommonFormShape = {
  eqpmntId: string;
  pwplId: string;
  mkrNm: string;
  mdlNm: string;
  serialNo: string;
  eqpmntKname: string;
  ip: string;
  macAddr: string;
  lnkgMth: string;
  commProtocol: string;
  eqpmntStts: string;
  eqpmntVer: string;
  bldrNm: string;
  bldrCnpl: string;
  mngrNm: string;
  mngrCnpl: string;
  optrNm: string;
  optrCnpl: string;
  assoptrNm: string;
  assoptrCnpl: string;
  memo: string;
  delYn: string;
  rgtrId: string;
  regDt: string;
  mdfrId: string;
  mdfcnDt: string;
  structs: unknown;
};

type CommonPlantPatch = {
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

type CommonDetailShape = {
  eqpmntId?: string | null;
  pwplId?: string | null;
  pwplNm?: string | null;
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
  delYn?: string | null;
  rgtrId?: string | null;
  regDt?: string | null;
  mdfrId?: string | null;
  mdfcnDt?: string | null;
  structures?: unknown;
};

type StructGroup<TStructState> = {
  strtsSeq: number;
  value: TStructState;
};

type StructListItem<TStructState> = {
  status: StructStatus;
  strtsSeq: number;
  value: TStructState;
};

type DetailQueryResult<TDetailRes> = {
  data?: TDetailRes;
  isFetching: boolean;
};

type MutationResult<TBody> = {
  mutateAsync: (body: TBody) => Promise<unknown>;
  isPending: boolean;
};

type EqpmntCommonFormProps<
  TForm extends CommonFormShape,
  TUpdateReq extends TForm,
  TDeleteReq extends { eqpmntId: string },
  TDetailParams,
  TDetailRes extends CommonDetailShape,
  TMasterCode extends string,
  TStructState extends Record<TMasterCode, string>,
> = {
  eqpmntId?: string;
  initialMode: Mode;
  srcTable: string;
  listPath: string;
  title: string;
  subTitle: string;
  desc: string;
  detailQueryKey: string;
  listInvalidateHead: string;
  structKeys: readonly TMasterCode[];
  initialForm: TForm;
  createEmptyStructState: () => TStructState;
  mapStructStateToPayload: (item: {
    status: StructStatus;
    strtsSeq: number;
    value: TStructState;
  }) => unknown;
  buildStructGroupsFromDetail: (raw: unknown) => StructGroup<TStructState>[];
  createDetailParams: (args: { plantInfo: PlantInfoState; eqpmntId?: string }) => TDetailParams;
  useDetail: (params: TDetailParams, enabled: boolean) => DetailQueryResult<TDetailRes>;
  useCreate: () => MutationResult<TForm>;
  useUpdate: () => MutationResult<TUpdateReq>;
  useDelete: () => MutationResult<TDeleteReq>;
  buildUpdateBody: (baseBody: TForm, eqpmntId?: string) => TUpdateReq;
  buildDeleteBody: (eqpmntId: string) => TDeleteReq;
  renderStructTable: (args: {
    item: StructListItem<TStructState>;
    index: number;
    setStructValue: (targetIndex: number, key: TMasterCode, value: string) => void;
    addStructGroup: () => void;
    removeStructGroup: (targetIndex: number) => void;
  }) => React.ReactNode;
};

const trimText = (v: string) => v.trim();

const toTrimmedString = (v: unknown) => {
  if (v === null || v === undefined) return '';
  return trimText(String(v));
};

const mergeDetailToForm = <TForm extends CommonFormShape>(
  prev: TForm,
  detail: CommonDetailShape,
): TForm => {
  return {
    ...prev,
    eqpmntId: toTrimmedString(detail.eqpmntId ?? prev.eqpmntId),
    pwplId: toTrimmedString(detail.pwplId ?? prev.pwplId),
    mkrNm: (detail.mkrNm as string | undefined) ?? prev.mkrNm,
    mdlNm: (detail.mdlNm as string | undefined) ?? prev.mdlNm,
    serialNo: (detail.serialNo as string | undefined) ?? prev.serialNo,
    eqpmntKname: (detail.eqpmntKname as string | undefined) ?? prev.eqpmntKname,
    ip: (detail.ip as string | undefined) ?? prev.ip,
    macAddr: (detail.macAddr as string | undefined) ?? prev.macAddr,
    lnkgMth: toTrimmedString(detail.lnkgMth ?? prev.lnkgMth),
    commProtocol: toTrimmedString(detail.commProtocol ?? prev.commProtocol),
    eqpmntVer: toTrimmedString(detail.eqpmntVer ?? prev.eqpmntVer),
    eqpmntStts: toTrimmedString(detail.eqpmntStts ?? prev.eqpmntStts),
    bldrNm: (detail.bldrNm as string | undefined) ?? prev.bldrNm,
    bldrCnpl: (detail.bldrCnpl as string | undefined) ?? prev.bldrCnpl,
    mngrNm: (detail.mngrNm as string | undefined) ?? prev.mngrNm,
    mngrCnpl: (detail.mngrCnpl as string | undefined) ?? prev.mngrCnpl,
    optrNm: (detail.optrNm as string | undefined) ?? prev.optrNm,
    optrCnpl: (detail.optrCnpl as string | undefined) ?? prev.optrCnpl,
    assoptrNm: (detail.assoptrNm as string | undefined) ?? prev.assoptrNm,
    assoptrCnpl: (detail.assoptrCnpl as string | undefined) ?? prev.assoptrCnpl,
    memo: (detail.memo as string | undefined) ?? prev.memo,
    delYn: (detail.delYn as string | undefined) ?? prev.delYn,
    rgtrId: (detail.rgtrId as string | undefined) ?? prev.rgtrId,
    regDt: (detail.regDt as string | undefined) ?? prev.regDt,
    mdfrId: (detail.mdfrId as string | undefined) ?? prev.mdfrId,
    mdfcnDt: (detail.mdfcnDt as string | undefined) ?? prev.mdfcnDt,
    structs: (detail.structures ?? prev.structs) as TForm['structs'],
  };
};

const mergePlantToForm = <TForm extends CommonFormShape>(
  prev: TForm,
  plant: CommonPlantPatch,
): TForm => {
  return {
    ...prev,
    pwplId: toTrimmedString(plant.pwplId),
    macAddr: toTrimmedString(plant.macAddr),
    mkrNm: toTrimmedString(plant.mkrNm ?? prev.mkrNm),
    mdlNm: toTrimmedString(plant.mdlNm ?? prev.mdlNm),
    serialNo: toTrimmedString(plant.serialNo ?? prev.serialNo),
    eqpmntKname: toTrimmedString(plant.eqpmntKname ?? prev.eqpmntKname),
    ip: toTrimmedString(plant.ip ?? prev.ip),
    lnkgMth: toTrimmedString(plant.lnkgMth ?? prev.lnkgMth),
    commProtocol: toTrimmedString(plant.commProtocol ?? prev.commProtocol),
    eqpmntStts: toTrimmedString(plant.eqpmntStts ?? prev.eqpmntStts),
    eqpmntVer: toTrimmedString(plant.eqpmntVer ?? prev.eqpmntVer),
    bldrNm: toTrimmedString(plant.bldrNm ?? prev.bldrNm),
    bldrCnpl: toTrimmedString(plant.bldrCnpl ?? prev.bldrCnpl),
    mngrNm: toTrimmedString(plant.mngrNm ?? prev.mngrNm),
    mngrCnpl: toTrimmedString(plant.mngrCnpl ?? prev.mngrCnpl),
    optrNm: toTrimmedString(plant.optrNm ?? prev.optrNm),
    optrCnpl: toTrimmedString(plant.optrCnpl ?? prev.optrCnpl),
    assoptrNm: toTrimmedString(plant.assoptrNm ?? prev.assoptrNm),
    assoptrCnpl: toTrimmedString(plant.assoptrCnpl ?? prev.assoptrCnpl),
    memo: toTrimmedString(plant.memo ?? prev.memo),
  };
};

export default function EqpmntCommonForm<
  TForm extends CommonFormShape,
  TUpdateReq extends TForm,
  TDeleteReq extends { eqpmntId: string },
  TDetailParams,
  TDetailRes extends CommonDetailShape,
  TMasterCode extends string,
  TStructState extends Record<TMasterCode, string>,
>({
  eqpmntId,
  initialMode,
  srcTable,
  listPath,
  title,
  subTitle,
  desc,
  detailQueryKey,
  listInvalidateHead,
  structKeys,
  initialForm,
  createEmptyStructState,
  mapStructStateToPayload,
  buildStructGroupsFromDetail,
  createDetailParams,
  useDetail,
  useCreate,
  useUpdate,
  useDelete,
  buildUpdateBody,
  buildDeleteBody,
  renderStructTable,
}: EqpmntCommonFormProps<
  TForm,
  TUpdateReq,
  TDeleteReq,
  TDetailParams,
  TDetailRes,
  TMasterCode,
  TStructState
>) {
  const router = useRouter();
  const qc = useQueryClient();
  const [mode] = useState<Mode>(initialMode);
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

  const [form, setForm] = useState<TForm>(initialForm);

  const {
    structList,
    setStructList,
    setActiveStructIndex,
    addStructGroup,
    removeStructGroup,
    setStructValue: setStructValueBase,
    buildStructs: buildStructsBase,
  } = useEqpmntFormBase<TStructState>(mode, createEmptyStructState);

  const validStructKeySet = useMemo(
    () => new Set<string>(structKeys.map((key) => String(key))),
    [structKeys],
  );

  const detailParams = useMemo(() => {
    return createDetailParams({ plantInfo, eqpmntId });
  }, [createDetailParams, plantInfo, eqpmntId]);

  const detailQuery = useDetail(detailParams, mode === 'edit' && Boolean(eqpmntId));
  const plantDetailQuery = useGetPlantBaseDetail({ pwplId: plantInfo.pwplId }, !!plantInfo.pwplId);

  const createMutation = useCreate();
  const updateMutation = useUpdate();
  const deleteMutation = useDelete();

  const isLoading =
    (mode === 'edit' ? detailQuery.isFetching : false) ||
    createMutation.isPending ||
    updateMutation.isPending ||
    deleteMutation.isPending;

  useEffect(() => {
    if (mode !== 'edit') return;
    if (!eqpmntId && !plantInfo.pwplId) return;
    if (!detailQuery.data) return;

    const d = detailQuery.data as TDetailRes;

    setPlantInfo({
      pwplId: toTrimmedString(d.pwplId),
      pwplNm: toTrimmedString(d.pwplNm),
      lctnZip: toTrimmedString(d.lctnZip),
      roadNmAddr: toTrimmedString(d.roadNmAddr),
      lctnLotnoAddr: toTrimmedString(d.lctnLotnoAddr),
      lctnDtlAddr: toTrimmedString(d.lctnDtlAddr),
      macAddr: toTrimmedString(d.macAddr),
    });

    setForm((prev) => mergeDetailToForm(prev, d));

    setStructList((prev) => {
      const nextList = [...prev];
      const groups = buildStructGroupsFromDetail(d.structures);
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
  }, [
    mode,
    eqpmntId,
    plantInfo.pwplId,
    detailQuery.data,
    setStructList,
    setActiveStructIndex,
    buildStructGroupsFromDetail,
  ]);

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

  const setValue = <K extends keyof TForm>(key: K, value: TForm[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const setStructValue = (targetIndex: number, key: TMasterCode, value: string) => {
    if (!validStructKeySet.has(String(key))) return;
    setStructValueBase(targetIndex, key, value);
  };

  const buildStructs = () => buildStructsBase(mapStructStateToPayload) as TForm['structs'];

  const onGoList = () => {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back();
      return;
    }
    router.replace(listPath);
  };

  const goListAfterSave = () => router.replace(listPath);

  const invalidateListQueries = () => {
    qc.invalidateQueries({
      predicate: (q) => {
        const key = q.queryKey;
        if (!Array.isArray(key) || key.length === 0) return false;
        const head = String(key[0] ?? '');
        return head === listInvalidateHead;
      },
    });
  };

  const onSubmit = async () => {
    try {
      if (!toTrimmedString(plantInfo.pwplId)) {
        alert('발전소를 선택하세요.');
        return;
      }

      const baseBody: TForm = {
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

      const body = buildUpdateBody(baseBody, eqpmntId);

      await updateMutation.mutateAsync(body);
      invalidateListQueries();
      qc.invalidateQueries({ queryKey: [detailQueryKey, eqpmntId ?? ''] });
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
      const body = buildDeleteBody(targetEqpmntId);
      await deleteMutation.mutateAsync(body);
      invalidateListQueries();
      router.replace(listPath);
    } catch (e) {
      const err = e as AxiosError<ApiErrorBody>;
      console.error(err);
    }
  };

  return (
    <>
      <div className="title-group">
        <TitleComponent title={title} subTitle={subTitle} desc={desc} />
      </div>

      <div className="content-group" style={{ paddingTop: 'var(--spacing-10)' }}>
        <Group className="row-group" style={{ gap: 'var(--spacing-16)' }}>
          <BasicInfoTableBase<TForm>
            plantInfo={plantInfo}
            setIsPlantModalOpen={setIsPlantModalOpen}
            form={form}
            setValue={setValue}
            disablePlantSearch={mode === 'edit'}
            srcTable={srcTable}
          />

          {structList
            .filter((item) => item.status !== 'D')
            .map((item, index) => (
              <div key={`${item.status}-${index}`} role="presentation">
                {renderStructTable({
                  item,
                  index,
                  setStructValue,
                  addStructGroup,
                  removeStructGroup,
                })}
              </div>
            ))}

          <ExtraInfoTableBase<TForm> form={form} setValue={setValue} />
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
        srcTable={srcTable}
        onApply={(plant: PlantEqpmntPop) => {
          const p = plant as CommonPlantPatch;

          setPlantInfo({
            pwplId: toTrimmedString(p.pwplId),
            pwplNm: toTrimmedString(p.pwplNm),
            lctnZip: toTrimmedString(p.lctnZip),
            roadNmAddr: toTrimmedString(p.roadNmAddr),
            lctnLotnoAddr: toTrimmedString(p.lctnLotnoAddr),
            lctnDtlAddr: toTrimmedString(p.lctnDtlAddr),
            macAddr: toTrimmedString(p.macAddr),
          });

          setForm((prev) => mergePlantToForm(prev, p));
        }}
      />
    </>
  );
}
