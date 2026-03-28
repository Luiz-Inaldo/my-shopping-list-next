"use client";
import Footer from "../Footer";

const LoggedLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="page-wrapper sketch-shell relative isolate min-h-screen-dvh font-sketch">
      {children}
      <Footer />
    </div>
  );
};

export default LoggedLayout;
