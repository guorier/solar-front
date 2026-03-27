// services/eqpmnt/intrcon/type.ts

/* =======================================================================================
 * 1️⃣ 구조물 타입
 * ======================================================================================= */

export type IntrconStructure = {
  strtsSeq: number;        // 구조물 순번
  instlYmd: string;        // 설치일자 (YYYY-MM-DD)

  prtcRelay: string;          // 보호계전기
  ifPrtcEqpmnt: string;       // 계통보호장치
  hvSwchGear: string;         // 고압 스위치기어
  lvSwchGear: string;         // 저압 스위치기어
  crsnggat: string;           // 접속반
  elpwrMeter: string;         // 전력량계
  elpwrQltyMeter: string;     // 전력품질계
  invldElpwrCmpnstr: string;  // 무효전력 보상장치
  emifilter: string;          // EMI 필터
  trnsfrm: string;            // 변압기
};


/* =======================================================================================
 * 2️⃣ 장비 타입 (상세/목록 공통)
 * ======================================================================================= */

export type IntrconEquip = {
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

  prtcRelay: string;
  ifPrtcEqpmnt: string;
  hvSwchGear: string;
  lvSwchGear: string;
  crsnggat: string;
  elpwrMeter: string;
  elpwrQltyMeter: string;
  invldElpwrCmpnstr: string;
  emifilter: string;
  trnsfrm: string;

  structures: IntrconStructure[];
};


/* =======================================================================================
 * 4️⃣ 상세
 * ======================================================================================= */

export type IntrconDetailParams = {
  eqpmntId: string;
};

export type IntrconDetailRes = IntrconEquip;

/* =======================================================================================
 * 5️⃣ 요청용 구조물
 * ======================================================================================= */

export type IntrconStructReq = {
  status: 'I' | 'U' | 'D';
  strtsSeq?: number;
  instlYmd: string;

  prtcRelay: string;
  ifPrtcEqpmnt: string;
  hvSwchGear: string;
  lvSwchGear: string;
  crsnggat: string;
  elpwrMeter: string;
  elpwrQltyMeter: string;
  invldElpwrCmpnstr: string;
  emifilter: string;
  trnsfrm: string;
};


/* =======================================================================================
 * 6️⃣ 등록/수정/삭제
 * ======================================================================================= */

export type IntrconCreateReq = {
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

  structs: IntrconStructReq[];
};

export type IntrconUpdateReq = IntrconCreateReq;

export type IntrconDeleteReq = {
  eqpmntId: string;
};

export type IntrconCreateRes = {
  code: string;
  message: string;
  data?: unknown;
};

export type IntrconUpdateRes = IntrconCreateRes;
export type IntrconDeleteRes = IntrconCreateRes;