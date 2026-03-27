// import { useQuery } from '@tanstack/react-query';
// import { getMonitorOprate } from './request';
// import type { MonitorOprateParams } from './type';

// /**
//  * 운영 모니터링 조회
//  */
// export const useGetMonitorOprate = (params: MonitorOprateParams) => {
//   return useQuery({
//     queryKey: ['monitor', 'oprate', params.pwplIds],
//     queryFn: () => getMonitorOprate(params),
//     enabled: params.pwplIds.length > 0,
//   });
// };
