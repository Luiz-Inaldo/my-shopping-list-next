"use client";
import Footer from "../Footer";

const forbiddenRoutesToShowFooter = ['/notifications']

const LoggedLayout = ({ children }: { children: React.ReactNode }) => {

  const showFooter = !forbiddenRoutesToShowFooter.includes(window.location.pathname);

  return (
    <div className="page-wrapper sketch-shell relative isolate min-h-screen-dvh font-sketch">
      {children}
      {showFooter && <Footer />}
    </div>
  );
};

export default LoggedLayout;
