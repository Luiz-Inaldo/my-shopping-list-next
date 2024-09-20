import LoggedLayout from '@/components/layout/LoggedLayout';
import { Wrench } from 'lucide-react';
import React from 'react'

export default function Settings() {

    return (
        <LoggedLayout>
            <div className='w-full min-h-screen'>
                <div className='flex items-center justify-center gap-3 text-subtitle border-b border-paragraph w-fit mx-auto p-1'>
                    <Wrench size={24} />
                    <h1 className='text-xl font-semibold'>Configurações</h1>
                    <Wrench size={24} className='-rotate-[90deg]' />
                </div>
            </div>
        </LoggedLayout>
    )
}
