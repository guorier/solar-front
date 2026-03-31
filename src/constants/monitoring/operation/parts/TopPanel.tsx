'use client';

import {
  InfoBoxComponent,
  InfoBoxGroup,
  TopInfoBoxComponent,
  Progressbar,
  ProgressbarComponent,
} from '@/components';
import AnimatedWaveGauge from '@/components/chart/AnimatedWaveGauge';
import type { MonitorWeatherRes } from '@/services/monitoring/weather/type';
import { CircleGlowBackground } from './GlowBg';
import { INVERTER_TOTAL_ENERGY_MAX_KWH, MODULE_POWER_MAX_W } from './constants';
import { formatEnergyDisplay, getProgressPercent, safeToFixed } from './utils';
import type { RealtimeData } from './types';

export const TopDashboardSection = ({
  realtimeData,
  weatherData,
}: {
  realtimeData: RealtimeData;
  weatherData?: MonitorWeatherRes;
}) => {
  const inverterTotalEnergyDisplay = formatEnergyDisplay(realtimeData.inverterTotalEnergy);

  return (
    <div
      className="flex-1"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '120px',
        paddingTop: '152px',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '160px',
          width: '100%',
        }}
      >
        <div
          style={{
            position: 'relative',
            flex: 1,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minWidth: 0,
          }}
        >
          <CircleGlowBackground />
          <AnimatedWaveGauge
            value={safeToFixed(realtimeData.gridPowerW, 2)}
            title="3상 출력 전류"
            unit="W"
          />
        </div>

        <div
          style={{
            display: 'grid',
            gap: '160px',
            gridTemplateColumns: 'repeat(2, 360px)',
            zIndex: 10,
          }}
        >
          <ProgressbarComponent
            title="인버터 누적 발전량"
            count={inverterTotalEnergyDisplay.value}
            unit={inverterTotalEnergyDisplay.unit}
            fractionDigits={2}
            rightSide
          >
            <Progressbar
              aria-label="인버터 누적 발전량"
              value={getProgressPercent(
                realtimeData.inverterTotalEnergy,
                INVERTER_TOTAL_ENERGY_MAX_KWH,
              )}
              fillColor="#BC0046"
              trackColor="#ece8eb"
              height={18}
              radius={2}
            />
          </ProgressbarComponent>

          <ProgressbarComponent
            title="예측 발전량"
            count={safeToFixed(realtimeData.predictionPowerW / 1000, 2)}
            unit="kW"
            fractionDigits={2}
            rightSide
          >
            <Progressbar
              aria-label="예측 발전량"
              value={getProgressPercent(realtimeData.predictionPowerW, MODULE_POWER_MAX_W)}
              fillColor="#DB5F00"
              trackColor="#ece8eb"
              height={18}
              radius={2}
            />
          </ProgressbarComponent>
        </div>
      </div>

      <TopInfoBoxComponent title="금일 기상정보" className="w-full z-10">
        <InfoBoxGroup>
          {[
            {
              icon: 'temp' as const,
              title: '온도',
              count: safeToFixed(weatherData?.tmpr, 2),
              unit: '℃',
            },
            {
              icon: 'humidity' as const,
              title: '습도',
              count: safeToFixed(weatherData?.hmdt, 2),
              unit: '%',
            },
            {
              icon: 'wind' as const,
              title: '풍속',
              count: safeToFixed(weatherData?.wndSpd, 2),
              unit: 'm/s',
            },
            {
              icon: 'solar' as const,
              title: '강수확률',
              count: safeToFixed(weatherData?.pr, 2),
              unit: '%',
            },
            {
              icon: 'dust' as const,
              title: 'PM10',
              count: safeToFixed(weatherData?.pm10, 2),
              unit: 'μg/m³',
            },
            {
              icon: 'dust' as const,
              title: 'PM2.5',
              count: safeToFixed(weatherData?.pm25, 2),
              unit: 'μg/m³',
            },
          ].map((item, idx) => (
            <InfoBoxComponent key={`weather-${idx}`} bg="white" {...item} />
          ))}
        </InfoBoxGroup>
      </TopInfoBoxComponent>
    </div>
  );
};
