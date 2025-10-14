"use client";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import LoggedLayout from "@/components/layout/MainLayout";
import { MonthlyResumeSection } from "./Components/MonthlyResumeSection";
import { PurchasesProvider } from "@/context/PurchasesContext";

export default function Statistics() {

    return (
        <LoggedLayout>
            <Header className="text-lg font-medium">
                Estatísticas
            </Header>
            <PurchasesProvider>
                <main className='main-container py-6 px-5 flex flex-col gap-10'>
                    <MonthlyResumeSection />
                    {/* <AnnualResumeSection />
                <LastSixMonthsSection /> */}
                </main>
                <Footer />
            </PurchasesProvider>
        </LoggedLayout>
    )
}
