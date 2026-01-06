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

  return (
    <div className="page-wrapper">
      <Header className="text-lg font-medium">Ajustes</Header>

      <main className="px-5 pb-24 pt-6 flex flex-col gap-8">
        <ProfileCard />
        {user && !user?.emailVerified && (
          <AppAlert type="email" />
        )}
        <ProfileSection />
        <PreferencesSection />
      </main>

      <Footer />
    </div>
  );
}
