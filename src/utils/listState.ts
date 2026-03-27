// src/utils/listState.ts
export type JsonPrimitive = string | number | boolean | null;
export type JsonValue = JsonPrimitive | JsonObject | JsonArray;
export type JsonObject = { [k: string]: JsonValue };
export type JsonArray = JsonValue[];

export type StorageKind = 'session' | 'local';

export type ListState<TFilters extends JsonObject> = {
  page: number;
  size: number;
  filters: TFilters;
  draftFilters?: TFilters;
  sort?: string;
  scrollY?: number;
  updatedAt: number;
};

export const makeListStateKey = (scope: string) => `${scope}:list-state:v1`;

export const loadListState = <TFilters extends JsonObject>(
  key: string,
  storage: StorageKind = 'session',
  ttlMs?: number,
): ListState<TFilters> | null => {
  if (typeof window === 'undefined') return null;
  try {
    const s = storage === 'local' ? localStorage : sessionStorage;
    const raw = s.getItem(key);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as ListState<TFilters>;
    if (!parsed.updatedAt) return null;
    if (ttlMs && Date.now() - parsed.updatedAt > ttlMs) return null;
    return parsed;
  } catch {
    return null;
  }
};

export const saveListState = <TFilters extends JsonObject>(
  key: string,
  state: ListState<TFilters>,
  storage: StorageKind = 'session',
) => {
  if (typeof window === 'undefined') return;
  const s = storage === 'local' ? localStorage : sessionStorage;
  s.setItem(key, JSON.stringify(state));
};

export const clearListState = (key: string, storage: StorageKind = 'session') => {
  if (typeof window === 'undefined') return;
  const s = storage === 'local' ? localStorage : sessionStorage;
  s.removeItem(key);
};