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
    console.log('🧪 usePowerTrendSocket 실행', {
      pwplIds,
      WS_URL,
      WS_CHART_TOPIC,
      WS_LIST_TOPIC,
    });

    if (!WS_URL || pwplIds.length === 0) {
      console.error('❌ WS_URL 또는 pwplIds 없음', {
        WS_URL,
        pwplIds,
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
      console.log('⚠️ STOMP (PowerTrend):', str);
    };

    client.onConnect = () => {
      console.log('🟢 웹소켓 접속 완료 (PowerTrend)', {
        pwplIds,
      });

      // 기존 구독 제거
      subscriptionsRef.current.forEach((sub) => {
        try {
          sub.unsubscribe();
        } catch (e) {
          console.error('❌ unsubscribe error:', e);
        }
      });
      subscriptionsRef.current = [];

      // 새로운 토픽 구독
      pwplIds.forEach((pwplId) => {
        // 추이 차트 데이터 구독
        const chartTopic = `${WS_CHART_TOPIC}/${pwplId}`;
        try {
          console.log(`📌 차트 토픽 구독 시작: "${chartTopic}"`);
          const chartSub = client.subscribe(chartTopic, (message: IMessage) => {
            console.log('🔥 추이 차트 데이터 도착:', chartTopic);
            console.log('📦 메시지 본문:', message.body);
            try {
              const json = JSON.parse(message.body);
              console.log('✅ 파싱된 차트 데이터:', json);
              onChartMessageRef.current?.(json);
            } catch (e) {
              console.error('❌ 추이 차트 데이터 파싱 에러:', e);
            }
          });
          subscriptionsRef.current.push(chartSub);
          console.log(`✅ 차트 토픽 구독 성공: "${chartTopic}"`);
        } catch (e) {
          console.error('❌ 추이 차트 데이터 구독 에러:', e, { topic: chartTopic });
        }

        // 추이 목록 데이터 구독
        const listTopic = `${WS_LIST_TOPIC}/${pwplId}`;
        try {
          console.log(`📌 목록 토픽 구독 시작: "${listTopic}"`);
          const listSub = client.subscribe(listTopic, (message: IMessage) => {
            console.log('🔥 추이 목록 데이터 도착:', listTopic);
            console.log('📦 메시지 본문:', message.body);
            try {
              const json = JSON.parse(message.body);
              console.log('✅ 파싱된 목록 데이터:', json);
              onListMessageRef.current?.(json);
            } catch (e) {
              console.error('❌ 추이 목록 데이터 파싱 에러:', e);
            }
          });
          subscriptionsRef.current.push(listSub);
          console.log(`✅ 목록 토픽 구독 성공: "${listTopic}"`);
        } catch (e) {
          console.error('❌ 추이 목록 데이터 구독 에러:', e, { topic: listTopic });
        }
      });
    };

    client.onStompError = (frame) => {
      console.error('❌ STOMP 에러:', frame);
      console.error('❌ 에러 명령:', frame.command);
      console.error('❌ 에러 헤더:', frame.headers);
      console.error('❌ 에러 본문:', frame.body);
    };

    client.onDisconnect = () => {
      console.warn('🔌 웹소켓 연결 끊김 (PowerTrend)');
    };

    clientRef.current = client;
    client.activate();

    return () => {
      subscriptionsRef.current.forEach((sub) => {
        try {
          sub.unsubscribe();
        } catch (e) {
          console.error('❌ unsubscribe error:', e);
        }
      });
      subscriptionsRef.current = [];

      if (clientRef.current) {
        try {
          clientRef.current.deactivate();
        } catch (e) {
          console.error('❌ client deactivate error:', e);
        }
        clientRef.current = null;
      }
    };
  }, [WS_URL, WS_CHART_TOPIC, WS_LIST_TOPIC, pwplIds]);
}
