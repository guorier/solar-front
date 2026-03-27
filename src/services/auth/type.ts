// 키 발급 Response 타입
export type SignUpKeyRes = {
  acntUnqNo: string | null;
  pwplTypeCd: string | null;
  name: string | null;
  useYn: string | null;
  publicKey: string;
  status: string;
  uuId: string;
};

// 회원가입 Request 공통 타입
export type CommonSignUpReq = {
  name: string;
  publicKey: string;
  uuId: string;
  seCd: string;
  acntId: string;
  pswd: string;
  eml?: string;
  phone: string;
};

// 일반 회원가입 Request 타입
export type UserSignUpReq = CommonSignUpReq & {
  snsToken?: string;
  gndr?: string;
  birth?: string;
  zip?: string;
  lotnoAddr?: string;
  roadNmAddr?: string;
  lctnDtlAddr?: string;
  bzmnNo?: string;
  bzmnNm?: string;
  bzmnZip?: string;
  bzmnLotnoAddr?: string;
  bzmnRoadAddr?: string;
  bzmnDtlAddr?: string;
  agreYn: 'Y' | 'N';
  chcYn?: 'Y' | 'N';
};

// 관리자 회원가입 Request 타입
export type AdminSignUpReq = CommonSignUpReq & {
  deptCd: string;
  deptName: string;
  jbgdName?: string;
  taskCn?: string;
};

// 회원가입 Request 타입
export type SignUpReq = UserSignUpReq | AdminSignUpReq;

// 응답 Response 타입
export type StatusResultRes = {
  successYn: 'Y' | 'N';
  statusCode: string;
  statusMessage: string;
  statusCause: string;
};

// 이메일 중복 확인 Request 타입
export type AccountIdDuplicateReq = {
  acntId: string;
  classify?: string;
};

// 이메일 중복 확인 Response 타입
export type AccountIdDuplicateRes = StatusResultRes;

// 로그인 Request 타입
export type LoginReq = {
  acntId: string;
  pswd: string;
  uuId: string;
  seCd?: string;
  hashKey: string;
  classify?: string;
};

// 로그인 Response 타입
export type LoginRes = StatusResultRes & {
  verifiedCode: string;
};

// 로그인 인증 Request 타입
export type TFactAuthReq = {
  hashKey: string;
  verifiedCode: string;
  classify?: string;
};

// 토큰 Response 타입
export type AccessTokenClaims = {
  exp: number;
  iat: number;
  iss: string;
  jti: string;
  sub: string;

  acntId: string;
  hasPermission: boolean;
  acntUnqNo: string;
  pwplTypeCd: string;
  nm: string;
  hashKey: string;
  verifiedCode: string;
  snsToken: string;
  pridtfScrtyId: string;
  grd: string;
  joinTypeCd: string;
  level: string;
  verificationCode: string;
  renewCode: string;
  groupCd: string;
};

// 토큰 재발급 Request 타입
export type SessionRenewReq = {
  acntUnqNo: string;
  verificationCode: string;
  renewCode: string;
  classify?: string;
};

// 비밀번호 확인 Request 타입
export type PasswordVerifyReq = {
  publicKey: string;
  uuId: string;
  acntId: string;
  pswd: string;
  classify: string;
  verificationCode: string;
};

// 비밀번호 업데이트 Request 타입
export type PasswordUpdateReq = {
  publicKey: string;
  uuId: string;
  acntId: string;
  pswd: string;
  classify: string;
  verifiedCode: string;
};

export type DepartmentRes = {
  deptName: string;
  deptCd: string;
  upDeptCd: string;
  children: DepartmentRes[] | null;
};
