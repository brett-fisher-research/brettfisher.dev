// Capture the blackjack game as an animated gif for the projects page.
// Serves the built game (../blackjack_rust/www) locally, drives one hand with
// Chrome via puppeteer-core (trusted input reaches the wasm canvas), records a
// screencast, and encodes a two-pass palette gif with ffmpeg-static. Also
// writes a static PNG frame for the reduced-motion fallback.
// Run: npm run capture:blackjack  (writes public/projects/blackjack-hero.{gif,png})
import puppeteer from "puppeteer-core";
import ffmpegPath from "ffmpeg-static";
import { execFileSync } from "node:child_process";
import { createServer } from "node:http";
import { readFile, mkdtemp, rm, copyFile, stat } from "node:fs/promises";
import { existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname, extname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const WWW = join(ROOT, "..", "blackjack_rust", "www");
const OUT_GIF = join(ROOT, "public", "projects", "blackjack-hero.gif");
const OUT_PNG = join(ROOT, "public", "projects", "blackjack-hero.png");
const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const FPS = 15;
const WIDTH = 680;
const DEBUG = !!process.env.DEBUG;
const DBG = process.env.DEBUG_DIR || tmpdir();

// Game is a fixed 800x600 canvas; drive it at that exact viewport so page
// coordinates equal in-game coordinates (dpr forced to 1).
const VW = 800;
const VH = 600;

// Button centers in game coordinates (top-left corner, absolute positions).
const BTN = {
  plus25: [116, 146],
  deal: [116, 255],
  stand: [112, 152],
};

if (!existsSync(join(WWW, "blackjack.wasm"))) {
  throw new Error(`Built game not found at ${WWW}. Run ./build.sh in blackjack_rust first.`);
}

const MIME = {
  ".html": "text/html",
  ".wasm": "application/wasm",
  ".js": "text/javascript",
  ".png": "image/png",
  ".wav": "audio/wav",
};

// Tiny static server over the www dir.
const server = createServer(async (req, res) => {
  try {
    const rel = decodeURIComponent(req.url.split("?")[0]);
    const path = join(WWW, rel === "/" ? "index.html" : rel);
    const body = await readFile(path);
    res.writeHead(200, { "content-type": MIME[extname(path)] || "application/octet-stream" });
    res.end(body);
  } catch {
    res.writeHead(404);
    res.end("not found");
  }
});
await new Promise((r) => server.listen(0, r));
const port = server.address().port;
const URL = `http://localhost:${port}`;

const work = await mkdtemp(join(tmpdir(), "bj-hero-"));
const webm = join(work, "hero.webm");

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  args: [
    "--force-device-scale-factor=1",
    "--ignore-gpu-blocklist",
    "--enable-unsafe-swiftshader",
    "--use-gl=angle",
    "--use-angle=swiftshader",
  ],
});

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

try {
  const page = await browser.newPage();
  await page.setViewport({ width: VW, height: VH, deviceScaleFactor: 1 });
  await page.goto(URL, { waitUntil: "networkidle2", timeout: 60000 });
  await page.waitForSelector("#glcanvas", { timeout: 30000 });
  await sleep(3000); // wasm load + settle

  const click = async ([x, y], label) => {
    await page.mouse.move(x, y);
    await page.mouse.down();
    await sleep(70);
    await page.mouse.up();
    await sleep(500);
    if (DEBUG && label) await page.screenshot({ path: join(DBG, `bj-${label}.png`) });
  };

  const recorder = await page.screencast({ path: webm, ffmpegPath });
  await sleep(900); // hold on the betting screen

  await click(BTN.plus25, "bet1");
  await click(BTN.plus25, "bet2"); // bet $50
  await sleep(300);
  await click(BTN.deal, "deal");
  await sleep(3200); // cards deal in

  // Static frame for the reduced-motion fallback: cards on the table, pot down.
  await page.screenshot({ path: OUT_PNG });

  await click(BTN.stand, "stand");
  await sleep(4400); // dealer plays, outcome modal, money float
  await sleep(600);

  await recorder.stop();
} finally {
  await browser.close();
  server.close();
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

await copyFile(gif, OUT_GIF);
await rm(work, { recursive: true, force: true });
const kb = Math.round((await stat(OUT_GIF)).size / 1024);
const pkb = Math.round((await stat(OUT_PNG)).size / 1024);
console.log(`wrote ${OUT_GIF} (${kb} KB) and ${OUT_PNG} (${pkb} KB)`);
