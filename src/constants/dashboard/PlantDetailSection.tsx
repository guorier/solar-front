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
import { useDashboardSocketContext } from '@/providers/DashboardSocketContext';

const toFixedTwo = (value: number | string | null | undefined): string => {
  const numericValue = Number(value ?? 0);

  if (!Number.isFinite(numericValue)) {
    return '0.00';
  }

  return numericValue.toFixed(2);
};

const formatOccurredAt = (value: string | null | undefined): string => {
  if (!value) {
    return '-';
  }

  const parsedDate = new Date(value);

  if (!Number.isFinite(parsedDate.getTime())) {
    return value.replace('T', ' ').slice(0, 16);
  }

  const year = parsedDate.getFullYear();
  const month = String(parsedDate.getMonth() + 1).padStart(2, '0');
  const day = String(parsedDate.getDate()).padStart(2, '0');
  const hours = String(parsedDate.getHours()).padStart(2, '0');
  const minutes = String(parsedDate.getMinutes()).padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}`;
};

export function PlantDetailSection({
  data,
  dashboardData,
  pwplIds,
}: {
  data: PlantData;
  dashboardData?: PwplDashboardEntity;
  pwplIds: string[];
}) {
  const router = useRouter();
  const { setOperationPwplId } = useDashboardSocketContext();
  const isSingleSelection = pwplIds.length === 1;
  const plantDetail = dashboardData?.plantDetail;

  const capacity = plantDetail?.capacityKw ?? data?.detail?.capacity ?? 0;
  const currentPower = plantDetail?.currentPowerKw ?? data?.detail?.output ?? 0;
  const todayGeneration = plantDetail?.todayGenerationKwh ?? data?.detail?.todayGen ?? 0;
  const operationRate = plantDetail?.operationRate ?? data?.detail?.rate ?? 0;
  const areaNm = plantDetail?.areaNm ?? data?.detail?.region ?? '-';
  const pwplNm = plantDetail?.pwplNm ?? data?.title ?? '';
  const pwplLat = plantDetail?.pwplLat ?? data?.lat;
  const pwplLot = plantDetail?.pwplLot ?? data?.lng;
  const updateTime = formatOccurredAt(plantDetail?.occurredAt) ?? data?.detail?.updateTime ?? '-';

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
            localStorage.setItem(
              'pwplIds',
              JSON.stringify([
                {
                  pwplId: data.pwplId,
                  pwplNm: data.title,
                  macAddr: data.macAddr,
                },
              ]),
            );
            setOperationPwplId(data.pwplId);
            router.push('/monitoring/operation');
          }}
        >
          발전소 모니터링
        </ButtonComponent>
      )}
    </InfoGroupComponent>
  );
}
