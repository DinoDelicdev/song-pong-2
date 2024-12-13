import { setTurns } from "@/utils/supabase";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    // Assuming you want to log the request body
    const body = await req.json();
    console.log("Request Body:", body);

    const turn = await setTurns(body.gameId, body.userEmail, body.tracks);
    //   console.log("FROM SUPA", game);

    return NextResponse.json({ ...turn });
  } catch (error) {
    console.error("Error handling POST request:", error);
    return NextResponse.json({ error: "Internal Server Error" });
  }
}
