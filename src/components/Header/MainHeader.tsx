import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import Image from 'next/image'
import useGeneralUserStore from '@/store/generalUserStore';
import { MainHeaderSkeleton } from '../Skeletons/MainHeaderSkeleton';
import { UserAvatar } from '../UserAvatar';

export const MainHeader = () => {

    // =============
    // # STORE
    // =============
    const userProfile = useGeneralUserStore(store => store.userProfile);

    if (!userProfile) return <MainHeaderSkeleton />

    return (
        <div className="relative w-full p-4 flex items-center gap-3">
            <UserAvatar
                width={40}
                height={40}
                className='border-2'
            />
            <div className='flex flex-col'>
                <p className="text-[#eaeaea] font-medium leading-none">
                    Olá {userProfile?.name || 'Usuário sem nome.'}
                </p>
                <p className='text-[#d0d0d0] text-xs'>Bem-vindo de volta!</p>
            </div>
        </div>
    )
}
