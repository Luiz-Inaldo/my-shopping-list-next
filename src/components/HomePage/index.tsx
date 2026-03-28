'use client';
import { MainHeader } from '../Header/MainHeader';
import NewListForm from '../Forms/NewListForm';
import { ActivePurchsesList } from '../ActivePurchases/List';
// import { MonthlyStatistics } from '../MonthlyStatistics';
import { AppAlert } from '../Alerts';
import useGeneralUserStore from '@/store/generalUserStore';

export const HomePage = () => {
  const user = useGeneralUserStore((s) => s.userProfile);

  return (
    <div className="relative flex min-h-0 w-full flex-1 flex-col font-sketch">
      <MainHeader />
      <div className="container flex flex-col gap-5">
        {user && !user?.emailVerified && <AppAlert type="email" />}
        {/* <MonthlyStatistics /> */}
        <ActivePurchsesList />
        <NewListForm />
      </div>
    </div>
  );
};
