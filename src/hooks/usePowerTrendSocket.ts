'use client';

import { useEffect, useRef } from 'react';
import SockJS from 'sockjs-client';
import { Client, type IMessage, type StompSubscription } from '@stomp/stompjs';

type Props = {
  pwplIds: string[];
  onChartMessage?: (json: unknown) => void;
  onListMessage?: (json: unknown) => void;
};

export function usePowerTrendSocket({ pwplIds, onChartMessage, onListMessage }: Props) {
  const WS_URL = process.env.NEXT_PUBLIC_WS_SOLAR ?? '/ws';
  const WS_CHART_TOPIC = process.env.NEXT_PUBLIC_WS_SOLAR_CHART_TOPIC ?? '/topic/sequel-chart-data';
  const WS_LIST_TOPIC = process.env.NEXT_PUBLIC_WS_SOLAR_LIST_TOPIC ?? '/topic/sequel-list-data';

  const clientRef = useRef<Client | null>(null);
  const subscriptionsRef = useRef<StompSubscription[]>([]);
  const onChartMessageRef = useRef(onChartMessage);
  const onListMessageRef = useRef(onListMessage);

  onChartMessageRef.current = onChartMessage;
  onListMessageRef.current = onListMessage;

  useEffect(() => {
    if (!WS_URL) {
      console.error('WS_URL is missing.', {
        WS_URL,
      });
      return;
    }

    if (pwplIds.length === 0) {
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

      pwplIds.forEach((pwplId) => {
        const chartTopic = `${WS_CHART_TOPIC}/${pwplId}`;
        try {
          const chartSub = client.subscribe(chartTopic, (message: IMessage) => {
            try {
              const json = JSON.parse(message.body);
              onChartMessageRef.current?.(json);
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
              onListMessageRef.current?.(json);
            } catch (error) {
              console.error('Failed to parse power trend list message:', error);
            }
          });
          subscriptionsRef.current.push(listSub);
        } catch (error) {
          console.error('Failed to subscribe power trend list topic:', error, { topic: listTopic });
        }
      });
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
  }, [WS_URL, WS_CHART_TOPIC, WS_LIST_TOPIC, pwplIds]);
}
