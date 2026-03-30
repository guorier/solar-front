import type { PwplDashboardEntity } from '@/services/dashboard/type';
import type { PlantBaseComboItem } from '@/services/plants/type';

interface StatusItem {
  title: string;
  count: number | string;
  unit?: string;
  titleCount?: number;
  titleCountUnit?: string;
}

const formatNumber = (
  value: number | string | null | undefined,
  fractionDigits: number = 2,
  trimTrailingZeros: boolean = true,
) => {
  const numericValue = Number(value ?? 0);

  if (!Number.isFinite(numericValue)) {
    return '0';
  }

  const formattedValue = numericValue.toLocaleString('ko-KR', {
    minimumFractionDigits: trimTrailingZeros ? 0 : fractionDigits,
    maximumFractionDigits: fractionDigits,
  });

  return trimTrailingZeros && formattedValue.includes('.')
    ? formattedValue.replace(/\.?0+$/, '')
    : formattedValue;
};

const formatCurrentPrevious = (
  currentValue: number | string | null | undefined,
  previousValue: number | string | null | undefined,
  fractionDigits: number = 2,
  trimTrailingZeros: boolean = true,
) => {
  return `${formatNumber(currentValue, fractionDigits, trimTrailingZeros)} (${formatNumber(previousValue, fractionDigits, trimTrailingZeros)})`;
};

export const buildStatusData = (
  dashboardData?: PwplDashboardEntity,
  pwplIds: string[] = [],
  plantCombo?: PlantBaseComboItem[],
): StatusItem[] => {
  let selectedLabel = '전체';
  let titleCount: number | undefined;
  let titleCountUnit: string | undefined;

  const selectedPlantCount = pwplIds.length > 0 ? pwplIds.length : (plantCombo?.length ?? 0);

  if (pwplIds.length === 1 && plantCombo) {
    const target = plantCombo.find((value) => value.pwplId === pwplIds[0]);
    if (target) {
      selectedLabel = target.pwplNm;
    }
  }

  if (pwplIds.length > 1 && plantCombo) {
    const first = plantCombo.find((value) => value.pwplId === pwplIds[0]);

    if (first) {
      selectedLabel = `${first.pwplNm} 외`;
      titleCount = pwplIds.length - 1;
      titleCountUnit = '개';
    }
  }

  return [
    {
      title: selectedLabel,
      titleCount,
      titleCountUnit,
      count: selectedPlantCount,
      unit: '개',
    },
    {
      title: '총 설비용량',
      count: formatNumber(dashboardData?.summary.totalCapacityKw ?? 0, 2, true),
      unit: 'kW',
    },
    {
      title: '현재 출력',
      count: formatNumber(
        dashboardData?.summary.currentPowerKw ?? 0,
        2,
        true,
      ),
      unit: 'kW',
    },
    {
      title: '금일 발전량',
      count: formatCurrentPrevious(
        dashboardData?.summary.todayGenerationKwh ?? 0,
        dashboardData?.summary.yesterdayGenerationKwh ?? 0,
        2,
        true,
      ),
      unit: 'kWh',
    },
    {
      title: '금일 발전시간',
      count: formatCurrentPrevious(
        dashboardData?.summary.todayGenerationTime ?? 0,
        dashboardData?.summary.yesterdayGenerationTime ?? 0,
        2,
        true,
      ),
      unit: 'h',
    },
    {
      title: '발전금액',
      count: formatCurrentPrevious(
        dashboardData?.summary.currentGenerationAmount ?? 0,
        dashboardData?.summary.yesterdayGenerationAmount ?? 0,
        0,
        false,
      ),
      unit: '원',
    },
    {
      title: '총 누적 발전량',
      count: formatNumber(dashboardData?.summary.totalGenerationKwh ?? 0, 2, true),
      unit: 'kWh',
    },
  ];
};
