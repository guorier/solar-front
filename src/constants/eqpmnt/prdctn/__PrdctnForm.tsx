// // src/constants/eqpmnt/prdctn/PrdctnForm.tsx
// 'use client';

// import React from 'react';

// import EquipmentTable, { type MasterCode, type StructState } from './components/EquipmentTable';
// import EqpmntCommonForm from '@/constants/eqpmnt/components/EqpmntCommonForm';

// import {
//   useGetPrdctnDetail,
//   usePostPrdctnCreate,
//   usePostPrdctnUpdate,
//   usePostPrdctnDelete,
// } from '@/services/eqpmnt/prdctn/query';
// import type {
//   PrdctnCreateReq,
//   PrdctnUpdateReq,
//   PrdctnDeleteReq,
//   PrdctnDetailRes,
//   PrdctnDetailParams,
// } from '@/services/eqpmnt/prdctn/type';
// import type { PlantInfoState } from '@/constants/eqpmnt/components/BasicInfoTableBase';

// type Mode = 'create' | 'edit';

// type PlantFormProps = {
//   eqpmntId?: string;
//   initialMode: Mode;
// };

// const trimText = (v: string) => v.trim();

// const toTrimmedString = (v: unknown) => {
//   if (v === null || v === undefined) return '';
//   return trimText(String(v));
// };

// const STRUCT_KEYS = ['PVE', 'PVA', 'PVM', 'CMB', 'DCD', 'CBL', 'CON', 'INV', 'FIL'] as const;

// const createEmptyStructState = (): StructState => ({
//   PVE: '',
//   PVA: '',
//   PVM: '',
//   CMB: '',
//   DCD: '',
//   CBL: '',
//   CON: '',
//   INV: '',
//   FIL: '',
// });

// const mapStructStateToPayload = (item: {
//   status: 'I' | 'U' | 'D';
//   strtsSeq: number;
//   value: StructState;
// }) => {
//   const base = {
//     status: item.status,
//     instlYmd: '        ',
//     cntnpnlDbc: toTrimmedString(item.value.CMB),
//     dcDstrbutnDbc: toTrimmedString(item.value.DCD),
//     cable: toTrimmedString(item.value.CBL),
//     connctor: toTrimmedString(item.value.CON),
//     slrcellDbc: toTrimmedString(item.value.PVE),
//     arrayDbc: toTrimmedString(item.value.PVA),
//     slrpwrMdulDbc: toTrimmedString(item.value.PVM),
//     invtrDbc: toTrimmedString(item.value.INV),
//     filtrDbc: toTrimmedString(item.value.FIL),
//   };

//   if (item.status === 'I') {
//     return base;
//   }

//   return {
//     ...base,
//     strtsSeq: item.strtsSeq,
//   };
// };

// const buildStructGroupsFromDetail = (raw: unknown) => {
//   const list = (raw as unknown[]) ?? [];
//   const groups: { strtsSeq: number; value: StructState }[] = [];

//   list.forEach((s) => {
//     const sAny = s as Record<string, unknown>;
//     const seq = Number(sAny.strtsSeq ?? 0);
//     if (seq < 0) return;

//     groups.push({
//       strtsSeq: seq,
//       value: {
//         CMB: toTrimmedString(sAny.cntnpnlDbc),
//         DCD: toTrimmedString(sAny.dcDstrbutnDbc),
//         CBL: toTrimmedString(sAny.cable),
//         CON: toTrimmedString(sAny.connctor),
//         PVE: toTrimmedString(sAny.slrcellDbc),
//         PVA: toTrimmedString(sAny.arrayDbc),
//         PVM: toTrimmedString(sAny.slrpwrMdulDbc),
//         INV: toTrimmedString(sAny.invtrDbc),
//         FIL: toTrimmedString(sAny.filtrDbc),
//       },
//     });
//   });

//   return [...groups].sort((a, b) => a.strtsSeq - b.strtsSeq);
// };

// const initialForm: PrdctnCreateReq = {
//   eqpmntId: '',
//   pwplId: '',
//   mkrNm: '',
//   mdlNm: '',
//   serialNo: '',
//   eqpmntKname: '',
//   ip: '',
//   macAddr: '',
//   lnkgMth: '',
//   commProtocol: '',
//   eqpmntStts: '',
//   eqpmntVer: '',
//   bldrNm: '',
//   bldrCnpl: '',
//   mngrNm: '',
//   mngrCnpl: '',
//   optrNm: '',
//   optrCnpl: '',
//   assoptrNm: '',
//   assoptrCnpl: '',
//   memo: '',
//   delYn: 'N',
//   rgtrId: '',
//   regDt: '',
//   mdfrId: '',
//   mdfcnDt: '',
//   structs: [],
// };

// const createDetailParams = ({
//   plantInfo,
//   eqpmntId,
// }: {
//   plantInfo: PlantInfoState;
//   eqpmntId?: string;
// }): PrdctnDetailParams => {
//   const pwplId = toTrimmedString(plantInfo.pwplId);
//   const fallback = toTrimmedString(eqpmntId ?? '');
//   const base = { eqpmntId: fallback };

//   if (pwplId) {
//     return { ...base, pwplId } as unknown as PrdctnDetailParams;
//   }

//   return base as unknown as PrdctnDetailParams;
// };

// export default function PlantForm({ eqpmntId, initialMode }: PlantFormProps) {
//   return (
//     <EqpmntCommonForm<
//       PrdctnCreateReq,
//       PrdctnUpdateReq,
//       PrdctnDeleteReq,
//       PrdctnDetailParams,
//       PrdctnDetailRes,
//       MasterCode,
//       StructState
//     >
//       eqpmntId={eqpmntId}
//       initialMode={initialMode}
//       srcTable="PRD"
//       listPath="/eqpmnt/prdctn"
//       title="현장 설비 정보"
//       subTitle="발전 생산 등록"
//       desc="발전소 현장 장비 등록 및 관리"
//       detailQueryKey="getPrdctnDetail"
//       listInvalidateHead='getPrdctnList'
//       structKeys={STRUCT_KEYS}
//       initialForm={initialForm}
//       createEmptyStructState={createEmptyStructState}
//       mapStructStateToPayload={mapStructStateToPayload}
//       buildStructGroupsFromDetail={buildStructGroupsFromDetail}
//       createDetailParams={createDetailParams}
//       useDetail={useGetPrdctnDetail}
//       useCreate={usePostPrdctnCreate}
//       useUpdate={usePostPrdctnUpdate}
//       useDelete={usePostPrdctnDelete}
//       buildUpdateBody={(baseBody, targetEqpmntId) => {
//         const body: PrdctnUpdateReq = {
//           ...baseBody,
//           eqpmntId: toTrimmedString(targetEqpmntId ?? baseBody.eqpmntId),
//         };
//         return body;
//       }}
//       buildDeleteBody={(targetEqpmntId) => {
//         const body: PrdctnDeleteReq = { eqpmntId: targetEqpmntId };
//         return body;
//       }}
//       renderStructTable={({ item, index, setStructValue, addStructGroup, removeStructGroup }) => {
//         return (
//           <EquipmentTable
//             value={item.value}
//             onChange={(key: MasterCode, value: string) => {
//               setStructValue(index, key, value);
//             }}
//             onAdd={addStructGroup}
//             onRemove={() => removeStructGroup(index)}
//             count={index}
//           />
//         );
//       }}
//     />
//   );
// }