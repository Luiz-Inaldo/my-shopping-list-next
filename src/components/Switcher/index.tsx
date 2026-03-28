import React from "react";
import { cn } from "@/lib/utils";

export default function ThemeSwitcher({ theme, toggleTheme }: { theme: string, toggleTheme: () => void }) {
  const isDark = theme === "dark";

  return (
    <label
      htmlFor="theme-switcher"
      className={cn(
        "relative inline-flex h-7 w-12 cursor-pointer items-center rounded-sketch-avatar border-[3px] border-sketch-border transition-colors duration-200",
        isDark ? "bg-sketch-bg" : "bg-sketch-muted"
      )}
      onClick={(e) => {
        e.preventDefault();
        toggleTheme();
      }}
    >
      <input
        id="theme-switcher"
        type="checkbox"
        className="sr-only"
        checked={isDark}
        readOnly
      />
      <span
        className={cn(
          "pointer-events-none block h-4 w-4 rounded-sketch-avatar border-2 border-sketch-fg bg-sketch-accent transition-transform duration-200 shadow-sketch-1",
          isDark ? "translate-x-6" : "translate-x-1"
        )}
      />
    </label>
  );
}
