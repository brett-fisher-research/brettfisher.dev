import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

/**
 * A single blog post parsed from `_posts/<YYYY-MM-DD-slug>.md`.
 *
 * `date` is always normalized to a `YYYY-MM-DD` string regardless of whether
 * gray-matter handed us a JS `Date` (unquoted YAML date) or a raw string. This
 * keeps the type stable while Agent A2 normalizes frontmatter concurrently.
 */
export interface Post {
  /** filename minus the leading `YYYY-MM-DD-` and trailing `.md` */
  slug: string;
  title: string;
  /** normalized `YYYY-MM-DD` */
  date: string;
  /** 4-digit year derived from the filename (asserted == frontmatter year) */
  year: number;
  description?: string;
  /** raw markdown body (frontmatter stripped) */
  content: string;
}

/** Absolute path to the `_posts/` directory. */
export const POSTS_DIR = path.join(process.cwd(), "_posts");

const FILENAME_RE = /^(\d{4})-(\d{2})-(\d{2})-(.+)\.md$/;

/**
 * Coerce whatever gray-matter produced for `date` (a JS Date for unquoted YAML
 * dates, or a string) into a `YYYY-MM-DD` string. Uses UTC so a midnight-UTC
 * Date doesn't drift a day across timezones.
 */
function normalizeDate(value: unknown): string {
  if (value instanceof Date) {
    const y = value.getUTCFullYear();
    const m = String(value.getUTCMonth() + 1).padStart(2, "0");
    const d = String(value.getUTCDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  }
  if (typeof value === "string") {
    // Accept "2020-03-22" or "2020-03-22T00:00:00Z" etc; keep just the date.
    const match = value.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (match) return `${match[1]}-${match[2]}-${match[3]}`;
    return value;
  }
  return String(value);
}

/** Parse one markdown file into a typed `Post`. */
function parsePost(filename: string): Post {
  const match = filename.match(FILENAME_RE);
  if (!match) {
    throw new Error(`Post filename does not match YYYY-MM-DD-slug.md: ${filename}`);
  }
  const [, yearStr, , , slug] = match;
  const year = Number(yearStr);

  const raw = fs.readFileSync(path.join(POSTS_DIR, filename), "utf8");
  const { data, content } = matter(raw);

  const date = normalizeDate(data.date);
  const frontmatterYear = Number(date.slice(0, 4));
  if (frontmatterYear !== year) {
    throw new Error(
      `Year mismatch for ${filename}: filename=${year} frontmatter=${frontmatterYear}`,
    );
  }

  return {
    slug,
    title: String(data.title ?? ""),
    date,
    year,
    description: data.description ? String(data.description) : undefined,
    content,
  };
}

/**
 * Read every `*.md` in `_posts/`, parse frontmatter, and return typed posts
 * sorted by date descending (newest first). Directory is read dynamically.
 */
export function getAllPosts(): Post[] {
  const files = fs
    .readdirSync(POSTS_DIR)
    .filter((f) => f.endsWith(".md"));

  return files
    .map(parsePost)
    .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
}

/** Look up a single post by its derived slug, or `undefined` if not found. */
export function getPostBySlug(slug: string): Post | undefined {
  return getAllPosts().find((p) => p.slug === slug);
}

/**
 * Group posts by year, newest year first, posts kept date-descending within
 * each year (input order is preserved, so pass `getAllPosts()`).
 */
export function groupByYear(posts: Post[]): { year: number; posts: Post[] }[] {
  const byYear = new Map<number, Post[]>();
  for (const post of posts) {
    const bucket = byYear.get(post.year);
    if (bucket) bucket.push(post);
    else byYear.set(post.year, [post]);
  }
  return [...byYear.entries()]
    .sort((a, b) => b[0] - a[0])
    .map(([year, posts]) => ({ year, posts }));
}
