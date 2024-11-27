"use client";
import React, { useEffect, useState } from "react";
import { ModeToggle } from "./ModeToggle";
import { Button } from "../ui/button";
import { signOut, useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { Home } from "lucide-react";
import { useRecoilState } from "recoil";
import { userSpotifyAccountState, selectedSongsState } from "@/state/state";

const Header = () => {
  const router = useRouter();
  const [user, setUser] = useRecoilState(userSpotifyAccountState);
  const [selectedSongs, setSelectedSongs] = useRecoilState(selectedSongsState);
  const path = usePathname();
  const { data: session } = useSession();

  // Determine if the current path is the login page
  const isLogin = path === "/login";

  const handleSignOut = async () => {
    try {
      console.log("Signing out...");
      await signOut({ callbackUrl: "/login" });
      console.log("Signed out successfully, redirecting to login...");
      // redirect("/login");
    } catch (error) {
      console.error("Error during sign out:", error);
    }
  };

  return (
    <div className="bg-zinc-500 flex justify-between items-center max-h-[400px] p-2">
      {/* Show Home button only if not on login page */}
      {!isLogin && (
        <Button
          onClick={() => {
            setSelectedSongs([]);
            router.push("/");
          }}
        >
          <Home />
        </Button>
      )}
      <p>SONG PONG LOGO</p>
      <div className="flex justify-center items-center gap-2">
        <ModeToggle />
        {/* Show SignOut button only if not on login page */}
        {!isLogin && <Button onClick={handleSignOut}>SignOut</Button>}
      </div>
    </div>
  );
};

export default Header;
