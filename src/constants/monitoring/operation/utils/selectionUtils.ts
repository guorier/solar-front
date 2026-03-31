import { useSearchParams } from 'next/navigation';
import { normalizeMac } from './socketUtils';
import type { RestoredSelection, SavedPlantItem } from './types';

export const getRestoredSelection = (
  searchParams: ReturnType<typeof useSearchParams>,
  initialPwplIds: string[],
): RestoredSelection => {
  const paramPwplIds = searchParams.get('pwplIds');
  const paramPwplNms = searchParams.get('pwplNms');
  const paramMacAddrs = searchParams.get('macAddrs');

  if (paramPwplIds || paramPwplNms || paramMacAddrs) {
    return {
      pwplIds: (paramPwplIds ?? '')
        .split(',')
        .map((v) => v.trim())
        .filter(Boolean),
      plantNames: (paramPwplNms ?? '')
        .split(',')
        .map((v) => v.trim())
        .filter(Boolean),
      macAddrs: (paramMacAddrs ?? '')
        .split(',')
        .map((v) => normalizeMac(v))
        .filter(Boolean),
    };
  }

  if (typeof window === 'undefined') {
    return { pwplIds: initialPwplIds, plantNames: [], macAddrs: [] };
  }

  const savedPwplIds = localStorage.getItem('pwplIds');
  const savedPlantNames = localStorage.getItem('pwplNms');
  const savedMacAddrs = localStorage.getItem('macAddrs');

  let nextPwplIds: string[] = initialPwplIds;
  let nextPlantNames: string[] = [];
  let nextMacAddrs: string[] = [];

  if (savedPwplIds) {
    try {
      const parsed = JSON.parse(savedPwplIds) as Array<string | SavedPlantItem>;

      if (Array.isArray(parsed) && parsed.length > 0) {
        if (typeof parsed[0] === 'string') {
          nextPwplIds = parsed as string[];
        } else {
          const items = parsed as SavedPlantItem[];
          nextPwplIds = items.map((v) => v.pwplId);

          const itemNames = items.map((v) => v.pwplNm ?? '').filter(Boolean);
          const itemMacs = items.map((v) => normalizeMac(v.macAddr)).filter(Boolean);

          if (itemNames.length > 0) nextPlantNames = itemNames;
          if (itemMacs.length > 0) nextMacAddrs = itemMacs;
        }
      }
    } catch {
      nextPwplIds = initialPwplIds;
    }
  }

  if (savedPlantNames) {
    try {
      nextPlantNames = (JSON.parse(savedPlantNames) as string[]).filter(Boolean);
    } catch {
      nextPlantNames = [];
    }
  }

  if (savedMacAddrs) {
    try {
      nextMacAddrs = (JSON.parse(savedMacAddrs) as string[])
        .map((v) => normalizeMac(v))
        .filter(Boolean);
    } catch {
      nextMacAddrs = [];
    }
  }

  return { pwplIds: nextPwplIds, plantNames: nextPlantNames, macAddrs: nextMacAddrs };
};
