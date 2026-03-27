// src/services/eqpmnt/meas/type.ts

/* =======================================================================================
 * 1️⃣ 구조물 타입
 * ======================================================================================= */

export type MeasStructure = {
  strtsSeq: number; // 구조물 순번
  instlYmd: string; // 설치일자 (YYYY-MM-DD)

  srqtyMeter: string; // 일사량계
  tpMeter: string; // 온도계
  humMeter: string; // 습도계
  wspdMeter: string; // 풍속계
  prcpMeter: string; // 강우계
  airqultyMeter: string; // 대기질측정기
  wtherObsrvnEqpmnt: string; // 기상관측장비
  pollutionMete: string;
};

/* =======================================================================================
 * 2️⃣ 장비 타입 (상세/목록 공통)
 * ======================================================================================= */

export type MeasEquip = {
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

  srqtyMeter: string;
  tpMeter: string;
  humMeter: string;
  wspdMeter: string;
  prcpMeter: string;
  airqultyMeter: string;
  wtherObsrvnEqpmnt: string;

  structures: MeasStructure[];
};


/* =======================================================================================
 * 4️⃣ 상세
 * ======================================================================================= */

export type MeasDetailParams = {
  eqpmntId: string;
};

export type MeasDetailRes = MeasEquip;

/* =======================================================================================
 * 5️⃣ 요청용 구조물
 * ======================================================================================= */

export type MeasStructReq = {
  status: 'I' | 'U' | 'D';
  strtsSeq?: number;
  instlYmd: string;

  srqtyMeter: string;
  tpMeter: string;
  humMeter: string;
  wspdMeter: string;
  prcpMeter: string;
  airqultyMeter: string;
  wtherObsrvnEqpmnt: string;
};

/* =======================================================================================
 * 6️⃣ 등록/수정/삭제
 * ======================================================================================= */

export type MeasCreateReq = {
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

  structs: MeasStructReq[];
};

export type MeasUpdateReq = MeasCreateReq;

export type MeasDeleteReq = {
  eqpmntId: string;
};

export type MeasCreateRes = {
  code: string;
  message: string;
  data?: unknown;
};

export type MeasUpdateRes = MeasCreateRes;
export type MeasDeleteRes = MeasCreateRes;