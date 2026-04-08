import { plantClient } from '@/lib/http.lib';
import { FaultSocket, FaultStatusRes, ManualDownReq } from './type';

// [장애 모니터링] 장애 목록 조회
export const postFaultList = async (pwplIds?: string[]): Promise<FaultSocket[]> => {
  const { data } = await plantClient.post('/monitor/disaster/alarm', {
    pwplIds,
  });

  if (data === '') return [];

  return data;
};

// [장애 모니터링] 장애 상태 변경 (인지)
export const postRecognizeStatus = async (unqNo: string): Promise<FaultStatusRes> => {
  const { data } = await plantClient.post('/monitor/disaster/recognize', { unqNo });
  return data;
};

// [장애 모니터링] 장애 상태 변경 (수동종료)
export const postManualDownStatus = async (payload: ManualDownReq): Promise<FaultStatusRes> => {
  const { data } = await plantClient.post('/monitor/disaster/manualDown', payload);
  return data;
};
