import z from 'zod';

// 메뉴 등록 스키마
export const menuCreateSchema = z.object({
  menuNm: z
    .string()
    .nonempty('메뉴 이름을 입력해주세요.')
    .min(2, '최소 2자 이상 입력해주세요.')
    .max(15, '15자 이내로 입력해주세요.'),
  path: z.string().max(50, '50자 이내로 입력해주세요.').optional().or(z.literal('')),
  seCd: z.string().nonempty('메뉴 노드를 선택해주세요.'),
  menuTypeCd: z.string().optional().or(z.literal('')),
  menuCd: z.string().optional().or(z.literal('')),
  upMenuCd: z.string().optional().or(z.literal('')),
  sortSeq: z.number().optional(),
  expln: z.string().optional().or(z.literal('')),
  useYn: z.enum(['Y', 'N']),
});

// 메뉴 그룹 권한 저장 스키마
export const menuGroupSaveSchema = z.object({
  groupCd: z.string().optional().or(z.literal('')),
  groupNm: z
    .string()
    .nonempty('메뉴 그룹 이름을 입력해주세요.')
    .min(2, '최소 2자 이상 입력해주세요.')
    .max(15, '15자 이내로 입력해주세요.')
    .regex(/^[가-힣A-Za-z0-9\s]+$/, '한글, 영문, 숫자만 입력 가능합니다'),
  accessLevelCd: z.string().nonempty('권한을 선택해주세요.'),
  grdCd: z.string().nonempty('구분을 선택해주세요.'),
  menuCds: z.array(z.string()),
  useYn: z.enum(['Y', 'N']),
});

export type MenuCreateForm = z.infer<typeof menuCreateSchema>;
export type MenuGroupSaveForm = z.infer<typeof menuGroupSaveSchema>;
