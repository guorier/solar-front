'use client';

import {
  UNSTABLE_ToastRegion as ToastRegion,
  UNSTABLE_Toast as Toast,
  UNSTABLE_ToastContent as ToastContent,
  ToastProps,
  Text,
  Button,
} from 'react-aria-components';
import { Icons } from '../icon';
import { iName } from '../icon/Icons';
import { toastQueue } from '@/stores/toast';
import './toast.scss';

interface ToastContentProps {
  title: string;
  description?: string;
  type?: 'success' | 'error' | 'excel';
}

const TOAST_CONFIG: Record<
  NonNullable<ToastContentProps['type']>,
  { icon: iName; color: string }
> = {
  success: { icon: 'check', color: '#16a34a' },
  error: { icon: 'close', color: '#dc2626' },
  excel: { icon: 'feedback', color: '#15803d' },
};

function getToastConfig(type?: ToastContentProps['type']) {
  return type ? TOAST_CONFIG[type] : { icon: 'check', color: '#444242' };
}

export function ToastRegionComponent() {
  return (
    <ToastRegion queue={toastQueue} className="toast-region">
      {({ toast }) => {
        const config = getToastConfig(toast.content.type);

        return (
          <ToastComponent toast={toast}>
            <div className="toast__icon">
              <Icons iName={config.icon as iName} color={config.color} />
            </div>

            <ToastContent className="toast__content">
              <div className="toast__header">
                <Text slot="title" className="toast__title">
                  {toast.content.title}
                </Text>
                <Button slot="close" aria-label="닫기" className="toast__close">
                  <Icons iName="del" size={30} />
                </Button>
              </div>

              {toast.content.description && (
                <Text slot="description" className="toast__desc">
                  {toast.content.description}
                </Text>
              )}
            </ToastContent>
          </ToastComponent>
        );
      }}
    </ToastRegion>
  );
}

export function ToastComponent(props: ToastProps<ToastContentProps>) {
  return <Toast {...props} className="toast" />;
}
