// import { NextResponse } from "next/server";
// import puppeteer from "puppeteer";

// export async function POST(req) {
//   try {
//     const body = await req.json();
//     console.log("SPOTIFY", body);

//     let streamCounts = await Promise.all(
//       body.map(async (song) => {
//         const browser = await puppeteer.launch();
//         const page = await browser.newPage();
//         await page.goto(song.link, { waitUntil: "networkidle2" });
//         const htmlContent = await page.content();
//         await browser.close();
//         let numOfStreams = htmlContent.split('data-testid="playcount">')[1].split("</span>")[0];
//         return {
//           ...song,
//           streams: parseInt(numOfStreams.replace(/,/g, ""), 10),
//         };
//       })
//     );

//     console.log("ODGOVOR", streamCounts);

//     return NextResponse.json(streamCounts);
//   } catch (error) {
//     console.error("Error handling POST request:", error);
//     return NextResponse.json({ error: "Internal Server Error" });
//   }
// }

import { NextResponse } from "next/server";
import puppeteer from "puppeteer";

export async function POST(req) {
  try {
    const body = await req.json();
    console.log("SPOTIFY", body);

    const browser = await puppeteer.launch();

    const streamCounts = await Promise.all(
      body.map(async (song) => {
        const page = await browser.newPage();

        // Enable request interception
        await page.setRequestInterception(true);
        page.on("request", (req) => {
          if (["image", "stylesheet", "font"].includes(req.resourceType())) {
            req.abort();
          } else {
            req.continue();
          }
        });

        await page.goto(song.link, { waitUntil: "networkidle2" });
        const htmlContent = await page.content();
        console.log(htmlContent);
        await page.close();

        const numOfStreams = htmlContent.split('data-testid="playcount">')[1].split("</span>")[0];
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
