"use client";
import { useRouter } from "next/navigation";
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "../ui/button";
import { Swords } from "lucide-react";
import Image from "next/image";

const GameCard = ({ game }) => {
  const router = useRouter();
  const rules = JSON.parse(game.rules);
  return (
    <Card className="w-full mt-2">
      <CardHeader className="flex flex-col items-center">
        <CardTitle
          className="cursor-pointer flex gap-4 items-center"
          onClick={() => {
            console.log();
          }}
        >
          {rules.playlistName}
          <Image
            src="/spotify.png"
            width={25}
            height={25}
            alt="Picture of the author"
            onClick={() => {
              window.open(game.spotify_playlist_url);
            }}
          />
        </CardTitle>
      </CardHeader>
      <CardContent className="flex justify-center items-center gap-3">
        <Avatar>
          <AvatarFallback className="bg-slate-400 text-black">{game.sender_name[0]}</AvatarFallback>
        </Avatar>
        <p>{game.sender_name}</p> <Swords /> <p>{game.reciever_name}</p>
        <Avatar>
          <AvatarFallback className="bg-black text-white">{game.reciever_name[0]}</AvatarFallback>
        </Avatar>
      </CardContent>
      <CardFooter>
        <Button
          className="w-full"
          onClick={() => {
            router.push(`games/${game.id}`);
          }}
        >
          SEE
        </Button>
      </CardFooter>
    </Card>
  );
};

export default GameCard;
