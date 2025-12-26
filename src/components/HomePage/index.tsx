"use client";
import { MainHeader } from '../Header/MainHeader'
import NewListForm from '../Forms/NewListForm';
import { ActivePurchsesList } from '../ActivePurchases/List';
import { MonthlyStatistics } from '../MonthlyStatistics';
import useGeneralUserStore from '@/store/generalUserStore';
import { StaticAlert } from '../Alerts/StaticAlert';
import { Mail } from 'lucide-react';
import { AppAlert } from '../Alerts';

export const HomePage = () => {

    const userProfile = useGeneralUserStore(store => store.userProfile);

    return (
        <div className='relative'>
            <div className="absolute top-0 w-full h-36 bg-gradient-to-r from-[#011c01] to-[#165518]">
            </div>
            <MainHeader />
            <div className="z-[1]">
                <div className="container">
                    {userProfile?.emailPendencies && (
                        <AppAlert type="email" />
                    )}
                    <MonthlyStatistics />
                    <ActivePurchsesList />
                    <NewListForm />
                </div>
            </div>
        </div>
    )
}
