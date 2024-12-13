"use client";
import React, { useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useRecoilState, useRecoilValue } from "recoil";
import { rulesState, userSpotifyAccountState, selectedSongsState } from "@/state/state";
import RulesSheet from "@/components/shared/RulesSheet";
import SearchSongDialog from "@/components/shared/SearchSongDialog";
import SelectedSong from "@/components/shared/SelectedSong";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { checkIfSongsComplyWithRules, createPlaylist, addTracksToPlaylist } from "@/utils/spotify";

const SharedPage = () => {
  const currentUser = useRecoilValue(userSpotifyAccountState);
  const { data: session } = useSession();
  const { toast } = useToast();
  const router = useRouter();
  const params = useSearchParams();
  const completeUrl = usePathname();
  const [selectedSongs, setSelectedSongs] = useRecoilState(selectedSongsState);
  const [addedSongsComply, setAddedSongsComply] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const user = {
    email: params.get("playerEmail"),
    user_name: params.get("userName"),
  };
  const rules = {
    playlistName: params.get("playlistName"),
    songsPerTurn: Number(params.get("songsPerTurn")),
    streamsMore: params.get("streamsMore"),
    streamsLimit: Number(params.get("streamsLimit")),
    repeatedArtist: params.get("repeatedArtist"),
    monthleyListenersMore: params.get("monthleyListenersMore"),
    monthleyListenersLimit: Number(params.get("monthleyListenersLimit")),
  };

  if (!session) {
    const queryString = new URLSearchParams(rules).toString();
    let sharedLinkUrl = `${process.env.NEXT_PUBLIC_BASE_URL}${completeUrl}?playerEmail=${user.email}&userName=${user.user_name}&${queryString}`;
    localStorage.setItem("sharedLinkUrl", sharedLinkUrl);
    router.push("/login");
    return null;
  }

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
    if (turn) {
      router.push("/");
    }
  };

  return (
    <div className="h-full w-full min-h-[calc(100vh-54px)] flex flex-col justify-center items-center p-5 gap-3">
      {selectedSongs.map((song) => (
        <SelectedSong key={song.id} song={song} />
      ))}
      {Array.from({ length: rules.songsPerTurn - selectedSongs.length }).map((_, index) => {
        return <SearchSongDialog key={index} />;
      })}
      {addedSongsComply && selectedSongs.length ? (
        <Button
          className="mt-20"
          onClick={async () => {
            console.log(addedSongsComply);
            await handleGameRequest();
          }}
        >
          Reply
        </Button>
      ) : (
        <Button
          className="mt-20"
          onClick={async () => {
            console.log("HEEEEEEEEEEE", selectedSongs);
            setIsLoading(true);
            try {
              let songsWithStreamNumbersResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/spotify/streams/get`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(selectedSongs),
                cache: "no-cache",
              });
              let songsWithStreamNumbers = await songsWithStreamNumbersResponse.json();
              setSelectedSongs(songsWithStreamNumbers);

              let songsWithArtistMonthleyListenersNumberResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/spotify/listeners/get`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(songsWithStreamNumbers),
                cache: "no-cache",
              });
              let songsWithArtistMonthleyListenersNumber = await songsWithArtistMonthleyListenersNumberResponse.json();
              setSelectedSongs(songsWithArtistMonthleyListenersNumber);
              console.log("THIS IS IT", songsWithArtistMonthleyListenersNumber);
              let message = checkIfSongsComplyWithRules(songsWithArtistMonthleyListenersNumber, [], rules);
              console.log(message);
              setAddedSongsComply(message.complies);

              // Ensure toast is called after all async operations
              toast({
                variant: message.complies ? "success" : "destructive",
                duration: message.complies ? 1000 : 5000,
                title: message.complies ? "All songs comply with the rules" : "Songs not complying with the rules",
                description: message.message,
                action: <ToastAction altText="Goto schedule to undo">Undo</ToastAction>,
              });
            } catch (error) {
              console.error("Error fetching songs or checking rules:", error);
            } finally {
              setIsLoading(false);
            }
          }}
        >
          CHECK IF SONGS COMPLY WITH RULES
        </Button>
      )}
      <Button
        onClick={() => {
          console.log(rules);
          console.log(user);
        }}
      >
        Seeeee
      </Button>
      <RulesSheet rules={rules} />
    </div>
  );
};

export default SharedPage;
