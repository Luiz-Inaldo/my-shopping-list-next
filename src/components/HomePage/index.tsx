"use client";
import { MainHeader } from '../Header/MainHeader'
import NewListForm from '../Forms/NewListForm';
import { ActivePurchsesList } from '../ActivePurchases/List';
import { MonthlyStatistics } from '../MonthlyStatistics';

export const HomePage = () => {

    return (
        <div className='relative'>
            <div className="absolute top-0 w-full h-36 bg-gradient-to-r from-[#011c01] to-[#165518]">
            </div>
            <MainHeader />
            <div className="z-[1]">
                <div className="container">
                    <MonthlyStatistics />
                    <ActivePurchsesList />
                    <NewListForm />
                </div>
            </div>
        </div>
    )
}
