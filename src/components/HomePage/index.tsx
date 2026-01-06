'use client';
import { MainHeader } from '../Header/MainHeader';
import NewListForm from '../Forms/NewListForm';
import { ActivePurchsesList } from '../ActivePurchases/List';
import { MonthlyStatistics } from '../MonthlyStatistics';
import { AppAlert } from '../Alerts';
import useGeneralUserStore from '@/store/generalUserStore';
import { motion } from 'motion/react';

export const HomePage = () => {
  const user = useGeneralUserStore((s) => s.userProfile);

  return (
    <div className="relative page-wrapper overflow-hidden isolate">
      <motion.div
        initial={{ opacity: 0, y: '-100%' }}
        animate={{ opacity: 1, y: 0, x: '-50%' }}
        transition={{ duration: 0.5 }}
        className="absolute left-1/2 -top-28 h-60 w-[150%] rounded-bl-full rounded-br-full bg-[linear-gradient(135deg,#161334_0%,#241F56_60%,#322B78_100%)]"
      />
      <MainHeader />
      <div className="container">
        {user && !user?.emailVerified && <AppAlert type="email" />}
        <MonthlyStatistics />
        <ActivePurchsesList />
        <NewListForm />
      </div>
    </div>
  );
};
