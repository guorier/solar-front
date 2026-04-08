'use client';

import {
  AgGridComponent,
  BottomGroupComponent,
  ButtonComponent,
  Cell,
  Column,
  Form,
  Icons,
  Label,
  Row,
  Select,
  SelectItem,
  Table,
  TableBody,
  TableHeader,
  TitleComponent,
} from '@/components';
import { MENU_GROUP_SAVE_COLUMN } from '@/constants/setting/menu';
import {
  useGetComCodeList,
  useGetMenuGroupDetail,
  useGetMenuTree,
  usePostMenuGroupSave,
} from '@/services/common/query';
import { useRouter, useSearchParams } from 'next/navigation';
import { Group, Input, ResizableTableContainer } from 'react-aria-components';
import { useEffect, useState, Suspense } from 'react';
import { MenuGroupSaveForm, menuGroupSaveSchema } from '@/schemas/common/menu';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { makeOptions } from '@/utils/makeOptions';
import { toTreeNode, TreeNode } from '@/utils/treeNode';
import { TreeMenu } from '../_components/treeMenu';
import { useSession } from 'next-auth/react';
import { MenuGroupSaveReq } from '@/services/common/type';
import { toast } from '@/stores/toast';

// form 기본 값
const DEFAULTS_VALUES: MenuGroupSaveForm = {
  groupCd: '',
  groupNm: '',
  accessLevelCd: '',
  grdCd: '',
  useYn: 'Y',
  menuCds: [],
};

function MenuTransferPageInner() {
  const { data: user } = useSession();
  const userEmail = user?.user?.email ?? '';

  const router = useRouter();
  const searchParams = useSearchParams();
  const groupCd = searchParams.get('groupCd');

  const isEdit = !!groupCd;

  // 권한 종류 목록
  const { data: accessLevelCodeList } = useGetComCodeList({ comMastrCd: 'A01' }, true);
  // 권한 등급 목록
  const { data: grdCodeList } = useGetComCodeList({ comMastrCd: 'A04' }, true);
  // 메뉴 그룹 권한 상세 데이터
  const { data: menuGroupDetail } = useGetMenuGroupDetail(groupCd ?? '');
  // 메뉴 계층형 조회
  const { data: menuTree } = useGetMenuTree();

  // 트리에서 선택된 메뉴들
  const [selectedMenus, setSelectedMenus] = useState<TreeNode[]>([]);
  // 그리드에서 선택된 row들
  const [selectedGridRows, setSelectedGridRows] = useState<TreeNode[]>([]);
  // 오른쪽 그리드에 표시되는 rowData
  const [menuRowData, setMenuRowData] = useState<TreeNode[]>([]);

  // 공통 코드 options 구조에 맞게 변환
  const accessLevelOptions = makeOptions(accessLevelCodeList);
  const grdOptions = makeOptions(grdCodeList);

  const form = useForm<MenuGroupSaveForm>({
    resolver: zodResolver(menuGroupSaveSchema),
    defaultValues: DEFAULTS_VALUES,
  });

  const { handleSubmit, reset } = form;

  useEffect(() => {
    if (!isEdit) return;
    if (!menuGroupDetail) return;

    const mappedMenus = menuGroupDetail.menuItems.map(toTreeNode);

    setSelectedMenus(mappedMenus);
    setMenuRowData(mappedMenus);

    reset({
      groupCd: menuGroupDetail.groupCd,
      groupNm: menuGroupDetail.groupNm,
      accessLevelCd: menuGroupDetail.accessLevelCd,
      grdCd: menuGroupDetail.grdCd,
      useYn: menuGroupDetail.useYn === 'N' ? 'N' : 'Y',
      menuCds: menuGroupDetail.menuItems.map((menu) => menu.menuCd) ?? [],
    });
  }, [isEdit, menuGroupDetail, reset]);

  // 폼 제출
  const saveMenuGroup = usePostMenuGroupSave();

  const onSubmit = (values: MenuGroupSaveForm) => {
    if (menuRowData.length === 0) return toast.error('메뉴를 선택해주세요.');

    const payload = {
      ...values,
      menuCds: menuRowData.map((m) => m.menuCd),
      ...(isEdit ? { mdfrId: userEmail } : { rgtrId: userEmail }),
    };

    saveMenuGroup.mutate(payload as MenuGroupSaveReq, {
      onSuccess: () => {
        toast.success('메뉴 그룹 저장 완료!');
        router.push('/setting/menu/menu-authority');
      },
    });
  };

  // 오른쪽으로 이동(추가)
  const handleTransferRight = () => {
    // 오른쪽 그리드에 넣을 때도 중복 제거해서 합치기
    setMenuRowData((prev) => {
      const merged = [...prev, ...selectedMenus];
      const map = new Map(merged.map((n) => [n.menuCd, n]));
      return Array.from(map.values());
    });
  };

  // 왼쪽으로 이동(제거) - 그리드에서 체크된 것 제거
  const handleTransferLeft = () => {
    if (!selectedGridRows.length) return;

    const removeIds = new Set(selectedGridRows.map((r) => r.menuCd));

    // 오른쪽 그리드에서 제거
    setMenuRowData((prev) => prev.filter((m) => !removeIds.has(m.menuCd)));
    // 트리 선택 목록에서도 제거
    setSelectedMenus((prev) => prev.filter((m) => !removeIds.has(m.menuCd)));

    // 그리드 선택 state도 비우기
    setSelectedGridRows([]);
  };

  return (
    <>
      <div className="title-group">
        <TitleComponent title="설정 관리" subTitle="메뉴 관리" desc="메뉴 그룹 권한 설정" />
      </div>

      <div className="content-group" style={{ paddingTop: 'var(--spacing-10)' }}>
        <Group style={{ gap: 'var(--spacing-16)' }}>
          <TreeMenu
            selectionMode="multiple"
            treeHeader={{ title: '메뉴 목록' }}
            menuList={menuTree ?? []}
            onTreeSelectionChange={(payload) => {
              setSelectedMenus(payload.selectedItems);
            }}
          />

          <div className="content-group" style={{ justifyContent: 'center' }}>
            <ButtonComponent
              variant="outlined"
              onClick={handleTransferRight}
              icon={<Icons iName="transfer_right" />}
            />
            <ButtonComponent
              variant="outlined"
              onClick={handleTransferLeft}
              icon={<Icons iName="transfer_left" />}
            />
          </div>

          <Form onSubmit={handleSubmit(onSubmit)}>
            <ResizableTableContainer>
              <Table type="vertical" aria-labelledby="table-title" aria-describedby="table-summary">
                <TableHeader>
                  <Column isRowHeader width={160} />
                  <Column />
                  <Column isRowHeader width={160} />
                  <Column />
                </TableHeader>
                <TableBody>
                  <Row>
                    <Cell>
                      <Label htmlFor="accessLevelCd" className="imp">
                        권한
                      </Label>
                    </Cell>
                    <Cell>
                      <div className="react-aria-TextField">
                        <Controller
                          control={form.control}
                          name="accessLevelCd"
                          render={({ field }) => (
                            <Select
                              value={field.value}
                              onChange={field.onChange}
                              aria-label="권한 선택"
                            >
                              {accessLevelOptions.map((opt) => (
                                <SelectItem key={opt.value} id={opt.value}>
                                  {opt.label}
                                </SelectItem>
                              ))}
                            </Select>
                          )}
                        />
                      </div>
                    </Cell>

                    <Cell>
                      <Label htmlFor="grdCd" className="imp">
                        구분
                      </Label>
                    </Cell>
                    <Cell>
                      <div className="react-aria-TextField">
                        <Controller
                          control={form.control}
                          name="grdCd"
                          render={({ field }) => (
                            <Select
                              value={field.value}
                              onChange={field.onChange}
                              aria-label="구분 선택"
                            >
                              {grdOptions.map((opt) => (
                                <SelectItem key={opt.value} id={opt.value}>
                                  {opt.label}
                                </SelectItem>
                              ))}
                            </Select>
                          )}
                        />
                      </div>
                    </Cell>
                  </Row>

                  <Row>
                    <Cell>
                      <Label htmlFor="groupNm" className="imp">
                        메뉴 권한 이름
                      </Label>
                    </Cell>
                    <Cell>
                      <div className="react-aria-TextField">
                        <Controller
                          control={form.control}
                          name="groupNm"
                          render={({ field }) => (
                            <Input
                              {...field}
                              id="groupNm"
                              aria-label="메뉴 권한 이름 입력"
                              placeholder="입력하세요"
                            />
                          )}
                        />
                      </div>
                    </Cell>

                    <Cell>
                      <Label htmlFor="useYn">사용 여부</Label>
                    </Cell>
                    <Cell>
                      <div className="react-aria-TextField">
                        <Controller
                          control={form.control}
                          name="useYn"
                          render={({ field }) => (
                            <Select
                              value={field.value}
                              onChange={field.onChange}
                              aria-label="사용 여부 선택"
                            >
                              <SelectItem id="Y">사용</SelectItem>
                              <SelectItem id="N">미사용</SelectItem>
                            </Select>
                          )}
                        />
                      </div>
                    </Cell>
                  </Row>
                </TableBody>
              </Table>
            </ResizableTableContainer>

            <div style={{ height: 900 }}>
              <AgGridComponent
                rowData={menuRowData}
                columnDefs={MENU_GROUP_SAVE_COLUMN}
                rowSelection="multiple"
                onSelectionChanged={(event) => {
                  const rows = event.api.getSelectedRows() as TreeNode[];
                  setSelectedGridRows(rows);
                }}
                isPagination={false}
              />
            </div>
          </Form>
        </Group>
      </div>

      <BottomGroupComponent
        rightCont={
          <div className="button-group">
            <ButtonComponent
              onClick={form.handleSubmit(onSubmit)}
              variant="contained"
              icon={<Icons iName={isEdit ? 'edit' :'plus'} size={16} color="#fff" />}
            >
              {isEdit ? '수정' : '등록'}
            </ButtonComponent>
          </div>
        }
      />
    </>
  );
}

export default function MenuTransferPage() {
  return (
    <Suspense fallback={null}>
      <MenuTransferPageInner />
    </Suspense>
  );
}
