'use client';

import { useEffect, useRef } from 'react';
import SockJS from 'sockjs-client';
import { Client, type IMessage, type StompSubscription } from '@stomp/stompjs';

type Props = {
  pwplIds: string[];
  onMessage: (pwplId: string, json: unknown) => void;
};

export function useDashboardChartSocket({ pwplIds, onMessage }: Props) {
  const WS_URL = process.env.NEXT_PUBLIC_WS_SOLAR ?? '/ws';
  const WS_CHART_TOPIC =
    process.env.NEXT_PUBLIC_WS_SOLAR_DASHBOARD_CHART_TOPIC ?? '/topic/chart-data';

  const clientRef = useRef<Client | null>(null);
  const subscriptionsRef = useRef<StompSubscription[]>([]);
  const onMessageRef = useRef(onMessage);

  onMessageRef.current = onMessage;

  useEffect(() => {
    if (!WS_URL || pwplIds.length === 0) {
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
      subscriptionsRef.current.forEach((subscription) => {
        try {
          subscription.unsubscribe();
        } catch (error) {
          console.error('[Dashboard Chart Socket] unsubscribe error', error);
        }
      });
      subscriptionsRef.current = [];

      pwplIds.forEach((pwplId) => {
        const topic = `${WS_CHART_TOPIC}/${pwplId}`;

        try {
          const subscription = client.subscribe(topic, (message: IMessage) => {
            console.log('[Dashboard Chart Socket] raw payload', {
              topic,
              pwplId,
              body: message.body,
            });

            try {
              const json = JSON.parse(message.body);

              console.log('[Dashboard Chart Socket] parsed payload', {
                topic,
                pwplId,
                payload: json,
              });

              onMessageRef.current(pwplId, json);
            } catch (error) {
              console.error('[Dashboard Chart Socket] JSON parse error', error);
            }
          });

          subscriptionsRef.current.push(subscription);
        } catch (error) {
          console.error('[Dashboard Chart Socket] subscribe error', error, { topic, pwplId });
        }
      });
    };

    client.onStompError = (frame) => {
      console.error('[Dashboard Chart Socket] STOMP error', {
        command: frame.command,
        headers: frame.headers,
        body: frame.body,
      });
    };

    client.activate();
    clientRef.current = client;

    return () => {
      subscriptionsRef.current.forEach((subscription) => {
        try {
          subscription.unsubscribe();
        } catch (error) {
          console.error('[Dashboard Chart Socket] unsubscribe error', error);
        }
      });
      subscriptionsRef.current = [];

      if (clientRef.current) {
        clientRef.current.deactivate();
        clientRef.current = null;
      }
    };
  }, [WS_URL, WS_CHART_TOPIC, pwplIds]);
}
