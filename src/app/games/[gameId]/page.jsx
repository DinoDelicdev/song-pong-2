"use client";
import { useEffect, useState } from "react";
import { useRecoilValue, useRecoilState } from "recoil";
import { gameByIdState, selectedSongsState, userSpotifyAccountState } from "@/state/state";
import { useSession } from "next-auth/react";
import { getSongsFromSpotifyPlaylist, formatSongData, checkIfUsersTurn, addTracksToPlaylist } from "@/utils/spotify";
import ExistingSong from "@/components/shared/ExistingSong";
import RulesSheet from "@/components/shared/RulesSheet";
import SearchSongDialog from "@/components/shared/SearchSongDialog";
import SelectedSong from "@/components/shared/SelectedSong";
import { useRouter } from "next/navigation";
import MusicLoader from "@/components/shared/MusicLoader";
import { Button } from "@/components/ui/button";
import { checkIfSongsComplyWithRules } from "@/utils/spotify";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";

const Game = ({ params }) => {
  const { data: session } = useSession();
  const game = useRecoilValue(gameByIdState(Number(params.gameId)));
  const user = useRecoilValue(userSpotifyAccountState);
  const [selectedSongs, setSelectedSongs] = useRecoilState(selectedSongsState);
  const [existingSongs, setExistingSongs] = useState([]);
  const rules = JSON.parse(game.rules);
  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [addedSongsComply, setAddedSongsComply] = useState(false);

  const isUsersTurn = checkIfUsersTurn(user.email, game.players);

  useEffect(() => {
    const handleSongFetching = async () => {
      const songs = await getSongsFromSpotifyPlaylist(session, game.spotify_playlist_id);
      let formatedSongsData = songs.items.map((song) => {
        return formatSongData(song.track);
      });
      setExistingSongs(formatedSongsData);
    };

    handleSongFetching();
  }, []);

  const handleCompliesSetting = () => {
    setAddedSongsComply(false);
  };

  const handleReplyMove = async () => {
    let newGameInfo = { ...game };
    newGameInfo.players = [...newGameInfo.players].reverse();
    const gameUpdateResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/games/update`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        gameID: newGameInfo.id,
        players: newGameInfo.players,
        status: "active",
      }),
    });
    let updatedGame = await gameUpdateResponse.json();
    let songs = await addTracksToPlaylist(session, game.spotify_playlist_id, selectedSongs);

    const turnResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/turns/set`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        gameId: game.id,
        userEmail: session.user.email,
        tracks: selectedSongs.map((song) => song.uri),
      }),
    });
    setSelectedSongs([]);
    router.push("/");
  };
  return (
    <div className="h-full w-full min-h-[calc(100vh-54px)] flex flex-col items-center gap-5">
      {existingSongs.map((song) => {
        return <ExistingSong key={song.id} song={song} />;
      })}
      {isUsersTurn ? (
        <>
          {selectedSongs.map((song) => (
            <SelectedSong key={song.id} song={song} handleCompliesSetting={handleCompliesSetting} />
          ))}
          {Array.from({ length: rules.songsPerTurn - selectedSongs.length }).map((_, index) => {
            return <SearchSongDialog key={index} />;
          })}
          {isLoading ? (
            <div className="mt-20">
              <MusicLoader />
            </div>
          ) : addedSongsComply && selectedSongs.length ? (
            <Button
              className="mt-20"
              onClick={async () => {
                console.log(addedSongsComply);
                await handleReplyMove();
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
                  let message = checkIfSongsComplyWithRules(songsWithArtistMonthleyListenersNumber, existingSongs, rules);
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
        </>
      ) : (
        <p>Not your turn</p>
      )}
      <RulesSheet rules={rules} />
    </div>
  );
};

export default Game;
