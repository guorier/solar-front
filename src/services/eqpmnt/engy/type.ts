// services/eqpmnt/engy/type.ts

/* =======================================================================================
 * 1️⃣ 구조물 타입
 * ======================================================================================= */

export type EngyStructure = {
  status: string; // 상태 (I/U/D 등: 예시 U/D)
  // strtsSeq: number; // 구조물 순번
  instlYmd: string; // 설치일자 (YYYY-MM-DD)

  bttrycell: string; // 배터리셀
  bttrymdul: string; // 배터리모듈
  bttryrack: string; // 배터리랙
  heatmngSys: string; // 열관리시스템
  bttryMngDbc: string; // 배터리관리시스템(BMS)
  frftgDbc: string; // 소화설비
  gasDtctnDbc: string; // 가스감지설비
  essPrtcDbc: string; // ESS 보호장치
  essTrnsfrm: string; // ESS 변압기
  essSwchGear: string; // ESS 스위치기어
  enrgyMngDbc: string; // 에너지관리시스템(EMS)
  elpwrTrsfDbc: string; // 전력변환장치(PCS 등)
};

/* =======================================================================================
 * 2️⃣ 장비 타입 (상세/목록 공통)
 * ======================================================================================= */

export type EngyEquip = {
  eqpmntId: string;
  pwplId: string;

  mkrNm: string;
  mdlNm: string;
  serialNo: string;
  eqpmntKname: string;

  ip: string;
  macAddr: string;

  lnkgMth: string;
  lnkgMthNm: string;

  commProtocol: string;
  commProtocolNm: string;

  eqpmntStts: string;
  eqpmntSttsNm: string;

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

  // 대표 구조물
  strtsSeq: number;
  instlYmd: string;

  bttrycell: string;
  bttrymdul: string;
  bttryrack: string;
  heatmngSys: string;
  bttryMngDbc: string;
  frftgDbc: string;
  gasDtctnDbc: string;
  essPrtcDbc: string;
  essTrnsfrm: string;
  essSwchGear: string;
  enrgyMngDbc: string;
  elpwrTrsfDbc: string;

  structures: EngyStructure[];
};

/* =======================================================================================
 * 4️⃣ 상세
 * ======================================================================================= */

export type EngyDetailParams = {
  eqpmntId: string;
};

export type EngyDetailRes = EngyEquip;

/* =======================================================================================
 * 5️⃣ 요청용 구조물
 * ======================================================================================= */

export type EngyStructReq = {
  status: 'I' | 'U' | 'D';
  strtsSeq?: number;
  instlYmd: string;

  bttrycell: string;
  bttrymdul: string;
  bttryrack: string;
  heatmngSys: string;
  bttryMngDbc: string;
  frftgDbc: string;
  gasDtctnDbc: string;
  essPrtcDbc: string;
  essTrnsfrm: string;
  essSwchGear: string;
  enrgyMngDbc: string;
  elpwrTrsfDbc: string;
};

/* =======================================================================================
 * 6️⃣ 등록/수정/삭제
 * ======================================================================================= */

export type EngyCreateReq = {
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

  structs: EngyStructReq[];
};

export type EngyUpdateReq = EngyCreateReq;

export type EngyDeleteReq = {
  eqpmntId: string;
};

export type EngyCreateRes = {
  code: string;
  message: string;
  data?: unknown;
};

export type EngyUpdateRes = EngyCreateRes;
export type EngyDeleteRes = EngyCreateRes;
