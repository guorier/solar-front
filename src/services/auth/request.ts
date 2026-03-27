import { apiClient, serverApi } from '@/lib/http.lib';
import {
  AccountIdDuplicateReq,
  TFactAuthReq,
  LoginReq,
  SignUpReq,
  SessionRenewReq,
  PasswordVerifyReq,
  PasswordUpdateReq,
} from './type';

/**
 * 규칙
 * - 회원 API는 apiClient 사용 (baseURL: /solar/api)
 * - 절대 백엔드 URL 직접 쓰지 않음
 * - 인증 불필요: headers 'X-SKIP-AUTH': true
 * - 인증 필요: 헤더 제거 (인터셉터가 Authorization 자동 첨부)
 * - Next app/api 라우트로 프록시 안 씀 (rewrites 사용)
 *
 * 최종 요청 흐름(회원 API):
 * 브라우저 → /solar/api/acnt/...
 * Next rewrites → {NEXT_PUBLIC_API_URL}/api/acnt/...
 */

// 키 발급 API
export const postSignUpKey = async () => {
  const { data } = await apiClient.post('/acnt/signUpKey');
  return data;
};

// 회원가입 API
export const postSignUpInfo = async <T extends SignUpReq>(signUpInfo: T) => {
  const { data } = await apiClient.post('/acnt/signUpInfo', signUpInfo);
  return data;
};

// 회원가입 이메일 중복 확인 API
export const postAccountIdDuplicate = async (payload: AccountIdDuplicateReq) => {
  const { data } = await apiClient.post('/acnt/acntId', payload);
  return data;
};

// 로그인 API
export const postLogin = (loginInfo: LoginReq) => serverApi.post(`/acnt/login`, loginInfo);

// 로그인 인증 API
export const postFactAuth = (payload: TFactAuthReq) => serverApi.post('/acnt/tFactAuth', payload);

// 토큰 연장 API
export const postSessionRenew = (payload: SessionRenewReq) =>
  serverApi.post('/acnt/sessionRenew', payload);

// 부서 구조 정보 조회 API
export const getDepartmentList = async () => {
  const { data } = await apiClient.get('/acnt/dept');
  return data;
};


// 비밀번호 확인
export const postPasswordVerify = async (payload: PasswordVerifyReq) => {
  const { data } = await apiClient.post('/acnt/myPass', payload);
  return data;
};

// 비밀번호 업데이트
export const postPasswordUpdate = async (payload: PasswordUpdateReq) => {
  const { data } = await apiClient.post('/acnt/changePwd', payload);
  return data;
};
