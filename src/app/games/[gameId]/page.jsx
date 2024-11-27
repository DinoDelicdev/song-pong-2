"use client";
import { useRecoilValue } from "recoil";
import { gameByIdState, userSpotifyAccountState } from "@/state/state";
import { useSession } from "next-auth/react";
import { getSongsFromSpotifyPlaylist } from "@/utils/spotify";

const Game = ({ params }) => {
  const { data: session } = useSession();
  const game = useRecoilValue(gameByIdState(Number(params.gameId)));
  const user = useRecoilValue(userSpotifyAccountState);
  console.log(session);
  console.log(game);
  console.log(user);
  return <div>Hellloooooo</div>;
};

export default Game;
