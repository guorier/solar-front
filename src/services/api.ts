import { apiClient, plantClient, plantCommonClient } from '@/lib/http.lib';
import type { AxiosRequestConfig } from 'axios';

// GET
export async function getRequest<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
  const { data } = await apiClient.get<T>(url, { ...config });
  return data;
}

// POST
export async function postRequest<T>(url: string, body?: object): Promise<T> {
  const { data } = await apiClient.post<T>(url, body);
  return data;
}

// PUT
export async function putRequest<T>(url: string, body?: object): Promise<T> {
  const { data } = await apiClient.put<T>(url, body);
  return data;
}

// DELETE
export async function deleteRequest<T>(url: string, body?: object): Promise<T> {
  const { data } = await apiClient.delete<T>(url, { data: body });
  return data;
}

// plant GET
export async function plantGetRequest<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
  const { data } = await plantClient.get<T>(url, { ...config });
  return data;
}

// plant POST
export async function plantPostRequest<T>(url: string, body?: object, config?: AxiosRequestConfig): Promise<T> {
  const { data } = await plantClient.post<T>(url, body, { ...config });
  return data;
}


// plant common GET
export async function plantCommonGetRequest<T>(
  url: string,
  config?: AxiosRequestConfig
): Promise<T> {
  const { data } = await plantCommonClient.get<T>(url, { ...config });
  return data;
}

// plant common POST
export async function plantCommonPostRequest<T>(
  url: string,
  body?: object,
  config?: AxiosRequestConfig
): Promise<T> {
  const { data } = await plantCommonClient.post<T>(url, body, { ...config });
  return data;
}
