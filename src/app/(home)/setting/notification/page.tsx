'use client';

import {
  BottomGroupComponent,
  ButtonComponent,
  Icons,
  Select,
  SelectItem,
  Switch,
  TitleComponent,
} from '@/components';
import { useState } from 'react';
import { Group, Heading, Input } from 'react-aria-components';
import { styled } from 'styled-components';

const NotificationBox = styled.div`
  padding: var(--spacing-10);
  border-top: 2px solid var(--border-color);
  border-bottom: 2px solid var(--border-color);
`;

const NotificationBoxItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: var(--text-color);
  font-size: var(--font-size-17);
  line-height: 1.5;
`;

const NotificationList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-10);
  width: 100%;
  padding-top: var(--spacing-10);
`;
const NotificationListItem = styled.li`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  line-height: 1;

  > span {
    font-weight: 600;
  }
`;

const NotificationSubList = styled.ul`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: var(--spacing-10);
  border-radius: var(--radius);
  background: var(--gray-A100);
  margin-top: var(--spacing-6);
`;
const NotificationSubListItem = styled.li`
  display: flex;
  justify-content: space-between;
  line-height: 42px;

  > span {
    &::before {
      display: inline-block;
      content: '';
      width: 3px;
      height: 3px;
      background: var(--text-color);
      vertical-align: middle;
      margin: 0 var(--spacing-6);
    }
  }
`;

export default function NotificationPage() {
  const [isMainOn, setIsMainOn] = useState<boolean>(false);
  const [isRepeatOn, setIsRepeatOn] = useState<boolean>(false);

  // 장애 알림 사용 스위치
  const handleMainChange = (isSelected: boolean) => {
    setIsMainOn(isSelected);
    if (!isSelected) {
      setIsRepeatOn(false);
    }
  };

  // 장애 알림 반복 스위치
  const handleRepeatChange = (isSelected: boolean) => {
    setIsRepeatOn(isSelected);
    if (isSelected) {
      setIsMainOn(true);
    }
  };

  return (
    <>
      <div className="title-group">
        <TitleComponent
          title="설정 관리"
          subTitle="알림 관리"
          desc="알림 설정으로 알림 종류와 알림 받을 여부를 설정 관리"
        />
      </div>

      <div className="content-group" style={{ paddingTop: 'var(--spacing-10)' }}>
        <Group className="row-group" style={{ gap: 'var(--spacing-16)' }}>
          <div>
            <Heading level={3}>푸시알림</Heading>
            <NotificationBox>
              <NotificationBoxItem>
                <span>
                  실시간 발생 또는 행위에 따른 발생 이벤트에 대한 알림 발송 여부를 선택 할 수
                  있습니다.
                  <br />
                  비활성화 선택 하시면 알림 카테고리 활성화도 모두 비활성화 처리 됩니다.
                </span>
                <Switch>푸시알림</Switch>
              </NotificationBoxItem>
            </NotificationBox>
          </div>
          {/* //푸시알림 */}
          <div>
            <Heading level={3}>알림 카테고리</Heading>
            <NotificationBox>
              <NotificationBoxItem>
                <span>알림 카테고리별 알림을 사용자에게 발송 여부를 선택 할 수 있습니다.</span>
              </NotificationBoxItem>
              <NotificationBoxItem>
                <NotificationList>
                  <NotificationListItem>
                    <span>장애 알림 사용 (장애 및 기타 알림 발송 여부)</span>
                    <Switch isSelected={isMainOn} onChange={handleMainChange}>
                      알림
                    </Switch>
                    <NotificationSubList>
                      <NotificationSubListItem>
                        <span>장애 알림 반복</span>
                        <Switch
                          isSelected={isRepeatOn}
                          onChange={handleRepeatChange}
                        >
                          알림
                        </Switch>
                      </NotificationSubListItem>
                      <NotificationSubListItem>
                        <span>장애 알림 반복 횟수</span>
                        <Select aria-label="장애 알림 반복 횟수 선택" value="3" isDisabled={!isRepeatOn} style={{ width: 95 }}>
                          <SelectItem id="3">3</SelectItem>
                          <SelectItem id="6">6</SelectItem>
                          <SelectItem id="9">9</SelectItem>
                        </Select>
                      </NotificationSubListItem>
                    </NotificationSubList>
                  </NotificationListItem>
                  <NotificationListItem>
                    <span>등록 알림 (게시판 공지, 파일공유, 뉴스 피트 신규 등록)</span>
                    <Switch>알림</Switch>
                  </NotificationListItem>
                  <NotificationListItem>
                    <span>보안 경고 알림 (로그인 사용자 비밀번호 6개월 이상 변경 없는 경우)</span>
                    <Switch>알림</Switch>
                  </NotificationListItem>
                  <NotificationListItem>
                    <span>정산 알림 (정산 대기 또는 정산 완료)</span>
                    <Switch>알림</Switch>
                  </NotificationListItem>
                  <NotificationListItem>
                    <span>모바일 알림 (앱 사용자 대상 장애/등록/정산 3개 알림 사용 여부)</span>
                    <Switch>알림</Switch>
                  </NotificationListItem>
                </NotificationList>
              </NotificationBoxItem>
            </NotificationBox>
          </div>
          {/* //알림 카테고리 */}

          <div>
            <Heading level={3}>이메일 주소</Heading>
            <NotificationBox>
              <NotificationBoxItem>
                <span>발송 메일 주소를 변경 할 수 있습니다.</span>
                <Group style={{ gap: 'var(--spacing-6)' }}>
                  <div className="react-aria-TextField">
                    <Input
                      aria-label="이메일 주소 입력"
                      placeholder="wiable@mail.com"
                      value=""
                    />
                  </div>
                  <ButtonComponent variant="contained">업데이트</ButtonComponent>
                </Group>
              </NotificationBoxItem>
            </NotificationBox>
          </div>
          {/* //이메일 주소 */}
        </Group>
      </div>

      <BottomGroupComponent
        rightCont={
          <div className="button-group">
            <ButtonComponent
              variant="contained"
              icon={<Icons iName="edit" size={16} color="#fff" />}
            >
              수정
            </ButtonComponent>
            <ButtonComponent
              variant="outlined"
              icon={<Icons iName="list" size={16} color="#8B8888" />}
            >
              취소
            </ButtonComponent>
          </div>
        }
      />
    </>
  );
}
