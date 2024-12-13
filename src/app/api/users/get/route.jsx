import { getAllUsers } from "@/utils/supabase";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    // Assuming you want to log the request body
    const body = await req.json();
    console.log("Request Body:", body);

    const users = await getAllUsers(body.email);
    console.log("FROM SUPA", users);

    return NextResponse.json({ users: users });
  } catch (error) {
    console.error("Error handling POST request:", error);
    return NextResponse.json({ error: "Internal Server Error" });
  }
}
