import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";
import { join } from "path";

const root = join(__dirname, "..", "..");
const pageSrc = readFileSync(join(root, "app", "projects", "page.tsx"), "utf8");
const layoutSrc = readFileSync(join(root, "app", "layout.tsx"), "utf8");
const cssSrc = readFileSync(join(root, "app", "globals.css"), "utf8");

describe("/projects page", () => {
  it("features Duree with a duree.dev link", () => {
    expect(pageSrc).toContain("Duree");
    expect(pageSrc).toContain('href="https://duree.dev"');
  });

  it("opens the duree.dev link in a new tab with noopener", () => {
    expect(pageSrc).toContain('target="_blank"');
    expect(pageSrc).toContain('rel="noopener noreferrer"');
  });

  it("uses the animated hero gif with a reduced-motion PNG fallback", () => {
    expect(pageSrc).toContain("/projects/duree-hero.gif");
    expect(pageSrc).toContain("/projects/duree-hero.png");
    expect(pageSrc).toContain("prefers-reduced-motion: reduce");
  });

  it("uses the approved blurb, no em dashes, no FEATURED label", () => {
    expect(pageSrc).toContain("optional paid cross-device sync");
    expect(pageSrc).not.toContain("—");
    expect(pageSrc).not.toMatch(/Featured/);
  });

  it("keeps styling in globals.css classes, not inline styles", () => {
    expect(pageSrc).not.toContain("style={{");
    expect(cssSrc).toContain(".featured__card");
    expect(cssSrc).toContain(".section-label");
  });

  it("features Blackjack linking its GitHub repo", () => {
    expect(pageSrc).toContain("Blackjack");
    expect(pageSrc).toContain(
      'href="https://github.com/brett-fisher-research/blackjack_rust"',
    );
  });

  it("uses the animated blackjack gif with a reduced-motion PNG fallback", () => {
    expect(pageSrc).toContain("/projects/blackjack-hero.gif");
    expect(pageSrc).toContain("/projects/blackjack-hero.png");
  });
});

describe("hero gif asset", () => {
  const gif = readFileSync(join(root, "public", "projects", "duree-hero.gif"));

  it("is a GIF89a", () => {
    expect(gif.subarray(0, 6).toString("ascii")).toBe("GIF89a");
  });

  it("is animated (multiple frames) and loops", () => {
    // Count Graphic Control Extension blocks (0x21 0xF9 0x04) — one per frame.
    let frames = 0;
    for (let i = 0; i < gif.length - 2; i++) {
      if (gif[i] === 0x21 && gif[i + 1] === 0xf9 && gif[i + 2] === 0x04)
        frames++;
    }
    expect(frames).toBeGreaterThan(1);
    expect(gif.includes(Buffer.from("NETSCAPE2.0"))).toBe(true);
  });

  it("stays under 5MB", () => {
    expect(gif.length).toBeLessThan(5 * 1024 * 1024);
  });
});

describe("blackjack hero gif asset", () => {
  const gif = readFileSync(
    join(root, "public", "projects", "blackjack-hero.gif"),
  );

  it("is a GIF89a", () => {
    expect(gif.subarray(0, 6).toString("ascii")).toBe("GIF89a");
  });

  it("is animated (multiple frames) and loops", () => {
    let frames = 0;
    for (let i = 0; i < gif.length - 2; i++) {
      if (gif[i] === 0x21 && gif[i + 1] === 0xf9 && gif[i + 2] === 0x04)
        frames++;
    }
    expect(frames).toBeGreaterThan(1);
    expect(gif.includes(Buffer.from("NETSCAPE2.0"))).toBe(true);
  });

  it("stays under 5MB", () => {
    expect(gif.length).toBeLessThan(5 * 1024 * 1024);
  });
});

describe("site nav", () => {
  it("renders Projects before About", () => {
    const projectsIdx = layoutSrc.indexOf('href="/projects"');
    const aboutIdx = layoutSrc.indexOf('href="/about"');
    expect(projectsIdx).toBeGreaterThan(-1);
    expect(aboutIdx).toBeGreaterThan(-1);
    expect(projectsIdx).toBeLessThan(aboutIdx);
  });
});
