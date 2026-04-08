'use client';

import { BottomGroupComponent, ButtonComponent, Icons, Modal, TitleComponent } from '@/components';
import { MenuCreateForm, menuCreateSchema } from '@/schemas/common/menu';
import {
  useGetMenuDetail,
  useGetMenuTree,
  usePostMenuCreate,
  usePostMenuDelete,
  usePostMenuUpdate,
} from '@/services/common/query';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { Group, Heading } from 'react-aria-components';
import { useForm } from 'react-hook-form';
import { MenuForm } from './_components/menuFormTable';
import { TreeMenu } from '../_components/treeMenu';
import { TreeNode } from '@/utils/treeNode';
import { useSession } from 'next-auth/react';
import { MenuCreateReq, MenuUpdateReq } from '@/services/common/type';
import { toast } from '@/stores/toast';

// Form 기본 값
const DEFAULTS_VALUES: MenuCreateForm = {
  menuNm: '',
  path: '',
  seCd: '001',
  menuTypeCd: '001',
  menuCd: '',
  upMenuCd: '',
  sortSeq: 1,
  expln: '',
  useYn: 'Y',
};

// 빈 값 null 변환
const emptyToNull = <T extends Record<string, unknown>>(obj: T) =>
  Object.fromEntries(
    Object.entries(obj).map(([key, value]) => [key, value === '' ? null : value]),
  ) as T;

export default function MenuSettingPage() {
  const { data: user } = useSession();
  const userEmail = user?.user?.email ?? '-';

  const [selectedMenu, setSelectedMenu] = useState<TreeNode | null>(null);
  const [isSubMenu, setIsSubMenu] = useState<boolean>(false);
  const [isDeleteConfirm, setIsDeleteConfirm] = useState<boolean>(false);

  const isEdit = !!selectedMenu && !isSubMenu;

  const { data: menuTree } = useGetMenuTree();
  const { data: menuDetail } = useGetMenuDetail(selectedMenu?.menuCd ?? '');

  const form = useForm<MenuCreateForm>({
    resolver: zodResolver(menuCreateSchema),
    defaultValues: DEFAULTS_VALUES,
  });

  const { handleSubmit, reset } = form;

  // 상세 데이터 표출
  useEffect(() => {
    // 목록 선택 해제 → 초기화
    if (!selectedMenu) {
      setIsSubMenu(false);
      reset(DEFAULTS_VALUES);
      return;
    }

    if (isSubMenu || !menuDetail) return;

    // 상세 정보 반영
    reset({
      menuNm: menuDetail.menuNm,
      path: menuDetail.path ?? '',
      seCd: menuDetail.seCd,
      menuTypeCd: menuDetail.menuTypeCd,
      menuCd: menuDetail.menuCd ?? '',
      upMenuCd: menuDetail.upMenuCd ?? '',
      sortSeq: menuDetail.sortSeq,
      expln: menuDetail.expln ?? '',
      useYn: menuDetail.useYn === 'N' ? 'N' : 'Y',
    });
  }, [selectedMenu, menuDetail, isSubMenu, reset]);

  const createMenu = usePostMenuCreate();
  const updateMenu = usePostMenuUpdate();
  const deleteMenu = usePostMenuDelete();

  // 메뉴 등록 / 수정 핸들러
  const onSubmit = (values: MenuCreateForm) => {
    const { upMenuCd, ...rest } = emptyToNull(values);
    const basePayload = upMenuCd ? { ...rest, upMenuCd } : rest;

    if (isEdit) {
      // 수정
      if (!selectedMenu || !menuDetail) return toast.error('수정할 메뉴를 선택해주세요.');

      const payload: MenuUpdateReq = {
        ...basePayload,
        mdfrId: userEmail,
        menuCd: menuDetail.menuCd,
      };

      // 메뉴 깊이에 따른 메뉴 노드 값 검사
      if (
        (selectedMenu.depthCd === 1 && payload.seCd === '002') ||
        (selectedMenu.depthCd > 1 && payload.seCd === '001')
      )
        return toast.error('메뉴 노드가 맞지 않습니다.');

      updateMenu.mutate(payload, {
        onSuccess: () => toast.success('정상적으로 수정되었습니다.'),
      });
    } else {
      // 등록
      const payload: MenuCreateReq = {
        ...basePayload,
        rgtrId: userEmail,
      };

      if (!selectedMenu && payload.seCd === '002') return toast.error('메뉴 노드가 맞지 않습니다.');

      createMenu.mutate(payload, {
        onSuccess: () => {
          toast.success('정상적으로 등록되었습니다.');
          if (!isSubMenu) reset(DEFAULTS_VALUES);
        },
      });
    }

    setIsSubMenu(false);
  };

  // 메뉴 삭제 핸들러
  const handleMenuDelete = () => {
    if (!selectedMenu) return toast.error('메뉴를 선택해주세요.');
    if (selectedMenu.children.length > 0) return toast.error('하위 메뉴를 먼저 삭제해주세요.');

    deleteMenu.mutate(selectedMenu.menuCd, {
      onSuccess: () => {
        toast.success('정상적으로 삭제되었습니다.');
        setSelectedMenu(null);
        reset(DEFAULTS_VALUES);
        setIsDeleteConfirm(false);
      },
    });
  };

  // 서브 메뉴 추가 시 폼 세팅
  const handleAddSubMenu = () => {
    if (!selectedMenu || !menuDetail) return;

    setIsSubMenu(true);

    reset({
      ...DEFAULTS_VALUES,
      upMenuCd: menuDetail?.menuCd,
      seCd: '002',
    });
  };

  return (
    <>
      <div className="title-group">
        <TitleComponent
          title="설정 관리"
          subTitle="메뉴 관리"
          thirdTitle="메뉴 설정"
          desc="메뉴를 등록 및 수정 관리 하는 기능을 제공"
        />
      </div>

      <div className="content-group" style={{ gap: 'var(--spacing-10)' }}>
        <Group style={{ gap: 'var(--spacing-16)' }}>
          <TreeMenu
            menuList={menuTree ?? []}
            treeHeader={{
              title: '메뉴 목록',
              right: (
                <ButtonComponent
                  onClick={handleAddSubMenu}
                  isDisabled={!selectedMenu}
                  icon={<Icons iName="plus" color="#fff" />}
                />
              ),
            }}
            onTreeItemClick={(item) => {
              setSelectedMenu(item);
              setIsSubMenu(false);
            }}
          />
          <Heading level={3} id="table-title" className="sr-only">
            메뉴 설정 표
          </Heading>
          <p id="table-summary" className="sr-only">
            메뉴 이름, 깊이, 종류, url, 순서 등을 입력하는 표입니다.
          </p>
          <MenuForm form={form} menuDetail={menuDetail} isSubMenu={isSubMenu} onSubmit={onSubmit} />
        </Group>
      </div>

      <BottomGroupComponent
        rightCont={
          <div className="button-group">
            <ButtonComponent
              onClick={handleSubmit(onSubmit)}
              variant="contained"
              icon={<Icons iName={isEdit ? 'edit' : 'plus'} size={16} color="#fff" />}
            >
              {isEdit ? '수정' : '등록'}
            </ButtonComponent>
            <ButtonComponent
              onClick={() => setIsDeleteConfirm(true)}
              variant="delete"
              isDisabled={!selectedMenu}
              icon={<Icons iName="delete" size={16} color="#fff" />}
            >
              삭제
            </ButtonComponent>
          </div>
        }
      />

      {isDeleteConfirm && (
        <Modal
          isOpen={isDeleteConfirm}
          onOpenChange={setIsDeleteConfirm}
          title="선택한 메뉴를 삭제하시겠습니까?"
          primaryButton="삭제"
          onPrimaryPress={handleMenuDelete}
        />
      )}
    </>
  );
}
