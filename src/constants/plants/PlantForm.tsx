// src/constants/plants/PlantForm.tsx
'use client';

import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { AxiosError } from 'axios';
import { useSession } from 'next-auth/react';

import { ButtonComponent, Icons, TitleComponent, BottomGroupComponent } from '@/components';
import { Group } from 'react-aria-components';

import type { AddressFieldValue } from '@/components/address/AddressField';

import {
  useGetPlantBaseDetail,
  usePostPlantBaseCreate,
  usePostPlantBaseUpdate,
  usePostPlantBaseDelete,
} from '@/services/plants/query';

import { getComCodeList } from '@/services/common/request';

import type {
  PlantBaseCreateReq,
  PlantBaseDetailParams,
  PlantBaseDetailRes,
  PlantBaseUpdateReq,
} from '@/services/plants/type';
import type { ComCodeItem } from '@/services/common/type';

import BasicInfoTable from './components/BasicInfoTable';
import CapacityInfoTable from './components/CapacityInfoTable';
import LocationInfoTable from './components/LocationInfoTable';
import EquipmentInfoTable from './components/EquipmentInfoTable';
import StructureInfoTable from './components/StructureInfoTable';
import InfrastructureInfoTable from './components/InfrastructureInfoTable';
import ExtraInfoTable from './components/ExtraInfoTable';
import WeightInfoTable from './components/WeightInfoTable';
import { initialForm } from './PlantType';

type ApiErrorBody = { message?: string };
type Mode = 'create' | 'edit';

type Props = {
  pwplId?: string;
  initialMode: Mode;
};

type FieldKey = keyof PlantBaseCreateReq;
const REQUIRED: FieldKey[] = ['pwplNm', 'bcode', 'roadAddress', 'jibunAddress', 'zonecode', 'sido'];

export default function PlantForm({ pwplId, initialMode }: Props) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: session } = useSession();

  const [mode] = useState<Mode>(initialMode);

  const [form, setForm] = useState<PlantBaseCreateReq>(initialForm);

  const [typeCodes, setTypeCodes] = useState<ComCodeItem[]>([]);
  const [statusCodes, setStatusCodes] = useState<ComCodeItem[]>([]);
  const [scaleCodes, setScaleCodes] = useState<ComCodeItem[]>([]);

  const [addressOpen, setAddressOpen] = useState(false);

  const requiredSet = useMemo(() => new Set<FieldKey>(REQUIRED), []);
  const isRequired = (k: FieldKey) => requiredSet.has(k);

  const loginId = session?.user?.email?.trim() ?? '';

  const setValue = <K extends FieldKey>(k: K, v: PlantBaseCreateReq[K]) => {
    setForm((prev) => ({ ...prev, [k]: v }));
  };

  const normalize = (list: ComCodeItem[]) =>
    list
      .map((x) => ({
        ...x,
        comSubCd: x.comSubCd?.trim(),
        comSubCdNm: x.comSubCdNm?.trim(),
        sortSeq: x.sortSeq?.trim(),
      }))
      .sort((a, b) => Number(a.sortSeq) - Number(b.sortSeq));

  const loadTypeCodes = useCallback(async () => {
    if (typeCodes.length) return;
    setTypeCodes(normalize(await getComCodeList({ comMastrCd: 'P01' })));
  }, [typeCodes]);

  const loadStatusCodes = useCallback(async () => {
    if (statusCodes.length) return;
    setStatusCodes(normalize(await getComCodeList({ comMastrCd: 'P02' })));
  }, [statusCodes]);

  const loadScaleCodes = useCallback(async () => {
    if (scaleCodes.length) return;
    setScaleCodes(normalize(await getComCodeList({ comMastrCd: 'P03' })));
  }, [scaleCodes]);

  // ✅ edit 진입 시 코드리스트 선로딩
  useEffect(() => {
    if (mode !== 'edit') return;
    if (!pwplId) return;

    loadTypeCodes();
    loadStatusCodes();
    loadScaleCodes();
  }, [mode, pwplId, loadTypeCodes, loadStatusCodes, loadScaleCodes]);

  const onAddressChange = (v: AddressFieldValue) => {
    setForm((prev) => ({
      ...prev,

      pwplNm: prev.pwplNm,
      bcode: v.bcode,
      roadAddress: v.roadAddress || v.address,
      jibunAddress: v.jibunAddress,
      zonecode: v.zonecode,
      sido: v.sido,
      address: v.address,

      lctnZip: v.zonecode,
      roadNmAddr: v.roadAddress || v.address,
      lctnLotnoAddr: v.jibunAddress,
    }));
  };

  const validateCreate = () => {
    for (const k of REQUIRED) {
      const v = form[k];
      if (v === undefined || v === null) return false;
      if (typeof v === 'string' && v.trim() === '') return false;
    }
    return true;
  };

  const createMutation = usePostPlantBaseCreate();
  const updateMutation = usePostPlantBaseUpdate();
  const deleteMutation = usePostPlantBaseDelete();

  const detailParams: PlantBaseDetailParams = useMemo(() => ({ pwplId: pwplId ?? '' }), [pwplId]);
  const detailQuery = useGetPlantBaseDetail(detailParams, !!pwplId && mode === 'edit');

  const mapDetailToForm = (d: PlantBaseDetailRes): PlantBaseCreateReq => ({
    ...initialForm,
    loginId: '',
    pwplIdPrefix: initialForm.pwplIdPrefix,
    pwplId: d.pwplId,
    pwplNm: d.pwplNm ?? '',
    pwplTypeCd: d.pwplTypeCd ?? '',
    pwplSttsCd: d.pwplSttsCd ?? '',
    pwplSclCd: d.pwplSclCd ?? '',
    designCpct: d.designCpct ?? 0,
    instlCpct: d.instlCpct ?? 0,
    lctnZip: d.lctnZip ?? '',
    roadNmAddr: d.roadNmAddr ?? '',
    lctnLotnoAddr: d.lctnLotnoAddr ?? '',
    lctnDtlAddr: d.lctnDtlAddr ?? '',
    pwplLat: d.pwplLat ?? 0,
    pwplLot: d.pwplLot ?? 0,
    pwplXcrd: d.pwplXcrd ?? 0,
    pwplYcrd: d.pwplYcrd ?? 0,
    pmMsrstn: d.pmMsrstn ?? '',
    pltar: d.pltar ?? 0,
    premsShpNm: d.premsShpNm ?? '',
    eqpmntQty: d.eqpmntQty ?? 0,
    systmVltg: d.systmVltg ?? 0,
    grdnt: d.grdnt ?? 0,
    az: d.az ?? 0,
    pr: d.pr === 0 || d.pr === null || d.pr === undefined ? 85 : d.pr,
    weight: d.weight ?? 1.5,
    bldgStrctNm: d.bldgStrctNm ?? '',
    instlPlcNm: d.instlPlcNm ?? '',
    infraNm: d.infraNm ?? '',
    asstFlctNm: d.asstFlctNm ?? '',
    ownrNm: d.ownrNm ?? '',
    operCoNm: d.operCoNm ?? '',
    cnstCoNm: d.cnstCoNm ?? '',
    instlYmd: d.instlYmd ?? '',
    cmrcoprYmd: d.cmrcoprYmd ?? '',
    pwplExpln: d.pwplExpln ?? '',
    delYn: d.delYn ?? initialForm.delYn,
    rgtrId: d.rgtrId ?? initialForm.rgtrId,
    regDt: d.regDt ?? initialForm.regDt,
    mdfrId: d.mdfrId ?? initialForm.mdfrId,
    mdfcnDt: d.mdfcnDt ?? initialForm.mdfcnDt,
    bcode: initialForm.bcode,
    address: initialForm.address,
    jibunAddress: initialForm.jibunAddress,
    roadAddress: initialForm.roadAddress,
    sido: initialForm.sido,
    zonecode: initialForm.zonecode,
  });

  useEffect(() => {
    if (mode !== 'edit') return;
    if (!detailQuery.data) return;
    setForm(mapDetailToForm(detailQuery.data));
  }, [mode, detailQuery.data]);

  const toStringOrNullFromNumber = (v: number): string | null =>
    Number.isFinite(v) ? String(v) : null;

  const toStringOrNullFromString = (v: string | null | undefined): string | null => {
    if (v === null || v === undefined) return null;
    const s = v.trim();
    return s.length ? s : null;
  };

  const buildCreatePayload = (): PlantBaseCreateReq => ({
    ...form,
    pr: Number.isFinite(form.pr) ? (form.pr === 0 ? 85 : form.pr) : 85,
    loginId,
    rgtrId: loginId || form.rgtrId,
  });

  const buildUpdatePayload = (): PlantBaseUpdateReq => ({
    pwplId: pwplId ?? form.pwplId,
    pwplNm: form.pwplNm,
    pwplTypeCd: toStringOrNullFromString(form.pwplTypeCd),
    pwplSttsCd: toStringOrNullFromString(form.pwplSttsCd),
    pwplSclCd: toStringOrNullFromString(form.pwplSclCd),
    designCpct: Number.isFinite(form.designCpct) ? form.designCpct : null,
    instlCpct: Number.isFinite(form.instlCpct) ? form.instlCpct : null,
    lctnZip: form.lctnZip,
    roadNmAddr: form.roadNmAddr,
    lctnLotnoAddr: form.lctnLotnoAddr,
    lctnDtlAddr: toStringOrNullFromString(form.lctnDtlAddr),
    pwplLat: form.pwplLat,
    pwplLot: form.pwplLot,
    pwplXcrd: form.pwplXcrd,
    pwplYcrd: form.pwplYcrd,
    pmMsrstn: toStringOrNullFromString(form.pmMsrstn),
    pltar: toStringOrNullFromNumber(form.pltar),
    premsShpNm: toStringOrNullFromString(form.premsShpNm),
    eqpmntQty: toStringOrNullFromNumber(form.eqpmntQty),
    systmVltg: toStringOrNullFromNumber(form.systmVltg),
    grdnt: toStringOrNullFromNumber(form.grdnt),
    az: toStringOrNullFromNumber(form.az),
    pr: Number.isFinite(form.pr) ? (form.pr === 0 ? 85 : form.pr) : 85,
    weight: Number.isFinite(form.weight) ? form.weight : null,
    bldgStrctNm: toStringOrNullFromString(form.bldgStrctNm),
    instlPlcNm: toStringOrNullFromString(form.instlPlcNm),
    infraNm: toStringOrNullFromString(form.infraNm),
    asstFlctNm: toStringOrNullFromString(form.asstFlctNm),
    ownrNm: toStringOrNullFromString(form.ownrNm),
    operCoNm: toStringOrNullFromString(form.operCoNm),
    cnstCoNm: toStringOrNullFromString(form.cnstCoNm),
    instlYmd: form.instlYmd,
    cmrcoprYmd: form.cmrcoprYmd,
    pwplExpln: toStringOrNullFromString(form.pwplExpln),
    mdfrId: loginId || form.mdfrId,
  });

  const onSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    try {
      if (mode === 'create') {
        if (!validateCreate()) return;

        const payload = buildCreatePayload();
        await createMutation.mutateAsync(payload);
        await queryClient.invalidateQueries({ queryKey: ['getPlantBaseList'] });
        router.push('/info');
        return;
      }

      const payload = buildUpdatePayload();

      if (!payload.pwplId) return;
      if (!payload.pwplNm?.trim()) return;
      if (!payload.lctnZip.trim() || !payload.roadNmAddr.trim() || !payload.lctnLotnoAddr.trim())
        return;

      await updateMutation.mutateAsync(payload);

      await queryClient.invalidateQueries({ queryKey: ['plantBaseDetail', payload.pwplId] });
      await queryClient.invalidateQueries({ queryKey: ['getPlantBaseList'] });

      router.back();
    } catch (err) {
      const error = err as AxiosError<ApiErrorBody>;
      console.log(error);
    }
  };

  const onDelete = async () => {
    const targetPwplId = pwplId ?? form.pwplId;
    if (!targetPwplId) return;

    if (!window.confirm('정말 삭제하시겠습니까?')) return;

    try {
      await deleteMutation.mutateAsync({ pwplId: targetPwplId });
      await queryClient.invalidateQueries({ queryKey: ['getPlantBaseList'] });

      router.back();
    } catch (err) {
      console.log(err);
    }
  };

  if (mode === 'edit' && detailQuery.isLoading) return <div>loading...</div>;
  if (mode === 'edit' && detailQuery.isError) return <div>상세 조회 실패</div>;

  return (
    <form onSubmit={(e) => onSubmit(e)} style={{ display: 'contents' }}>
      <div className="title-group">
        <TitleComponent
          title="발전소 기초정보"
          desc={mode === 'create' ? '새로운 발전소의 기본 정보를 입력' : '발전소 기본 정보를 수정'}
        />
      </div>

      <div className="content-group" style={{ paddingTop: 'var(--spacing-10)' }}>
        <Group className="row-group" style={{ gap: 'var(--spacing-16)' }}>
          <BasicInfoTable
            form={form}
            isRequired={isRequired}
            setValue={setValue}
            loadTypeCodes={loadTypeCodes}
            loadStatusCodes={loadStatusCodes}
            loadScaleCodes={loadScaleCodes}
            typeCodes={typeCodes}
            statusCodes={statusCodes}
            scaleCodes={scaleCodes}
          />

          <CapacityInfoTable form={form} setValue={setValue} />

          <LocationInfoTable
            form={form}
            isRequired={isRequired}
            setValue={setValue}
            addressOpen={addressOpen}
            setAddressOpen={setAddressOpen}
            onAddressChange={onAddressChange}
            isEdit={mode === 'edit'}
          />

          <EquipmentInfoTable form={form} setValue={setValue} />

          <WeightInfoTable form={form} setValue={setValue} />

          <StructureInfoTable form={form} setValue={setValue} />
          <InfrastructureInfoTable form={form} setValue={setValue} />
          <ExtraInfoTable form={form} setValue={setValue} />
        </Group>
      </div>

      <BottomGroupComponent
        rightCont={
          <div className="button-group">
            <ButtonComponent
              variant="contained"
              icon={<Icons iName="plus" size={16} color="#fff" />}
              type="button"
              onClick={() => onSubmit()}
              isDisabled={mode === 'create' ? createMutation.isPending : updateMutation.isPending}
            >
              {mode === 'create' ? '등록' : '수정'}
            </ButtonComponent>

            <ButtonComponent
              variant="delete"
              icon={<Icons iName="delete" size={16} color="#fff" />}
              type="button"
              onClick={onDelete}
              isDisabled={mode === 'create' || deleteMutation.isPending}
            >
              삭제
            </ButtonComponent>

            <ButtonComponent
              variant="outlined"
              icon={<Icons iName="list" size={16} color="#8B8888" />}
              type="button"
              onClick={() => router.back()}
            >
              목록
            </ButtonComponent>
          </div>
        }
      />
    </form>
  );
}
