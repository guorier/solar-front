'use client';

import {
  InfoGroupComponent,
  InfoBoxGroup,
  InfoBoxComponent,
  ButtonComponent,
  Icons,
} from '@/components';
import { Badge } from './Badge';
import type { PwplDashboardEntity } from '@/services/dashboard/type';
import type { PlantData } from '@/app/(home)/page';

export function WeatherInfoSection({
  data,
  dashboardData,
}: {
  data: PlantData;
  dashboardData?: PwplDashboardEntity;
}) {
  return (
    <InfoGroupComponent
      isCollapsible
      title={
        <>
          기상정보
          {dashboardData?.plantDetail?.pwplNm ? (
            <Badge variant="observatory">{dashboardData.plantDetail.pwplNm}</Badge>
          ) : (
            ''
          )}
        </>
      }
      extra={
        <ButtonComponent variant="none">
          <Icons iName="arrow_down02" color="#2D2D2D" data-role="arrow" />
        </ButtonComponent>
      }
    >
      <InfoBoxGroup>
        <InfoBoxComponent icon="temp" title="온도" count={dashboardData?.weatherInfo.temperatureC ?? data?.weather.temp} unit="℃" />
        <InfoBoxComponent icon="humidity" title="습도" count={dashboardData?.weatherInfo.humidity ?? data?.weather.humidity} unit="%" />
        <InfoBoxComponent icon="wind" title="풍속" count={dashboardData?.weatherInfo.windSpeed ?? data?.weather.wind} unit="m/s" />
        <InfoBoxComponent icon="solar" title="일사량" count={Number((dashboardData?.weatherInfo.irradianceWm2 ?? data?.weather.solar ?? 0).toFixed(1),)} unit="W/m²" />
        <InfoBoxComponent icon="dust" title="PM10" count={dashboardData?.weatherInfo.pm10 ?? data?.weather.pm10} unit="μg/m³" />
        <InfoBoxComponent icon="dust" title="PM2.5" count={dashboardData?.weatherInfo.pm25 ?? data?.weather.pm25} unit="μg/m³"/>
      </InfoBoxGroup>
    </InfoGroupComponent>
  );
}
