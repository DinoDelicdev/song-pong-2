"use client";
import { useRouter } from "next/navigation";
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const GameCard = ({ gameId }) => {
  const router = useRouter();
  return (
    <Card className="w-full mt-2">
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>Card Description</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Card Content</p>
      </CardContent>
      <CardFooter
        onClick={() => {
          router.push(`games/${gameId}`);
        }}
      >
        <p>Card Footer</p>
      </CardFooter>
    </Card>
  );
};

export default GameCard;
