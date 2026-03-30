'use client';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import { PreferencesSection } from './_components/PreferencesSection';
import { ProfileCard } from './_components/ProfileCard';
import { ProfileSection } from './_components/ProfileSection';
import { AppAlert } from '@/components/Alerts';
import useGeneralUserStore from '@/store/generalUserStore';

export default function Settings() {

  const user = useGeneralUserStore(s => s.userProfile);
  console.log("user", user);
  return (
    <div className="page-wrapper sketch-shell">
      <Header className="text-2xl font-sketchHeading">Ajustes</Header>

      <main className="px-5 pb-24 pt-8 flex flex-col gap-10">
        <ProfileCard />
        {user && !user?.emailVerified && (
          <div className="-rotate-1">
            <AppAlert
              type="email"
              className="bg-sketch-yellow border-[3px] border-sketch-fg rounded-sketch-card shadow-sketch-sm"
            />
          </div>
        )}
        <ProfileSection />
        <PreferencesSection />
      </main>

      <Footer />
    </div>
  );
}
