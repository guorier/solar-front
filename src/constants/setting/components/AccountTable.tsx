'use client';

import React, { useState } from 'react';
import {
  Table,
  TableHeader,
  Column,
  TableBody,
  Row,
  Cell,
  Label,
  Select,
  SelectItem,
  ButtonComponent,
  Icons,
} from '@/components';
import {
  Group,
  Heading,
  Input,
  ResizableTableContainer,
  Tag,
  TagGroup,
  TagList,
} from 'react-aria-components';
// import type { PlantBaseCreateReq } from '@/services/plants/type';
import AddressField, { AddressFieldValue } from '@/components/address/AddressField';

// type FieldKey = keyof PlantBaseCreateReq;
type AccountTableProps = {
  //form: PlantBaseCreateReq;
  // isRequired: (k: FieldKey) => boolean;
  // setValue: <K extends FieldKey>(k: K, v: PlantBaseCreateReq[K]) => void;

  addressOpen: boolean;
  setAddressOpen: (v: boolean) => void;
  onAddressChange: (v: AddressFieldValue) => void;
  setIsPlantSelectModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function AccountTable({
  //form,
  // isRequired,
  // setValue,
  addressOpen,
  setAddressOpen,
  onAddressChange,
  setIsPlantSelectModalOpen
}: AccountTableProps) {

  const [items, setItems] = useState([
    { id: 1, name: '와이어블 1호기' },
    { id: 2, name: '와이어블 2호기' },
  ]);
  const handleRemove = (keys: Set<React.Key>) => {
    const keyArray = Array.from(keys);
    setItems((prev) => prev.filter((item) => !keyArray.includes(item.id)));
  };

  return (
    <div>
      <Heading level={3} id="acc-info-title">계정 정보</Heading>
      <p id="acc-info-summary" className="sr-only">사용자의 권한 등급, 개인정보, 소속 부서 및 연동된 발전소 목록을 관리하는 상세 표입니다.</p>
      <ResizableTableContainer>
        <Table type="vertical" aria-labelledby="acc-info-title" aria-describedby="acc-info-summary">
          <TableHeader>
            <Column isRowHeader width={160} />
            <Column />
            <Column isRowHeader width={160} />
            <Column />
          </TableHeader>
          <TableBody>
            <Row>
              <Cell>
                <Label className="imp">회원 등급</Label>
              </Cell>
              <Cell>
                <Select aria-label="회원 등급 선택">
                  <SelectItem>일반</SelectItem>
                  <SelectItem>관리자</SelectItem>
                  <SelectItem>시스템 관리자</SelectItem>
                </Select>
              </Cell>
              <Cell>
                <Label className="imp">등급 구분</Label>
              </Cell>
              <Cell>
                <Select aria-label="등급 구분 선택">
                  <SelectItem>사업자</SelectItem>
                  <SelectItem>소설 연동</SelectItem>
                  <SelectItem>일반 가입</SelectItem>
                </Select>
              </Cell>
            </Row>
            <Row>
              <Cell>아이디</Cell>
              <Cell>dsid3@dsie.com</Cell>
              <Cell>이름</Cell>
              <Cell>제임스</Cell>
            </Row>
            <Row>
              <Cell>비밀번호</Cell>
              <Cell>
                <ButtonComponent variant="contained">초기화</ButtonComponent>
              </Cell>
              <Cell>계정 그룹 권한</Cell>
              <Cell>
                <ButtonComponent variant="contained">변경</ButtonComponent>
              </Cell>
            </Row>
            <Row>
              <Cell>휴대 전화 번호</Cell>
              <Cell>010-0000-0000</Cell>
              <Cell>전화</Cell>
              <Cell>010-0000-0000</Cell>
            </Row>
            <Row>
              <Cell>성별</Cell>
              <Cell>-</Cell>
              <Cell>생년월일</Cell>
              <Cell>1888-01-01</Cell>
            </Row>
            <Row>
              <Cell>비밀번호 변경일</Cell>
              <Cell>2024-12-12 21:22 21</Cell>
              <Cell>마지막 로그인</Cell>
              <Cell>2025-12-12 21:22 21</Cell>
            </Row>
            <Row>
              <Cell>
                <Label className="imp">승인 여부</Label>
              </Cell>
              <Cell>
                <Select aria-label="승인 여부 선택">
                  <SelectItem>승인 대기</SelectItem>
                  <SelectItem>승인 완료</SelectItem>
                </Select>
              </Cell>
              <Cell>승인 일시</Cell>
              <Cell>2025-12-12 21:22 21</Cell>
            </Row>
            <Row>
              <Cell>
                <Label className="imp">발전소</Label>
              </Cell>
              <Cell colSpan={3}>
                <Group style={{ justifyContent: 'space-between' }}>
                  <TagGroup className="react-aria-TagGroup del-type" onRemove={handleRemove}>
                    <TagList items={items}>
                      {(item) => (
                        <Tag>
                          {item.name}
                          <ButtonComponent
                            variant="none"
                            slot="remove"
                            icon={<Icons iName="del" color="#444242" />}
                          />
                        </Tag>
                      )}
                    </TagList>
                  </TagGroup>
                  <ButtonComponent
                    variant="contained"
                    onPress={() => setIsPlantSelectModalOpen(true)}
                  >
                    추가
                  </ButtonComponent>
                </Group>
              </Cell>
            </Row>
            <Row>
              <Cell>
                <Label>주소</Label>
              </Cell>
              <Cell colSpan={3}>
                <div className="react-aria-TextField">
                  <Group>
                    <Input
                      aria-label="우편번호"
                      placeholder=""
                      title="우편번호 검색"
                      readOnly
                      style={{ width: 160, flex: 'none' }}
                      value=""
                    />
                    <ButtonComponent variant="contained" onClick={() => setAddressOpen(true)}>
                      검색
                    </ButtonComponent>
                  </Group>
                </div>

                <AddressField
                  open={addressOpen}
                  onClose={() => setAddressOpen(false)}
                  onChange={onAddressChange}
                />

                <Group className="input-group">
                  <Group style={{ gap: 'var(--spacing-6)' }}>
                    <div className="react-aria-TextField">
                      <Input
                        aria-label="도로명주소"
                        placeholder="도로명주소"
                        title="도로명주소 입력"
                        readOnly
                        value=""
                      />
                    </div>

                    <div className="react-aria-TextField">
                      <Input
                        aria-label="지번주소"
                        placeholder="지번주소"
                        title="지번주소 입력"
                        readOnly
                        value=""
                      />
                    </div>
                  </Group>
                  <Group style={{ gap: 'var(--spacing-6)' }}>
                    <div className="react-aria-TextField">
                      <Input
                        placeholder="상세 주소를 입력해 주세요"
                        aria-label="상세 주소 입력"
                        title="상세 주소 입력"
                        value=""
                        // onChange={(e) =>
                        //   setValue(
                        //     'lctnDtlAddr',
                        //     (e.target as HTMLInputElement)
                        //       .value as PlantBaseCreateReq['lctnDtlAddr'],
                        //   )
                        // }
                      />
                    </div>
                  </Group>
                </Group>
              </Cell>
            </Row>
            <Row>
              <Cell>
                <Label>사업자 명</Label>
              </Cell>
              <Cell>
                <div className="react-aria-TextField">
                  <Input aria-label="사업자 명" placeholder="" title="사업자 명 입력" value="" />
                </div>
              </Cell>
              <Cell>사업자 번호</Cell>
              <Cell>
                <Group>
                  1234567890
                  <ButtonComponent variant="contained">확인</ButtonComponent>
                </Group>
              </Cell>
            </Row>
            <Row>
              <Cell>
                <Label>사업자 주소</Label>
              </Cell>
              <Cell colSpan={3}>
                <div className="react-aria-TextField">
                  <Group style={{ flex: 'none' }}>
                    <Input
                      aria-label="우편번호"
                      placeholder=""
                      title="우편번호 검색"
                      readOnly
                      style={{ width: 160, flex: 'none' }}
                      value=""
                    />
                    <ButtonComponent variant="contained" onClick={() => setAddressOpen(true)}>
                      검색
                    </ButtonComponent>
                  </Group>
                </div>

                <AddressField
                  open={addressOpen}
                  onClose={() => setAddressOpen(false)}
                  onChange={onAddressChange}
                />

                <Group className="input-group">
                  <Group style={{ gap: 'var(--spacing-6)' }}>
                    <div className="react-aria-TextField">
                      <Input
                        aria-label="도로명주소"
                        placeholder="도로명주소"
                        title="도로명주소 입력"
                        readOnly
                        value=""
                      />
                    </div>

                    <div className="react-aria-TextField">
                      <Input
                        aria-label="지번주소"
                        placeholder="지번주소"
                        title="지번주소 입력"
                        readOnly
                        value=""
                      />
                    </div>
                  </Group>
                  <Group style={{ gap: 'var(--spacing-6)' }}>
                    <div className="react-aria-TextField">
                      <Input
                        placeholder="상세 주소를 입력해 주세요"
                        aria-label="상세 주소 입력"
                        title="상세 주소 입력"
                        value=""
                        // onChange={(e) =>
                        //   setValue(
                        //     'lctnDtlAddr',
                        //     (e.target as HTMLInputElement)
                        //       .value as PlantBaseCreateReq['lctnDtlAddr'],
                        //   )
                        // }
                      />
                    </div>
                  </Group>
                </Group>
              </Cell>
            </Row>
            <Row>
              <Cell>연동</Cell>
              <Cell>Naver</Cell>
              <Cell>가입 날짜</Cell>
              <Cell>YYYY-MM-DD</Cell>
            </Row>
            <Row>
              <Cell>
                <Label>소속 부서</Label>
              </Cell>
              <Cell>
                <div className="react-aria-TextField">
                  <Group>
                    <Input
                      aria-label="소속 부서 변경"
                      placeholder="운영팀"
                      title="소속 부서 변경"
                      readOnly
                      value=""
                    />
                    <ButtonComponent variant="contained">변경</ButtonComponent>
                  </Group>
                </div>
              </Cell>
              <Cell>직급/직책</Cell>
              <Cell>
                <Group>
                  <div className="react-aria-TextField">
                    <Input
                      aria-label="직급 입력"
                      placeholder="직급 입력"
                      title="직급 입력"
                      value=""
                    />
                  </div>
                  <div className="react-aria-TextField">
                    <Input
                      aria-label="직책 입력"
                      placeholder="직책 입력"
                      title="직책 입력"
                      value=""
                    />
                  </div>
                </Group>
              </Cell>
            </Row>
          </TableBody>
        </Table>
      </ResizableTableContainer>
    </div>
  );
}
