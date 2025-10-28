"use client";

import React from "react";

type TabType = "day" | "week" | "month";

interface StatisticsTabsProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export function StatisticsTabs({ activeTab, onTabChange }: StatisticsTabsProps) {
  const tabs = [
    { key: "day" as TabType, label: "Dia" },
    { key: "week" as TabType, label: "Semana" },
    { key: "month" as TabType, label: "Mês" },
  ];

  return (
    <div className="w-full bg-white rounded-full p-2 shadow-md">
      <div className="relative flex">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => onTabChange(tab.key)}
            className={`flex-1 relative text-center py-2 px-4 rounded-full transition-all duration-300 ${
              activeTab === tab.key 
                ? "text-white bg-default-green" 
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            <span className="relative z-10 font-medium">{tab.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
