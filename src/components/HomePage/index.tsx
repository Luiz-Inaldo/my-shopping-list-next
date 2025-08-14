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

                    <h2 className="text-subtitle font-medium">Suas listas ativas</h2>

                    <div className="flex flex-col gap-3 items-center">
                        <ActivePurchsesList />
                    </div>
                    <NewListForm />
                </div>
            </div>
        </div>
    )
}
