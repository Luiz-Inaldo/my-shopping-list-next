"use client";
import React, { useEffect } from "react";
import Footer from "../Footer";
import { useTheme } from "@/hooks/useTheme";
import getProfile from "@/services/userProfileServices";
import useGeneralUserStore from "@/store/generalUserStore";

const LoggedLayout = ({ children }: { children: React.ReactNode }) => {
  const { theme, toggleTheme } = useTheme();
  const user = useGeneralUserStore((store) => store.user);
  const userProfile = useGeneralUserStore((store) => store.userProfile);
  const setUserProfile = useGeneralUserStore((store) => store.setUserProfile);

  async function fetchProfileData() {
    const profileData = await getProfile(user?.email);
    setUserProfile(profileData);
  }

  useEffect(() => {
    if (user && !userProfile) {
      fetchProfileData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return (
    <div className="container bg-app-background">
      {children}
      <Footer />
    </div>
  );
};

export default LoggedLayout;
