// 장애 등급 타입
export type AlarmGrade = 'CRITICAL' | 'MAJOR' | 'MINOR' | 'WARNING' | 'NORMAL';

// [장애 모니터링] 소켓 타입
export type FaultSocket = {
  unqNo: string;
  macAddr: string;
  pwplId: string;
  alrmCd: string;
  alrmGrd: AlarmGrade;
  expln: string;
  eventRegDt: string;
  pwplNm: string;
  roadNmAddr: string;
  mkrNm: string;
  pbptSe: string;
  memo: string;
};

// [장애 모니터링] 장애 목록 Response 타입
export type FaultRes = {
  pwplIds: string;
  jsonDataList: FaultSocket[];
};

// [장애 모니터링] 장애 상태 변경(인지) Response 타입
export type FaultStatusRes = {
  successYn: 'Y' | 'N';
  statusCode: string;
  statusMessage: string;
  statusCause: string;
};

// [장애 모니터링] 장애 상태 변경(수동종료) Request 타입
export type ManualDownReq = {
  acntId: string;
  verifiedCode: string;
  unqNo: string;
};
