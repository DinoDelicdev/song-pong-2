import { NextResponse } from "next/server";
import puppeteer from "puppeteer";

export async function POST(req) {
  try {
    const body = await req.json();
    console.log("SPOTIFY", body);
    const browser = await puppeteer.launch();

    let songsWithNumberOfMonthlyListeners = await Promise.all(
      body.map(async (song) => {
        const updatedArtists = await Promise.all(
          song.artist.map(async (artist) => {
            if (artist.hasOwnProperty("numberOfMonthlyListeners") && artist.numberOfMonthlyListeners !== 0) {
              return artist;
            }
            const page = await browser.newPage();
            await page.goto(artist.link, { waitUntil: "networkidle2" });

            const numOfMonthlyListeners = await page.evaluate(() => {
              // Update the selector to a more reliable one
              const element = document.querySelector('span[data-testid="entityTitle"]').nextElementSibling;

              return element ? element.textContent.split(" monthly listeners")[0] : "0";
            });
            console.log(numOfMonthlyListeners);
            return {
              ...artist,
              numberOfMonthlyListeners: parseInt(numOfMonthlyListeners.replace(/,/g, ""), 10),
            };
          })
        );
        return { ...song, artist: updatedArtists };
      })
    );

    await browser.close();

    return NextResponse.json(songsWithNumberOfMonthlyListeners);
  } catch (error) {
    console.error("Error handling POST request:", error);
    return NextResponse.json({ error: "Internal Server Error" });
  }
}
