"use client";
import { MainHeader } from '../Header/MainHeader'
import NewListForm from '../Forms/NewListForm';
import { ActivePurchsesList } from '../ActivePurchases/List';

export const HomePage = () => {

    return (
        <>
            <div className="w-full h-36 bg-gradient-to-r from-[#011c01] to-[#165518]">
                <MainHeader />
            </div>
            <div className="container">
                <div className='absolute w-[calc(100%-32px)] -top-[60px] min-h-[100px] flex items-center justify-center p-4 bg-blue-100 rounded-lg shadow-sm'>
                    <p className="text-sm text-subtitle">Não há conteudo disponível para exibir</p>
                </div>

                <h2 className="text-subtitle mt-[60px] font-medium">Suas listas ativas</h2>

                <div className="flex flex-col gap-3 items-center">
                    <ActivePurchsesList />
                </div>
                <NewListForm />
            </div>
        </>
    )
}
