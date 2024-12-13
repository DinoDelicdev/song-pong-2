import { NextResponse } from "next/server";
import puppeteer from "puppeteer";

export async function POST(req) {
  try {
    const body = await req.json();
    console.log("SPOTIFY", body);
    const browser = await puppeteer.launch();

    let streamCounts = await Promise.all(
      body.map(async (song) => {
        if (song.hasOwnProperty("streams")) {
          return song;
        }
        const page = await browser.newPage();
        await page.goto(song.link, { waitUntil: "networkidle2" });
        const htmlContent = await page.content();

        let numOfStreams = htmlContent.split('data-testid="playcount">')[1].split("</span>")[0];
        return {
          ...song,
          streams: parseInt(numOfStreams.replace(/,/g, ""), 10),
        };
      })
    );
    await browser.close();
    console.log("ODGOVOR", streamCounts);

    return NextResponse.json(streamCounts);
  } catch (error) {
    console.error("Error handling POST request:", error);
    return NextResponse.json({ error: "Internal Server Error" });
  }
}
