import React from "react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const RulesSheet = ({ rules }) => {
  return (
    <Sheet>
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
    </Sheet>
  );
};

export default RulesSheet;
