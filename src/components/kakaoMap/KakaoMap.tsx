// src/components/kakaoMap/KakaoMap.tsx
'use client';

import { useEffect, useRef } from 'react';
import './kakao-marker.scss';

type MapPlant = {
  pwplId: string;
  title: string;
  lat: number;
  lng: number;
  macAddr?: string;
  topLevel?: 'NORMAL' | 'MAJOR' | 'CRITICAL' | string;
  capacity?: number;
  output?: number;
  gridPowerW?: number;
  isOffline?: boolean;
};

type KakaoMapInstance = {
  setCenter: (latlng: unknown) => void;
  setBounds: (bounds: unknown) => void;
};

type KakaoCustomOverlayInstance = {
  setMap: (map: unknown) => void;
};

type KakaoWindow = Window &
  typeof globalThis & {
    kakao?: {
      maps: {
        load: (cb: () => void) => void;
        LatLng: new (lat: number, lng: number) => unknown;
        LatLngBounds: new () => {
          extend: (latlng: unknown) => void;
        };

        Map: new (
          container: HTMLElement,
          options: { center: unknown; level: number },
        ) => KakaoMapInstance;

        Marker: new (options: { position: unknown; title?: string; clickable?: boolean }) => {
          setMap: (map: unknown) => void;
        };

        CustomOverlay: new (options: {
          position: unknown;
          content: HTMLElement;
          yAnchor?: number;
          clickable?: boolean;
        }) => KakaoCustomOverlayInstance;

        event: {
          addListener: (target: unknown, type: string, handler: () => void) => void;
        };
      };
    };
  };

const roundToTwo = (value: number): number => Math.round(value * 100) / 100;

const escapeHtml = (value: string): string =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');

const formatKw = (value?: number): string => {
  if (typeof value !== 'number' || Number.isNaN(value)) {
    return '0';
  }

  return String(roundToTwo(value));
};

interface Props {
  plants: MapPlant[];
  onSelect: (plant: MapPlant) => void;
  selectedPlant?: {
    pwplId: string;
    lat: number;
    lng: number;
  };
}

export default function KakaoMap({ plants, onSelect, selectedPlant }: Props) {
  const mapElement = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<KakaoMapInstance | null>(null);
  const overlayListRef = useRef<KakaoCustomOverlayInstance[]>([]);

  useEffect(() => {
    const { kakao } = window as KakaoWindow;
    if (!mapElement.current || !kakao) return;

    kakao.maps.load(() => {
      if (!mapRef.current) {
        const options = {
          center: plants.length
            ? new kakao.maps.LatLng(plants[0].lat, plants[0].lng)
            : new kakao.maps.LatLng(36.5, 127.8),
          level: 13,
        };

        mapRef.current = new kakao.maps.Map(mapElement.current as HTMLElement, options);
      }

      const map = mapRef.current;
      if (!map) return;

      overlayListRef.current.forEach((overlay) => {
        overlay.setMap(null);
      });
      overlayListRef.current = [];

      const imageSrc = '../icons/icon_factory_w.svg';
      const normal = '../icons/icon_normal.svg';
      const warning = '../icons/icon_warning.svg';
      const error = '../icons/icon_error.svg';
      const offline = '../icons/icon_offline.svg';
      const bounds = new kakao.maps.LatLngBounds();

      plants.forEach((data) => {
        const markerPosition = new kakao.maps.LatLng(data.lat, data.lng);
        const displayCapacity = formatKw(data.capacity);
        const displayOutput = formatKw(data.output ?? data.gridPowerW);
        const displayTitle = escapeHtml(data.title || '-');

        bounds.extend(markerPosition);

        let statusClass = 'normal';
        let statusText = '정상';
        let statusIcon = normal;

        const isOffline =
          data.isOffline === true ||
          data.topLevel === 'OFFLINE' ||
          data.topLevel === 'offline' ||
          data.topLevel === 'DISCONNECT' ||
          data.topLevel === 'disconnect';

        if (isOffline) {
          statusClass = 'offline';
          statusText = '오프라인';
          statusIcon = offline;
        } else if (data.topLevel === 'MAJOR') {
          statusClass = 'checking';
          statusText = '경고';
          statusIcon = warning;
        } else if (data.topLevel === 'CRITICAL') {
          statusClass = 'error';
          statusText = '오류';
          statusIcon = error;
        }

        const markerNode = document.createElement('div');
        markerNode.dataset.mac = data.macAddr ?? '';
        markerNode.className = `marker-wrapper ${statusClass}`;
        markerNode.innerHTML = `
          <div class="marker-ring"></div>
          <div class="marker-img">
            <img src="${imageSrc}" />
          </div>
        `;

        const markerOverlay = new kakao.maps.CustomOverlay({
          position: markerPosition,
          content: markerNode,
          yAnchor: 0.5,
        });

        markerOverlay.setMap(map);
        overlayListRef.current.push(markerOverlay);

        /*** tooltip*/
        const tooltipNode = document.createElement('div');
        tooltipNode.className = 'marker-tooltip';

        tooltipNode.innerHTML = `
              <div class="tooltip-box ${statusClass}">
                <div class="tooltip-title">${displayTitle}</div>
                <div class="flex items-center gap6 pb-8">
                  <div class="tooltip-img"><img src="${statusIcon}" /></div>
                  <div class="tooltip-status">${statusText}</div>
                </div>
                <div class="tooltip-item" style="display:none">MAC <span>${data.macAddr ?? '-'}</span></div>
                <div class="tooltip-item">
                설비용량 <span>${displayCapacity}kW</span>
                </div>
                <div class="tooltip-item">
                현재출력 <span>${displayOutput}kW</span>
                </div>
              </div>
        `;

        const tooltipOverlay = new kakao.maps.CustomOverlay({
          position: markerPosition,
          content: tooltipNode,
          yAnchor: 0,
        });

        overlayListRef.current.push(tooltipOverlay);

        let hoverTimer: number | null = null;

        markerNode.addEventListener('mouseenter', () => {
          if (hoverTimer) {
            clearTimeout(hoverTimer);
            hoverTimer = null;
          }
          // console.log('hover mac:', markerNode.dataset.mac);
          tooltipOverlay.setMap(map);
        });

        markerNode.addEventListener('mouseleave', () => {
          hoverTimer = window.setTimeout(() => {
            tooltipOverlay.setMap(null);
          }, 120);
        });
        //  click
        markerNode.addEventListener('click', () => {
          console.log('지도클릭', data);
          onSelect(data);
        });
      });

      if (!selectedPlant && plants.length > 1) {
        map.setBounds(bounds);
      }
    });
  }, [plants, onSelect, selectedPlant]);

  useEffect(() => {
    const { kakao } = window as KakaoWindow;
    if (!kakao || !mapRef.current || !selectedPlant) return;

    kakao.maps.load(() => {
      const moveCenter = new kakao.maps.LatLng(selectedPlant.lat, selectedPlant.lng);
      mapRef.current?.setCenter(moveCenter);
    });
  }, [selectedPlant]);

  return (
    <div
      ref={mapElement}
      style={{
        width: '100%',
        height: '100%',
        minHeight: '400px',
      }}
    />
  );
}
