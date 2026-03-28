'use client';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import { MenuOptionsSection } from './_components/MenuOptionsSection';
import { ProfileCard } from './_components/ProfileCard';

export default function Menu() {
  return (
    <div className="sketch-shell min-h-screen flex flex-col">
      <Header className="text-2xl font-sketchHeading">Geral</Header>

      <main className="flex-1 px-5 pb-24 pt-8 flex flex-col gap-10 max-w-2xl mx-auto w-full">
        <ProfileCard />
        <MenuOptionsSection />
      </main>

      <Footer />
    </div>
  );
}
