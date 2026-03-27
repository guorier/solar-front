// src/hooks/useListHistoryState.ts
'use client';

import { useEffect, useRef } from 'react';
import type { JsonObject, ListState, StorageKind } from '@/utils/listState';
import { loadListState, saveListState } from '@/utils/listState';

type Params<TFilters extends JsonObject> = {
  key: string;
  storage?: StorageKind;
  ttlMs?: number;

  getState: () => Omit<ListState<TFilters>, 'updatedAt'>;
  applyState: (state: ListState<TFilters>) => void;

  restoreScroll?: boolean;
};

export const useListHistoryState = <TFilters extends JsonObject>({
  key,
  storage = 'session',
  ttlMs,
  getState,
  applyState,
  restoreScroll = true,
}: Params<TFilters>) => {
  const didRestoreRef = useRef(false);

  useEffect(() => {
    const saved = loadListState<TFilters>(key, storage, ttlMs);
    if (!saved) return;

    didRestoreRef.current = true;
    applyState(saved);

    if (restoreScroll) {
      requestAnimationFrame(() => {
        window.scrollTo(0, typeof saved.scrollY === 'number' ? saved.scrollY : 0);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const persistNow = () => {
    const base = getState();
    saveListState<TFilters>(
      key,
      {
        ...base,
        scrollY: typeof window !== 'undefined' ? window.scrollY : 0,
        updatedAt: Date.now(),
      },
      storage,
    );
  };

  useEffect(() => {
    if (!didRestoreRef.current) return;
    didRestoreRef.current = false;
    persistNow();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { persistNow };
};