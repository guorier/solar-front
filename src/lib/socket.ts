// src/lib/socket.ts
'use client';

import { Client, type Frame, type IMessage, type StompSubscription } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

export type WsUnknownMessage = Record<string, unknown>;
export type WsMessageHandler<T> = (msg: T) => void;

type TokenGetter = () => string | null;

class ManagedSubscription implements StompSubscription {
  public id: string;
  private inner?: StompSubscription;
  private active = true;

  constructor(
    private readonly manager: StompConnectionManager,
    private readonly topic: string,
    private readonly onMessage: (msg: IMessage) => void,
  ) {
    this.id = `${topic}-${Math.random().toString(36).slice(2, 10)}`;
  }

  equals(other: ManagedSubscription) {
    return this.id === other.id;
  }

  attach() {
    if (!this.active) return;
    const client = this.manager.getClient();
    if (client && client.connected) {
      try {
        this.inner = client.subscribe(this.topic, (message: IMessage) => {
          try {
            this.onMessage(message);
          } catch (e) {
            if (process.env.NODE_ENV !== 'production') {
              console.error('❌ ManagedSubscription onMessage error:', e);
            }
          }
        });
      } catch (e) {
        if (process.env.NODE_ENV !== 'production') {
          console.error('❌ STOMP subscribe error:', e);
        }
      }
    }
  }

  unsubscribe(): void {
    if (!this.active) return;
    this.active = false;
    try {
      this.inner?.unsubscribe();
    } catch (e) {
      if (process.env.NODE_ENV !== 'production') {
        console.error('❌ unsubscribe error:', e);
      }
    }
    this.manager.unregisterSubscription(this);
  }

  isActive() {
    return this.active;
  }

  getTopic() {
    return this.topic;
  }
}

class StompConnectionManager {
  private static instance: StompConnectionManager;

  private client: Client | null = null;
  private referenceCount = 0;
  private connectCallbacks: Array<() => void> = [];
  private isConnecting = false;
  private subscriptions = new Set<ManagedSubscription>();
  private retryAttempt = 0;

  private tokenGetter: TokenGetter = () => null;

  private constructor() {}

  public static getInstance(): StompConnectionManager {
    if (!StompConnectionManager.instance) {
      StompConnectionManager.instance = new StompConnectionManager();
    }
    return StompConnectionManager.instance;
  }

  public setTokenGetter(getter: TokenGetter) {
    this.tokenGetter = getter;
  }

  public connect(onConnect?: () => void): void {
    this.referenceCount++;

    if (onConnect) this.connectCallbacks.push(onConnect);

    if (this.client?.connected) {
      this.executeCallbacks();
      return;
    }

    if (this.isConnecting) return;

    if (!this.client) this.createClient();
  }

  public disconnect(): void {
    this.referenceCount = Math.max(0, this.referenceCount - 1);
    if (this.referenceCount === 0) this.forceDisconnect();
  }

  public forceDisconnect(): void {
    if (this.client) {
      this.client.deactivate();
      this.client = null;
    }
    this.referenceCount = 0;
    this.connectCallbacks = [];
    this.isConnecting = false;
  }

  public getClient(): Client | null {
    return this.client;
  }

  public isConnected(): boolean {
    return this.client?.connected ?? false;
  }

  public getReferenceCount(): number {
    return this.referenceCount;
  }

  public registerSubscription(
    topic: string,
    onMessage: (msg: IMessage) => void,
  ): ManagedSubscription {
    const sub = new ManagedSubscription(this, topic, onMessage);
    this.subscriptions.add(sub);
    sub.attach();
    return sub;
  }

  public unregisterSubscription(sub: ManagedSubscription) {
    this.subscriptions.delete(sub);
  }

  private resubscribeAll() {
    for (const sub of this.subscriptions) {
      if (sub.isActive()) sub.attach();
    }
  }

  private computeReconnectDelay(): number {
    const base = 1000;
    const max = 30000;
    const exp = Math.min(10, this.retryAttempt);
    const delay = Math.min(max, base * Math.pow(2, exp));
    const jitter = 0.1 * delay;
    return Math.max(500, Math.floor(delay + (Math.random() * 2 - 1) * jitter));
  }

  private createClient(): void {
    this.isConnecting = true;

    this.client = new Client({
      webSocketFactory: () => {
        const base = process.env.NEXT_PUBLIC_WS_URL;
        if (!base) {
          if (process.env.NODE_ENV !== 'production') {
            console.error('❌ NEXT_PUBLIC_WS_URL 없음');
          }
          throw new Error('NEXT_PUBLIC_WS_URL is not set');
        }

        let url = base;
        try {
          const token = this.tokenGetter();
          if (token) {
            const sep = base.includes('?') ? '&' : '?';
            url = `${base}${sep}access_token=${encodeURIComponent(token)}`;
          }
        } catch (e) {
          if (process.env.NODE_ENV !== 'production') {
            console.warn('⚠️ token getter failed', e);
          }
        }
        return new SockJS(url);
      },
      connectHeaders: {},
      beforeConnect: () => {
        try {
          const t = this.tokenGetter();
          this.client!.connectHeaders = t ? { Authorization: `Bearer ${t}` } : {};
        } catch (e) {
          this.client!.connectHeaders = {};
          if (process.env.NODE_ENV !== 'production') {
            console.warn('⚠️ beforeConnect token getter failed', e);
          }
        }
      },
      reconnectDelay: this.computeReconnectDelay(),
      debug: (str: string) => {
        void str;
      },
      onConnect: () => {
        this.isConnecting = false;
        this.retryAttempt = 0;
        this.resubscribeAll();
        if (process.env.NODE_ENV !== 'production') {
          console.log(`✅ STOMP Connected (refs: ${this.referenceCount})`);
        }
        this.executeCallbacks();
      },
      onStompError: (frame: Frame) => {
        this.isConnecting = false;
        this.retryAttempt++;
        if (this.client) this.client.reconnectDelay = this.computeReconnectDelay();
        if (process.env.NODE_ENV !== 'production') {
          console.error('❌ STOMP Error:', frame);
        }
      },
      onWebSocketClose: (evt: CloseEvent) => {
        this.isConnecting = false;
        this.retryAttempt++;
        if (this.client) this.client.reconnectDelay = this.computeReconnectDelay();
        if (process.env.NODE_ENV !== 'production') {
          console.warn('🔌 STOMP WebSocket closed:', evt.code, evt.reason);
        }
      },
    });

    this.client.activate();
  }

  private executeCallbacks(): void {
    const callbacks = [...this.connectCallbacks];
    this.connectCallbacks = [];
    callbacks.forEach(cb => {
      try {
        cb();
      } catch (e) {
        if (process.env.NODE_ENV !== 'production') {
          console.error('❌ STOMP callback error:', e);
        }
      }
    });
  }
}

const stompManager = StompConnectionManager.getInstance();

export const setWsTokenGetter = (getter: () => string | null) => {
  stompManager.setTokenGetter(getter);
};

export const connectStomp = (onConnect?: () => void) => {
  stompManager.connect(onConnect);
};

export const disconnectStomp = () => {
  stompManager.disconnect();
};

export const forceDisconnectStomp = () => {
  stompManager.forceDisconnect();
};

export const getStompReferenceCount = () => stompManager.getReferenceCount();
export const isStompConnected = () => stompManager.isConnected();
export const getStompClient = () => stompManager.getClient();

export const subscribeTopic = <T extends WsUnknownMessage = WsUnknownMessage>(
  topic: string,
  callback: WsMessageHandler<T>,
): StompSubscription => {
  return stompManager.registerSubscription(topic, (message: IMessage) => {
    try {
      const body = JSON.parse(message.body) as T;
      callback(body);
    } catch (e) {
      if (process.env.NODE_ENV !== 'production') {
        console.error('❌ STOMP parse error:', e);
      }
    }
  });
};

export const subscribeAlarm = <T extends WsUnknownMessage = WsUnknownMessage>(
  callback: WsMessageHandler<T>,
): StompSubscription => {
  return subscribeTopic<T>('/topic/alarm', callback);
};

export const subscribeFault = <T extends WsUnknownMessage = WsUnknownMessage>(
  callback: WsMessageHandler<T>,
): StompSubscription => {
  return subscribeTopic<T>('/topic/fault', callback);
};

export const publishMessage = <T extends WsUnknownMessage = WsUnknownMessage>(
  destination: string,
  payload: T,
) => {
  const client = stompManager.getClient();
  if (!client || !client.connected) {
    if (process.env.NODE_ENV !== 'production') console.error('❌ STOMP 연결 안됨');
    return;
  }
  client.publish({ destination, body: JSON.stringify(payload) });
};