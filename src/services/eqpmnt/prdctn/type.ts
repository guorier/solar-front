// src/services/eqpmnt/prdctn/type.ts

/* =======================================================================================
 * 1️⃣ 집전장비
 * ======================================================================================= */

export type PrdctnClctItem = {
  clctSeq: number;
  cntnpnlDbc: string;
  dcDstrbutnDbc: string;
  cable: string;
  connctor: string;
};

/* =======================================================================================
 * 2️⃣ 태양광장비
 * ======================================================================================= */

export type PrdctnSlrItem = {
  slrSeq: number;
  mkrNm: string;
  mdlNm: string;
  serialNo: string;
  eqpmntKname: string;
  slrcellDbc: string;
  arrayDbc: string;
  slrpwrMdulDbc: string;
};

/* =======================================================================================
 * 3️⃣ 변환장비
 * ======================================================================================= */

export type PrdctnConvItem = {
  convSeq: number;
  mkrNm: string;
  mdlNm: string;
  serialNo: string;
  eqpmntKname: string;
  invtrDbc: string;
  filtrDbc: string;
};

/* =======================================================================================
 * 4️⃣ 상세
 * ======================================================================================= */

export type PrdctnDetailParams = {
  eqpmntId: string;
};

export type PrdctnDetailRes = {
  pwplId: string;
  eqpmntId: string;
  mkrNm: string;
  mdlNm: string;
  serialNo: string;
  eqpmntKname: string;
  ip: string;
  macAddr: string;
  lnkgMth: string;
  lnkgMthNm?: string;
  commProtocol: string;
  commProtocolNm?: string;
  eqpmntVer: string;
  eqpmntStts: string;
  eqpmntSttsNm?: string;
  instlYmd: string;
  bldrNm: string;
  bldrCnpl: string;
  mngrNm: string;
  mngrCnpl: string;
  optrNm: string;
  optrCnpl: string;
  assoptrNm: string;
  assoptrCnpl: string;
  memo: string;
  rgtrId: string;
  mdfrId: string;
  regDt?: string;
  mdfcnDt?: string;
  delYn?: string;

  pwplNm?: string;
  lctnZip?: string;
  roadNmAddr?: string;
  lctnLotnoAddr?: string;
  lctnDtlAddr?: string;

  clctItems: PrdctnClctItem[];
  slrItems: PrdctnSlrItem[];
  convItems: PrdctnConvItem[];
};

/* =======================================================================================
 * 5️⃣ 요청용 아이템
 * ======================================================================================= */

export type PrdctnClctItemReq = {
  clctSeq?: number;
  cntnpnlDbc: string;
  dcDstrbutnDbc: string;
  cable: string;
  connctor: string;
};

export type PrdctnSlrItemReq = {
  slrSeq?: number;
  mkrNm: string;
  mdlNm: string;
  serialNo: string;
  eqpmntKname: string;
  slrcellDbc: string;
  arrayDbc: string;
  slrpwrMdulDbc: string;
};

export type PrdctnConvItemReq = {
  convSeq?: number;
  mkrNm: string;
  mdlNm: string;
  serialNo: string;
  eqpmntKname: string;
  invtrDbc: string;
  filtrDbc: string;
};

/* =======================================================================================
 * 6️⃣ 등록/수정/삭제
 * ======================================================================================= */

export type PrdctnCreateReq = {
  pwplId: string;
  mkrNm: string;
  mdlNm: string;
  serialNo: string;
  eqpmntKname: string;
  ip: string;
  macAddr: string;
  lnkgMth: string;
  commProtocol: string;
  eqpmntVer: string;
  eqpmntStts: string;
  instlYmd: string;
  bldrNm: string;
  bldrCnpl: string;
  mngrNm: string;
  mngrCnpl: string;
  optrNm: string;
  optrCnpl: string;
  assoptrNm: string;
  assoptrCnpl: string;
  memo: string;
  rgtrId: string;
  mdfrId: string;
  clctItems: PrdctnClctItemReq[];
  slrItems: PrdctnSlrItemReq[];
  convItems: PrdctnConvItemReq[];
};

export type PrdctnUpdateReq = PrdctnCreateReq & {
  eqpmntId: string;
};

export type PrdctnDeleteReq = {
  eqpmntId: string;
};

export type PrdctnCreateRes = {
  code: string;
  message: string;
  data?: unknown;
};

export type PrdctnUpdateRes = PrdctnCreateRes;
export type PrdctnDeleteRes = PrdctnCreateRes;