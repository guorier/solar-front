'use client';

import { useEffect, useRef } from 'react';
import SockJS from 'sockjs-client';
import { Client, type IMessage, type StompSubscription } from '@stomp/stompjs';

type Props = {
  pwplIds: string[];
  onChartMessage?: (json: unknown) => void;
  onListMessage?: (json: unknown) => void;
};

type SocketPayloadItem = Record<string, unknown>;

const DEFAULT_CHART_TOPIC = '/topic/transition-chart';
const DEFAULT_LIST_TOPIC = '/topic/transition-list';
const DEFAULT_CHART_REQUEST_DEST = '/app/request-multi-chart-data';
const DEFAULT_LIST_REQUEST_DEST = '/app/request-multi-transition-list';

const isRecord = (value: unknown): value is SocketPayloadItem => {
  return typeof value === 'object' && value !== null;
};

const resolvePwplId = (item: SocketPayloadItem, fallbackPwplId: string = ''): string => {
  return (
    (typeof item.targetPwplId === 'string' && item.targetPwplId) ||
    (typeof item.pwplId === 'string' && item.pwplId) ||
    fallbackPwplId
  );
};

const withTargetPwplId = (
  value: unknown,
  fallbackPwplId: string = '',
): SocketPayloadItem | null => {
  if (!isRecord(value)) {
    return null;
  }

  const targetPwplId = resolvePwplId(value, fallbackPwplId);

  if (!targetPwplId) {
    return value;
  }

  return {
    ...value,
    targetPwplId,
  };
};

const normalizePayload = (
  payload: unknown,
  nestedKeys: string[],
  fallbackPwplId: string = '',
): SocketPayloadItem[] => {
  const source = Array.isArray(payload) ? payload : [payload];

  return source.flatMap((value) => {
    if (!isRecord(value)) {
      return [];
    }

    const targetPwplId = resolvePwplId(value, fallbackPwplId);
    const nestedItems = nestedKeys
      .map((key) => value[key])
      .find((nestedValue) => Array.isArray(nestedValue));

    if (Array.isArray(nestedItems)) {
      return nestedItems
        .map((item) => withTargetPwplId(item, targetPwplId))
        .filter((item): item is SocketPayloadItem => item !== null);
    }

    const normalizedItem = withTargetPwplId(value, targetPwplId);
    return normalizedItem ? [normalizedItem] : [];
  });
};

export function usePowerTrendSocket({ pwplIds, onChartMessage, onListMessage }: Props) {
  const WS_URL = process.env.NEXT_PUBLIC_WS_SOLAR ?? '/ws';
  const WS_CHART_TOPIC = process.env.NEXT_PUBLIC_WS_SOLAR_CHART_TOPIC ?? DEFAULT_CHART_TOPIC;
  const WS_LIST_TOPIC = process.env.NEXT_PUBLIC_WS_SOLAR_LIST_TOPIC ?? DEFAULT_LIST_TOPIC;
  const WS_CHART_REQUEST_DEST =
    process.env.NEXT_PUBLIC_WS_SOLAR_CHART_REQUEST_DEST ?? DEFAULT_CHART_REQUEST_DEST;
  const WS_LIST_REQUEST_DEST =
    process.env.NEXT_PUBLIC_WS_SOLAR_LIST_REQUEST_DEST ?? DEFAULT_LIST_REQUEST_DEST;

  const clientRef = useRef<Client | null>(null);
  const subscriptionsRef = useRef<StompSubscription[]>([]);
  const onChartMessageRef = useRef(onChartMessage);
  const onListMessageRef = useRef(onListMessage);
  const chartChannelIdRef = useRef(`chart-dash-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`);
  const listChannelIdRef = useRef(`list-dash-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`);
  const pwplIdsKey = pwplIds.join(',');

  onChartMessageRef.current = onChartMessage;
  onListMessageRef.current = onListMessage;

  useEffect(() => {
    if (!WS_URL) {
      console.error('WS_URL is missing.', {
        WS_URL,
      });
      return;
    }

    const currentPwplIds = pwplIdsKey ? pwplIdsKey.split(',') : [];

    if (currentPwplIds.length === 0) {
      return;
    }

    const client = new Client({
      webSocketFactory: () => new SockJS(WS_URL) as unknown as WebSocket,
      reconnectDelay: 3000,
      heartbeatIncoming: 10000,
      heartbeatOutgoing: 10000,
    });

    client.debug = () => {};

    client.onConnect = () => {
      subscriptionsRef.current.forEach((sub) => {
        try {
          sub.unsubscribe();
        } catch (error) {
          console.error('unsubscribe error:', error);
        }
      });
      subscriptionsRef.current = [];

      try {
        const chartInitTopic = `${WS_CHART_TOPIC}/${chartChannelIdRef.current}`;
        const chartInitSub = client.subscribe(chartInitTopic, (message: IMessage) => {
          try {
            const json = JSON.parse(message.body);
            const normalized = normalizePayload(json, ['chartDataList', 'chartData', 'data']);
            onChartMessageRef.current?.(normalized);
          } catch (error) {
            console.error('Failed to parse power trend chart init message:', error);
          }
        });
        subscriptionsRef.current.push(chartInitSub);
      } catch (error) {
        console.error('Failed to subscribe power trend chart init topic:', error, {
          topic: `${WS_CHART_TOPIC}/${chartChannelIdRef.current}`,
        });
      }

      try {
        const listInitTopic = `${WS_LIST_TOPIC}/${listChannelIdRef.current}`;
        const listInitSub = client.subscribe(listInitTopic, (message: IMessage) => {
          try {
            const json = JSON.parse(message.body);
            const normalized = normalizePayload(json, ['listData']);
            onListMessageRef.current?.(normalized);
          } catch (error) {
            console.error('Failed to parse power trend list init message:', error);
          }
        });
        subscriptionsRef.current.push(listInitSub);
      } catch (error) {
        console.error('Failed to subscribe power trend list init topic:', error, {
          topic: `${WS_LIST_TOPIC}/${listChannelIdRef.current}`,
        });
      }

      currentPwplIds.forEach((pwplId) => {
        const chartTopic = `${WS_CHART_TOPIC}/${pwplId}`;
        try {
          const chartSub = client.subscribe(chartTopic, (message: IMessage) => {
            try {
              const json = JSON.parse(message.body);
              const normalized = normalizePayload(json, [], pwplId);
              onChartMessageRef.current?.(normalized);
            } catch (error) {
              console.error('Failed to parse power trend chart message:', error);
            }
          });
          subscriptionsRef.current.push(chartSub);
        } catch (error) {
          console.error('Failed to subscribe power trend chart topic:', error, { topic: chartTopic });
        }

        const listTopic = `${WS_LIST_TOPIC}/${pwplId}`;
        try {
          const listSub = client.subscribe(listTopic, (message: IMessage) => {
            try {
              const json = JSON.parse(message.body);
              const normalized = normalizePayload(json, [], pwplId);
              onListMessageRef.current?.(normalized);
            } catch (error) {
              console.error('Failed to parse power trend list message:', error);
            }
          });
          subscriptionsRef.current.push(listSub);
        } catch (error) {
          console.error('Failed to subscribe power trend list topic:', error, { topic: listTopic });
        }
      });

      try {
        client.publish({
          destination: WS_CHART_REQUEST_DEST,
          body: JSON.stringify({
            targetPwplIds: currentPwplIds,
            channelId: chartChannelIdRef.current,
          }),
        });
      } catch (error) {
        console.error('Failed to publish power trend chart init request:', error, {
          destination: WS_CHART_REQUEST_DEST,
        });
      }

      try {
        client.publish({
          destination: WS_LIST_REQUEST_DEST,
          body: JSON.stringify({
            targetPwplIds: currentPwplIds,
            channelId: listChannelIdRef.current,
          }),
        });
      } catch (error) {
        console.error('Failed to publish power trend list init request:', error, {
          destination: WS_LIST_REQUEST_DEST,
        });
      }
    };

    client.onStompError = (frame) => {
      console.error('STOMP error:', frame);
      console.error('STOMP command:', frame.command);
      console.error('STOMP headers:', frame.headers);
      console.error('STOMP body:', frame.body);
    };

    client.onDisconnect = () => {
      console.warn('PowerTrend socket disconnected.');
    };

    clientRef.current = client;
    client.activate();

    return () => {
      subscriptionsRef.current.forEach((sub) => {
        try {
          sub.unsubscribe();
        } catch (error) {
          console.error('unsubscribe error:', error);
        }
      });
      subscriptionsRef.current = [];

      if (clientRef.current) {
        try {
          clientRef.current.deactivate();
        } catch (error) {
          console.error('client deactivate error:', error);
        }
        clientRef.current = null;
      }
    };
  }, [WS_URL, WS_CHART_TOPIC, WS_LIST_TOPIC, WS_CHART_REQUEST_DEST, WS_LIST_REQUEST_DEST, pwplIdsKey]);
}
