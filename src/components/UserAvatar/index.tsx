import React, { useEffect } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import Image from 'next/image'
import useGeneralUserStore from '@/store/generalUserStore';
import { cn } from '@/lib/utils';
import { defaultAvatarImgUrl } from '@/constants/avatarImgUrl';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { TUserProfileProps } from '@/types/user';

export function UserAvatar({ width, height, className = '' }: { width: number, height: number, className?: string }) {

    const { userProfile, setUserProfile } = useGeneralUserStore();
    console.log(userProfile)
    // useEffect(() => {
    //     if (!userProfile?.uid) return;
    //     const unsubscribe = onSnapshot(doc(db, "users", userProfile?.uid as string), (doc) => {
    //         console.log("atualizando dados do usuario via websocket")
    //         console.log("==============================")
    //         console.log(doc.data());
    //         setUserProfile(doc.data() as TUserProfileProps);
    //     });
    //     return () => unsubscribe();
    // }, [userProfile?.uid]);

    return (
        <Avatar className={cn('border-app-container', className)} style={
            {
                width: width,
                height: height,
            }
        }>
            <AvatarImage
                src={userProfile?.profile_img}
            />
            <AvatarFallback>
                <img
                    src={defaultAvatarImgUrl}
                    alt="no-profile-img"
                    width={width}
                    height={height}
                />
            </AvatarFallback>
        </Avatar>
    )
}
