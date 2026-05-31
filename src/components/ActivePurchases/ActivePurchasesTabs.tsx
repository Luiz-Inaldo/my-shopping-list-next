'use client';

import { motion } from 'motion/react';
import { cn } from '@/lib/utils';

export type ActivePurchasesTab = 'created' | 'shared';

interface ActivePurchasesTabsProps {
  activeTab: ActivePurchasesTab;
  onTabChange: (tab: ActivePurchasesTab) => void;
}

const tabs: { key: ActivePurchasesTab; label: string }[] = [
  { key: 'created', label: 'Criadas' },
  { key: 'shared', label: 'Compartilhadas' },
];

export function ActivePurchasesTabs({
  activeTab,
  onTabChange,
}: ActivePurchasesTabsProps) {
  return (
    <div className="w-full">
      <ul className="relative flex border-b-2 border-sketch-border">
        {tabs.map((tab) => (
          <motion.li
            key={tab.key}
            initial={false}
            onClick={() => onTabChange(tab.key)}
            className={cn(
              'relative flex-1 cursor-pointer px-4 py-2 text-center transition-colors duration-200',
              activeTab === tab.key
                ? 'text-sketch-fg'
                : 'text-sketch-fg/60 hover:text-sketch-fg/80',
            )}
          >
            <span className="relative z-[2] font-sketchHeading text-base font-bold">
              {tab.label}
            </span>
            {activeTab === tab.key ? (
              <motion.div
                layoutId="activePurchasesTabsBg"
                className="absolute inset-x-0 bottom-[-2px] top-0 z-[1] rounded-t-sketch-wobbly border-2 border-b-0 border-sketch-fg bg-sketch-white"
              />
            ) : null}
          </motion.li>
        ))}
      </ul>
    </div>
  );
}
