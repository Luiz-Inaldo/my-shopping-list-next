import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { OtherSettingsSection } from "./_components/OtherSettingsSection";
import { PreferencesSection } from "./_components/PreferencesSection";
import { ProfileCard } from "./_components/ProfileCard";
import { ProfileSection } from "./_components/ProfileSection";

export default function Settings() {
  return (
    <>
      <Header className="text-lg font-medium">Ajustes do sistema</Header>

      <main className="px-5 pb-24 pt-6 flex flex-col gap-8">
        <ProfileCard />
        <ProfileSection />
        <PreferencesSection />
        <OtherSettingsSection />
      </main>

      <Footer />
    </>
  );
}
