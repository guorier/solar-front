import { FaultSocket } from '@/services/monitoring/fault/type';
import { Client, IMessage, StompSubscription } from '@stomp/stompjs';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import SockJS from 'sockjs-client';

export function useFaultSocket({ pwplIds }: { pwplIds?: string[] } = {}) {
  const WS_URL = process.env.NEXT_PUBLIC_WS_SOLAR ?? '/ws';
  const WS_FAULT_TOPIC =
    process.env.NEXT_PUBLIC_WS_SOLAR_DISASTER_ALARM_TOPIC ?? '/topic/disaster_alarm';

  const clientRef = useRef<Client | null>(null);
  const subscriptionsRef = useRef<StompSubscription[]>([]);
  const didMountRef = useRef<boolean>(false);

  const [faultList, setFaultList] = useState<FaultSocket[]>([]);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  // pwplIds 순서가 바뀌어도 같은 값이면 동일하게 취급하기 위해 정렬
  const normalizedPwplIds = useMemo(() => {
    return pwplIds ? [...pwplIds].sort() : [];
  }, [pwplIds]);

  const pwplIdsKey = useMemo(() => normalizedPwplIds.join(','), [normalizedPwplIds]);

  // 기존 구독을 전부 해제하는 함수
  const clearSubscriptions = useCallback(() => {
    subscriptionsRef.current.forEach((sub) => sub.unsubscribe());
    subscriptionsRef.current = [];
  }, []);

  // 웹소켓 메시지 수신 시 실행되는 핸들러
  const handleMessage = useCallback((message: IMessage) => {
    try {
      const parsed = JSON.parse(message.body);

      setFaultList((prev) => [...prev, parsed].slice(-100));
    } catch (error) {
      console.error('❌ 파싱 실패', message.body, error);
    }
  }, []);

  // 웹소켓/STOMP 연결 시작 함수
  const connect = useCallback(() => {
    // 사용자가 중지한 상태면 연결하지 않음
    if (isPaused) return;

    // 이미 활성화된 client가 있으면 중복 연결 방지
    const prevClient = clientRef.current;
    if (prevClient?.active) return;

    // 기존 subscription 정리
    clearSubscriptions();

    // 새로운 STOMP Client 생성
    const client = new Client({
      // SockJS 기반 웹소켓 연결
      webSocketFactory: () => new SockJS(WS_URL) as unknown as WebSocket,

      reconnectDelay: 3000, // 연결이 끊겼을 때 3초 후 자동 재연결 시도
      heartbeatIncoming: 10000, // 서버에서 heartbeat 받는 주기
      heartbeatOutgoing: 10000, // 서버로 heartbeat 보내는 주기
    });

    // 개발 로그 비활성화
    client.debug = () => {};

    // 실제 토픽 구독 처리
    const subscribeTopics = () => {
      // 혹시 남아있을 수 있는 구독을 정리 후 다시 구독
      clearSubscriptions();

      // 특정 발전소가 선택된 경우 개별 토픽 구독
      if (normalizedPwplIds.length > 0) {
        normalizedPwplIds.forEach((pwplId) => {
          const sub = client.subscribe(`${WS_FAULT_TOPIC}/${pwplId}`, handleMessage);
          subscriptionsRef.current.push(sub);
        });
        console.log(`📡 구독 시작`, normalizedPwplIds);
        return;
      }

      // 발전소 선택이 없으면 전체 장애 토픽 구독
      const sub = client.subscribe(WS_FAULT_TOPIC, handleMessage);
      subscriptionsRef.current.push(sub);
      console.log('📡 전체 장애 알림 구독 시작');
    };

    // STOMP 연결 성공 시
    client.onConnect = () => {
      setIsConnected(true);
      console.log('✅ 소켓 연결 완료');
      subscribeTopics();
    };

    // STOMP disconnect 처리 시
    client.onDisconnect = () => {
      setIsConnected(false);
      console.log('🔌 소켓 연결 해제');
    };

    // STOMP 레벨 에러
    client.onStompError = (frame) => {
      console.error('❌ STOMP 오류', frame);
    };

    // 웹소켓 자체가 닫혔을 때
    client.onWebSocketClose = () => {
      setIsConnected(false);
      console.log('🔌 연결 종료');
    };

    // 웹소켓 에러 발생 시
    client.onWebSocketError = (event) => {
      console.error('❌ 웹소켓 오류', event);
    };

    // 연결 시작
    client.activate();

    // 현재 client 저장
    clientRef.current = client;
  }, [WS_URL, WS_FAULT_TOPIC, normalizedPwplIds, handleMessage, clearSubscriptions, isPaused]);

  // 웹소켓/STOMP 연결 종료 함수
  const disconnect = useCallback(async () => {
    // 먼저 구독 모두 정리
    clearSubscriptions();

    // 현재 client 꺼내고 ref 비우기
    const client = clientRef.current;
    clientRef.current = null;

    // client가 있으면 deactivate로 연결 종료
    if (client) {
      await client.deactivate();
    }

    setIsConnected(false);
  }, [clearSubscriptions]);

  // 사용자가 중지를 눌렀을 때 호출
  const pause = useCallback(async () => {
    setIsPaused(true);
    await disconnect();
  }, [disconnect]);

  // 사용자가 재개를 눌렀을 때 호출
  const resume = useCallback(() => {
    // 실제 connect는 아래 useEffect에서 isPaused 변경을 감지해 수행
    setIsPaused(false);
  }, []);

  useEffect(() => {
    // 중지 상태가 아니면 연결 시도
    if (!isPaused) {
      connect();
    }

    // 언마운트 또는 dependency 변경 시 정리
    return () => {
      clearSubscriptions();

      const client = clientRef.current;
      clientRef.current = null;

      if (client) {
        client.deactivate();
      }

      setIsConnected(false);
    };
  }, [connect, clearSubscriptions, isPaused]);

  // 발전소 선택값이 실제로 바뀌었을 때만 기존 연결을 끊고 다시 연결
  useEffect(() => {
    // 첫 렌더에서는 실행하지 않음
    if (!didMountRef.current) {
      didMountRef.current = true;
      return;
    }

    // 사용자가 중지한 상태면 재연결하지 않음
    if (isPaused) return;

    // 발전소 선택이 바뀌면 기존 연결/구독을 정리 후 다시 연결
    disconnect().then(() => {
      connect();
    });
  }, [pwplIdsKey, isPaused, connect, disconnect]);

  return {
    faultList,
    isConnected,
    isPaused,
    pause,
    resume,
    clearFaultList: () => setFaultList([]),
  };
}
