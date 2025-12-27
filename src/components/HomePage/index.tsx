"use client";
import { MainHeader } from '../Header/MainHeader'
import NewListForm from '../Forms/NewListForm';
import { ActivePurchsesList } from '../ActivePurchases/List';
import { MonthlyStatistics } from '../MonthlyStatistics';
import { AppAlert } from '../Alerts';
import { auth } from '@/lib/firebase';

export const HomePage = () => {

    const user = auth.currentUser;
    console.log(user)

    return (
        <div className='relative'>
            <div className="absolute top-0 w-full h-36 bg-gradient-to-r from-[#011c01] to-[#165518]">
            </div>
            <MainHeader />
            <div className="z-[1]">
                <div className="container">
                    {!user?.emailVerified && (
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
