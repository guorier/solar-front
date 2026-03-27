import axios from 'axios';
import { getSession } from 'next-auth/react';

// 서버용 api
export const serverApi = axios.create({
  baseURL: process.env.API_BASE_URL + '/api',
  timeout: 15_000,
});

// 계정api
export const apiClient = axios.create({
  baseURL: '/solar/api',
  timeout: 15_000,
});

apiClient.interceptors.request.use(async (config) => {
  if (!config.headers) return config;

  const skipAuth = config.headers.get('X-SKIP-AUTH');
  if (!skipAuth) {
    const session = await getSession();
    if (session?.accessToken) {
      config.headers.set('Authorization', `Bearer ${session.accessToken}`);
    }
  }

  return config;
});

// 발전소 api
export const plantClient = axios.create({
  baseURL: '/plant/api',
  timeout: 15_000,
});

plantClient.interceptors.request.use(async (config) => {
  if (!config.headers) return config;

  const skipAuth = config.headers.get('X-SKIP-AUTH');
  if (!skipAuth) {
    const session = await getSession();
    if (session?.accessToken) {
      config.headers.set('Authorization', `Bearer ${session.accessToken}`);
    }
  }

  return config;
});

// 발전소 공통 api
export const plantCommonClient = axios.create({
  baseURL: '/common',
  timeout: 15_000,
});

plantCommonClient.interceptors.request.use(async (config) => {
  if (!config.headers) return config;

  const skipAuth = config.headers.get('X-SKIP-AUTH');
  if (!skipAuth) {
    const session = await getSession();
    if (session?.accessToken) {
      config.headers.set('Authorization', `Bearer ${session.accessToken}`);
    }
  }

  return config;
});
