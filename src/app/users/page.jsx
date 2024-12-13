"use client";
import React, { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { selectedSongsState, userSpotifyAccountState } from "@/state/state";
import UserCard from "@/components/shared/UserCard";
import { useSession } from "next-auth/react";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const currentUser = useRecoilValue(userSpotifyAccountState);
  const { data: session } = useSession();
  useEffect(() => {
    setIsLoading(true);
    const handleUserFetching = async () => {
      try {
        const response = await fetch("/api/users/get", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: currentUser.email,
          }),
        });

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        console.log("USERS", data);
        setUsers(data.users);
      } catch (error) {
        console.error("There was a problem with the fetch operation:", error);
      }
    };
    handleUserFetching();
  }, []);
  return (
    <div className="flex flex-col items-center mt-8">
      {users.map((user) => {
        return <UserCard key={user.id} user={user} session={session} />;
      })}
    </div>
  );
};

export default Users;
