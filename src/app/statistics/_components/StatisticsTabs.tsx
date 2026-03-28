"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";

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
            className={cn(
              "relative flex-1 text-center px-5 py-2 cursor-pointer transition-colors duration-200",
              activeTab === tab.key ? "text-sketch-fg" : "text-sketch-fg/60 hover:text-sketch-fg/80"
            )}
          >
            <span className="relative z-[2] font-sketchHeading font-bold text-lg">
              {tab.label}
            </span>
            {activeTab === tab.key ? (
              <motion.div
                layoutId="tabsBg"
                id="tabsBg"
                className="absolute inset-x-0 bottom-[-2px] top-0 z-[1] rounded-t-sketch-wobbly border-2 border-b-0 border-sketch-fg bg-sketch-white"
              />
            ) : null}
          </motion.li>
        ))}
      </ul>
    </div>
  );
}
