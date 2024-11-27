"use client";
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useRecoilState } from "recoil";
import { selectedSongsState } from "@/state/state";
import { Button } from "../ui/button";

const SelectedSong = ({ song }) => {
  const [selectedSongs, setSelectedSongs] = useRecoilState(selectedSongsState);
  const handleSongRemoval = () => {
    console.log(song.id);
    setSelectedSongs(selectedSongs.filter((selectedSong) => selectedSong.id !== song.id));
  };
  return (
    <Card className="w-[90%] mt-4">
      <CardHeader>
        <CardTitle>{song.name}</CardTitle>
        <CardDescription>
          {song.artist.reduce((acc, artist, index) => {
            if (index < 1) {
              return acc + artist.name;
            } else {
              return acc + " , " + artist.name;
            }
          }, "")}
        </CardDescription>
      </CardHeader>
      <CardFooter>
        <Button onClick={handleSongRemoval}>REMOVE</Button>
      </CardFooter>
    </Card>
  );
};

export default SelectedSong;
