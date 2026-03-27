import { UNSTABLE_ToastQueue as ToastQueue } from 'react-aria-components';

export interface ToastContentProps {
  title: string;
  description?: string;
  type?: 'success' | 'error' | 'excel';
}

export const toastQueue = new ToastQueue<ToastContentProps>();

export const toast = {
  success(title: string, description?: string) {
    toastQueue.add({ title, description, type: 'success' }, { timeout: 3000 });
  },
  error(title: string, description?: string) {
    toastQueue.add({ title, description, type: 'error' }, { timeout: 3000 });
  },
  excel(title: string, description?: string) {
    toastQueue.add({ title, description, type: 'excel' }, { timeout: 3000 });
  },
};
