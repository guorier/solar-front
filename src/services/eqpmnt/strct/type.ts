// equipment/strct/type.ts

/* =======================================================================================
 * 1️⃣ 구조물 타입
 * ======================================================================================= */

export type StrctStructure = {
  strtsSeq:        number;         // 구조물 순번
  instlYmd:        string;         // 설치일자 (YYYY-MM-DD)
  archMainfrm:     string;         // 아치 메인프레임
  mdulEqpm:        string;         // 모듈 장착 장비
  bscsStrts:       string;         // 기초 구조물
  sbsdDbc:         string;         // 부속 DBC
  crsnggatDbc:     string;         // 크로싱게이트 DBC
  lightngDbc:      string;         // 조명 DBC
  emgncyPowrDbc:   string;         // 비상전원 DBC
  elcegrm:         string;         // 전기 계통도
  centrlCtrlrm:    string;         // 중앙 제어실
  trckr:           string;         // 트래커
  enexdor:         string;         // 인클로저 도어
};

export type StrctEquip = {
  eqpmntId:        string;         // 장비 아이디
  pwplId:          string;         // 발전소 아이디

  mkrNm:           string;         // 제조사명
  mdlNm:           string;         // 모델명
  serialNo:        string;         // 시리얼번호
  eqpmntKname:     string;         // 장비 한글명

  ip:              string;         // IP
  macAddr:         string;         // MAC 주소

  lnkgMth:         string;         // 연결 방식 코드
  lnkgMthNm:       string;         // 연결 방식 코드명

  commProtocol:    string;         // 통신 프로토콜 코드
  commProtocolNm:  string;         // 통신 프로토콜 코드명

  eqpmntStts:      string;         // 장비 상태 코드
  eqpmntSttsNm:    string;         // 장비 상태 코드명

  eqpmntVer:       string;         // 장비 버전

  bldrNm:          string;         // 시공사명
  bldrCnpl:        string;         // 시공사 연락처

  mngrNm:          string;         // 주 담당자명
  mngrCnpl:        string;         // 주 담당자 연락처

  optrNm:          string;         // 운영 담당자명
  optrCnpl:        string;         // 운영 담당자 연락처

  assoptrNm:       string;         // 부 담당자명
  assoptrCnpl:     string;         // 부 담당자 연락처

  memo:            string;         // 메모
  delYn:           string;         // 삭제 여부 (Y/N)

  rgtrId:          string;         // 등록자 아이디
  regDt:           string;         // 등록일시

  mdfrId:          string;         // 수정자 아이디
  mdfcnDt:         string;         // 수정일시

  strtsSeq:        number;         // (대표) 구조물 순번

  instlYmd:        string;         // (대표) 설치일자
  archMainfrm:     string;         // (대표) 아치 메인프레임
  mdulEqpm:        string;         // (대표) 모듈 장착 장비
  bscsStrts:       string;         // (대표) 기초 구조물
  sbsdDbc:         string;         // (대표) 부속 DBC
  crsnggatDbc:     string;         // (대표) 크로싱게이트 DBC
  lightngDbc:      string;         // (대표) 조명 DBC
  emgncyPowrDbc:   string;         // (대표) 비상전원 DBC
  elcegrm:         string;         // (대표) 전기 계통도
  centrlCtrlrm:    string;         // (대표) 중앙 제어실
  trckr:           string;         // (대표) 트래커
  enexdor:         string;         // (대표) 인클로저 도어

  structures:      StrctStructure[]; // 구조물 목록
};

/* =======================================================================================
 * 3️⃣ 목록
 * ======================================================================================= */

export type StrctListParams = {
  page?:           number;         // 페이지 번호 (int32)
  size?:           number;         // 페이지 크기 (int32)
};

export type StrctListRes = {
  items:           StrctEquip[];          // 목록 아이템
  total:           number;         // 전체 건수
  page:            number;         // 현재 페이지
  size:            number;         // 페이지 크기
};

/* =======================================================================================
 * 4️⃣ 상세
 * ======================================================================================= */

export type StrctDetailParams = {
  eqpmntId:        string;         // 장비 아이디
};

export type StrctDetailRes = StrctEquip;

/* =======================================================================================
 * 5️⃣ 요청용 구조물
 * ======================================================================================= */
export type StrctStructReq = {
  status: 'I' | 'U' | 'D';         // 상태 (U:수정/등록, D:삭제)
  strtsSeq?:        number;         // 구조물 순번
  instlYmd:        string;         // 설치일자
  archMainfrm:     string;         // 아치 메인프레임
  mdulEqpm:        string;         // 모듈 장착 장비
  bscsStrts:       string;         // 기초 구조물
  sbsdDbc:         string;         // 부속 DBC
  crsnggatDbc:     string;         // 크로싱게이트 DBC
  lightngDbc:      string;         // 조명 DBC
  emgncyPowrDbc:   string;         // 비상전원 DBC
  elcegrm:         string;         // 전기 계통도
  centrlCtrlrm:    string;         // 중앙 제어실
  trckr:           string;         // 트래커
  enexdor:         string;         // 인클로저 도어
};

/* =======================================================================================
 * 6️⃣ 등록/수정/삭제
 * ======================================================================================= */

export type StrctCreateReq = {
  eqpmntId:        string;         // 장비 아이디
  pwplId:          string;         // 발전소 아이디

  mkrNm:           string;         // 제조사명
  mdlNm:           string;         // 모델명
  serialNo:        string;         // 시리얼번호
  eqpmntKname:     string;         // 장비 한글명

  ip:              string;         // IP
  macAddr:         string;         // MAC 주소

  lnkgMth:         string;         // 연결 방식 코드
  commProtocol:    string;         // 통신 프로토콜 코드

  eqpmntStts:      string;         // 장비 상태 코드
  eqpmntVer:       string;         // 장비 버전

  bldrNm:          string;         // 시공사명
  bldrCnpl:        string;         // 시공사 연락처

  mngrNm:          string;         // 주 담당자명
  mngrCnpl:        string;         // 주 담당자 연락처

  optrNm:          string;         // 운영 담당자명
  optrCnpl:        string;         // 운영 담당자 연락처

  assoptrNm:       string;         // 부 담당자명
  assoptrCnpl:     string;         // 부 담당자 연락처

  memo:            string;         // 메모
  delYn:           string;         // 삭제 여부

  rgtrId:          string;         // 등록자 ID
  regDt:           string;         // 등록 일시
  mdfrId:          string;         // 수정자 ID
  mdfcnDt:         string;         // 수정 일시

  structs:      StrctStructReq[]; // 구조물 목록 (요청)
};

export type StrctUpdateReq = StrctCreateReq;

export type StrctDeleteReq = {
  eqpmntId:        string;         // 장비 아이디
};

export type StrctCreateRes = {
  code:            string;         // 결과 코드
  message:         string;         // 결과 메시지
  data?:           unknown;        // 응답 데이터
};

export type StrctUpdateRes = StrctCreateRes;
export type StrctDeleteRes = StrctCreateRes;