"use client";
import { useEffect, useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useRecoilState } from "recoil";
import { userSpotifyAccountState, userPlaylistsState } from "@/state/state";
import { Button } from "@/components/ui/button";
import { getUserData, getUserPlaylists } from "@/utils/spotify";

const Login = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userSpotifyAccount, setUserSpotifyAccount] = useRecoilState(userSpotifyAccountState);
  const [userPlayists, setUserPlaylists] = useRecoilState(userPlaylistsState);

  useEffect(() => {
    if (session) {
      const handleRegistration = async () => {
        try {
          const response = await fetch("/api/users/new", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: session.user?.email,
              username: session.user?.name,
            }),
          });

          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          const data = await response.json();
          console.log(data);
          let userDataResponse = await getUserData(session);
          setUserSpotifyAccount({
            email: userDataResponse.email,
            id: userDataResponse.id,
            username: userDataResponse.display_name,
            images: userDataResponse.images,
          });

          let playlists = await getUserPlaylists(session, userDataResponse.id);
          console.log(playlists);
          setUserPlaylists(playlists);
          setIsLoading(false);
          console.log("LOCAL", localStorage.getItem("sharedLinkUrl"));
          if (localStorage.getItem("sharedLinkUrl")) {
            console.log("USAO");
            let url = localStorage.getItem("sharedLinkUrl");
            console.log("Attempting to navigate to URL:", url);
            try {
              router.push(url);
            } catch (error) {
              console.error("Navigation error:", error);
            }
            localStorage.clear();
          } else {
            router.push("/");
          }
        } catch (error) {
          console.error("There was a problem with the fetch operation:", error);
        } finally {
          setIsLoading(false);
        }
      };

      setIsLoading(true);
      handleRegistration();
    }
  }, [session, router, setUserPlaylists, setUserSpotifyAccount]);

  const handleSignIn = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await signIn();
      if (result?.error) {
        setError("Sign-in error: " + result.error);
        console.error("Sign-in error:", result.error);
      }
    } catch (error) {
      setError("Error during sign-in");
      console.error("Error during sign-in:", error);
    }
  };

  return (
    <div className="w-full h-[calc(100vh-54px)] flex justify-center items-center">
      <Button onClick={handleSignIn} disabled={isLoading}>
        {isLoading ? (
          <div className="flex items-center">
            <span className="loader mr-2"></span> Signing In...
          </div>
        ) : (
          "Sign In"
        )}
      </Button>
      {error && <p className="text-red-500 mt-4">{error}</p>}
    </div>
  );
};

export default Login;
