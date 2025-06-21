import { useEffect, useState } from "react";

export const useTheme = () => {
    const [theme, setThemeState] = useState<"light" | "dark">(() => {
      if (typeof window !== "undefined") {
        const stored = localStorage.getItem("theme");
        return (stored as "light" | "dark") || "light";
      }
      return "light";
    });

    useEffect(() => {
      const root = window.document.documentElement;

      if (theme === "dark") {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }

      localStorage.setItem("theme", theme);
    }, [theme]);

    const toggleTheme = () => {
      setThemeState((prev) => (prev === "light" ? "dark" : "light"));
    };

    return { theme, toggleTheme };
}
