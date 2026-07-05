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

  it("uses the captured hero screenshot", () => {
    expect(pageSrc).toContain("/projects/duree-hero.png");
  });

  it("keeps styling in globals.css classes, not inline styles", () => {
    expect(pageSrc).not.toContain("style={{");
    expect(cssSrc).toContain(".featured__card");
    expect(cssSrc).toContain(".section-label");
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
