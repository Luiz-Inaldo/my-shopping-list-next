"use client";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import LoggedLayout from "@/components/layout/MainLayout";
import { MonthlyResumeSection } from "./Components/MonthlyResumeSection";
import AnnualResumeSection from "./Components/AnnualResumeSection";
import { LastSixMonthsSection } from "./Components/LastSixMonthsSection";

export default function Statistics() {

    return (
        <LoggedLayout>
            <Header
                content={(_) => (
                    <div className='flex items-center gap-3 cursor-pointer overflow-hidden'>
                        <h2 className="text-title text-lg">Estatísticas</h2>
                    </div>
                )}
            />
            <main className='main-container py-28 px-5 flex flex-col gap-10'>
                <MonthlyResumeSection />
                <AnnualResumeSection />
                <LastSixMonthsSection />
            </main>
            <Footer />
        </LoggedLayout>
    )
}
