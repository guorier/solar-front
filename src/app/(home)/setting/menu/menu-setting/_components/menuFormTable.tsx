import {
  Cell,
  Column,
  Form,
  Label,
  Radio,
  Row,
  Select,
  SelectItem,
  Table,
  TableBody,
  TableHeader,
} from '@/components';
import { MenuCreateForm } from '@/schemas/common/menu';
import { useGetComCodeList } from '@/services/common/query';
import { MenuDetailRes } from '@/services/common/type';
import { formatYmdHm } from '@/utils';
import { makeOptions } from '@/utils/makeOptions';
import { Input, ResizableTableContainer, TextArea } from 'react-aria-components';
import { Controller, UseFormReturn } from 'react-hook-form';

type MenuFormProps = {
  form: UseFormReturn<MenuCreateForm>;
  menuDetail?: MenuDetailRes;
  isSubMenu: boolean;
  onSubmit: (values: MenuCreateForm) => void;
};

export function MenuForm({ form, menuDetail, isSubMenu, onSubmit }: MenuFormProps) {
  // 권한 종류 목록
  const { data: seCodeList } = useGetComCodeList({ comMastrCd: 'M03 ' }, true);
  // 권한 등급 목록
  const { data: menuTypeCodeList } = useGetComCodeList({ comMastrCd: 'M02' }, true);
  // options 구조에 맞게 변환
  const seCdOptions = makeOptions(seCodeList);
  const menuTypeCdOptions = makeOptions(menuTypeCodeList);

  return (
    <Form onSubmit={form.handleSubmit(onSubmit)}>
      <ResizableTableContainer>
        <Table type="vertical" aria-labelledby="table-title" aria-describedby="table-summary">
          <TableHeader>
            <Column isRowHeader width={160} />
            <Column />
            <Column isRowHeader width={160} />
            <Column />
            <Column isRowHeader width={160} />
            <Column />
          </TableHeader>
          <TableBody>
            <Row>
              <Cell>
                <Label htmlFor="menuNm" className="imp">
                  메뉴 이름
                </Label>
              </Cell>
              <Cell>
                <div className="react-aria-TextField">
                  <Controller
                    control={form.control}
                    name="menuNm"
                    render={({ field }) => (
                      <Input
                        {...field}
                        id="menuNm"
                        aria-label="메뉴 이름 입력"
                        placeholder="입력하세요"
                      />
                    )}
                  />
                </div>
              </Cell>
              <Cell>
                <Label htmlFor="depth">메뉴 깊이</Label>
              </Cell>
              <Cell>
                <div className="react-aria-TextField">
                  <Input
                    id="depth"
                    aria-label="메뉴 깊이 입력"
                    placeholder="입력하세요"
                    value={menuDetail?.depthCd ?? '1'}
                    disabled
                  />
                </div>
              </Cell>
              <Cell>
                <Label htmlFor="path" className={isSubMenu ? 'imp' : ''}>
                  메뉴 URL
                </Label>
              </Cell>
              <Cell>
                <div className="react-aria-TextField">
                  <Controller
                    control={form.control}
                    name="path"
                    render={({ field }) => (
                      <Input
                        {...field}
                        id="path"
                        aria-label="메뉴 URL 입력"
                        placeholder="입력하세요"
                      />
                    )}
                  />
                </div>
              </Cell>
            </Row>
            <Row>
              <Cell>
                <Label htmlFor="menuTypeCd">메뉴 종류</Label>
              </Cell>
              <Cell>
                <Controller
                  control={form.control}
                  name="menuTypeCd"
                  render={({ field }) => (
                    <>
                      {menuTypeCdOptions.map((opt) => (
                        <Radio
                          key={opt.value}
                          name={field.name}
                          value={opt.value}
                          label={opt.label}
                          checked={field.value === opt.value}
                          onChange={() => field.onChange(opt.value)}
                        />
                      ))}
                    </>
                  )}
                />
              </Cell>
              <Cell>
                <Label htmlFor="sortSeq" className="imp">
                  메뉴 순서
                </Label>
              </Cell>
              <Cell>
                <div className="react-aria-TextField">
                  <Controller
                    control={form.control}
                    name="sortSeq"
                    render={({ field }) => (
                      <Input
                        {...field}
                        id="sortSeq"
                        type="number"
                        aria-label="메뉴 순서 입력"
                        placeholder="입력하세요"
                        onChange={(e) => field.onChange(e.target.valueAsNumber)}
                      />
                    )}
                  />
                </div>
              </Cell>
              <Cell>
                <Label htmlFor="seCd" className="imp">
                  메뉴 노드
                </Label>
              </Cell>
              <Cell>
                <Controller
                  control={form.control}
                  name="seCd"
                  render={({ field }) => (
                    <>
                      {seCdOptions.map((opt) => (
                        <Radio
                          key={opt.value}
                          name={field.name}
                          value={opt.value}
                          label={opt.label}
                          checked={field.value === opt.value}
                          onChange={() => field.onChange(opt.value)}
                          disabled={isSubMenu}
                        />
                      ))}
                    </>
                  )}
                />
              </Cell>
            </Row>
            <Row>
              <Cell>메뉴 코드</Cell>
              <Cell>
                <div className="react-aria-TextField">
                  <Controller
                    control={form.control}
                    name="menuCd"
                    render={({ field }) => (
                      <Input
                        {...field}
                        id="menuCd"
                        aria-label="메뉴 코드"
                        placeholder="-"
                        readOnly
                      />
                    )}
                  />
                </div>
              </Cell>
              <Cell>
                <Label htmlFor="upMenuCd" className={isSubMenu ? 'imp' : ''}>
                  상위 메뉴 코드
                </Label>
              </Cell>
              <Cell>
                <div className="react-aria-TextField">
                  <Controller
                    control={form.control}
                    name="upMenuCd"
                    render={({ field }) => (
                      <Input
                        {...field}
                        id="upMenuCd"
                        aria-label="상위 메뉴 코드"
                        placeholder="-"
                        readOnly
                      />
                    )}
                  />
                </div>
              </Cell>
              <Cell>
                <Label htmlFor="useYn">사용 여부</Label>
              </Cell>
              <Cell>
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
              </Cell>
            </Row>
            <Row>
              <Cell>등록 ID</Cell>
              <Cell>{isSubMenu ? '-' : (menuDetail?.rgtrId ?? '-')}</Cell>
              <Cell>등록 일시</Cell>
              <Cell colSpan={3}>{isSubMenu ? '-' : (formatYmdHm(menuDetail?.regDt) ?? '-')}</Cell>
            </Row>
            <Row>
              <Cell>수정 ID</Cell>
              <Cell>{isSubMenu ? '-' : (menuDetail?.mdfrId ?? '-')}</Cell>
              <Cell>수정 일시</Cell>
              <Cell colSpan={3}>{isSubMenu ? '-' : (formatYmdHm(menuDetail?.mdfcnDt) ?? '-')}</Cell>
            </Row>
            <Row>
              <Cell>메뉴 설명</Cell>
              <Cell colSpan={5}>
                <div className="react-aria-TextField" style={{ maxWidth: '100%' }}>
                  <Controller
                    control={form.control}
                    name="expln"
                    render={({ field }) => (
                      <TextArea
                        {...field}
                        aria-label="메뉴 설명 입력"
                        placeholder="입력해 주세요"
                      />
                    )}
                  />
                </div>
              </Cell>
            </Row>
          </TableBody>
        </Table>
      </ResizableTableContainer>
    </Form>
  );
}
