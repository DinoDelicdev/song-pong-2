import { checkIfUserRegistered, reisterUserIntoUsersTable } from "@/utils/supabase";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    // Assuming you want to log the request body
    const body = await req.json();
    console.log("Request Body:", body);

    const users = await checkIfUserRegistered(body.email);
    console.log("FROM SUPA", users);
    if (users.length) {
      return NextResponse.json({ message: "Data received successfully" });
    } else {
      const user = await reisterUserIntoUsersTable(body.username, body.email);
      if (user) {
        console.log(user);
        return NextResponse.json({ message: "Data received successfully" });
      } else {
        return NextResponse.json({ message: "Shit happened" });
      }
    }
  } catch (error) {
    console.error("Error handling POST request:", error);
    return NextResponse.json({ error: "Internal Server Error" });
  }
}
