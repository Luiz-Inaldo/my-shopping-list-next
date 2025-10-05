import LoggedLayout from '@/components/layout/MainLayout';
import { HistoricPage } from '@/app/historic/_components';

export default function Historic() {
  return (
    <LoggedLayout>
      <HistoricPage />
    </LoggedLayout>
  );
}