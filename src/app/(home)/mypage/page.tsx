'use client';

import React, { useState } from 'react';
import {
  ButtonComponent,
  Icons,
  TitleComponent,
  BottomGroupComponent,
  Table,
  TableHeader,
  Column,
  TableBody,
  Row,
  Cell,
  Label,
  Select,
  SelectItem,
  InputComponent,
} from '@/components';
import { Group, Heading, ResizableTableContainer } from 'react-aria-components';
import AddressField, { AddressFieldValue } from '@/components/address/AddressField';
import { EmailVerifyModal, PasswordUpdateForm, PasswordVerifyModal } from './_components';
import { useSession } from 'next-auth/react';

type FormState = {
  bcode?: string;
  roadAddress?: string;
  jibunAddress?: string;
  zonecode?: string;
  sido?: string;
  address?: string;
  lctnZip?: string;
  roadNmAddr?: string;
  lctnLotnoAddr?: string;
  pwplId?: string;
  pwplNm?: string;
};

type ModalType = 'none' | 'passwordVerify' | 'emailVerify' | 'passwordUpdate';
type VerifyAction = 'email' | 'password' | null;

export default function MyPage() {
  const { data: user } = useSession();

  const [currentModal, setCurrentModal] = useState<ModalType>('none');
  const [verifyAction, setVerifyAction] = useState<VerifyAction>(null);
  const [verifiedCode, setVerifiedCode] = useState<string>('');

  const [form, setForm] = useState<FormState>({});

  const [isAddressOpen, setIsAddressOpen] = useState<boolean>(false);

  const onAddressChange = (v: AddressFieldValue) => {
    setForm((prev) => ({
      ...prev,
      bcode: v.bcode,
      roadAddress: v.roadAddress || v.address,
      jibunAddress: v.jibunAddress,
      zonecode: v.zonecode,
      sido: v.sido,
      address: v.address,
      lctnZip: v.zonecode,
      roadNmAddr: v.roadAddress || v.address,
      lctnLotnoAddr: v.jibunAddress,
    }));
  };

  // 비밀번호 인증 성공 시
  const handleVerifySuccess = (code: string) => {
    setVerifiedCode(code);

    if (verifyAction === 'email') {
      setCurrentModal('emailVerify');
    } else if (verifyAction === 'password') {
      setCurrentModal('passwordUpdate');
    } else {
      setCurrentModal('none');
    }
  };

  // 모달 닫기
  const handleModalClose = () => {
    setCurrentModal('none');
    setVerifyAction(null);
    setVerifiedCode('');
  };

  return (
    <>
      <div className="title-group">
        <TitleComponent
          title="마이페이지"
          subTitle="내 정보"
          desc="사용자 상세 정보 확인 및 메뉴에 대한 권한 제어 가능하다."
        />
      </div>

      <div className="content-group" style={{ paddingTop: 'var(--spacing-10)' }}>
        <Group className="row-group" style={{ gap: 'var(--spacing-16)' }}>
          <div>
            <Heading level={3} id="acc-info-title">
              내 정보
            </Heading>
            <p id="acc-info-summary" className="sr-only">
              사용자의 권한 등급, 개인정보, 소속 부서 및 연동된 발전소 목록을 관리하는 상세
              표입니다.
            </p>
            <ResizableTableContainer>
              <Table
                type="vertical"
                aria-labelledby="acc-info-title"
                aria-describedby="acc-info-summary"
              >
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
                    <Cell>
                      <Group style={{ alignItems: 'center' }}>
                        {user?.user?.email}
                        <ButtonComponent
                          onClick={() => {
                            setVerifyAction('email');
                            setCurrentModal('passwordVerify');
                          }}
                        >
                          아이디 변경
                        </ButtonComponent>
                      </Group>
                    </Cell>
                    <Cell>비밀번호</Cell>
                    <Cell>
                      <ButtonComponent
                        onClick={() => {
                          setVerifyAction('password');
                          setCurrentModal('passwordVerify');
                        }}
                      >
                        비밀번호 변경
                      </ButtonComponent>
                    </Cell>
                  </Row>
                  <Row>
                    <Cell>이름</Cell>
                    <Cell>제임스</Cell>
                    <Cell>휴대 전화 번호</Cell>
                    <Cell>010-0000-0000</Cell>
                  </Row>
                  <Row>
                    <Cell>성별</Cell>
                    <Cell>-</Cell>
                    <Cell>생년월일</Cell>
                    <Cell>1888-01-01</Cell>
                  </Row>
                  <Row>
                    <Cell>회원 변경</Cell>
                    <Cell>
                      <ButtonComponent>사업자 변경</ButtonComponent>
                    </Cell>
                    <Cell>마지막 로그인</Cell>
                    <Cell>2025-12-12 21:22 21</Cell>
                  </Row>

                  <Row>
                    <Cell>
                      <Label>주소</Label>
                    </Cell>
                    <Cell colSpan={3}>
                      <Group>
                        <InputComponent
                          aria-label="우편번호"
                          placeholder=""
                          title="우편번호 검색"
                          readOnly
                          value=""
                        />
                        <ButtonComponent variant="contained" onClick={() => setIsAddressOpen(true)}>
                          검색
                        </ButtonComponent>
                      </Group>

                      <AddressField
                        open={isAddressOpen}
                        onClose={() => setIsAddressOpen(false)}
                        onChange={onAddressChange}
                      />

                      <Group className="input-group">
                        <Group style={{ gap: 'var(--spacing-6)' }}>
                          <InputComponent
                            aria-label="도로명주소"
                            placeholder="도로명주소"
                            title="도로명주소 입력"
                            readOnly
                            value=""
                          />

                          <InputComponent
                            placeholder="상세 주소를 입력해 주세요"
                            aria-label="상세 주소 입력"
                            title="상세 주소 입력"
                          />
                        </Group>
                      </Group>
                    </Cell>
                  </Row>
                  <Row>
                    <Cell>
                      <Label>사업자 명</Label>
                    </Cell>
                    <Cell>
                      <InputComponent
                        aria-label="사업자 명"
                        placeholder=""
                        title="사업자 명 입력"
                        value=""
                      />
                    </Cell>
                    <Cell>사업자 번호</Cell>
                    <Cell>
                      <Group style={{ alignItems: 'center' }}>
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
                      <Group>
                        <InputComponent
                          aria-label="우편번호"
                          placeholder=""
                          title="우편번호 검색"
                          readOnly
                          value=""
                        />
                        <ButtonComponent variant="contained" onClick={() => setIsAddressOpen(true)}>
                          검색
                        </ButtonComponent>
                      </Group>

                      <AddressField
                        open={isAddressOpen}
                        onClose={() => setIsAddressOpen(false)}
                        onChange={onAddressChange}
                      />

                      <Group className="input-group">
                        <Group style={{ gap: 'var(--spacing-6)', width: '100%' }}>
                          <InputComponent
                            aria-label="도로명주소"
                            placeholder="도로명주소"
                            title="도로명주소 입력"
                            readOnly
                            value=""
                          />
                          <InputComponent
                            aria-label="지번주소"
                            placeholder="지번주소"
                            title="지번주소 입력"
                            readOnly
                            value=""
                          />
                        </Group>
                        <Group style={{ gap: 'var(--spacing-6)' }}>
                          <InputComponent
                            placeholder="상세 주소를 입력해 주세요"
                            aria-label="상세 주소 입력"
                            title="상세 주소 입력"
                          />
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
                      <Group>
                        <InputComponent
                          aria-label="소속 부서 변경"
                          placeholder="운영팀"
                          title="소속 부서 변경"
                          readOnly
                          value=""
                        />
                        <ButtonComponent variant="contained">변경</ButtonComponent>
                      </Group>
                    </Cell>
                    <Cell>직급/직책</Cell>
                    <Cell>
                      <Group>
                        <InputComponent
                          aria-label="직급 입력"
                          placeholder="직급 입력"
                          title="직급 입력"
                          value=""
                        />
                        <InputComponent
                          aria-label="직책 입력"
                          placeholder="직책 입력"
                          title="직책 입력"
                          value=""
                        />
                      </Group>
                    </Cell>
                  </Row>
                </TableBody>
              </Table>
            </ResizableTableContainer>
          </div>
        </Group>
      </div>

      <BottomGroupComponent
        rightCont={
          <div className="button-group">
            <ButtonComponent variant="outlined">취소</ButtonComponent>
            <ButtonComponent
              variant="contained"
              icon={<Icons iName="edit" size={16} color="#fff" />}
              onClick={() => console.log('수정 데이터:', form)}
            >
              수정
            </ButtonComponent>
          </div>
        }
      />

      <PasswordVerifyModal
        isOpen={currentModal === 'passwordVerify'}
        onOpen={(open) => {
          if (!open && currentModal === 'passwordVerify') {
            handleModalClose();
          }
        }}
        onPrimaryAction={handleVerifySuccess}
      />

      <EmailVerifyModal
        isOpen={currentModal === 'emailVerify'}
        onOpen={(open) => {
          if (!open && currentModal === 'emailVerify') {
            handleModalClose();
          }
        }}
        verifiedCode={verifiedCode}
      />

      <PasswordUpdateForm
        isOpen={currentModal === 'passwordUpdate'}
        onOpen={(open) => {
          if (!open && currentModal === 'passwordUpdate') {
            handleModalClose();
          }
        }}
        verifiedCode={verifiedCode}
      />
    </>
  );
}
