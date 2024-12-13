"use client";
import { Button } from "@/components/ui/button";
import { useSession, signOut } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";
import { useRecoilValue } from "recoil";
import { userSpotifyAccountState } from "@/state/state";

export default function HomePage() {
  const router = useRouter();
  const { data: session } = useSession();
  const user = useRecoilValue(userSpotifyAccountState);
  return (
    <div className="w-full h-[calc(100dvh-54px)] flex flex-col justify-center items-center gap-2">
      <h2 className="text-lg">Welcome:</h2>
      {user && user.images.length ? (
        <Avatar className="w-30 h-30 bg-blue-700">
          {" "}
          <AvatarImage src={user.images[0].url} alt="@shadcn" />{" "}
        </Avatar>
      ) : (
        ""
      )}
      {user && !user.images.length ? (
        <Avatar>
          <AvatarFallback>{user ? user.username[0] : "?"}</AvatarFallback>
        </Avatar>
      ) : (
        ""
      )}
      <h1 className="text-[2rem]">{user && user.username ? user.username : ""}</h1>

      <h1>SONG PONG</h1>
      <Button
        onClick={() => {
          console.log(session);
          console.log(user);
        }}
      >
        See
      </Button>
      <Button
        onClick={() => {
          router.push("/games");
        }}
      >
        See Games
      </Button>
      <Button
        onClick={() => {
          router.push("/rules");
        }}
      >
        Start New Game
      </Button>
    </div>
  );
}
