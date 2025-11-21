"use client";

import { motion } from "motion/react";

export type TabType = "day" | "week" | "month";

interface StatisticsTabsProps {
  activeTab: TabType;
  handleTabChange: (tab: TabType) => void;
}

export function StatisticsTabs({ activeTab, handleTabChange }: StatisticsTabsProps) {
  const tabs = [
    { key: "day" as TabType, label: "Dia" },
    { key: "week" as TabType, label: "Semana" },
    { key: "month" as TabType, label: "Mês" },
  ];

  return (
    <div className="w-full">
      <ul className="relative flex">
        {tabs.map((tab) => (
          <motion.li
          key={tab.key}
          initial={false}
          onClick={() => handleTabChange(tab.key)}
          className={`relative w-1/2 text-center rounded-full px-5 py-2`}
        >
          <span className={`${activeTab === tab.key ? "!text-subtitle" : "text-paragraph"} relative z-[2] transition-colors delay-100`}>{tab.label}</span>
          {activeTab === tab.key ? (
            <motion.div
              layoutId="background"
              id="background"
              className="absolute inset-0 z-[0] rounded-tl-lg rounded-tr-lg p-2 bg-app-container"
            />
          ) : null}
        </motion.li>
        ))}
      </ul>
    </div>
  );
}
