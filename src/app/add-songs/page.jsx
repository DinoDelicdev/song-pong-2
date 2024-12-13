"use client";
import React, { useState } from "react";
import { useRecoilValue, useRecoilState } from "recoil";
import { rulesState, selectedSongsState } from "@/state/state";

import { useRouter } from "next/navigation";
import MusicLoader from "@/components/shared/MusicLoader";
import SelectedSong from "@/components/shared/SelectedSong";
import SearchSongDialog from "@/components/shared/SearchSongDialog";
import { Button } from "@/components/ui/button";
import { checkIfSongsComplyWithRules } from "@/utils/spotify";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import RulesSheet from "@/components/shared/RulesSheet";

const AddSongs = () => {
  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const rules = useRecoilValue(rulesState);
  const [selectedSongs, setSelectedSongs] = useRecoilState(selectedSongsState);
  console.log(rules);
  return (
    <div className="h-full w-full min-h-[calc(100vh-54px)] flex flex-col justify-center items-center p-5 gap-3">
      {selectedSongs.map((song) => (
        <SelectedSong key={song.id} song={song} />
      ))}
      {Array.from({ length: rules.songsPerTurn - selectedSongs.length }).map((_, index) => {
        return <SearchSongDialog key={index} />;
      })}

      {isLoading ? (
        <div className="mt-20">
          <MusicLoader></MusicLoader>
        </div>
      ) : (
        <Button
          className="mt-20"
          onClick={async () => {
            setIsLoading(true);
            try {
              let songsWithStreamNumbersResponse = await fetch("api/spotify/streams/get", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(selectedSongs),
                cache: "no-cache",
              });
              let songsWithStreamNumbers = await songsWithStreamNumbersResponse.json();
              setSelectedSongs(songsWithStreamNumbers);

              let songsWithArtistMonthleyListenersNumberResponse = await fetch("api/spotify/listeners/get", {
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
              if (message.complies) {
                router.push("/users");
              }
              //Ensure toast is called after all async operations
              toast({
                variant: message.complies ? "sucess" : "destructive",
                duration: message.complies ? 1000 : 5000,
                title: message.complies ? "All songs comply with the rules" : "Songs not compling with the rules",
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
          SEND GAME REQUEST
        </Button>
      )}
      {isLoading ? <p>Checking if songs comply with rules</p> : ""}

      <RulesSheet rules={rules} />

      {/* <Sheet>
        <SheetTrigger className="absolute bottom-2 left-2">
          <Avatar className="w-16 h-16">
            <AvatarFallback className="bg-zinc-400">
              <b>RULES</b>
            </AvatarFallback>
          </Avatar>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>RULES</SheetTitle>
            <SheetDescription>
              List of rules for <b>{rules.playlistName ? rules.playlistName : "Unnamed"}</b>
            </SheetDescription>
          </SheetHeader>
          <ul className="flex flex-col gap-3 mt-4 text-lg">
            <li>
              <b>{rules.songsPerTurn}</b> songs per Turn
            </li>
            <li>
              <b>{rules.repeatedArtist ? "" : "No"}</b> Repeated Artist <b>{rules.repeatedArtist ? "Allowed" : ""}</b>
            </li>
            <li>
              Number of streams <b>{rules.streamsMore ? "more" : "less"}</b> than <b>{rules.streamsLimit}</b>
            </li>
            <li>
              Number of monthley listeners <b>{rules.monthleyListenersMore ? "more" : "less"}</b> than <b>{rules.monthleyListenersLimit}</b>
            </li>
          </ul>
        </SheetContent>
      </Sheet> */}
    </div>
  );
};

export default AddSongs;
