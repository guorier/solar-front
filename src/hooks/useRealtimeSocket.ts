'use client';

import { useEffect, useMemo, useRef } from 'react';
import SockJS from 'sockjs-client';
import { Client, type IMessage, type StompSubscription } from '@stomp/stompjs';

type Props = {
  mac: string | string[] | undefined;
  onMessage: (json: unknown) => void;
};

const isPlantIdLike = (value: string) => /^P/i.test(value);

const normalizeMac = (value: string | null | undefined) =>
  String(value ?? '')
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '');

export function useRealtimeSocket({ mac, onMessage }: Props) {
  const WS_URL = process.env.NEXT_PUBLIC_WS_SOLAR ?? '/ws';
  const WS_TOPIC = process.env.NEXT_PUBLIC_WS_SOLAR_TOPIC ?? '/topic/realtime-data';

  const clientRef = useRef<Client | null>(null);
  const subscriptionRef = useRef<StompSubscription | null>(null);
  const onMessageRef = useRef(onMessage);

  onMessageRef.current = onMessage;

  const normalizedMacList = useMemo(() => {
    if (!mac) return [];

    if (Array.isArray(mac)) {
      return mac
        .filter((item) => !isPlantIdLike(item))
        .map((item) => normalizeMac(item))
        .filter(Boolean);
    }

    if (isPlantIdLike(mac)) return [];

    const normalized = normalizeMac(mac);

    return normalized ? [normalized] : [];
  }, [mac]);

  const macKey = useMemo(() => normalizedMacList.join(','), [normalizedMacList]);

  useEffect(() => {
    console.log('🧪 useRealtimeSocket 실행', {
      mac,
      normalizedMacList,
      macKey,
      WS_URL,
      WS_TOPIC,
    });

    if (!WS_URL) {
      console.error('❌ WS_URL 없음', {
        WS_URL,
        WS_TOPIC,
        normalizedMacList,
      });
      return;
    }

    const client = new Client({
      webSocketFactory: () => new SockJS(WS_URL) as unknown as WebSocket,
      reconnectDelay: 3000,
      heartbeatIncoming: 10000,
      heartbeatOutgoing: 10000,
    });

    client.debug = (str) => {
      console.log('⚠️ STOMP:', str);
    };

    client.onConnect = () => {
      console.log('🟢 웹소켓 접속 완료', {
        WS_URL,
        WS_TOPIC,
        macKey,
      });

      console.log('📡 subscribe 시작', {
        WS_TOPIC,
        macKey,
      });

      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe();
        subscriptionRef.current = null;
      }

      const subscription = client.subscribe(WS_TOPIC, (message: IMessage) => {
        console.log('🔥 웹소켓 값 도착:', message.body);

        try {
          const json = JSON.parse(message.body) as {
            header?: { mac?: string };
          };

          const targetMac = normalizeMac(json.header?.mac);

          console.log('🧾 웹소켓 MAC 비교', {
            rawTargetMac: json.header?.mac,
            normalizedTargetMac: targetMac,
            normalizedMacList,
            hasMatch:
              normalizedMacList.length === 0 ? true : normalizedMacList.includes(targetMac),
          });

          if (normalizedMacList.length > 0) {
            if (!targetMac || !normalizedMacList.includes(targetMac)) return;
          }

          console.log('✅ onMessage 호출');
          onMessageRef.current(json);
        } catch (e) {
          console.error('❌ JSON 파싱 오류', e);
        }
      });

      subscriptionRef.current = subscription;

      console.log('✅ subscribe 완료', {
        WS_TOPIC,
        subscriptionId: subscription.id,
      });
    };

    client.onStompError = (frame) => {
      console.error('❌ 웹소켓 STOMP 오류', {
        command: frame.command,
        headers: frame.headers,
        body: frame.body,
        WS_URL,
        WS_TOPIC,
        macKey,
      });
    };

    client.onWebSocketError = (event) => {
      const target = event.target;

      console.error('❌ 웹소켓 연결 오류', {
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
        macKey,
      });
    };

    client.onWebSocketClose = (event) => {
      console.warn('❌ 웹소켓 종료', {
        code: event.code,
        reason: event.reason,
        wasClean: event.wasClean,
        type: event.type,
        WS_URL,
        WS_TOPIC,
        macKey,
      });
    };

    client.onDisconnect = () => {
      console.log('🔴 웹소켓 연결 종료', {
        WS_URL,
        WS_TOPIC,
        macKey,
      });
    };

    client.activate();
    clientRef.current = client;

    return () => {
      console.log('🧹 웹소켓 cleanup', {
        macKey,
      });

      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe();
        subscriptionRef.current = null;
      }

      if (clientRef.current) {
        clientRef.current.deactivate();
        clientRef.current = null;
      }
    };
  }, [WS_URL, WS_TOPIC, macKey, normalizedMacList, mac]);

  return null;
}