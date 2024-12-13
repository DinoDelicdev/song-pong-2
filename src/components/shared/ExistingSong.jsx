"use client";
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";

const ExistingSong = ({ song }) => {
  return (
    <Card className="w-[90%] mt-4">
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
    </Card>
  );
};

export default ExistingSong;
