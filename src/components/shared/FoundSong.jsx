import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "../ui/button";
import { DialogClose } from "@/components/ui/dialog";
import { useRecoilState } from "recoil";
import { selectedSongsState } from "@/state/state";

const FoundSong = ({ song, setFoundSongs }) => {
  const [selectedSongs, setSelectedSongs] = useRecoilState(selectedSongsState);
  return (
    <Card className="w-[98%] mt-4">
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
        <DialogClose asChild>
          <Button
            onClick={() => {
              console.log(song);
              setSelectedSongs([...selectedSongs, song]);
              setFoundSongs([]);
            }}
          >
            ADD
          </Button>
        </DialogClose>
      </CardFooter>
    </Card>
  );
};

export default FoundSong;
