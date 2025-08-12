import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import Image from 'next/image'
import useGeneralUserStore from '@/store/generalUserStore';

export const MainHeader = () => {

    // =============
    // # STORE
    // =============
    const userProfile = useGeneralUserStore(store => store.userProfile);

    return (
        <div className="w-full p-4 flex items-center gap-3">
            <Avatar className='border-2 border-app-container'>
                <AvatarImage src={userProfile?.profile_img} />
                <AvatarFallback>
                    <Image
                        src='/images/avatars/default-avatar.svg'
                        alt='no-profile-img'
                        width={40}
                        height={40}
                    />
                </AvatarFallback>
            </Avatar>
            <div className='flex flex-col'>
                <p className="text-[#d9d9d9] text-lg font-medium leading-none">
                    Olá {userProfile?.user_name || 'Usuário sem nome.'}
                </p>
                <p className='text-[#909090] text-sm'>Bem-vindo de volta!</p>
            </div>
        </div>
    )
}
