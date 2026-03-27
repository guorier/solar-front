'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { signOut, useSession } from 'next-auth/react';
import { toast } from '@/stores/toast';

export function useSessionExpiry() {
  const warnBeforeMinutes = 5;

  const { data: session, status, update } = useSession();

  const [isOpen, setIsOpen] = useState<boolean>(false);

  const timeoutsRef = useRef<{ warn?: NodeJS.Timeout; expire?: NodeJS.Timeout }>({});
  const warnedRef = useRef(false);
  const signingOutRef = useRef(false);

  const role = session?.user?.role;

  // 만료 시 이동할 url
  const callbackUrl = useMemo(() => {
    const isAdmin = role === 'A01001' || role === 'A01002';
    return isAdmin ? '/login/admin' : '/login';
  }, [role]);

  // 타이머 초기화
  const clearTimers = () => {
    if (timeoutsRef.current.warn) clearTimeout(timeoutsRef.current.warn);
    if (timeoutsRef.current.expire) clearTimeout(timeoutsRef.current.expire);
    timeoutsRef.current = {};
  };

  // 모달 닫기
  const close = () => setIsOpen(false);

  // 토큰 연장
  const extend = async () => {
    await update({ extend: true });
    warnedRef.current = false;
    setIsOpen(false);
    clearTimers();
  };

  useEffect(() => {
    if (status !== 'authenticated') return;

    const exp = session?.user?.accessTokenExp;
    if (typeof exp !== 'number') return;

    clearTimers();

    // 토큰 만료
    const expireNow = async () => {
      if (signingOutRef.current) return;
      signingOutRef.current = true;

      clearTimers();
      setIsOpen(false);

      toast.error('세션이 만료되어 다시 로그인해 주세요.');

      setTimeout(() => {
        signOut({ callbackUrl });
      }, 0);
    };

    const nowSec = Math.floor(Date.now() / 1000);
    const remainingMs = (exp - nowSec) * 1000;

    // 이미 만료
    if (remainingMs <= 0) {
      setTimeout(() => {
        expireNow();
      }, 0);

      return () => clearTimers();
    }

    // warn 타이밍
    const warnMs = remainingMs - warnBeforeMinutes * 60 * 1000;

    const fireWarnOnce = () => {
      if (warnedRef.current) return;
      warnedRef.current = true;
      setIsOpen(true);
    };

    if (warnMs <= 0) {
      fireWarnOnce();
    } else {
      timeoutsRef.current.warn = setTimeout(fireWarnOnce, warnMs);
    }

    timeoutsRef.current.expire = setTimeout(() => {
      expireNow();
    }, remainingMs);

    return () => clearTimers();
  }, [status, session?.user?.accessTokenExp, warnBeforeMinutes, callbackUrl]);

  return { isOpen, close, extend };
}
