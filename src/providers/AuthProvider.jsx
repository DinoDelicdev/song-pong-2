"use client";
import React from "react";
import { SessionProvider } from "next-auth/react";

function AuthProvider({ children }) {
  return <SessionProvider refetchInterval={15 * 60}>{children}</SessionProvider>;
}

export default AuthProvider;
