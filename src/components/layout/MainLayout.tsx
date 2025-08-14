"use client";
import Footer from "../Footer";
import { useTheme } from "@/hooks/useTheme";

const LoggedLayout = ({ children }: { children: React.ReactNode }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="relative bg-app-background">
      {children}
      <Footer />
    </div>
  );
};

export default LoggedLayout;
