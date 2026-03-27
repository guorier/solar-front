import z from 'zod';

// 공통 이메일 스키마
const emailSchema = z
  .string()
  .min(1, '이메일을 입력해 주세요.')
  .min(6, '이메일은 최소 6자 이상 입력해 주세요.')
  .max(25, '이메일은 최대 25자 이하로 입력해 주세요.')
  .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, '이메일 형식에 맞지 않습니다.');

// 공통 비밀번호 스키마
const passwordSchema = z
  .string()
  .nonempty('비밀번호를 입력해 주세요.')
  .min(8, '비밀번호는 최소 8자리 이상 입력해 주세요.')
  .max(30, '비밀번호는 최대 30자리 이하로 입력해 주세요.');

// 공통 이름 스키마
const nameSchema = z
  .string()
  .nonempty('이름을 입력해 주세요.')
  .min(2, '최소 2자 이상 입력해 주세요.')
  .max(20, '20자 이내로 입력해 주세요.')
  .regex(/^[가-힣a-zA-Z]+$/, '한글과 영문만 입력할 수 있습니다.');

// 공통 연락처 스키마
const phoneSchema = z
  .string()
  .nonempty('연락처를 입력해주세요.')
  .transform((v) => v.replace(/\D/g, ''))
  .refine((v) => /^\d{10,11}$/.test(v), {
    message: '연락처는 하이픈 제외 10~11자리 숫자로 입력해주세요.',
  });

// 일반 로그인 스키마
export const loginSchema = z.object({
  acntId: emailSchema,
  pswd: passwordSchema,
  uuId: z.string(),
  seCd: z.string(),
  hashKey: z.string(),
});

// 관리자 로그인 스키마
export const adminLoginSchema = loginSchema.extend({
  classify: z.string().optional().or(z.literal('')),
});

// 공통 계정 생성 스키마
export const commonSignupSchema = z
  .object({
    publicKey: z.string(),
    uuId: z.string(),
    seCd: z.string().nonempty('가입구분을 선택해주세요.'),

    acntId: emailSchema,
    eml: z
      .string()
      .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, '이메일 형식에 맞지 않습니다.')
      .optional()
      .or(z.literal('')),
    pswd: passwordSchema.regex(
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).+$/,
      '비밀번호는 영문, 숫자, 특수문자를 각각 1개 이상 포함해야 합니다',
    ),
    pswdConfirm: passwordSchema.optional(),

    name: nameSchema,
    phone: phoneSchema,
  })
  .refine((data) => data.pswd === data.pswdConfirm, {
    path: ['pswdConfirm'],
    message: '비밀번호가 일치하지 않습니다.',
  });

// 관리자 계정 발급 신청(회원가입) 스키마
export const adminSignupSchema = commonSignupSchema.extend({
  deptCd: z.string().nonempty('조직명을 선택해주세요.'),
  deptName: z.string().nonempty('조직명을 선택해주세요.'),
  jbgdName: z
    .string()
    .max(15, '15자 이내로 입력해 주세요.')
    .regex(/^[가-힣A-Za-z0-9]+$/, '한글, 영문, 숫자만 입력 가능합니다')
    .optional()
    .or(z.literal('')),
  taskCn: z.string().max(100, '100자 이내로 입력해 주세요.').optional().or(z.literal('')),
});

// 일반 회원가입 스키마
export const userSignupSchema = commonSignupSchema.extend({
  snsToken: z.string().optional().or(z.literal('')),
  gndr: z.string().optional().or(z.literal('')),
  birth: z
    .string()
    .max(8, '생년월일은 8자리 이내입니다.')
    .regex(/^\d+$/, '숫자만 입력 가능합니다.')
    .optional()
    .or(z.literal('')),

  zip: z.string().optional().or(z.literal('')),
  lotnoAddr: z.string().optional().or(z.literal('')),
  roadNmAddr: z.string().optional().or(z.literal('')),
  lctnDtlAddr: z.string().optional().or(z.literal('')),

  bzmnNo: z
    .string()
    .max(10, '최대 10자리까지 입력 가능합니다.')
    .regex(/^\d+$/, '숫자만 입력 가능합니다.')
    .optional()
    .or(z.literal('')),
  bzmnNm: z
    .string()
    .regex(/^[가-힣a-zA-Z]+$/, '한글과 영문만 입력할 수 있습니다.')
    .max(20, '20자 이내로 입력해주세요.')
    .optional()
    .or(z.literal('')),
  bzmnZip: z.string().optional().or(z.literal('')),
  bzmnLotnoAddr: z.string().optional().or(z.literal('')),
  bzmnRoadAddr: z.string().optional().or(z.literal('')),
  bzmnDtlAddr: z.string().optional().or(z.literal('')),

  agreYn: z.enum(['Y', 'N']),
  chcYn: z.enum(['Y', 'N']).optional(),
});

// 아이디 찾기 스키마
export const findEmailRequestSchema = z.object({
  name: nameSchema,
  verifyEmail: emailSchema,
});

// 비밀번호 찾기 스키마
export const findPasswordRequestSchema = findEmailRequestSchema.extend({
  email: emailSchema,
});

// 인증 코드 스키마
export const emailVerificationCodeSchema = z.object({
  code: z.string().length(6, '인증코드는 6자리입니다.'),
});

// 비밀번호 재설정 스키마
export const resetPasswordSchema = z
  .object({
    newPswd: passwordSchema.regex(
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).+$/,
      '비밀번호는 영문, 숫자, 특수문자를 각각 1개 이상 포함해야 합니다',
    ),
    newPswdCheck: passwordSchema.regex(
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).+$/,
      '비밀번호는 영문, 숫자, 특수문자를 각각 1개 이상 포함해야 합니다',
    ),
  })
  .refine((v) => v.newPswd === v.newPswdCheck, {
    path: ['newPswdCheck'],
    message: '비밀번호가 일치하지 않습니다.',
  });

export type LoginForm = z.infer<typeof loginSchema>;
export type AdminLoginForm = z.infer<typeof adminLoginSchema>;
export type FindEmailRequestForm = z.infer<typeof findEmailRequestSchema>;
export type FindPasswordRequestForm = z.infer<typeof findPasswordRequestSchema>;
export type VerifyEmailCodeForm = z.infer<typeof emailVerificationCodeSchema>;
export type ResetPasswordForm = z.infer<typeof resetPasswordSchema>;
export type AdminSignupForm = z.infer<typeof adminSignupSchema>;
export type UserSignupForm = z.infer<typeof userSignupSchema>;
