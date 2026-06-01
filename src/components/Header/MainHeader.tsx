import useGeneralUserStore from '@/store/generalUserStore';
import { MainHeaderSkeleton } from '../Skeletons/MainHeaderSkeleton';
import { UserAvatar } from '../UserAvatar';
import { APP_ROUTES } from '@/routes/app-routes';
import { NotificationsButton } from './NotificationsButton';

export const MainHeader = () => {
  const userProfile = useGeneralUserStore((store) => store.userProfile);

  if (!userProfile) return <MainHeaderSkeleton />;

  const displayName = userProfile?.name || 'Usuário';

  return (
    <header className="sticky top-0 z-10 flex w-full items-center justify-between border-b-2 border-dashed border-sketch-muted bg-sketch-bg px-5 pb-4 pt-5">
      <a href={APP_ROUTES.private.settings.name} className="flex items-center gap-3">
        <div
          className="relative h-[52px] w-[52px] shrink-0 overflow-hidden border-[3px] border-sketch-border bg-sketch-accent-lt shadow-sketch-sm rounded-sketch-avatar"
        >
          <UserAvatar
            width={52}
            height={52}
            className="size-full border-0 !rounded-none"
          />
        </div>
        <div className="flex flex-col gap-0.5">
          <p className="font-sketch text-[13px] leading-none text-title opacity-60">
            Bem-vindo de volta,
          </p>
          <p className="font-sketchHeading text-xl font-bold leading-tight text-title">
            {displayName}
          </p>
        </div>
      </a>
      <NotificationsButton />
    </header>
  );
};
