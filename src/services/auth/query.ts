import { useMutation, useQuery } from '@tanstack/react-query';
import {
  postSignUpKey,
  postSignUpInfo,
  postAccountIdDuplicate,
  postPasswordVerify,
  postPasswordUpdate,
  getDepartmentList
} from './request';
import type {
  SignUpReq,
  AccountIdDuplicateReq,
  PasswordUpdateReq,
  PasswordVerifyReq,
} from './type';

// 공개 키 발급
export const usePostSignUpKey = () => {
  return useMutation({
    mutationKey: ['postSignUpKey'],
    mutationFn: () => postSignUpKey(),
  });
};

// 회원가입
export const usePostSignUpInfo = <T extends SignUpReq>() => {
  return useMutation({
    mutationKey: ['postSignUpInfo'],
    mutationFn: (payload: T) => postSignUpInfo(payload),
  });
};

// 회원가입 이메일 중복 확인
export const usePostAccountIdDuplicate = () => {
  return useMutation({
    mutationKey: ['postAccountIdDuplicate'],
    mutationFn: (payload: AccountIdDuplicateReq) => postAccountIdDuplicate(payload),
  });
};

// 비밀번호 확인
export const usePostPasswordVerify = () => {
  return useMutation({
    mutationKey: ['postPasswordVerify'],
    mutationFn: (payload: PasswordVerifyReq) => postPasswordVerify(payload),
  });
};

// 비밀번호 업데이트
export const usePostPasswordUpdate = () => {
  return useMutation({
    mutationKey: ['postPasswordUpdate'],
    mutationFn: (payload: PasswordUpdateReq) => postPasswordUpdate(payload),
  });
};


// 부서 구조 정보 조회
export const useGetDepartmentList = () => {
  return useQuery({
    queryKey: ['dept'],
    queryFn: () => getDepartmentList(),
  });
};
