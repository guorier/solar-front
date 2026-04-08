// services/plant/base/type.ts

/**
 * 발전소 기본 엔티티 타입
 * - DB 및 상세조회 응답 기준 모델
 */
export type PlantBase = {
  pwplId: string; // 발전소 ID (PK)
  pwplNm: string; // 발전소명
  pwplTypeCd: string | null; // 발전소 유형 코드
  pwplTypeNm: string | null; // 발전소 유형 명
  pwplSttsCd: string | null; // 발전소 상태 코드
  pwplSttsNm: string | null; // 발전소 상태 명
  pwplSclCd: string | null; // 발전소 규모 코드
  pwplSclNm: string | null; // 발전소 규모 명
  designCpct: number | null; // 설계용량
  instlCpct: number | null; // 설치용량
  lctnZip: string; // 우편번호
  roadNmAddr: string; // 도로명 주소
  lctnLotnoAddr: string; // 지번 주소
  lctnDtlAddr: string | null; // 상세 주소
  pwplLat: number; // 위도
  pwplLot: number; // 경도
  pwplXcrd: number; // X좌표
  pwplYcrd: number; // Y좌표
  pltar: number | null; // 부지면적
  premsShpNm: string | null; // 건물 형태명
  eqpmntQty: number | null; // 설비 수량
  systmVltg: number | null; // 시스템 전압
  grdnt: number | null; // 경사도
  az: number | null; // 방위각
  pr: number; // pr 성능비 (%) (swagger: integer/int32)
  bldgStrctNm: string | null; // 건축 구조명
  instlPlcNm: string | null; // 설치 장소명
  infraNm: string | null; // 인프라명
  asstFlctNm: string | null; // 자산 설비명
  ownrNm: string | null; // 소유자명
  operCoNm: string | null; // 운영사명
  cnstCoNm: string | null; // 시공사명
  instlYmd: string | null; // 설치일자
  cmrcoprYmd: string | null; // 상업운전일자
  pwplExpln: string | null; // 설명
  delYn: 'Y' | 'N'; // 삭제 여부
  rgtrId: string | null; // 등록자 ID
  mdfrId: string | null; // 수정자 ID
  loginId: string | null; // 로그인 ID
  regDt: string; // 등록일시
  mdfcnDt: string | null; // 수정일시
  msrstnNm: string | null; // 측정소명
  weight: number | null; // 가중치
};

/**
 * 발전소 목록 조회 응답 타입
 */
export type PlantBaseListRes = {
  items: PlantBase[]; // 목록 데이터
  total: number; // 전체 건수
  page: number; // 현재 페이지
  size: number; // 페이지 사이즈
};

/**
 * 발전소 목록 조회 파라미터
 */
export type PlantBaseListParams = {
  page?: number;
  size?: number;
};

/**
 * 발전소 등록 요청 타입
 */
export type PlantBaseCreateReq = {
  pwplIdPrefix: string; // 아이디 생성값
  pwplId: string; // 발전소 아이디

  pwplNm: string; // 발전소명
  pwplTypeCd: string; // 발전소 유형 코드
  pwplSttsCd: string; // 발전소 상태 코드
  pwplSclCd: string; // 발전소 규모 코드

  designCpct: number; // 설계 용량
  instlCpct: number; // 설치 용량

  lctnZip: string; // 소재지 우편번호
  roadNmAddr: string; // 도로 명 주소
  lctnLotnoAddr: string; // 소재지 지번 주소
  lctnDtlAddr: string; // 소재지 상세 주소

  pwplLat: number; // 발전소 위도
  pwplLot: number; // 발전소 경도
  pwplXcrd: number; // 발전소 X좌표 (swagger: integer/int32)
  pwplYcrd: number; // 발전소 Y좌표 (swagger: integer/int32)

  pmMsrstn: string; // 미세먼지 측정소

  pltar: number; // 부지면적
  premsShpNm: string; // 부지 형태 명

  eqpmntQty: number; // 장비 수량
  systmVltg: number; // 제도 전압
  grdnt: number; // 경사도
  az: number; // 방위각
  pr: number; // pr 성능비 (%) (swagger: integer/int32)

  bldgStrctNm: string; // 건물 구조 명
  instlPlcNm: string; // 설치 장소 명
  infraNm: string; // 기반 명
  asstFlctNm: string; // 보조 시설 명

  ownrNm: string; // 소유자 명
  operCoNm: string; // 운영 회사 명
  cnstCoNm: string; // 시공 회사 명

  instlYmd: string; // 설치 일자
  cmrcoprYmd: string; // 상업운전 일자

  weight: number; // 가중치

  pwplExpln: string; // 발전소 설명
  delYn: string; // 삭제 여부

  regDt: string; // 등록 일시
  rgtrId: string; // 등록자 아이디
  mdfrId: string; // 수정자 아이디
  loginId: string; // 수정자 아이디
  mdfcnDt: string; // 수정 일시

  bcode: string; // 법정동코드

  address: string;
  jibunAddress: string; // 지번주소
  roadAddress: string; // 도로명
  sido: string; // 시/도
  zonecode: string; // 우편번호
};

/**
 * 발전소 등록 응답 타입
 */
export type PlantBaseCreateRes = {
  code: string; // 응답 코드
  message: string; // 메시지
  data?: unknown; // 추가 데이터
};

/**
 * 발전소 상세 조회 요청 파라미터
 */
export type PlantBaseDetailParams = {
  pwplId: string; // 발전소 ID (PK)
};

/**
 * 발전소 상세 조회 응답 타입
 * - 단건 조회이므로 PlantBase 사용
 */
export type PlantBaseDetailRes = {
  pwplId: string;
  pwplNm: string;
  pwplTypeCd: string | null;
  pwplSttsCd: string | null;
  pwplSclCd: string | null;
  designCpct: number | null;
  instlCpct: number | null;
  lctnZip: string;
  roadNmAddr: string;
  lctnLotnoAddr: string;
  lctnDtlAddr: string | null;
  pwplLat: number;
  pwplLot: number;
  pwplXcrd: number;
  pwplYcrd: number;
  pmMsrstn: string | null;
  pltar: number | null;
  premsShpNm: string | null;
  eqpmntQty: number | null;
  systmVltg: number | null;
  grdnt: number | null;
  az: number | null;
  pr: number | null;
  weight: number | null; // 가중치
  bldgStrctNm: string | null;
  instlPlcNm: string | null;
  infraNm: string | null;
  asstFlctNm: string | null;
  ownrNm: string | null;
  operCoNm: string | null;
  cnstCoNm: string | null;
  instlYmd: string | null;
  cmrcoprYmd: string | null;
  pwplExpln: string | null;
  delYn: 'Y' | 'N';
  rgtrId: string | null;
  regDt: string;
  mdfrId: string | null;
  mdfcnDt: string | null;
};

/**
 * 발전소 수정 요청 타입
 * - pwplId 필수
 * - 등록 관련 필드는 제외
 */
export type PlantBaseUpdateReq = {
  pwplId: string; // 발전소 ID (PK)
  pwplNm: string; // 발전소명
  pwplTypeCd: string | null;
  pwplSttsCd: string | null;
  pwplSclCd: string | null;
  designCpct: number | null;
  instlCpct: number | null;
  lctnZip: string;
  roadNmAddr: string;
  lctnLotnoAddr: string;
  lctnDtlAddr: string | null;
  pwplLat: number;
  pwplLot: number;
  pwplXcrd: number;
  pwplYcrd: number;
  pmMsrstn: string | null;
  pltar: string | null;
  premsShpNm: string | null;
  eqpmntQty: string | null;
  systmVltg: string | null;
  grdnt: string | null;
  az: string | null;
  pr: number | null;
  weight: number | null; // 가중치
  bldgStrctNm: string | null;
  instlPlcNm: string | null;
  infraNm: string | null;
  asstFlctNm: string | null;
  ownrNm: string | null;
  operCoNm: string | null;
  cnstCoNm: string | null;
  instlYmd: string | null;
  cmrcoprYmd: string | null;
  pwplExpln: string | null;
  mdfrId: string; // 수정자 ID
};

/**
 * 발전소 수정 응답 타입
 */
export type PlantBaseUpdateRes = {
  code: string;
  message: string;
};

/**
 * 발전소 삭제 요청 타입
 * POST /api/plant/base/delete
 */
export type PlantBaseDeleteReq = {
  pwplId: string; // 발전소 아이디 (PK)
};

/**
 * 발전소 삭제 응답 타입
 */
export type PlantBaseDeleteRes = {
  code: string;
  message: string;
  data?: unknown;
};

export interface PlantBaseComboItem {
  [key: string]: unknown;
  pwplId: string;
  pwplNm: string;
  pwplLat: number;
  pwplLot: number;
  macAddr: string;
}

export type PlantBaseComboRes = PlantBaseComboItem[];

export type PlantEqpmntPop = {
  pwplId: string;
  pwplNm: string;
  pwplLat: number | null;
  pwplLot: number | null;
  macAddr: string | null;
};

export type PlantEqpmntPopParams = {
  srcTable: string;
  page: number;
  size: number;
};