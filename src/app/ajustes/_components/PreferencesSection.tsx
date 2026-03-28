"use client";
import ThemeSwitcher from "@/components/Switcher";
import { useTheme } from "@/hooks/useTheme";
import { Moon, Sun } from "lucide-react";
import React, { useMemo } from "react";

export function PreferencesSection() {
  const { theme, toggleTheme } = useTheme();

  const themeOptions = useMemo(() => {
    return {
      theme: theme === "dark" ? "Modo Escuro" : "Modo Claro",
      icon: theme === "dark" ? <Moon size={20} strokeWidth={2.5} /> : <Sun size={20} strokeWidth={2.5} />,
    }
  }, [theme]);

  return (
    <section className="font-sketch py-2">
      <h2 className="text-sketch-fg font-sketchHeading text-xl mb-3 ml-2">Preferências</h2>
      <div className="bg-sketch-white border-[3px] border-sketch-border rounded-sketch-card shadow-sketch -rotate-1 overflow-hidden">
        <div className="w-full flex items-center justify-between p-4">
          <div className="flex items-center gap-3 text-sketch-fg">
            <span className="text-sketch-accent">
              {themeOptions.icon}
            </span>
            <span className="text-lg">{themeOptions.theme}</span>
          </div>
          <ThemeSwitcher theme={theme} toggleTheme={toggleTheme} />
        </div>
      </div>
    </section>
  );
}

