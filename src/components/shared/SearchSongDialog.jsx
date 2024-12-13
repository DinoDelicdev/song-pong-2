import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { selectedSongsState, userPlaylistsState } from "@/state/state";
import { useRecoilState, useRecoilValue } from "recoil";
import { useSession } from "next-auth/react";
import { searchSpotifyTracks, formatSongData, getSongsFromSpotifyPlaylist } from "@/utils/spotify";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FoundSong from "./FoundSong";
import { Card } from "../ui/card";

const SearchSongDialog = () => {
  const { data: session } = useSession();
  const [selectedSongs, setSelectedSongs] = useRecoilState(selectedSongsState);
  const userPlaylists = useRecoilValue(userPlaylistsState);
  const [userQuery, setUserQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState(userQuery);
  const [foundSongs, setFoundSongs] = useState([]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(userQuery);
    }, 300); // 300ms debounce delay

    return () => {
      clearTimeout(handler);
    };
  }, [userQuery]);

  useEffect(() => {
    if (debouncedQuery) {
      handleSearch(debouncedQuery);
    }
  }, [debouncedQuery]);

  const handleSettingUserQuery = (event) => {
    setUserQuery(event.target.value);
  };

  const handleSearch = async (query) => {
    let data = await searchSpotifyTracks(session, query);
    console.log(data);
    let formatedSongsData = data.tracks.items.map((song) => {
      return formatSongData(song);
    });

    console.log(formatedSongsData);

    setFoundSongs(formatedSongsData);
  };

  const handleFetchingSongsFromPlaylists = async (playlistId) => {
    let songsFromPlaylist = await getSongsFromSpotifyPlaylist(session, playlistId);
    let formatedSongsFromPlaylists = songsFromPlaylist.items.map((song) => {
      return formatSongData(song.track);
    });
    setFoundSongs(formatedSongsFromPlaylists);
  };

  return (
    <Dialog
      onOpenChange={() => {
        setFoundSongs([]);
      }}
    >
      <DialogTrigger asChild>
        <Button variant="outline">Add Song</Button>
      </DialogTrigger>

      <DialogContent aria-describedby={undefined} className="max-w-[90vw] w-[90vw] h-[90vh] flex flex-col  items-center">
        <Tabs
          defaultValue="search"
          className="w-full flex flex-col max-h-[90%]"
          onValueChange={() => {
            setFoundSongs([]);
          }}
        >
          <TabsList>
            <TabsTrigger value="search">
              <b>Search Song</b>
            </TabsTrigger>
            <TabsTrigger value="playlist">
              <b>Add Song from Playlist</b>
            </TabsTrigger>
          </TabsList>
          <TabsContent value="search" className="h-full w-full">
            <DialogHeader className="mb-0 h-full w-full">
              <DialogTitle>Search Songs</DialogTitle>
              {/* <DialogDescription></DialogDescription> */}
              <Input placeholder="Search Song" onChange={handleSettingUserQuery} />
              <ScrollArea className="w-full h-[80%] mt-3">
                {foundSongs.map((song) => {
                  return <FoundSong key={song.id} song={song} setFoundSongs={setFoundSongs} />;
                })}
              </ScrollArea>
            </DialogHeader>
          </TabsContent>
          <TabsContent value="playlist" className="h-full w-full">
            <DialogHeader className="mb-0 h-full w-full">
              <DialogTitle>Add Song From Playlist</DialogTitle>
              {/* <DialogDescription></DialogDescription> */}
              <div className="w-full flex flex-nowrap gap-2 min-h-10 overflow-x-auto overflow-hidden items-center scrollbar-hide">
                {userPlaylists.length
                  ? userPlaylists.map((playlist) => {
                      return (
                        <Card
                          key={playlist.id}
                          className="bg-black text-white p-2 cursor-pointer h-full whitespace-nowrap"
                          onClick={async () => {
                            console.log(playlist.id);
                            await handleFetchingSongsFromPlaylists(playlist.id);
                          }}
                        >
                          {playlist.name}
                        </Card>
                      );
                    })
                  : "You have no playlists"}
              </div>

              <ScrollArea className="w-full h-[80%] mt-3">
                {foundSongs.map((song) => {
                  return <FoundSong key={song.id} song={song} setFoundSongs={setFoundSongs} />;
                })}
              </ScrollArea>
            </DialogHeader>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default SearchSongDialog;
