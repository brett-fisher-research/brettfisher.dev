// Capture the live duree.dev hero animation as an animated gif.
// Records the .hero-visual element with Chrome (puppeteer-core screencast),
// then encodes a two-pass palette gif with ffmpeg-static.
// Run: npm run capture:hero  (writes public/projects/duree-hero.gif)
import puppeteer from "puppeteer-core";
import ffmpegPath from "ffmpeg-static";
import { execFileSync } from "node:child_process";
import { mkdtempSync, rmSync, copyFileSync, statSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT_GIF = join(ROOT, "public", "projects", "duree-hero.gif");
const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const URL = "https://duree.dev";
const SECONDS = 8; // roughly one loop; seam jump accepted
const FPS = 15;
const WIDTH = 680;

const work = mkdtempSync(join(tmpdir(), "duree-hero-"));
const webm = join(work, "hero.webm");

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  args: ["--force-device-scale-factor=1"],
});

try {
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
  await page.goto(URL, { waitUntil: "networkidle2", timeout: 60000 });
  await page.waitForSelector(".hero-visual", { timeout: 30000 });
  await page.evaluate(() =>
    document.querySelector(".hero-visual").scrollIntoView({ block: "center" })
  );
  // Let the GSAP animation start and settle into its loop.
  await new Promise((r) => setTimeout(r, 2000));

  const rect = await page.evaluate(() => {
    const r = document.querySelector(".hero-visual").getBoundingClientRect();
    return { x: r.x, y: r.y, width: r.width, height: r.height };
  });

  const recorder = await page.screencast({
    path: webm,
    ffmpegPath,
    crop: {
      x: Math.round(rect.x),
      y: Math.round(rect.y),
      width: Math.round(rect.width),
      height: Math.round(rect.height),
    },
  });
  await new Promise((r) => setTimeout(r, SECONDS * 1000));
  await recorder.stop();
} finally {
  await browser.close();
}

// Two-pass palette encode: webm -> gif.
const palette = join(work, "palette.png");
const gif = join(work, "hero.gif");
const filters = `fps=${FPS},scale=${WIDTH}:-1:flags=lanczos`;
execFileSync(ffmpegPath, [
  "-y", "-i", webm,
  "-vf", `${filters},palettegen=stats_mode=diff`,
  "-update", "1", "-frames:v", "1",
  palette,
]);
execFileSync(ffmpegPath, [
  "-y", "-i", webm, "-i", palette,
  "-lavfi", `${filters}[x];[x][1:v]paletteuse=dither=bayer:bayer_scale=4`,
  "-loop", "0",
  gif,
]);

copyFileSync(gif, OUT_GIF);
rmSync(work, { recursive: true, force: true });
const kb = Math.round(statSync(OUT_GIF).size / 1024);
console.log(`wrote ${OUT_GIF} (${kb} KB)`);
