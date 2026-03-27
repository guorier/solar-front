'use client';

import { DialogTrigger, Group, Popover, PopoverProps, Text } from 'react-aria-components';
import { ButtonComponent, Icons } from '@/components';
import styled from 'styled-components';
import { useRouter } from 'next/navigation';
import { JSX, RefAttributes } from 'react';
import { signOut, useSession } from 'next-auth/react';
import { CurrentTime } from '@/components/currentTime/currentTime';

const Header = styled.header`
  height: 60px;
  padding: 10px 32px;
  display: flex;
  justify-content: right;
`;

const ActionGroup = styled(Group)`
  display: flex;
  align-items: center;
  gap: 20px;
`;

const LinkGroup = styled.div`
  display: flex;
  margin-left: auto;

  button {
    + button {
      &::before {
        display: inline-block;
        content: '';
        width: 1px;
        height: 10px;
        background: var(--gray-40);
        margin: 0 8px;
      }
    }
  }
`;

const AlarmTextStyle: React.CSSProperties = {
  display: 'block',
  textAlign: 'left',
  color: 'var(--gray-50)',
  fontSize: 'var(--font-size-13)',
};

const AlarmTitleStyle: React.CSSProperties = {
  color: 'var(--text-color)',
  fontSize: 'var(--font-size)',
  fontWeight: 600,
  width: '100%',
  textOverflow: 'ellipsis',
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  maxWidth: 280,
  lineHeight: 1.6,
};

export function HeaderLayout(
  props: JSX.IntrinsicAttributes & PopoverProps & RefAttributes<HTMLElement>,
) {
  const { data: session, status } = useSession();
  const sessionUser = session?.user;
  const router = useRouter();

  const isReady = status !== 'loading';
  const isAdmin = isReady && (sessionUser?.role === 'A01001' || sessionUser?.role === 'A01002');

  const handleAuth = () => {
    if (sessionUser) {
      signOut({ callbackUrl: isAdmin ? '/login/admin' : '/login' });
      return;
    }

    router.push('/login');
  };

  return (
    <Header>
      <ActionGroup>
        <CurrentTime />

        <DialogTrigger>
          <ButtonComponent
            variant="none"
            aria-label="Notifications"
            style={{ gap: 'var(--spacing)' }}
          >
            <Group>
              <Icons iName="alarm" size={16} color="#8B8888" />
              <span>알람</span>
              <em className="count-alarm on">2</em>
            </Group>
          </ButtonComponent>
          <Popover {...props} placement="bottom end" style={{ width: 320 }}>
            <div className="pop-header">
              알림
              <LinkGroup>
                <ButtonComponent variant="none">모두읽음</ButtonComponent>
                <ButtonComponent variant="none">전체삭제</ButtonComponent>
              </LinkGroup>
            </div>
            <div className="pop-body">
              <ButtonComponent variant="none">
                <Text slot="label" style={AlarmTextStyle}>
                  인버터 오류 발생
                </Text>
                <Text slot="description" style={{ ...AlarmTextStyle, ...AlarmTitleStyle }}>
                  와이어블 2호기 INV-03에서 MPPT 추적 오류와이어블 2호기 INV-03에서 MPPT 추적 오류
                </Text>
                <Text style={{ ...AlarmTextStyle, position: 'absolute', right: 8, top: 6 }}>
                  방금전
                </Text>
              </ButtonComponent>
              <ButtonComponent variant="none">
                <Text slot="label" style={AlarmTextStyle}>
                  인버터 오류 발생
                </Text>
                <Text slot="description" style={{ ...AlarmTextStyle, ...AlarmTitleStyle }}>
                  와이어블 2호기 INV-03에서 MPPT 추적 오류와이어블 2호기 INV-03에서 MPPT 추적 오류
                </Text>
                <Text style={{ ...AlarmTextStyle, position: 'absolute', right: 8, top: 6 }}>
                  방금전
                </Text>
              </ButtonComponent>
              <ButtonComponent variant="none">
                <Text slot="label" style={AlarmTextStyle}>
                  인버터 오류 발생
                </Text>
                <Text slot="description" style={{ ...AlarmTextStyle, ...AlarmTitleStyle }}>
                  와이어블 2호기 INV-03에서 MPPT 추적 오류와이어블 2호기 INV-03에서 MPPT 추적 오류
                </Text>
                <Text style={{ ...AlarmTextStyle, position: 'absolute', right: 8, top: 6 }}>
                  방금전
                </Text>
              </ButtonComponent>
              <ButtonComponent variant="none">
                <Text slot="label" style={AlarmTextStyle}>
                  인버터 오류 발생
                </Text>
                <Text slot="description" style={{ ...AlarmTextStyle, ...AlarmTitleStyle }}>
                  와이어블 2호기 INV-03에서 MPPT 추적 오류와이어블 2호기 INV-03에서 MPPT 추적 오류
                </Text>
                <Text style={{ ...AlarmTextStyle, position: 'absolute', right: 8, top: 6 }}>
                  방금전
                </Text>
              </ButtonComponent>
              <ButtonComponent variant="none">
                <Text slot="label" style={AlarmTextStyle}>
                  인버터 오류 발생
                </Text>
                <Text slot="description" style={{ ...AlarmTextStyle, ...AlarmTitleStyle }}>
                  와이어블 2호기 INV-03에서 MPPT 추적 오류와이어블 2호기 INV-03에서 MPPT 추적 오류
                </Text>
                <Text style={{ ...AlarmTextStyle, position: 'absolute', right: 8, top: 6 }}>
                  방금전
                </Text>
              </ButtonComponent>
              <ButtonComponent variant="none">
                <Text slot="label" style={AlarmTextStyle}>
                  인버터 오류 발생
                </Text>
                <Text slot="description" style={{ ...AlarmTextStyle, ...AlarmTitleStyle }}>
                  와이어블 2호기 INV-03에서 MPPT 추적 오류와이어블 2호기 INV-03에서 MPPT 추적 오류
                </Text>
                <Text style={{ ...AlarmTextStyle, position: 'absolute', right: 8, top: 6 }}>
                  방금전
                </Text>
              </ButtonComponent>
            </div>
          </Popover>
        </DialogTrigger>

        {/* 프로필 메뉴 */}
        <DialogTrigger>
          <ButtonComponent
            variant="none"
            aria-label="User menu"
            style={{ gap: 'var(--spacing-4)' }}
          >
            <Group>
              <img
                src={sessionUser?.image ? sessionUser.image : '/images/img_profile.png'}
                alt="Profile"
              />
              <dl style={{ textAlign: 'left', marginRight: 'var(--spacing-2)' }}>
                <dt style={{ fontWeight: 600 }}>{isReady ? sessionUser?.name : ''}</dt>
                <dd style={{ fontSize: 'var(--font-size-13)', fontWeight: 500, opacity: 0.4 }}>
                  {!isReady
                    ? '-'
                    : sessionUser?.pwplType?.trim() === 'P'
                      ? '발전소 모드'
                      : '기지국 모드'}
                </dd>
              </dl>
              <Icons iName="arrow_down" size={20} color="#2B2F33" />
            </Group>
          </ButtonComponent>
          <Popover {...props} placement="bottom end">
            <div className="pop-header">
              {isReady ? (isAdmin ? '관리자' : '일반') : '-'}
              <p>{isReady ? sessionUser?.email : '-'}</p>
            </div>
            <div className="pop-body">
              {isReady && isAdmin && (
                <ButtonComponent variant="none" id="settings">
                  설정
                </ButtonComponent>
              )}
              {isReady && sessionUser && (
                <ButtonComponent variant="none" id="mypage" onClick={() => router.push('/mypage')}>
                  My Page
                </ButtonComponent>
              )}

              <ButtonComponent variant="none" id="logout" onClick={handleAuth}>
                {isReady && sessionUser ? '로그아웃' : '로그인'}
              </ButtonComponent>
            </div>
          </Popover>
        </DialogTrigger>
      </ActionGroup>
    </Header>
  );
}

export default HeaderLayout;
