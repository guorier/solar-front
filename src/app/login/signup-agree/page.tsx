'use client';

import { ButtonComponent, Checkbox, Icons, LoginBoxComponent } from '@/components';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { styled } from 'styled-components';

const AgreeList = styled.ul`
  label {
    font-size: var(--font-size-17);
    font-weight: 500;

    em {
      color: var(--point-pink-70);
    }
    .indicator {
      width: 24px;
      height: 24px;
      border-radius: var(--radius-full);
      background: var(--gray-10);
    }
  }
`;

const AgreeListItem = styled.li`
  > div {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    height: 52px;
    padding: var(--spacing-6) 0;
  }

  border-bottom: 1px solid var(--border-color);
  color: var(--text-color);

  &.total {
    padding: 0;
    padding-bottom: var(--spacing-16);

    label {
      font-weight: 700;
      padding-bottom: var(--spacing-5);
    }
  }
`;

const AgreeSubList = styled.ul`
  padding-bottom: var(--spacing-6);
`;
const AgreeSubListItem = styled.li`
  padding: var(--spacing-5);
  border-radius: var(--radius-sm);
  border: 0;
  background: var(--gray-5);

  label {
    font-size: var(--font-size-15);
  }
`;

export default function SignUpAgreePage() {
  const router = useRouter();

  const [agreements, setAgreements] = useState({
    termService: false,
    termPrivacy: false,
    termMarketing: false,
    termEvent: false,
    termPush: false,
  });

  const isAllChecked = Object.values(agreements).every(Boolean);

  const handleAllCheck = (checked: boolean) => {
    const nextState = Object.keys(agreements).reduce(
      (acc, key) => {
        acc[key as keyof typeof agreements] = checked;
        return acc;
      },
      {} as typeof agreements,
    );
    setAgreements(nextState);
  };

  const handleCheck = (key: keyof typeof agreements, checked: boolean) => {
    setAgreements((prev) => {
      const newState = { ...prev, [key]: checked };

      if (key === 'termEvent' || key === 'termPush') {
        newState.termMarketing = newState.termEvent && newState.termPush;
      }

      if (key === 'termMarketing') {
        newState.termEvent = checked;
        newState.termPush = checked;
      }

      return newState;
    });
  };

  const isRequiredAgreed = agreements.termService && agreements.termPrivacy;

  const agreYn = agreements.termService && agreements.termPrivacy ? 'Y' : 'N';
  const chcYn = agreements.termMarketing || agreements.termEvent || agreements.termPush ? 'Y' : 'N';

  return (
    <LoginBoxComponent
      title="회원가입"
      primaryButton="동의"
      secondaryButton="로그인 화면"
      onPrimaryClick={() => router.push(`/login/signup?agreYn=${agreYn}&chcYn=${chcYn}`)}
      onSecondaryClick={() => router.push('/login')}
      isPrimaryDisabled={!isRequiredAgreed}
    >
      <AgreeList>
        <AgreeListItem className="total">
          <div>
            <Checkbox isSelected={isAllChecked} onChange={handleAllCheck}>
              전체 동의하기
            </Checkbox>
          </div>
          <p className="desc">
            전체 동의는 필수 및 선택정보에 대한 동의도 포함되어 있으며, 개별적으로도 동의를 선택하실
            수 있습니다.
            <br />
            선택항목에 대한 동의를 거부하시는 경우에도 서비스는 이용이 가능합니다.
          </p>
        </AgreeListItem>
        <AgreeListItem>
          <div>
            <Checkbox
              isSelected={agreements.termService}
              onChange={(val) => handleCheck('termService', val)}
            >
              <em>&#40;필수&#41;</em> WIABLE 이용약관
            </Checkbox>
            <ButtonComponent
              variant="none"
              icon={<Icons iName="arrow_right" size={16} color="#8B8888" />}
            >
              <Link href="/login/signup-agree/term?tab=service">
                약관보기
              </Link>
            </ButtonComponent>
          </div>
        </AgreeListItem>
        <AgreeListItem>
          <div>
            <Checkbox
              isSelected={agreements.termPrivacy}
              onChange={(val) => handleCheck('termPrivacy', val)}
            >
              <em>&#40;필수&#41;</em> 개인정보 수집 및 이용
            </Checkbox>
            <ButtonComponent
              variant="none"
              icon={<Icons iName="arrow_right" size={16} color="#8B8888" />}
            >
              <Link href="/login/signup-agree/term?tab=privacy">
                약관보기
              </Link>
            </ButtonComponent>
          </div>
        </AgreeListItem>
        <AgreeListItem>
          <div>
            <Checkbox
              isSelected={agreements.termMarketing}
              onChange={(val) => handleCheck('termMarketing', val)}
            >
              <em style={{ color: 'var(--gray-50)' }}>(선택)</em> 광고성 정보 수신 동의
            </Checkbox>
            <ButtonComponent
              variant="none"
              icon={<Icons iName="arrow_right" size={16} color="#8B8888" />}
            >
              <Link href="/login/signup-agree/term?tab=marketing">
                약관보기
              </Link>
            </ButtonComponent>
          </div>

          <AgreeSubList>
            <AgreeSubListItem>
              <Checkbox
                isSelected={agreements.termEvent}
                onChange={(val) => handleCheck('termEvent', val)}
              >
                이벤트, 혜택 정보 수신
              </Checkbox>
            </AgreeSubListItem>
            <AgreeSubListItem>
              <Checkbox
                isSelected={agreements.termPush}
                onChange={(val) => handleCheck('termPush', val)}
              >
                앱 푸시 수신 동의
              </Checkbox>
            </AgreeSubListItem>
          </AgreeSubList>
        </AgreeListItem>
      </AgreeList>
    </LoginBoxComponent>
  );
}
