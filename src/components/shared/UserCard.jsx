"use client";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "../ui/button";
import { useRecoilValue, useRecoilState } from "recoil";
import { rulesState, userSpotifyAccountState, selectedSongsState } from "@/state/state";
import { createPlaylist, addTracksToPlaylist } from "@/utils/spotify";
import { useRouter } from "next/navigation";

const UserCard = ({ user, session }) => {
  const router = useRouter();
  const [rules, setRules] = useRecoilState(rulesState);
  const currentUser = useRecoilValue(userSpotifyAccountState);
  const [selectedSongs, setSelectedSongs] = useRecoilState(selectedSongsState);

  const handleGameRequest = async () => {
    let playlist = await createPlaylist(currentUser.id, currentUser.username, user.user_name, session, rules.playlistName);
    let addedSongs = await addTracksToPlaylist(session, playlist.id, selectedSongs);
    let newGameResponse = await fetch("/api/games/new", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        senderEmail: currentUser.email,
        recieverEmail: user.email,
        playlistId: playlist.id,
        rules: rules,
        senderName: currentUser.username,
        recieverName: user.user_name,
        playlistUrl: playlist.external_urls.spotify,
      }),
    });
    let newGame = await newGameResponse.json();
    console.log(newGame);

    const turnResponse = await fetch("api/turns/set", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        gameId: newGame.game[0].id,
        userEmail: currentUser.email,
        tracks: selectedSongs.map((song) => song.uri),
      }),
    });
    const turn = await turnResponse.json();

    console.log("TURN", turn);
    setSelectedSongs([]);
    setRules({
      playlistName: "",
      songsPerTurn: 2,
      streamsMore: false,
      streamsLimit: 1,
      repeatedArtist: false,
      monthleyListenersMore: false,
      monthleyListenersLimit: 1,
    });

    if (turn) {
      router.push("/");
    }
  };
  return (
    <Card className="w-[90%]">
      <CardHeader className="flex justify-center items-center">
        <CardTitle className="flex justify-center items-center gap-4">
          <Avatar>
            <AvatarFallback className="bg-slate-500">{user.user_name[0]}</AvatarFallback>
          </Avatar>
          {user.user_name}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex justify-center">
        <Button
          className="w-[90%]"
          onClick={async () => {
            await handleGameRequest();
          }}
        >
          Send Request
        </Button>
      </CardContent>
    </Card>
  );
};

export default UserCard;
