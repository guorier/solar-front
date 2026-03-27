// src/services/eqpmnt/safety/type.ts

/* =======================================================================================
 * 1️⃣ 구조물 타입
 * ======================================================================================= */

export type SafetyStructure = {
  strtsSeq: number; // 구조물 순번
  instlYmd: string; // 설치일자 (YYYY-MM-DD)

  vdoSurvlnDbc: string; // 영상감시장치
  intrsnDtctnDbc: string; // 침입감시장치
  enexCntrlDbc: string; // 출입통제장치
  alarmDbc: string; // 경보장치
  fireSurvlnDbc: string; // 화재감시장치
  firsupDbc: string; // 소방설비
  flodngDtctnDbc: string; // 침수감시장치
  emgncyDbc: string; // 비상설비
  surgePrtcEqpmnt: string; // 서지보호장치
  lgthprtEqpm: string; // 피뢰설비
};

/* =======================================================================================
 * 2️⃣ 장비 타입 (상세/목록 공통)
 * ======================================================================================= */

export type SafetyEquip = {
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

  vdoSurvlnDbc: string;
  intrsnDtctnDbc: string;
  enexCntrlDbc: string;
  alarmDbc: string;
  fireSurvlnDbc: string;
  firsupDbc: string;
  flodngDtctnDbc: string;
  emgncyDbc: string;
  surgePrtcEqpmnt: string;
  lgthprtEqpm: string;

  structures: SafetyStructure[];
};


/* =======================================================================================
 * 4️⃣ 상세
 * ======================================================================================= */

export type SafetyDetailParams = {
  eqpmntId: string;
};

export type SafetyDetailRes = SafetyEquip;

/* =======================================================================================
 * 5️⃣ 요청용 구조물
 * ======================================================================================= */

export type SafetyStructReq = {
  status: 'I' | 'U' | 'D';
  strtsSeq?: number;
  instlYmd: string;

  vdoSurvlnDbc: string;
  intrsnDtctnDbc: string;
  enexCntrlDbc: string;
  alarmDbc: string;
  fireSurvlnDbc: string;
  firsupDbc: string;
  flodngDtctnDbc: string;
  emgncyDbc: string;
  surgePrtcEqpmnt: string;
  lgthprtEqpm: string;
};

/* =======================================================================================
 * 6️⃣ 등록/수정/삭제
 * ======================================================================================= */

export type SafetyCreateReq = {
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

  structs: SafetyStructReq[];
};

export type SafetyUpdateReq = SafetyCreateReq;

export type SafetyDeleteReq = {
  eqpmntId: string;
};

export type SafetyCreateRes = {
  code: string;
  message: string;
  data?: unknown;
};

export type SafetyUpdateRes = SafetyCreateRes;
export type SafetyDeleteRes = SafetyCreateRes;
