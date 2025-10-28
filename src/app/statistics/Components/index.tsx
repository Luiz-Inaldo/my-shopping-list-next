import Footer from '@/components/Footer'
import Header from '@/components/Header'
import React from 'react'
import { StatisticsTabs } from './StatisticsTabs'
import { MonthYearFilters } from './MonthYearFilters'
import { CategoryDonutChart } from './CategoryDonutChart'
import { LastSixMonthsAreaChart } from './LastSixMonthsAreaChart'
import { SummaryInfo } from './SummaryInfo'
import { ComparisonInfo } from './ComparisonInfo'
import { useStatisticsData } from './useStatisticsData'

export function Statistics() {
    const {
        activeTab,
        setActiveTab,
        selectedMonth,
        setSelectedMonth,
        selectedYear,
        setSelectedYear,
        categoryData,
        lastSixMonthsData,
        totalPurchases,
        totalValue,
        previousTotalValue
    } = useStatisticsData();

    return (
        <div>
            <Header>
                <h2 className="text-subtitle font-medium text-lg">Estatísticas</h2>
            </Header>
            <main className='px-5 pb-24 flex flex-col gap-10'>
                {/* Tabs Section */}
                <section className="grid gap-5">
                    <StatisticsTabs 
                        activeTab={activeTab} 
                        onTabChange={setActiveTab} 
                    />
                    
                    {/* Month/Year Filters - Only show for month tab */}
                    {activeTab === "month" && (
                        <MonthYearFilters
                            selectedMonth={selectedMonth}
                            selectedYear={selectedYear}
                            onMonthChange={setSelectedMonth}
                            onYearChange={setSelectedYear}
                        />
                    )}
                </section>

                {/* Category Donut Chart */}
                <section>
                    <CategoryDonutChart 
                        data={categoryData} 
                        totalValue={totalValue} 
                    />
                </section>

                {/* Summary Information */}
                <section>
                    <SummaryInfo 
                        totalPurchases={totalPurchases}
                        totalValue={totalValue}
                    />
                    
                    {/* Comparison Info - Only show for week and month tabs */}
                    {(activeTab === "week" || activeTab === "month") && (
                        <ComparisonInfo
                            currentValue={totalValue}
                            previousValue={previousTotalValue}
                            period={activeTab}
                        />
                    )}
                </section>

                {/* Last Six Months Area Chart */}
                <section>
                    <LastSixMonthsAreaChart data={lastSixMonthsData} />
                </section>
            </main>
            <Footer />
        </div>
    )
}