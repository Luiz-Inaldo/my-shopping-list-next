"use client";
import React from "react";
import LoggedLayout from "@/components/layout/LoggedLayout";
import Main from "@/components/Main";
import SessionVerifier from "@/components/SessionVerifier";

export default function Home() {

  return (
    <>
      <SessionVerifier>
        <LoggedLayout>
          <Main />
        </LoggedLayout>
      </SessionVerifier>
    </>
  );
}
