// src\constants\dashboard\PlantDetailSection.tsx
'use client';

import {
  InfoGroupComponent,
  InfoBoxGroup,
  InfoBoxComponent,
  Meter,
  TextBoxGroup,
  TextBoxComponent,
  ButtonComponent,
  Icons,
} from '@/components';
import { useRouter } from 'next/navigation';
import { Badge } from './Badge';
import type { PwplDashboardEntity } from '@/services/dashboard/type';
import type { PlantData } from '@/app/(home)/page';

const toFixedTwo = (value: number | string | null | undefined): string => {
  const numericValue = Number(value ?? 0);

  if (!Number.isFinite(numericValue)) {
    return '0.00';
  }

  return numericValue.toFixed(2);
};

export function PlantDetailSection({
  data,
  dashboardData,
  socketPower,
  pwplIds,
}: {
  data: PlantData;
  dashboardData?: PwplDashboardEntity;
  socketPower?: number;
  pwplIds: string[];
}) {
  const router = useRouter();
  const isSingleSelection = pwplIds.length === 1;

  const capacity = dashboardData?.plantDetail?.capacityKw ?? data?.detail?.capacity ?? 0;
  const currentPower =
    dashboardData?.plantDetail?.currentPowerKw ?? socketPower ?? data?.detail?.output ?? 0;
  const todayGeneration =
    dashboardData?.plantDetail?.todayGenerationMwh ?? data?.detail?.todayGen ?? 0;
  const operationRate = dashboardData?.plantDetail?.operationRate ?? data?.detail?.rate ?? 0;
  const areaNm = dashboardData?.plantDetail?.areaNm ?? data?.detail?.region ?? '-';
  const pwplNm = dashboardData?.plantDetail?.pwplNm ?? data?.title ?? '';
  const pwplLat = dashboardData?.plantDetail?.pwplLat ?? data?.lat;
  const pwplLot = dashboardData?.plantDetail?.pwplLot ?? data?.lng;
  const updateTime = data?.detail?.updateTime ?? '-';
  
  return (
    <InfoGroupComponent
      isCollapsible
      title={
        <>
          발전소 상세정보
          {pwplNm ? <Badge variant="plant">{pwplNm}</Badge> : ''}
        </>
      }
      extra={
        <ButtonComponent variant="none">
          <Icons iName="arrow_down02" color="#2D2D2D" data-role="arrow" />
        </ButtonComponent>
      }
    >
      <InfoBoxGroup aria-label="발전소 주요 정보">
        <InfoBoxComponent icon="battery" title="설비용량" count={toFixedTwo(capacity)} unit="kW" />

        <InfoBoxComponent
          icon="energy"
          title="현재출력"
          count={toFixedTwo(currentPower)}
          unit="kW"
        />

        <InfoBoxComponent
          icon="factory"
          title="금일 발전량"
          count={toFixedTwo(todayGeneration)}
          unit="kWh"
        />

        <InfoBoxComponent
          icon="battery02"
          title="출력률"
          count={toFixedTwo(operationRate)}
          unit="%"
          rightSide
        >
          <Meter aria-label="출력률" value={operationRate} />
        </InfoBoxComponent>
      </InfoBoxGroup>

      <TextBoxGroup aria-label="발전소 상세 정보">
        <TextBoxComponent title="지역" content={areaNm} />
        <TextBoxComponent title="LMP 존" content="-" />

        <TextBoxComponent
          title="위치"
          content={
            typeof pwplLat === 'number' && typeof pwplLot === 'number'
              ? `${pwplLat.toFixed(3)}, ${pwplLot.toFixed(3)}`
              : '-'
          }
        />

        <TextBoxComponent
          title="최종 업데이트"
          content={updateTime}
          fontSize="var(--font-size-13)"
        />
      </TextBoxGroup>

      {isSingleSelection && (
        <ButtonComponent
          variant="contained"
          icon={<Icons iName="link" color="#fff" />}
          onClick={() => {
            console.log('저장전 pwplIds', pwplIds);

            localStorage.setItem('pwplIds', JSON.stringify(pwplIds));
            console.log('저장후', localStorage.getItem('pwplIds'));

            router.push('/monitoring/operation');
          }}
        >
          발전소 모니터링
        </ButtonComponent>
      )}
    </InfoGroupComponent>
  );
}
