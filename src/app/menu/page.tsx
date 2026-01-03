'use client';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import { MenuOptionsSection } from './_components/MenuOptionsSection';
import { ProfileCard } from './_components/ProfileCard';

export default function Menu() {
  return (
    <>
      <Header className="text-lg font-medium">Geral</Header>

      <main className="px-5 pb-24 pt-6 flex flex-col gap-8">
        <ProfileCard />
        <MenuOptionsSection />
      </main>

      <Footer />
    </>
  );
}
