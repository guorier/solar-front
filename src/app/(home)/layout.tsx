import { MainLayout } from '@/layouts';
import { DashboardSocketProvider } from '@/providers/DashboardSocketProvider';

export default function MainGroupLayout({ children }: { children: React.ReactNode }) {
  return (
    <MainLayout>
      <DashboardSocketProvider>{children}</DashboardSocketProvider>
    </MainLayout>
  );
}