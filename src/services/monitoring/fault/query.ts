import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { postFaultList, postManualDownStatus, postRecognizeStatus } from './request';
import { ManualDownReq } from './type';

// [장애 모니터링] 장애 목록 조회
export const useGetFaultList = (pwplIds?: string[]) => {
  return useQuery({
    queryKey: ['fault', 'list', pwplIds],
    queryFn: () => postFaultList(pwplIds),
  });
};

// [장애 모니터링] 장애 상태 변경 (인지)
export const usePostRecognizeStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['fault-status', 'recognize'],
    mutationFn: (unqNo: string) => postRecognizeStatus(unqNo),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fault'] });
    },
  });
};

// [장애 모니터링] 장애 상태 변경 (수동종료)
export const usePostManualDownStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['fault-status', 'manual-down'],
    mutationFn: (payload: ManualDownReq) => postManualDownStatus(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fault'] });
    },
  });
};
