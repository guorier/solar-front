// app/(home)/monitoring/power/[id]/page.tsx
import MonitoringPowLog from '@/constants/monitoring/power/MonitoringPowLog';

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function Page({ params }: PageProps) {
  const resolvedParams = await params;

  return <MonitoringPowLog id={resolvedParams.id} />;
}