import { getAllGamesByUser } from "@/utils/supabase";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    // Assuming you want to log the request body
    const body = await req.json();

    const games = await getAllGamesByUser(body.email);

    return NextResponse.json(games);
  } catch (error) {
    console.error("Error handling POST request:", error);
    return NextResponse.json({ error: "Internal Server Error" });
  }
}
