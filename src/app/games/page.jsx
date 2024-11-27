"use client";
import GameCard from "@/components/shared/GameCard";
import React, { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { gamesState, userSpotifyAccountState } from "@/state/state";

const page = () => {
  const [games, setGames] = useRecoilState(gamesState);
  const user = useRecoilValue(userSpotifyAccountState);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleGamesFetching = async () => {
      if (!user) {
        console.error("User data is not available");
        return;
      }

      try {
        const response = await fetch("/api/games/get", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: user.email,
          }),
        });

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        console.log("Games", data);
        setGames(data);
      } catch (error) {
        console.error("There was a problem with the fetch operation:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      handleGamesFetching();
      const intervalId = setInterval(handleGamesFetching, 15000); // Poll every 15 seconds
      return () => clearInterval(intervalId); // Cleanup on component unmount
    }
  }, [user, setGames]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>Please log in to view your games.</div>;
  }

  return (
    <div className="flex flex-col items-center h-[calc(100vh-54px)]">
      {games.map((game) => (
        <GameCard key={game.id} gameId={game.id} />
      ))}
    </div>
  );
};

export default page;
