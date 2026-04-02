'use client';

import { useEffect, useRef, useState } from 'react';
import SockJS from 'sockjs-client';
import { Client, type IMessage, type StompSubscription } from '@stomp/stompjs';
import type { OperationChartSocketItem } from '@/constants/monitoring/operation/utils/types';

type Props = {
  pwplIds: string[];
};

const toNumber = (value: unknown): number => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const parseItem = (
  row: Record<string, unknown>,
  fallbackPwplId: string,
): OperationChartSocketItem | null => {
  if (!row || typeof row !== 'object') return null;

  const targetPwplId =
    (typeof row.targetPwplId === 'string' && row.targetPwplId) ||
    (typeof row.pwplId === 'string' && row.pwplId) ||
    fallbackPwplId;

  if (!targetPwplId) return null;

  const deviceAddresses = toNumber(row.deviceAddresses ?? row.deviceAddr ?? 1);
  const uuid = (typeof row.uuid === 'string' && row.uuid) || `${targetPwplId}-${deviceAddresses}`;

  return {
    targetPwplId,
    powerW: toNumber(row.powerW),
    todayPower: toNumber(row.todayPower),
    statusConnection:
      typeof row.statusConnection === 'string'
        ? row.statusConnection
        : String(row.statusConnection ?? ''),
    gridPowerFactor: toNumber(row.gridPowerFactor),
    gridFrequencyHz: toNumber(row.gridFrequencyHz),
    inverterTotalEnergy: toNumber(row.inverterTotalEnergy),
    uuid,
    deviceAddresses,
    predictionPowerW: toNumber(row.predictionPowerW),
    irradianceWm2: toNumber(row.irradianceWm2),
    temperatureC: toNumber(row.temperatureC),
    formattedAvgVoltage: toNumber(row.formattedAvgVoltage),
  };
};

// 초기 데이터: { targetPwplId, operateData: [...] } 형태
type InitialPlantNode = {
  targetPwplId: string;
  operateData: Record<string, unknown>[];
};

export function useOperationChartSocket({ pwplIds }: Props) {
  const WS_URL = process.env.NEXT_PUBLIC_WS_SOLAR ?? '/ws';
  const WS_OPERATION_CHART_TOPIC =
    process.env.NEXT_PUBLIC_WS_SOLAR_OPERATION_CHART_TOPIC ?? '/topic/operate-chart';

  const clientRef = useRef<Client | null>(null);
  const subscriptionsRef = useRef<StompSubscription[]>([]);
  const inverterMapRef = useRef<Record<string, Record<string, OperationChartSocketItem>>>({});
  const [operationChartDataMap, setOperationChartDataMap] = useState<
    Record<string, OperationChartSocketItem[]>
  >({});

  const pwplIdsKey = pwplIds.join(',');

  useEffect(() => {
    const currentPwplIds = pwplIdsKey ? pwplIdsKey.split(',') : [];

    if (!WS_URL) {
      console.error('[운영차트 소켓] WS_URL 누락');
      return;
    }

    if (currentPwplIds.length === 0) {
      console.warn('[운영차트 소켓] 구독할 발전소 ID 없음');
      return;
    }

    inverterMapRef.current = {};

    const channelId = `operate-dash-${Date.now()}`;

    const flushState = () => {
      const next: Record<string, OperationChartSocketItem[]> = {};
      Object.entries(inverterMapRef.current).forEach(([pwplId, deviceMap]) => {
        next[pwplId] = Object.values(deviceMap).sort(
          (a, b) => a.deviceAddresses - b.deviceAddresses,
        );
      });
      setOperationChartDataMap(next);
    };

    const applyList = (list: Record<string, unknown>[], fallbackPwplId: string) => {
      list.forEach((row) => {
        const item = parseItem(row, fallbackPwplId);
        if (!item) return;

        if (!inverterMapRef.current[item.targetPwplId]) {
          inverterMapRef.current[item.targetPwplId] = {};
        }
        inverterMapRef.current[item.targetPwplId][String(item.deviceAddresses)] = item;
      });
    };

    const client = new Client({
      webSocketFactory: () => new SockJS(WS_URL) as unknown as WebSocket,
      reconnectDelay: 3000,
      heartbeatIncoming: 10000,
      heartbeatOutgoing: 10000,
    });

    client.debug = () => {};

    client.onConnect = () => {
      console.log(`[운영차트 소켓] 연결됨 (발전소: ${pwplIdsKey})`);

      subscriptionsRef.current.forEach((s) => {
        try {
          s.unsubscribe();
        } catch (e) {
          void e;
        }
      });
      subscriptionsRef.current = [];

      // ── 구독 1: 초기 10분치 데이터 ──────────────────────────────────
      const initialTopic = `/topic/operate-monitor-initial/${channelId}`;
      try {
        const initialSub = client.subscribe(initialTopic, (message: IMessage) => {
          try {
            const json = JSON.parse(message.body) as InitialPlantNode[];
            json.forEach((plantNode) => {
              applyList(plantNode.operateData ?? [], plantNode.targetPwplId);
            });
            flushState();
          } catch (e) {
            console.error('[운영차트 소켓] 초기 데이터 파싱 오류', e);
          }
        });
        subscriptionsRef.current.push(initialSub);
      } catch (e) {
        console.error(`[운영차트 소켓] 초기 구독 실패 — ${initialTopic}`, e);
      }

      // ── 구독 2: 실시간 갱신 ─────────────────────────────────────────
      currentPwplIds.forEach((pwplId) => {
        const topic = `${WS_OPERATION_CHART_TOPIC}/${pwplId}`;
        try {
          const subscription = client.subscribe(topic, (message: IMessage) => {
            try {
              const json = JSON.parse(message.body);
              const list: Record<string, unknown>[] = Array.isArray(json) ? json : [json];
              applyList(list, pwplId);
              flushState();
            } catch (e) {
              console.error('[운영차트 소켓] 파싱 오류', e);
            }
          });
          subscriptionsRef.current.push(subscription);
        } catch (e) {
          console.error(`[운영차트 소켓] 구독 실패 — ${topic}`, e);
        }
      });

      // ── 요청: 초기 데이터 달라고 서버에 발송 ───────────────────────
      try {
        client.publish({
          destination: '/app/request-operate-monitor',
          body: JSON.stringify({ targetPwplIds: currentPwplIds, channelId }),
        });
      } catch (e) {
        console.error('[운영차트 소켓] 초기 데이터 요청 실패', e);
      }
    };

    client.onStompError = (frame) => {
      console.error('[운영차트 소켓] STOMP 오류', {
        command: frame.command,
        headers: frame.headers,
        body: frame.body,
      });
    };

    client.onDisconnect = () => {
      console.warn(`[운영차트 소켓] 연결 끊김 (발전소: ${pwplIdsKey})`);
    };

    client.activate();
    clientRef.current = client;

    return () => {
      console.log(`[운영차트 소켓] 연결 종료 (발전소: ${pwplIdsKey})`);

      subscriptionsRef.current.forEach((s) => {
        try {
          s.unsubscribe();
        } catch (e) {
          void e;
        }
      });
      subscriptionsRef.current = [];

      if (clientRef.current) {
        clientRef.current.deactivate();
        clientRef.current = null;
      }
    };
  }, [WS_URL, WS_OPERATION_CHART_TOPIC, pwplIdsKey]);

  return operationChartDataMap;
}
