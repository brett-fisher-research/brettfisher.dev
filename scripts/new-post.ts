#!/usr/bin/env tsx
// new:post — scaffold a new blog post in _posts/ dated today.
//
// Creates `_posts/<YYYY-MM-DD>-untitled.md` (local date) with a minimal
// frontmatter template ready for the author. The `untitled` slug is a
// deliberate placeholder that the build-step guard (check-untitled.ts) refuses
// to ship, so a forgotten rename fails the build instead of publishing a broken
// /posts/untitled/ URL. Refuses to clobber an existing untitled placeholder.
import { existsSync, writeFileSync } from "node:fs";
import { join, relative } from "node:path";

const POSTS_DIR = join(process.cwd(), "_posts");

/** Today's local date as YYYY-MM-DD. */
function today(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

const date = today();
const filename = `${date}-untitled.md`;
const filepath = join(POSTS_DIR, filename);

if (existsSync(filepath)) {
  console.error(
    `Refusing to overwrite existing placeholder: ${relative(process.cwd(), filepath)}\n` +
      `Rename it (give the post a real slug) before scaffolding a new one.`,
  );
  process.exit(1);
}

const template = `---
title: Untitled
date: ${date}
---

`;

writeFileSync(filepath, template, "utf8");
console.log(`Created ${relative(process.cwd(), filepath).replace(/\\/g, "/")}`);
