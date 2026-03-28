import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import useGeneralUserStore from '@/store/generalUserStore';
import { cn } from '@/lib/utils';
import { defaultAvatarImgUrl } from '@/constants/avatarImgUrl';

export function UserAvatar({ width, height, className = '' }: { width: number, height: number, className?: string }) {

    const { userProfile } = useGeneralUserStore();

    return (
        <Avatar className={cn('border-4 border-sketch-border shadow-sketch-sm rounded-full', className)} style={
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
