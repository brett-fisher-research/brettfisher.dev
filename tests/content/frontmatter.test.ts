import { describe, it, expect } from "vitest";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import matter from "gray-matter";

const POSTS_DIR = join(process.cwd(), "_posts");

const postFiles = readdirSync(POSTS_DIR).filter((f) => f.endsWith(".md"));

/** Format a gray-matter date value (Date or string) to YYYY-MM-DD. */
function toIsoDate(value: unknown): string {
  if (value instanceof Date) {
    return value.toISOString().slice(0, 10);
  }
  return String(value);
}

describe("blog post frontmatter", () => {
  it("finds all markdown posts", () => {
    expect(postFiles.length).toBeGreaterThan(0);
  });

  for (const file of postFiles) {
    describe(file, () => {
      const raw = readFileSync(join(POSTS_DIR, file), "utf-8");
      const { data } = matter(raw);

      it("has a string title", () => {
        expect(typeof data.title).toBe("string");
        expect((data.title as string).length).toBeGreaterThan(0);
      });

      it("has a YYYY-MM-DD date (parsed)", () => {
        const date = toIsoDate(data.date);
        expect(date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      });

      it("has a bare YYYY-MM-DD date on disk", () => {
        expect(raw).toMatch(/^date: \d{4}-\d{2}-\d{2}$/m);
      });

      it("has a string description when present", () => {
        if (data.description !== undefined) {
          expect(typeof data.description).toBe("string");
        }
      });

      it("has no draft/layout/archive keys", () => {
        expect(data.draft).toBeUndefined();
        expect(data.layout).toBeUndefined();
        expect(data.archive).toBeUndefined();
        expect(data.tags).toBeUndefined();
      });
    });
  }
});
