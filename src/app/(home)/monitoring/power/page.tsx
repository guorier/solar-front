// src\app\(home)\monitoring\power\page.tsx
import MonitoringPow from '@/constants/power/MonitoringPow';

type PageProps = {
  searchParams?: Promise<{
    pwplIds?: string | string[];
  }>;
};

export default async function Page({ searchParams }: PageProps) {
  const params = searchParams ? await searchParams : undefined;

  const pwplIds =
    typeof params?.pwplIds === 'string'
      ? params.pwplIds
      : Array.isArray(params?.pwplIds)
        ? params.pwplIds.join(',')
        : '';

  return <MonitoringPow pwplIds={pwplIds} />;
}