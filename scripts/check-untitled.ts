#!/usr/bin/env tsx
// Build-step guard: fail the build if any post still carries the `untitled`
// placeholder slug (`_posts/<date>-untitled.md`). Wired into `npm run build`
// ahead of `next build`, so a forgotten rename can never ship a broken
// /posts/untitled/ URL. Passes quietly when no placeholder remains.
import { readdirSync } from "node:fs";
import { join } from "node:path";

const POSTS_DIR = join(process.cwd(), "_posts");

const offenders = readdirSync(POSTS_DIR).filter((f) => /-untitled\.md$/.test(f));

if (offenders.length > 0) {
  console.error(
    `Build blocked: ${offenders.length} untitled placeholder post(s) in _posts/:`,
  );
  for (const f of offenders) console.error(`  - _posts/${f}`);
  console.error(`Rename each to a real slug (title + filename) before building.`);
  process.exit(1);
}
