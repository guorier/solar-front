// services/eqpmnt/oper/type.ts

/* =======================================================================================
 * 1️⃣ 구조물 타입
 * ======================================================================================= */

export type OperStructure = {
  strtsSeq: number;        // 구조물 순번
  instlYmd: string;        // 설치일자 (YYYY-MM-DD)

  rmotTrmnlDbc: string;    // 원격 단말 장치
  ctrlDbc: string;         // 제어 장치
  gatewy: string;          // 게이트웨이
  operIfDbc: string;       // 운영 인터페이스 장치
  chckDbc: string;         // 점검 장치
  prmsCommDbc: string;     // 구내 통신 장치
  rmotCommDbc: string;     // 원격 통신 장치
  jbsrsCommDbc: string;    // 직렬 통신 장치
  operSrvrDbc: string;     // 운영 서버 장치
  dataSrvrDbc: string;     // 데이터 서버 장치
  mngSrvrDbc: string;      // 관리 서버 장치
  unpwPowrDbc: string;     // 무정전 전원 장치
  powrSplyDbc: string;     // 전원 공급 장치
  hrSyncDbc: string;       // 시간 동기 장치
  lcalCtrlDbc: string;     // 로컬 제어 장치
  rmotCtrlDbc: string;     // 원격 제어 장치
  mntnCntn: string;        // 유지보수 접속
  rmotCntnDbc: string;     // 원격 접속 장치
  operMeasDbc: string;     // 운영 계측 장치
};


/* =======================================================================================
 * 2️⃣ 장비 타입 (상세/목록 공통)
 * ======================================================================================= */

export type OperEquip = {
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

  structures: OperStructure[];
};


/* =======================================================================================
 * 3️⃣ 상세
 * ======================================================================================= */

export type OperDetailParams = {
  eqpmntId: string;
};

export type OperDetailRes = OperEquip;


/* =======================================================================================
 * 4️⃣ 요청용 구조물
 * ======================================================================================= */

export type OperStructureReq = {
  status: 'I' | 'U' | 'D'; // 상태 (I: 등록, U: 수정, D: 삭제)
  strtsSeq?: number;        // 구조물 순번
  instlYmd: string;        // 설치일자 (YYYY-MM-DD)

  rmotTrmnlDbc: string;    // 원격 단말 장치
  ctrlDbc: string;         // 제어 장치
  gatewy: string;          // 게이트웨이
  operIfDbc: string;       // 운영 인터페이스 장치
  chckDbc: string;         // 점검 장치
  prmsCommDbc: string;     // 구내 통신 장치
  rmotCommDbc: string;     // 원격 통신 장치
  jbsrsCommDbc: string;    // 직렬 통신 장치
  operSrvrDbc: string;     // 운영 서버 장치
  dataSrvrDbc: string;     // 데이터 서버 장치
  mngSrvrDbc: string;      // 관리 서버 장치
  unpwPowrDbc: string;     // 무정전 전원 장치
  powrSplyDbc: string;     // 전원 공급 장치
  hrSyncDbc: string;       // 시간 동기 장치
  lcalCtrlDbc: string;     // 로컬 제어 장치
  rmotCtrlDbc: string;     // 원격 제어 장치
  mntnCntn: string;        // 유지보수 접속
  rmotCntnDbc: string;     // 원격 접속 장치
  operMeasDbc: string;     // 운영 계측 장치
};


/* =======================================================================================
 * 5️⃣ 등록 / 수정 / 삭제
 * ======================================================================================= */

export type OperCreateReq = {
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

  structs: OperStructureReq[];
};

export type OperUpdateReq = OperCreateReq;

export type OperDeleteReq = {
  eqpmntId: string;
};


/* =======================================================================================
 * 6️⃣ 공통 응답
 * ======================================================================================= */

export type OperCommandRes = {
  code: string;
  message: string;
  data?: unknown;
};

export type OperCreateRes = OperCommandRes;
export type OperUpdateRes = OperCommandRes;
export type OperDeleteRes = OperCommandRes;