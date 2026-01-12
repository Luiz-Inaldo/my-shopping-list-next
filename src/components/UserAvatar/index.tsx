import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import Image from 'next/image'
import useGeneralUserStore from '@/store/generalUserStore';
import { cn } from '@/lib/utils';
import { defaultAvatarImgUrl } from '@/constants/avatarImgUrl';

export function UserAvatar({ width, height, className = '' }: { width: number, height: number, className?: string }) {

    const { userProfile } = useGeneralUserStore();

    return (
        <Avatar className={cn('border-app-container', className)} style={
            {
                width: width,
                height: height,
            }
        }>
            <AvatarImage
                src={`https://api.dicebear.com/9.x/micah/svg?seed=${userProfile?.email}&backgroundColor=c0aede` || defaultAvatarImgUrl}
            />
            <AvatarFallback>
                <Image
                    src="/images/avatars/default-avatar.svg"
                    alt="no-profile-img"
                    width={width}
                    height={height}
                />
            </AvatarFallback>
        </Avatar>
    )
}
