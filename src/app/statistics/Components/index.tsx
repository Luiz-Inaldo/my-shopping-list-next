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
        chartCategoryData,
        // categoryData,
        // totalPurchases,
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
                <h2 className="text-subtitle font-medium text-lg">Estatísticas</h2>
            </Header>
            <main className='px-5 pb-24 pt-6 flex flex-col gap-10'>
                <section>
                    <StatisticsTabs
                        activeTab={activeTab}
                        handleTabChange={handleChangeTab}
                    />

                    <div className={cn("flex flex-col bg-app-container rounded-bl-lg rounded-br-lg",
                        activeTab === "month" ? "rounded-tl-lg" : "",
                        activeTab === "day" ? "rounded-tr-lg" : "",
                        activeTab === "week" ? "rounded-tr-lg rounded-tl-lg" : "",
                    )}>

                        {/* Month/Year Filters - Only show for month tab */}
                        {activeTab === "month" && (
                            <MonthYearFilters
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
                            totalPurchases={chartCategoryData.length || 0}
                            totalValue={totalValue}
                        />

                        <ComparisonInfo
                            currentValue={totalValue}
                            previousValue={previousTotalValue}
                            period={activeTab}
                        />

                    </div>
                </section>

                {/* Last Six Months Area Chart */}
                <section>
                    {/* <LastSixMonthsAreaChart data={lastSixMonthsData} /> */}
                </section>
            </main>
            <Footer />
        </div>
    )
}