import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "../ui/button";
import { DialogClose } from "@/components/ui/dialog";
import { useRecoilState } from "recoil";
import { selectedSongsState } from "@/state/state";
import { useToast } from "@/hooks/use-toast";
import { ToastClose } from "../ui/toast";
import Image from "next/image";

const FoundSong = ({ song, setFoundSongs }) => {
  const { toast } = useToast();
  const [selectedSongs, setSelectedSongs] = useRecoilState(selectedSongsState);
  return (
    <Card className="w-[98%] mt-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          {song.name}
          <Image
            className="cursor-pointer"
            src="/spotify.png"
            width={25}
            height={25}
            alt="Listen On Spotify"
            onClick={() => {
              window.open(song.link);
            }}
          />
        </CardTitle>
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
              toast({
                duration: 2500,
                title: `Added New Song`,
                description: `${song.name} by ${song.artist.reduce((acc, artist, index) => {
                  if (index < 1) {
                    return acc + artist.name;
                  } else {
                    return acc + " , " + artist.name;
                  }
                }, "")}`,
              });
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
