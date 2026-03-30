import type { PwplDashboardEntity } from '@/services/dashboard/type';
import type { PlantBaseComboItem } from '@/services/plants/type';

interface StatusItem {
  title: string;
  count: number | string;
  unit?: string;
  titleCount?: number;
  titleCountUnit?: string;
}

type SocketSummary = {
  currentPowerKw?: number;
  todayGenerationKwh?: number;
  avgOperationRate?: number;
};

export const buildStatusData = (
  dashboardData?: PwplDashboardEntity,
  pwplIds: string[] = [],
  plantCombo?: PlantBaseComboItem[],
  socketSummary?: SocketSummary,
): StatusItem[] => {
  const roundToTwo = (value: number) => Math.round(value * 100) / 100;

  let selectedLabel = '전체';
  let titleCount: number | undefined;
  let titleCountUnit: string | undefined;

  const selectedPlantCount =
    pwplIds.length > 0 ? pwplIds.length : (plantCombo?.length ?? 0);

  if (pwplIds.length === 1 && plantCombo) {
    const target = plantCombo.find((v) => v.pwplId === pwplIds[0]);
    if (target) {
      selectedLabel = target.pwplNm;
    }
  }

  if (pwplIds.length > 1 && plantCombo) {
    const first = plantCombo.find((v) => v.pwplId === pwplIds[0]);

    if (first) {
      selectedLabel = `${first.pwplNm} 외`;
      titleCount = pwplIds.length - 1;
      titleCountUnit = '개';
    }
  }

  return [
    {
      title: `${selectedLabel}`,
      titleCount,
      titleCountUnit,
      count: selectedPlantCount,
      unit: '개',
    },
    {
      title: '총 설비용량',
      count: dashboardData?.summary.totalCapacityKw ?? 0,
      unit: 'kW',
    },
    {
      title: '현재 출력',
      count: roundToTwo(socketSummary?.currentPowerKw ?? dashboardData?.summary.currentPowerKw ?? 0),
      unit: 'kW',
    },
    {
      title: '출력률 (설비용량 대비)',
      count: roundToTwo(socketSummary?.avgOperationRate ?? dashboardData?.summary.avgOperationRate ?? 0),
      unit: '%',
    },
    {
      title: '금일 발전량',
      count: roundToTwo(socketSummary?.todayGenerationKwh ?? dashboardData?.summary.todayGenerationKwh ?? 0),
      unit: 'kWh',
    },
    {
      title: '전일 누적 발전량',
      count: roundToTwo(dashboardData?.summary.yesterdayGenerationKwh ?? 0),
      unit: 'kWh',
    },
    {
      title: '전일 발전금액',
      count: '-',
      unit: '원',
    },
  ];
};
