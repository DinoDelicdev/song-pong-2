"use client";
import React from "react";
import { useRecoilValue, useRecoilState } from "recoil";
import { rulesState, selectedSongsState } from "@/state/state";
import SelectedSong from "@/components/shared/SelectedSong";
import SearchSongDialog from "@/components/shared/SearchSongDialog";
import { Button } from "@/components/ui/button";
import { checkIfSongsComplyWithRules } from "@/utils/spotify";

const AddSongs = () => {
  const rules = useRecoilValue(rulesState);
  const selectedSongs = useRecoilValue(selectedSongsState);
  console.log(rules);
  return (
    <div className="h-full w-full min-h-[calc(100vh-54px)] bg-red-500 flex flex-col justify-center items-center p-5 gap-3">
      {selectedSongs.map((song) => (
        <SelectedSong key={song.id} song={song} />
      ))}
      {Array.from({ length: rules.songsPerTurn - selectedSongs.length }).map((_, index) => {
        return <SearchSongDialog key={index} />;
      })}
      <Button
        className="mt-20"
        onClick={async () => {
          let songsWithStreamNumbersResponse = await fetch("api/spotify/streams/get", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(selectedSongs),
          });
          let songsWithStreamNumbers = await songsWithStreamNumbersResponse.json();

          console.log("THIS IS IT", songsWithStreamNumbers);
          let message = checkIfSongsComplyWithRules(songsWithStreamNumbers, [], rules);
          console.log(message);
        }}
      >
        SEND GAME REQUEST
      </Button>
    </div>
  );
};

export default AddSongs;
