"use client";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { OtherSettingsSection } from "./_components/OtherSettingsSection";
import { PreferencesSection } from "./_components/PreferencesSection";
import { ProfileCard } from "./_components/ProfileCard";
import { ProfileSection } from "./_components/ProfileSection";
import { AppAlert } from "@/components/Alerts";
import { auth } from "@/lib/firebase";
import { useEffect } from "react";
import { sendEmailVerification } from "firebase/auth";

export default function Settings() {

  const user = auth.currentUser;

  // useEffect(() => {
  //   async function generateEmail(){
  //     if (user) {
  //       await sendEmailVerification(user);
  //     }
  //   }
  //   generateEmail();
  // }, [])

  return (
    <>
      <Header className="text-lg font-medium">Ajustes do sistema</Header>

      <main className="px-5 pb-24 pt-6 flex flex-col gap-8">
        <ProfileCard />
        {!user?.emailVerified && (
          <AppAlert type="email" />
        )}
        <ProfileSection />
        <PreferencesSection />
        <OtherSettingsSection />
      </main>

      <Footer />
    </>
  );
}
