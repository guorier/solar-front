'use client';

import { useEffect, useMemo, useRef } from 'react';
import SockJS from 'sockjs-client';
import { Client, type IMessage, type StompSubscription } from '@stomp/stompjs';

type SocketTarget = {
  pwplId: string;
  macAddr?: string;
};

type Props = {
  targets: SocketTarget[];
  onMessage: (json: unknown) => void;
};

const normalizeMac = (value: string | null | undefined) =>
  String(value ?? '')
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '');

export function useRealtimeSocket({ targets, onMessage }: Props) {
  const WS_URL = process.env.NEXT_PUBLIC_WS_SOLAR ?? '/ws';
  const WS_TOPIC = process.env.NEXT_PUBLIC_WS_SOLAR_TOPIC ?? '/topic/realtime-data';

  const clientRef = useRef<Client | null>(null);
  const subscriptionsRef = useRef<StompSubscription[]>([]);
  const noMessageTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const onMessageRef = useRef(onMessage);

  onMessageRef.current = onMessage;

  const normalizedTargets = useMemo(
    () =>
      targets
        .filter((target) => Boolean(target.pwplId))
        .map((target) => ({
          pwplId: target.pwplId,
          macAddr: normalizeMac(target.macAddr),
        })),
    [targets],
  );

  const subscribedTopics = useMemo(
    () => normalizedTargets.map((target) => `${WS_TOPIC}/${target.pwplId}`),
    [WS_TOPIC, normalizedTargets],
  );

  const targetKey = useMemo(
    () => normalizedTargets.map((target) => `${target.pwplId}:${target.macAddr}`).join(','),
    [normalizedTargets],
  );

  useEffect(() => {
    // console.log('[Map Socket] init', {
    //   WS_URL,
    //   WS_TOPIC,
    //   targetCount: normalizedTargets.length,
    //   targets: normalizedTargets,
    //   subscribedTopics,
    // });

    if (!WS_URL) {
      console.error('[Map Socket] missing WS_URL', {
        WS_URL,
        WS_TOPIC,
        normalizedTargets,
      });
      return;
    }

    if (normalizedTargets.length === 0) {
      // console.warn('[Map Socket] no targets', {
      //   WS_TOPIC,
      //   targets,
      // });
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
      // console.log('[Map Socket] connected', {
      //   WS_URL,
      //   WS_TOPIC,
      //   targetCount: normalizedTargets.length,
      // });

      if (noMessageTimeoutRef.current) {
        clearTimeout(noMessageTimeoutRef.current);
      }

      noMessageTimeoutRef.current = setTimeout(() => {
        // console.warn('[Map Socket] no payload after subscribe', {
        //   waitSeconds: 10,
        //   subscribedTopics,
        // });
      }, 10000);

      subscriptionsRef.current.forEach((subscription) => {
        try {
          subscription.unsubscribe();
        } catch (error) {
          console.error('[Map Socket] unsubscribe error', error);
        }
      });
      subscriptionsRef.current = [];

      normalizedTargets.forEach((target) => {
        const topic = `${WS_TOPIC}/${target.pwplId}`;

        // console.log('[Map Socket] subscribe try', {
        //   topic,
        //   pwplId: target.pwplId,
        //   macAddr: target.macAddr,
        // });

        const subscription = client.subscribe(topic, (message: IMessage) => {
          if (noMessageTimeoutRef.current) {
            clearTimeout(noMessageTimeoutRef.current);
            noMessageTimeoutRef.current = null;
          }

          // console.log('[Map Socket] raw payload', {
          //   topic,
          //   body: message.body,
          // });

          try {
            const json = JSON.parse(message.body) as {
              header?: { mac?: string };
            };

            // console.log('[Map Socket] parsed payload', {
            //   topic,
            //   payload: json,
            // });

            const targetMac = normalizeMac(json.header?.mac);

            if (target.macAddr && targetMac && target.macAddr !== targetMac) {
              // console.warn('[Map Socket] mac mismatch', {
              //   topic,
              //   expectedMac: target.macAddr,
              //   receivedMac: targetMac,
              // });
            }

            onMessageRef.current(json);
          } catch (error) {
            console.error('[Map Socket] JSON parse error', error);
          }
        });

        subscriptionsRef.current.push(subscription);

        // console.log('[Map Socket] subscribe done', {
        //   topic,
        //   subscriptionId: subscription.id,
        // });
      });
    };

    client.onStompError = (frame) => {
      console.error('[Map Socket] STOMP error', {
        command: frame.command,
        headers: frame.headers,
        body: frame.body,
        WS_URL,
        WS_TOPIC,
        targetKey,
      });
    };

    client.onWebSocketError = (event) => {
      const target = event.target;

      console.error('[Map Socket] connection error', {
        event,
        type: event.type,
        url:
          target && typeof target === 'object' && 'url' in target && typeof target.url === 'string'
            ? target.url
            : WS_URL,
        readyState:
          target &&
          typeof target === 'object' &&
          'readyState' in target &&
          typeof target.readyState === 'number'
            ? target.readyState
            : null,
        targetKey,
      });
    };

    client.onWebSocketClose = () => {
      // console.warn('[Map Socket] closed', {
      //   code: event.code,
      //   reason: event.reason,
      //   wasClean: event.wasClean,
      //   type: event.type,
      //   WS_URL,
      //   WS_TOPIC,
      //   targetKey,
      // });
    };

    client.onDisconnect = () => {
      // console.log('[Map Socket] disconnected', {
      //   WS_URL,
      //   WS_TOPIC,
      //   targetKey,
      // });
    };

    client.activate();
    clientRef.current = client;

    return () => {
      // console.log('[Map Socket] cleanup', {
      //   targetCount: normalizedTargets.length,
      //   subscribedTopics,
      // });

      if (noMessageTimeoutRef.current) {
        clearTimeout(noMessageTimeoutRef.current);
        noMessageTimeoutRef.current = null;
      }

      subscriptionsRef.current.forEach((subscription) => {
        try {
          subscription.unsubscribe();
        } catch (error) {
          console.error('[Map Socket] unsubscribe error', error);
        }
      });
      subscriptionsRef.current = [];

      if (clientRef.current) {
        clientRef.current.deactivate();
        clientRef.current = null;
      }
    };
  }, [WS_URL, WS_TOPIC, normalizedTargets, subscribedTopics, targetKey, targets]);

  return null;
}
