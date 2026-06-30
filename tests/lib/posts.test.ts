import { describe, it, expect } from "vitest";
import { getAllPosts, getPostBySlug } from "../../lib/posts";

describe("getAllPosts", () => {
  const posts = getAllPosts();

  it("returns all 16 posts", () => {
    expect(posts).toHaveLength(16);
  });

  it("sorts by date descending (newest first)", () => {
    const dates = posts.map((p) => p.date);
    const sorted = [...dates].sort().reverse();
    expect(dates).toEqual(sorted);
    expect(posts[0].date).toBe("2024-09-23");
  });

  it("shapes each post as {slug,title,date,year}", () => {
    for (const post of posts) {
      expect(typeof post.slug).toBe("string");
      expect(post.slug.length).toBeGreaterThan(0);
      expect(typeof post.title).toBe("string");
      expect(post.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(typeof post.year).toBe("number");
      // year derived from filename must equal the frontmatter date's year
      expect(post.year).toBe(Number(post.date.slice(0, 4)));
    }
  });

  it("derives slug from filename minus the date prefix", () => {
    const newest = posts[0];
    expect(newest.slug).toBe("introducing-my-new-blog");
    const known = getPostBySlug("dynamic-vue-components");
    expect(known).toBeDefined();
    expect(known?.year).toBe(2020);
  });

  it("getPostBySlug returns undefined for unknown slugs", () => {
    expect(getPostBySlug("does-not-exist")).toBeUndefined();
  });
});
