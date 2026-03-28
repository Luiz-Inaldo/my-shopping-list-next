import Footer from '@/components/Footer'
import Header from '@/components/Header'
import React from 'react'
import { StatisticsTabs, TabType } from './StatisticsTabs'
import { MonthYearFilters } from './MonthYearFilters'
import { CategoryDonutChart } from './CategoryDonutChart'
import { LastSixMonthsAreaChart } from './LastSixMonthsAreaChart'
import { SummaryInfo } from './SummaryInfo'
import { ComparisonInfo } from './ComparisonInfo'
import { useStatisticsData } from '../../../hooks/useStatisticsData'
import { cn } from '@/lib/utils'

export function Statistics() {
    const {
        activeTab,
        setActiveTab,
        selectedMonth,
        setSelectedMonth,
        selectedYear,
        setSelectedYear,
        areaChartData,
        chartCategoryData,
        totalPurchases,
        totalValue,
        previousTotalValue,
    } = useStatisticsData();

    const handleChangeTab = (tab: TabType) => {
        setActiveTab(tab as TabType);
        if (tab !== "month") {
            setSelectedMonth(new Date().getMonth());
            setSelectedYear(new Date().getFullYear());
        }
    }

    return (
        <div>
            <Header>
                <h2 className="font-sketchHeading text-2xl font-bold">Estatísticas</h2>
            </Header>
            <main className='px-5 pb-24 pt-6 flex flex-col gap-10'>
                <section>
                    <StatisticsTabs
                        activeTab={activeTab}
                        handleTabChange={handleChangeTab}
                    />

                    <div className={cn("flex flex-col bg-sketch-white border-2 border-sketch-fg rounded-sketch-card shadow-sketch-sm mt-[-2px]",
                        activeTab === "month" ? "rounded-tr-none" : "",
                        activeTab === "day" ? "rounded-tl-none" : ""
                    )}>

                        {/* Month/Year Filters - Only show for month tab */}
                        {activeTab === "month" && (
                            <MonthYearFilters
                                // purchasesList={areaChartData}
                                selectedMonth={selectedMonth}
                                selectedYear={selectedYear}
                                onMonthChange={setSelectedMonth}
                                onYearChange={setSelectedYear}
                            />
                        )}


                        <CategoryDonutChart
                            data={chartCategoryData}
                            totalValue={totalValue}
                        />


                        <SummaryInfo
                            totalPurchases={totalPurchases}
                            totalValue={totalValue}
                        />

                        <ComparisonInfo
                            currentValue={totalValue}
                            previousValue={previousTotalValue}
                            period={activeTab}
                        />

                    </div>
                </section>

                <section>
                    <LastSixMonthsAreaChart data={areaChartData} />
                </section>
            </main>
            <Footer />
        </div>
    )
}