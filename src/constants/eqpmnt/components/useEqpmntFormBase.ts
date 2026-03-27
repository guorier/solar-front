'use client';

import { useState } from 'react';

type StructItem<T> = {
  status: 'I' | 'U' | 'D';
  strtsSeq: number;
  value: T;
};

export function useEqpmntFormBase<T extends Record<string, string>>(
  mode: 'create' | 'edit',
  createEmptyStructState: () => T,
) {
  const [structList, setStructList] = useState<StructItem<T>[]>([
    {
      status: mode === 'create' ? 'I' : 'U',
      strtsSeq: 1,
      value: createEmptyStructState(),
    },
  ]);

  const [activeStructIndex, setActiveStructIndex] = useState<number>(0);

  const setStructValue = (targetIndex: number, key: keyof T, value: string) => {
    setStructList((prev: StructItem<T>[]) =>
      prev.map((item: StructItem<T>, idx: number) =>
        idx === targetIndex
          ? {
              ...item,
              status: item.status === 'I' ? 'I' : 'U',
              value: { ...item.value, [key]: value },
            }
          : item,
      ),
    );
  };

  const addStructGroup = () => {
    setStructList((prev: StructItem<T>[]) => [
      ...prev,
      { status: 'I', strtsSeq: 0, value: createEmptyStructState() },
    ]);
    setActiveStructIndex((prev: number) => prev + 1);
  };

  const removeStructGroup = (index: number) => {
    setStructList((prev: StructItem<T>[]) =>
      prev.map((item: StructItem<T>, idx: number) =>
        idx === index ? { ...item, status: 'D' } : item,
      ),
    );
    setActiveStructIndex((prev: number) => (prev === index ? 0 : prev));
  };

  const buildStructs = <R>(mapper: (item: StructItem<T>) => R) => {
    return structList.map((item: StructItem<T>) => mapper(item));
  };

  return {
    structList,
    setStructList,
    activeStructIndex,
    setActiveStructIndex,
    addStructGroup,
    removeStructGroup,
    setStructValue,
    buildStructs,
  };
}