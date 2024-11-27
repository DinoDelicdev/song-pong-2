"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { useRecoilState } from "recoil";
import { rulesState } from "@/state/state";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

const page = () => {
  const [rules, setRules] = useRecoilState(rulesState);
  const router = useRouter();

  const handlePlaylistNameChange = (e) => {
    setRules((prevRules) => ({ ...prevRules, playlistName: e.target.value }));
  };

  const handleSongsPerTurnChange = (value) => {
    setRules((prevRules) => ({ ...prevRules, songsPerTurn: Number(value) }));
  };

  const handleStreamsMoreChange = (value) => {
    setRules((prevRules) => ({ ...prevRules, streamsMore: value }));
  };

  const handleStreamsLimitChange = (e) => {
    setRules((prevRules) => ({ ...prevRules, streamsLimit: Number(e.target.value) }));
  };

  const handleRepeatedArtistToggle = (value) => {
    setRules((prevRules) => ({ ...prevRules, repeatedArtist: value }));
  };

  const handleMonthleyListenersMoreChange = (value) => {
    setRules((prevRules) => ({ ...prevRules, monthleyListenersMore: value }));
  };

  const handleMonthleyListenersLimitChange = (e) => {
    setRules((prevRules) => ({ ...prevRules, monthleyListenersLimit: Number(e.target.value) }));
  };
  return (
    <div className="h-full w-full min-h-[calc(100vh-54px)] bg-red-500 flex flex-col justify-center items-center p-5 gap-3">
      <Card className="w-full p-2">
        <CardTitle>Theme</CardTitle>
        <CardDescription>Enter the theme of a game</CardDescription>
        <CardContent className="mt-2">
          <Input type="text" placeholder="Game Theme" onChange={handlePlaylistNameChange} />
        </CardContent>
      </Card>
      <Card className="w-full p-2">
        <CardTitle>Songs Per Turn</CardTitle>
        <CardDescription>Select the Number of Songs Per Turn</CardDescription>
        <CardContent className="mt-2">
          <RadioGroup defaultValue="2" className="flex flex-row gap-3" onValueChange={handleSongsPerTurnChange}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="1" id="option-one" />
              <Label htmlFor="option-one">1</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="2" id="option-two" />
              <Label htmlFor="option-two">2</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="3" id="option-three" />
              <Label htmlFor="option-three">3</Label>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>
      <Card className="w-full p-2">
        <CardTitle>Repeated Artist</CardTitle>
        <CardDescription>Allow or Disallow Repeated Artist</CardDescription>
        <CardContent className="mt-2">
          <div className="flex items-center space-x-2">
            <Label htmlFor="repeated-artist">Disallowed</Label>
            <Switch id="repeated-artist" onCheckedChange={handleRepeatedArtistToggle} />
            <Label htmlFor="repeated-artist">Allowed</Label>
          </div>
        </CardContent>
      </Card>
      <Card className="w-full p-2">
        <CardTitle>Number of Streams</CardTitle>
        <CardDescription>Select the Limit for Number of Streams for Selected Song</CardDescription>
        <CardContent className="mt-2">
          <div className="flex items-center gap-2">
            <p>Number of streams </p>
            <div className="flex items-center space-x-2 mt-2">
              <Label htmlFor="stream-more">Less</Label>
              <Switch id="stream-more" onCheckedChange={handleStreamsMoreChange} />
              <Label htmlFor="stream-more">More</Label>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <p>than </p>
            <Input type="number" className="max-w-[50%]" onChange={handleStreamsLimitChange} />
          </div>
        </CardContent>
      </Card>
      <Card className="w-full p-2">
        <CardTitle>Number of Monthly Listeners</CardTitle>
        <CardDescription>Select the Limit for Number of Monthly Listeners for Selected Artist</CardDescription>
        <CardContent className="mt-2">
          <div className="flex items-center gap-2">
            <p>Number of Monthly Listeners</p>
            <div className="flex items-center space-x-2 mt-2">
              <Label htmlFor="listeners-more">Less</Label>
              <Switch id="listeners-more" onCheckedChange={handleMonthleyListenersMoreChange} />
              <Label htmlFor="listeners-more">More</Label>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <p>than </p>
            <Input type="number" className="max-w-[50%]" onChange={handleMonthleyListenersLimitChange} />
          </div>
        </CardContent>
      </Card>

      <Button
        onClick={() => {
          console.log(rules);
          router.push("/add-songs");
        }}
      >
        SELECT SONGS
      </Button>
      <p>-- OR --</p>
      <Button
        onClick={() => {
          const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
          const queryString = new URLSearchParams(rules).toString();
          const shareableLink = `${baseUrl}?${queryString}`;
          console.log(shareableLink);
          navigator.clipboard
            .writeText(shareableLink)
            .then(() => {
              console.log("Link copied to clipboard!");
            })
            .catch((err) => {
              console.error("Failed to copy link: ", err);
            });
          // Optionally, you can copy the link to the clipboard or display it to the user
        }}
      >
        CREATE SHAREABLE LINK
      </Button>
    </div>
  );
};

export default page;
