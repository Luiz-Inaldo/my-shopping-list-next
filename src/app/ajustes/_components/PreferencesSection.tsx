"use client";
import ThemeSwitcher from "@/components/Switcher";
import { useTheme } from "@/hooks/useTheme";
import { Moon, Sun } from "lucide-react";
import { useMemo } from "react";

export function PreferencesSection() {
  const { theme, toggleTheme } = useTheme();

  const themeOptions = useMemo(() => {
    return {
      theme: theme === "dark" ? "Modo Escuro" : "Modo Claro",
      icon: theme === "dark" ? <Moon size={18} /> : <Sun size={18} />,
    }
  }, [theme]);

  return (
    <section>
      <h2 className="text-paragraph text-sm mb-3">Preferências</h2>
      <div className="bg-app-container rounded-lg">
        <div className="w-full flex items-center justify-between p-4">
          <div className="flex items-center gap-3 text-subtitle">
            {themeOptions.icon}
            <span className="text-sm">{themeOptions.theme}</span>
          </div>
          <ThemeSwitcher theme={theme} toggleTheme={toggleTheme} />
        </div>
      </div>
    </section>
  );
}

