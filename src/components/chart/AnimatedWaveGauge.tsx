'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import './animated-wave-gauge.scss';

type GaugeStatusDirection = 'up' | 'down' | 'neutral';

type AnimatedWaveGaugeProps = {
  value: number;
  max?: number;
  size?: number;
  strokeWidth?: number;
  title?: string;
  unit?: string;
  duration?: number;
  statusText?: string;
  statusDirection?: GaugeStatusDirection;
  statusLabel?: string;
  children?: React.ReactNode;
};

export default function AnimatedWaveGauge({
  value,
  max = 100000,
  size = 400,
  strokeWidth = 10,
  title = '3상 출력 전류',
  unit = 'W',
  duration = 1400,
  // statusText = '이전대비',
  // statusDirection = 'up',
  children,
}: AnimatedWaveGaugeProps) {
  const [animatedValue, setAnimatedValue] = useState<number>(0);
  const rafRef = useRef<number | null>(null);

  const safeValue = Number.isFinite(value) ? Math.max(0, value) : 0;
  const safeMax = Number.isFinite(max) && max > 0 ? max : 1;

  const progress = Math.min(safeValue / safeMax, 1);
  const animatedProgress = Math.min(animatedValue / safeMax, 1);

  const ringGap = 24;
  const ringSize = size - ringGap * 2;
  const radius = useMemo(() => ringSize / 2 - strokeWidth / 2, [ringSize, strokeWidth]);

  const circumference = useMemo(() => 2 * Math.PI * radius, [radius]);

  const dashOffset = useMemo(
    () => circumference * (1 - animatedProgress),
    [circumference, animatedProgress],
  );

  const dotAngle = useMemo(() => -90 + 360 * animatedProgress, [animatedProgress]);
  const dotRad = useMemo(() => (dotAngle * Math.PI) / 180, [dotAngle]);
  const ringCenter = ringSize / 2;
  const dotCx = useMemo(() => ringCenter + radius * Math.cos(dotRad), [ringCenter, radius, dotRad]);
  const dotCy = useMemo(() => ringCenter + radius * Math.sin(dotRad), [ringCenter, radius, dotRad]);
  const glowSize = useMemo(() => Math.min(size, 600), [size]);

  const displayValueInfo = useMemo(() => {
    if (unit === 'W' && animatedValue >= 1000) {
      return {
        value: (animatedValue / 1000).toFixed(2),
        unit: 'kW',
      };
    }

    return {
      value: animatedValue.toFixed(2),
      unit,
    };
  }, [animatedValue, unit]);

  // const statusArrow = useMemo(() => {
  //   if (statusDirection === 'up') {
  //     return '↑';
  //   }

  //   if (statusDirection === 'down') {
  //     return '↓';
  //   }

  //   return '-';
  // }, [statusDirection]);

  useEffect(() => {
    const start = performance.now();
    const from = 0;
    const to = safeValue;

    const easeOutCubic = (t: number): number => {
      return 1 - Math.pow(1 - t, 3);
    };

    const animate = (time: number): void => {
      const elapsed = time - start;
      const ratio = Math.min(elapsed / duration, 1);
      const eased = easeOutCubic(ratio);
      const nextValue = from + (to - from) * eased;

      setAnimatedValue(nextValue);

      if (ratio < 1) {
        rafRef.current = window.requestAnimationFrame(animate);
      }
    };

    if (rafRef.current !== null) {
      window.cancelAnimationFrame(rafRef.current);
    }

    setAnimatedValue(0);
    rafRef.current = window.requestAnimationFrame(animate);

    return () => {
      if (rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current);
      }
    };
  }, [safeValue, duration]);

  return (
    <>
      <div
        className="animated-wave-gauge-frame"
        style={
          {
            width: `${size}px`,
            height: `${size}px`,
            ['--gauge-size' as string]: `${size}px`,
            ['--gauge-ring-size' as string]: `${ringSize}px`,
            ['--gauge-ring-gap' as string]: `${ringGap}px`,
            ['--gauge-stroke-width' as string]: `${strokeWidth}px`,
            ['--gauge-glow-size' as string]: `${glowSize}px`,
            ['--gauge-glow-half-size' as string]: `${glowSize / 2}px`,
          } as React.CSSProperties
        }
      >
        <div className="animated-wave-gauge__bg">
          <div className="animated-wave-gauge__glow animated-wave-gauge__glow--1" />
          <div className="animated-wave-gauge__glow animated-wave-gauge__glow--2" />
          <div className="animated-wave-gauge__glow animated-wave-gauge__glow--3" />
          <div className="animated-wave-gauge__glow animated-wave-gauge__glow--4" />
        </div>

        <div className="animated-wave-gauge">
          <div className="animated-wave-gauge__ring-wrap">
            <svg
              className="animated-wave-gauge__svg"
              width={ringSize}
              height={ringSize}
              viewBox={`0 0 ${ringSize} ${ringSize}`}
            >
              <defs>
                <linearGradient
                  id="animated-wave-gauge-progress"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor="#de3f73" />
                  <stop offset="100%" stopColor="#f2c7ad" />
                </linearGradient>
              </defs>

              <circle
                className="animated-wave-gauge__track"
                cx={ringCenter}
                cy={ringCenter}
                r={radius}
                fill="none"
                strokeLinecap="round"
                strokeWidth={strokeWidth}
              />

              <circle
                className="animated-wave-gauge__progress"
                cx={ringCenter}
                cy={ringCenter}
                r={radius}
                fill="none"
                stroke="url(#animated-wave-gauge-progress)"
                strokeLinecap="round"
                strokeWidth={strokeWidth}
                strokeDasharray={circumference}
                strokeDashoffset={dashOffset}
                transform={`rotate(-90 ${ringCenter} ${ringCenter})`}
              />

              <circle
                className="animated-wave-gauge__dot"
                cx={dotCx}
                cy={dotCy}
                r={strokeWidth * 0.62}
              />
            </svg>
          </div>

          <div className="animated-wave-gauge__content-wrap">
            {children ?? (
              <div className="animated-wave-gauge__content">
                <div className="animated-wave-gauge__icon">⚡</div>
                <div className="animated-wave-gauge__title">{title}</div>

                <div className="animated-wave-gauge__value-row">
                  <strong className="animated-wave-gauge__value">{displayValueInfo.value}</strong>
                  <span className="animated-wave-gauge__unit">{displayValueInfo.unit}</span>
                </div>
                {/* <div className={`animated-wave-gauge__status animated-wave-gauge__status--${statusDirection}`}>
                  <span className="animated-wave-gauge__status-text">{statusText}</span>
                  <span className="animated-wave-gauge__status-arrow">{statusArrow}</span>
                </div> */}
              </div>
            )}
          </div>

          <span className="animated-wave-gauge__sr-only">
            {title} {progress}
          </span>
        </div>
      </div>
    </>
  );
}
