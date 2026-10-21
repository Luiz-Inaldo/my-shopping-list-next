import LoggedLayout from '@/components/layout/MainLayout';
import { NotificationsPage } from '@/app/notifications/_components';
import { NotificationsProvider } from '@/context/NotificationsContext';

export default function Notifications() {
  return (
    <LoggedLayout>
      <NotificationsProvider>
        <NotificationsPage />
      </NotificationsProvider>
    </LoggedLayout>
  );
}
