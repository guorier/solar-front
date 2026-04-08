// src\components\modal\modal.component.tsx
import { Modal as AriaModal, ModalOverlayProps, Dialog, Heading } from 'react-aria-components';
import './modal.component.scss';
import { ButtonComponent } from '../button';
import { Icons } from '../icon';
import styled from 'styled-components';

interface MyModalProps extends ModalOverlayProps {
  title?: React.ReactNode;
  subTitle?: string;
  children?: React.ReactNode;
  primaryButton?: string;
  secondaryButton?: string;
  width?: number;
  hideButton?: boolean;

  // ✅ 추가
  onPrimaryPress?: () => void;
  isPrimaryDisabled?: boolean;
}

const Head = styled.div`
  display: flex;
  justify-content: space-between;
  padding: var(--spacing-20) var(--spacing-20) var(--spacing-16);

  h3 {
    font-size: var(--font-size-19);
    font-weight: 700;
  }
`;

const Body = styled.div<{ $hideButton?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-6);
  max-height: 680px;
  padding: 0 var(--spacing-20);
  overflow-y: auto;

  ${({ $hideButton }) => $hideButton && `padding-bottom: var(--spacing-20);`}
`;

const Foot = styled.div`
  display: flex;
  justify-content: right;
  gap: var(--spacing-4);
  padding: var(--spacing-16) var(--spacing-20) var(--spacing-20);

  button {
    min-width: 80px !important;
  }
`;

export function Modal({
  title,
  subTitle,
  children,
  primaryButton = '확인',
  secondaryButton = '취소',
  hideButton = false,
  width,

  // ✅ 추가
  onPrimaryPress,
  isPrimaryDisabled,

  ...props
}: MyModalProps) {
  return (
    <AriaModal {...props} style={{ width: width, maxWidth: '100%' }}>
      <Dialog>
        {({ close }) => (
          <>
            {title && (
              <Head>
                <Heading
                  slot="title"
                  level={3}
                  style={{
                    margin: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px',
                    lineHeight: 1,
                    fontFamily: 'auto',
                  }}
                >
                  {title}
                  {subTitle && (
                    <span style={{ fontSize: '13px', fontWeight: 400, color: '#666', whiteSpace: 'pre-line' }}>
                      {subTitle}
                    </span>
                  )}
                </Heading>
                <ButtonComponent
                  height={20}
                  variant="none"
                  icon={<Icons iName="close" />}
                  aria-label="닫기"
                  onClick={close}
                />
              </Head>
            )}
            <Body $hideButton={hideButton}>{children}</Body>
            {!hideButton && (
              <Foot>
                {secondaryButton && (
                  <ButtonComponent variant="outlined" onClick={close}>
                    {secondaryButton}
                  </ButtonComponent>
                )}
                {primaryButton && (
                  <ButtonComponent
                    variant="contained"
                    isDisabled={isPrimaryDisabled}
                    onClick={() => {
                      if (onPrimaryPress) {
                        onPrimaryPress();
                        return;
                      }
                      close();
                    }}
                  >
                    {primaryButton}
                  </ButtonComponent>
                )}
              </Foot>
            )}
          </>
        )}
      </Dialog>
    </AriaModal>
  );
}
